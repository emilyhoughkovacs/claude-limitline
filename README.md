# claude-limitline

A customized statusline for Claude Code showing real-time usage data, time, directory, comprehensive git status, and context usage.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue.svg)

## ✨ This Fork

This is a **heavily customized fork** of [tylergraydev/claude-limitline](https://github.com/tylergraydev/claude-limitline) that's evolved into a completely different statusline. We kept the OAuth API call for real-time 5-hour usage limits and rebuilt everything else from scratch for maximum aesthetic and functional vibes 🎀

**What's different:**
- 🕐 **Time display** - Current time in HH:MM:SS format
- 📁 **Directory name** - Shows your current working directory
- 🌿 **Comprehensive git status** - Branch with detailed indicators: `(main*+$%=)` showing unstaged (*), staged (+), stashed ($), untracked (%), and upstream (=/>/</<>) status, plus special states like |MERGING
- 📊 **Local context %** - Real-time context window usage from Claude Code
- 🎨 **Cute colorwave palette** - Soft, muted colors (salmon, gold, sky blue, sage green, coral) that look cohesive together
- 🧊 **Block character progress bars** - Uses proper Unicode blocks (`█░`) instead of ASCII
- ⚡ **1-minute polling** - More frequent API updates (configurable)

**Example output:**
```
17:03:49 claude-limitline (main*=) (35%) ██████░░░░ 58% 2h 35m
```

![Custom Statusline](imgs/custom-statusline.png)
*This fork's customized statusline showing time, directory, git status with indicators, context %, and 5-hour block usage*

## Features

- **Time Display** - Current time in HH:MM:SS format (salmon color)
- **Directory Name** - Shows current working directory (warm yellow)
- **Comprehensive Git Status** - Branch with detailed indicators `(main*+$%=)` showing unstaged, staged, stashed, untracked, upstream status, plus special states like |MERGING (teal)
- **Context Window** - Real-time context usage percentage from Claude Code hook data (color-coded by usage)
- **5-Hour Block Limit** - Shows current usage percentage with time remaining until reset
- **Progress Bar** - Visual bar with proper Unicode blocks (`█░`)
- **Cohesive Color Palette** - Soft, muted colors (salmon, gold, sky blue, sage green, coral) that work beautifully together
- **Real-time API Tracking** - Uses Anthropic's OAuth usage API for accurate 5-hour block data (polls every 1 minute by default)
- **Optional Segments** - Weekly usage tracking and model display can be enabled
- **Cross-Platform** - Works on Windows, macOS, and Linux

## Example Output

This fork's default configuration with comprehensive git status:
```
17:03:49 claude-limitline (main*+$=) (35%) ██████░░░░ 58% 2h 35m
```

Breaking it down:
- `17:03:49` - Current time
- `claude-limitline` - Directory name
- `(main*+$=)` - Git: branch `main` with unstaged (*), staged (+), stashed ($), equal to upstream (=)
- `(35%)` - Context window usage
- `██████░░░░ 58% 2h 35m` - 5-hour block: 58% used, 2h 35m remaining

Original project format (for reference):
```
 claude-limitline  main ●   Opus 4.5   12% (3h20m)   45% (wk 85%)
```

## Prerequisites

- **Node.js** 18.0.0 or higher
- **Claude Code** CLI installed and authenticated (for OAuth token)

## Installation

### From Source (This Fork)

This customized fork is not published to npm. Install from source:

```bash
git clone https://github.com/emilyhoughkovacs/claude-limitline.git
cd claude-limitline
npm install
npm run build
npm link  # Makes it available globally as 'claude-limitline'
```

## Quick Start

Add to your Claude Code settings file (`~/.claude/settings.json`):

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-limitline"
  }
}
```

That's it! The status line will now show your customized statusline in Claude Code.

## Configuration

Create a `claude-limitline.json` file in your Claude config directory (`~/.claude/claude-limitline.json`) or `.claude-limitline.json` in your current working directory.

**This fork's default configuration:**

```json
{
  "display": {
    "useNerdFonts": false,
    "compactMode": "never"
  },
  "time": {
    "enabled": true
  },
  "directory": {
    "enabled": true
  },
  "git": {
    "enabled": true
  },
  "model": {
    "enabled": false
  },
  "block": {
    "enabled": true,
    "displayStyle": "bar",
    "barWidth": 10,
    "showTimeRemaining": true
  },
  "weekly": {
    "enabled": false
  },
  "context": {
    "enabled": true
  },
  "budget": {
    "pollInterval": 1
  },
  "theme": "dark",
  "segmentOrder": ["time", "directory", "git", "context", "block"],
  "showTrend": false
}
```

> **Note**: Weekly usage tracking is disabled by default but can be enabled by setting `"weekly": { "enabled": true }`. You can also add it to `segmentOrder` to control where it appears.

### Configuration Options

| Option | Description | This Fork's Default |
|--------|-------------|---------------------|
| `display.useNerdFonts` | Use Nerd Font symbols | `false` |
| `display.compactMode` | `"auto"`, `"always"`, or `"never"` | `"never"` |
| `time.enabled` | Show current time HH:MM:SS | `true` |
| `directory.enabled` | Show repository/directory name | `true` |
| `git.enabled` | Show git branch with comprehensive status | `true` |
| `context.enabled` | Show context window usage % | `true` |
| `model.enabled` | Show Claude model name | `false` |
| `block.enabled` | Show 5-hour block usage | `true` |
| `block.displayStyle` | `"bar"` or `"text"` | `"bar"` |
| `block.barWidth` | Width of progress bar in characters | `10` |
| `block.showTimeRemaining` | Show time until block resets | `true` |
| `weekly.enabled` | Show 7-day rolling usage (optional) | `false` |
| `weekly.displayStyle` | `"bar"` or `"text"` (if enabled) | `"text"` |
| `weekly.barWidth` | Width of progress bar (if enabled) | `10` |
| `weekly.showWeekProgress` | Show week progress % (if enabled) | `true` |
| `weekly.viewMode` | `"simple"` or `"smart"` (if enabled) | `"simple"` |
| `budget.pollInterval` | Minutes between API calls | `1` |
| `budget.warningThreshold` | Percentage to trigger warning color | `80` |
| `theme` | Color theme (only "dark" is customized) | `"dark"` |
| `segmentOrder` | Array to customize segment order | `["time", "directory", "git", "context", "block"]` |
| `showTrend` | Show ↑↓ arrows for usage changes | `false` |

### Weekly Usage Tracking (Optional)

**Weekly tracking is disabled by default** in this fork, but you can enable it if you want to track your 7-day rolling usage.

To enable weekly tracking:
```json
{
  "weekly": {
    "enabled": true,
    "displayStyle": "text",
    "viewMode": "simple"
  },
  "segmentOrder": ["time", "directory", "git", "context", "block", "weekly"]
}
```

The weekly segment supports two view modes:

| Mode | Description |
|------|-------------|
| `simple` | Shows overall weekly usage only |
| `smart` | Model-aware: shows Sonnet + Overall when using Sonnet |

**Note:** Model-specific limits (Opus/Sonnet) are only available on certain subscription tiers.

## Segments

The statusline displays the following segments (all configurable):

| Segment | Description | Color (this fork's theme) |
|---------|-------------|---------------------------|
| **Time** | Current time HH:MM:SS | Salmon/Pink (ANSI 210) |
| **Directory** | Current repo/project name | Warm Yellow (ANSI 226) |
| **Git** | Branch name in parentheses with comprehensive status indicators: `(main*+$%=)` | Teal/Cyan (ANSI 50) |
| **Context** | Context window usage percentage | Sky Blue → Sage Green → Gold → Coral (by usage %) |
| **Block** | 5-hour usage % + progress bar + time remaining | Sky Blue → Sage Green → Gold → Coral (by usage %) |
| **Model** | Claude model (Opus 4.5, Sonnet 4, etc.) - optional | White |
| **Weekly** | 7-day usage % + week progress - optional | Sage Green |

### Git Status Indicators

The git segment shows comprehensive status information inspired by git-prompt.sh:

| Indicator | Meaning |
|-----------|---------|
| **`*`** | Unstaged changes (modified files not staged) |
| **`+`** | Staged changes (ready to commit) |
| **`$`** | Stashed changes exist |
| **`%`** | Untracked files present |
| **`=`** | Equal to upstream |
| **`>`** | Ahead of upstream |
| **`<`** | Behind upstream |
| **`<>`** | Diverged from upstream |
| **`\|MERGING`** | Merge in progress |
| **`\|REBASE`** | Rebase in progress |
| **`\|CHERRY-PICKING`** | Cherry-pick in progress |
| **`\|REVERTING`** | Revert in progress |
| **`\|BISECTING`** | Bisect in progress |

**Example**: `(main*+$=)` means you're on `main` with unstaged changes (*), staged changes (+), stashed changes ($), and equal to upstream (=)

## How It Works

claude-limitline retrieves data from two sources:

1. **Hook Data (stdin)** - Claude Code passes JSON with model info, workspace, and session data
2. **Usage API** - Fetches usage limits from Anthropic's OAuth usage endpoint

### OAuth Token Location

The tool automatically retrieves your OAuth token from Claude Code's credential storage:

| Platform | Location |
|----------|----------|
| **macOS** | Keychain (`Claude Code-credentials` service) |
| **Windows** | Credential Manager or `~/.claude/.credentials.json` |
| **Linux** | secret-tool (GNOME Keyring) or `~/.claude/.credentials.json` |

> **Note:** On macOS, the token is read directly from the system Keychain where Claude Code stores it. No additional configuration is needed—just make sure you're logged into Claude Code (`claude setup-token`).

## Development

```bash
git clone https://github.com/emilyhoughkovacs/claude-limitline.git
cd claude-limitline
npm install
npm run build    # Build once
npm run dev      # Watch mode
```

## Testing

The project uses [Vitest](https://vitest.dev/) for testing with 170 tests covering config loading, themes, segments, utilities, and rendering.

```bash
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Structure

| File | Tests | Coverage |
|------|-------|----------|
| `src/config/loader.test.ts` | 7 | Config loading, merging, fallbacks |
| `src/themes/index.test.ts` | 37 | Theme retrieval, color validation |
| `src/segments/block.test.ts` | 8 | Block segment, time calculations |
| `src/segments/weekly.test.ts` | 13 | Weekly segment, week progress |
| `src/utils/oauth.test.ts` | 19 | API responses, caching, trends, macOS keychain |
| `src/utils/claude-hook.test.ts` | 21 | Model name formatting |
| `src/utils/environment.test.ts` | 20 | Git branch, directory detection |
| `src/utils/terminal.test.ts` | 13 | Terminal width, ANSI handling |
| `src/utils/logger.test.ts` | 8 | Debug/error logging |
| `src/renderer.test.ts` | 24 | Segment rendering, ordering, view modes |

## Debug Mode

Enable debug logging to troubleshoot issues:

```bash
# Linux/macOS
CLAUDE_LIMITLINE_DEBUG=true claude-limitline

# Windows (PowerShell)
$env:CLAUDE_LIMITLINE_DEBUG="true"; claude-limitline

# Windows (CMD)
set CLAUDE_LIMITLINE_DEBUG=true && claude-limitline
```

Debug output is written to stderr so it won't interfere with the status line output.

## Troubleshooting

### Model not showing

The model is passed via stdin from Claude Code. If running standalone, pipe in hook data:
```bash
echo '{"model":{"id":"claude-opus-4-5-20251101"}}' | claude-limitline
```

### "No data" or empty output

1. **Check OAuth token**: Make sure you're logged into Claude Code (`claude setup-token`)
2. **Check credentials file**: Verify `~/.claude/.credentials.json` exists (Windows/Linux)
3. **Enable debug mode**: Run with `CLAUDE_LIMITLINE_DEBUG=true`

### OAuth "permission_error" or "user:profile scope" error

If you see errors like "OAuth token does not meet scope requirement user:profile":

**Cause**: An environment variable `CLAUDE_CODE_OAUTH_TOKEN` in your shell configuration (`.zshrc`, `.bash_profile`, etc.) is overriding Claude Code's native authentication. That token only has `user:inference` scope, but the Usage API requires `user:profile` scope.

**Solution**:
1. Remove `CLAUDE_CODE_OAUTH_TOKEN` from your shell configuration files
2. Delete any manually-stored tokens from Keychain: `security delete-generic-password -s "Claude Code-credentials"`
3. Restart your terminal
4. Let Claude Code use its native OAuth (which includes the correct scopes automatically)

**Important**: Do NOT set `CLAUDE_CODE_OAUTH_TOKEN` as an environment variable. Claude Code's native OAuth flow includes all necessary scopes.

### Git branch not showing

Make sure you're in a git repository. The git segment only appears when a `.git` directory is found.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Forked from [claude-limitline](https://github.com/tylergraydev/claude-limitline) by [@tylergraydev](https://github.com/tylergraydev)
- Inspired by [claude-powerline](https://github.com/Owloops/claude-powerline)
- Built for use with [Claude Code](https://claude.com/claude-code)
- Customized with 💖 for the girlie pops who like their terminals cute and functional
