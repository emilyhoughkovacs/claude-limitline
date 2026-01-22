import { execSync } from "child_process";
import { basename } from "path";
import { debug } from "./logger.js";
import { type ClaudeHookData, formatModelName } from "./claude-hook.js";

/**
 * Get the current directory/repo name
 */
export function getDirectoryName(hookData?: ClaudeHookData | null): string | null {
  try {
    // Use workspace from hook data if available
    if (hookData?.workspace?.project_dir) {
      return basename(hookData.workspace.project_dir);
    }
    if (hookData?.cwd) {
      return basename(hookData.cwd);
    }
    return basename(process.cwd());
  } catch (error) {
    debug("Error getting directory name:", error);
    return null;
  }
}

/**
 * Get the current git branch name
 */
export function getGitBranch(): string | null {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    return branch || null;
  } catch (error) {
    debug("Error getting git branch:", error);
    return null;
  }
}

export interface GitStatus {
  hasUnstaged: boolean;      // * - Unstaged changes
  hasStaged: boolean;         // + - Staged changes
  hasUntracked: boolean;      // % - Untracked files
  hasStashed: boolean;        // $ - Stashed changes
  upstream: string | null;    // =, >, <, <> - Upstream status
  specialState: string | null; // |MERGING, |REBASE, etc.
}

/**
 * Get comprehensive git status with all indicators
 */
export function getGitStatus(): GitStatus {
  const status: GitStatus = {
    hasUnstaged: false,
    hasStaged: false,
    hasUntracked: false,
    hasStashed: false,
    upstream: null,
    specialState: null,
  };

  try {
    // Check for unstaged changes
    try {
      execSync("git diff --no-ext-diff --quiet --exit-code", {
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch {
      status.hasUnstaged = true;
    }

    // Check for staged changes
    try {
      execSync("git diff-index --cached --quiet HEAD --", {
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch {
      status.hasStaged = true;
    }

    // Check for untracked files
    const untrackedOutput = execSync("git ls-files --others --exclude-standard", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    status.hasUntracked = untrackedOutput.length > 0;

    // Check for stashed changes
    try {
      execSync("git rev-parse --verify --quiet refs/stash", {
        stdio: ["pipe", "pipe", "pipe"],
      });
      status.hasStashed = true;
    } catch {
      status.hasStashed = false;
    }

    // Check upstream status
    try {
      const upstream = execSync("git rev-parse --abbrev-ref @{upstream}", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();

      if (upstream) {
        const counts = execSync(`git rev-list --left-right --count HEAD...${upstream}`, {
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"],
        }).trim().split(/\s+/);

        const ahead = parseInt(counts[0] || "0", 10);
        const behind = parseInt(counts[1] || "0", 10);

        if (ahead === 0 && behind === 0) {
          status.upstream = "=";
        } else if (ahead > 0 && behind === 0) {
          status.upstream = ">";
        } else if (ahead === 0 && behind > 0) {
          status.upstream = "<";
        } else if (ahead > 0 && behind > 0) {
          status.upstream = "<>";
        }
      }
    } catch {
      // No upstream or error - leave as null
    }

    // Check for special states
    try {
      const gitDir = execSync("git rev-parse --git-dir", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();

      if (execSync(`test -f ${gitDir}/MERGE_HEAD && echo 1 || echo 0`, { encoding: "utf-8" }).trim() === "1") {
        status.specialState = "|MERGING";
      } else if (execSync(`test -f ${gitDir}/CHERRY_PICK_HEAD && echo 1 || echo 0`, { encoding: "utf-8" }).trim() === "1") {
        status.specialState = "|CHERRY-PICKING";
      } else if (execSync(`test -f ${gitDir}/REVERT_HEAD && echo 1 || echo 0`, { encoding: "utf-8" }).trim() === "1") {
        status.specialState = "|REVERTING";
      } else if (execSync(`test -f ${gitDir}/BISECT_LOG && echo 1 || echo 0`, { encoding: "utf-8" }).trim() === "1") {
        status.specialState = "|BISECTING";
      } else if (execSync(`test -d ${gitDir}/rebase-merge && echo 1 || echo 0`, { encoding: "utf-8" }).trim() === "1") {
        status.specialState = "|REBASE";
      } else if (execSync(`test -d ${gitDir}/rebase-apply && echo 1 || echo 0`, { encoding: "utf-8" }).trim() === "1") {
        status.specialState = "|REBASE";
      }
    } catch {
      // No special state
    }
  } catch (error) {
    debug("Error getting git status:", error);
  }

  return status;
}

/**
 * Check if the git repo has uncommitted changes (legacy - kept for compatibility)
 */
export function hasGitChanges(): boolean {
  const status = getGitStatus();
  return status.hasUnstaged || status.hasStaged || status.hasUntracked;
}

/**
 * Get the Claude model from hook data or environment variable
 */
export function getClaudeModel(hookData?: ClaudeHookData | null): string | null {
  // First try hook data (most reliable)
  if (hookData?.model?.id) {
    return formatModelName(hookData.model.id, hookData.model.display_name);
  }

  // Fall back to environment variables
  const model = process.env.CLAUDE_MODEL
    || process.env.CLAUDE_CODE_MODEL
    || process.env.ANTHROPIC_MODEL;

  if (model) {
    return formatModelName(model);
  }

  return null;
}

export interface EnvironmentInfo {
  directory: string | null;
  gitBranch: string | null;
  gitDirty: boolean; // Legacy - kept for compatibility
  gitStatus: GitStatus | null;
  model: string | null;
  contextPercent: number;
}

/**
 * Calculate context window usage percentage from hook data
 */
export function getContextPercent(hookData?: ClaudeHookData | null): number {
  const ctx = hookData?.context_window;
  if (!ctx?.current_usage || !ctx.context_window_size) {
    return 0;
  }

  const usage = ctx.current_usage;
  const totalTokens =
    (usage.input_tokens || 0) +
    (usage.cache_creation_input_tokens || 0) +
    (usage.cache_read_input_tokens || 0);

  return Math.round((totalTokens / ctx.context_window_size) * 100);
}

/**
 * Get all environment info at once
 */
export function getEnvironmentInfo(hookData?: ClaudeHookData | null): EnvironmentInfo {
  const gitBranch = getGitBranch();
  const gitStatus = gitBranch ? getGitStatus() : null;

  return {
    directory: getDirectoryName(hookData),
    gitBranch,
    gitDirty: hasGitChanges(), // Legacy
    gitStatus,
    model: getClaudeModel(hookData),
    contextPercent: getContextPercent(hookData),
  };
}
