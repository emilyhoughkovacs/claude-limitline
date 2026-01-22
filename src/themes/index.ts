// Segment color definition
export interface SegmentColor {
  bg: string;
  fg: string;
}

// Theme structure matching claude-powerline
export interface ColorTheme {
  time: SegmentColor;       // Current time
  directory: SegmentColor;  // Repo/directory name
  git: SegmentColor;        // Git branch
  model: SegmentColor;      // Claude model
  block: SegmentColor;      // 5-hour block usage
  blockLow: SegmentColor;   // Block usage 0-50%
  blockMedium: SegmentColor; // Block usage 50-70%
  blockHigh: SegmentColor;  // Block usage 70-90%
  weekly: SegmentColor;     // 7-day weekly usage
  opus: SegmentColor;       // Opus-specific weekly usage
  sonnet: SegmentColor;     // Sonnet-specific weekly usage
  context: SegmentColor;    // Context window usage
  contextLow: SegmentColor;   // Context usage 0-50%
  contextMedium: SegmentColor; // Context usage 50-70%
  contextHigh: SegmentColor;  // Context usage 70-90%
  warning: SegmentColor;    // Warning state (near limit)
  critical: SegmentColor;   // Critical state (at/over limit)
}

// Convert hex color to ANSI 256 color code
function hexToAnsi256(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Check for grayscale
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round((r - 8) / 247 * 24) + 232;
  }

  // Convert to 6x6x6 color cube
  const ri = Math.round(r / 255 * 5);
  const gi = Math.round(g / 255 * 5);
  const bi = Math.round(b / 255 * 5);

  return 16 + 36 * ri + 6 * gi + bi;
}

// ANSI escape code generators
export const ansi = {
  fg: (color: string) => {
    if (color === "transparent") return "";
    // If it's a number string (e.g., "210"), use it directly
    if (/^\d+$/.test(color)) {
      return `\x1b[38;5;${color}m`;
    }
    // Otherwise convert hex to ANSI
    return `\x1b[38;5;${hexToAnsi256(color)}m`;
  },
  bg: (color: string) => {
    if (color === "transparent") return "";
    // If it's a number string, use it directly
    if (/^\d+$/.test(color)) {
      return `\x1b[48;5;${color}m`;
    }
    // Otherwise convert hex to ANSI
    return `\x1b[48;5;${hexToAnsi256(color)}m`;
  },
  fgRaw: (n: number) => `\x1b[38;5;${n}m`,
  bgRaw: (n: number) => `\x1b[48;5;${n}m`,
  reset: '\x1b[0m',
};

// Get raw ANSI color number from hex
export function hexToRaw(hex: string): number {
  return hexToAnsi256(hex);
}

// Dark theme (default) - matches original statusline colors
export const darkTheme: ColorTheme = {
  time: { bg: "transparent", fg: "210" },     // Salmon/pink (ANSI 210)
  directory: { bg: "transparent", fg: "226" },  // Yellow (ANSI 226)
  git: { bg: "transparent", fg: "50" },       // Cyan/teal (ANSI 50)
  model: { bg: "transparent", fg: "#ffffff" },
  block: { bg: "transparent", fg: "117" },
  blockLow: { bg: "transparent", fg: "117" },      // Sky blue (ANSI 117) - muted
  blockMedium: { bg: "transparent", fg: "150" },   // Light green (ANSI 150) - muted
  blockHigh: { bg: "transparent", fg: "221" },     // Gold (ANSI 221) - softer yellow
  weekly: { bg: "transparent", fg: "#98fb98" },
  opus: { bg: "transparent", fg: "#c792ea" },
  sonnet: { bg: "transparent", fg: "#89ddff" },
  context: { bg: "transparent", fg: "117" },
  contextLow: { bg: "transparent", fg: "117" },      // Sky blue (ANSI 117) - muted
  contextMedium: { bg: "transparent", fg: "150" },   // Light green (ANSI 150) - muted
  contextHigh: { bg: "transparent", fg: "221" },     // Gold (ANSI 221) - softer yellow
  warning: { bg: "transparent", fg: "221" },
  critical: { bg: "transparent", fg: "167" },     // Dusty rose/coral (ANSI 167) - much softer red
};

// Light theme
export const lightTheme: ColorTheme = {
  time: { bg: "#ffd1dc", fg: "#000000" },      // Light pink for time
  directory: { bg: "#ff6b47", fg: "#ffffff" },
  git: { bg: "#4fb3d9", fg: "#ffffff" },
  model: { bg: "#87ceeb", fg: "#000000" },
  block: { bg: "#6366f1", fg: "#ffffff" },
  blockLow: { bg: "#e0f2fe", fg: "#0369a1" },      // Light blue
  blockMedium: { bg: "#d1fae5", fg: "#065f46" },   // Light green
  blockHigh: { bg: "#fef3c7", fg: "#92400e" },     // Light yellow
  weekly: { bg: "#10b981", fg: "#ffffff" },
  opus: { bg: "#8b5cf6", fg: "#ffffff" },      // Purple for Opus
  sonnet: { bg: "#0ea5e9", fg: "#ffffff" },    // Sky blue for Sonnet
  context: { bg: "#6366f1", fg: "#ffffff" },   // Indigo for context
  contextLow: { bg: "#e0f2fe", fg: "#0369a1" },      // Light blue
  contextMedium: { bg: "#d1fae5", fg: "#065f46" },   // Light green
  contextHigh: { bg: "#fef3c7", fg: "#92400e" },     // Light yellow
  warning: { bg: "#f59e0b", fg: "#000000" },
  critical: { bg: "#ef4444", fg: "#ffffff" },
};

// Nord theme
export const nordTheme: ColorTheme = {
  time: { bg: "#3b4252", fg: "#d8dee9" },      // Light gray for time
  directory: { bg: "#434c5e", fg: "#d8dee9" },
  git: { bg: "#3b4252", fg: "#a3be8c" },
  model: { bg: "#4c566a", fg: "#81a1c1" },
  block: { bg: "#3b4252", fg: "#81a1c1" },
  blockLow: { bg: "#3b4252", fg: "#81a1c1" },      // Nord frost blue
  blockMedium: { bg: "#3b4252", fg: "#a3be8c" },   // Nord green
  blockHigh: { bg: "#3b4252", fg: "#ebcb8b" },     // Nord yellow
  weekly: { bg: "#2e3440", fg: "#8fbcbb" },
  opus: { bg: "#2e3440", fg: "#b48ead" },      // Nord purple for Opus
  sonnet: { bg: "#2e3440", fg: "#88c0d0" },    // Nord frost for Sonnet
  context: { bg: "#3b4252", fg: "#81a1c1" },   // Nord frost for context
  contextLow: { bg: "#3b4252", fg: "#81a1c1" },      // Nord frost blue
  contextMedium: { bg: "#3b4252", fg: "#a3be8c" },   // Nord green
  contextHigh: { bg: "#3b4252", fg: "#ebcb8b" },     // Nord yellow
  warning: { bg: "#d08770", fg: "#2e3440" },
  critical: { bg: "#bf616a", fg: "#eceff4" },
};

// Gruvbox theme
export const gruvboxTheme: ColorTheme = {
  time: { bg: "#3c3836", fg: "#fe8019" },      // Gruvbox orange for time
  directory: { bg: "#504945", fg: "#ebdbb2" },
  git: { bg: "#3c3836", fg: "#b8bb26" },
  model: { bg: "#665c54", fg: "#83a598" },
  block: { bg: "#3c3836", fg: "#83a598" },
  blockLow: { bg: "#3c3836", fg: "#83a598" },      // Gruvbox blue
  blockMedium: { bg: "#3c3836", fg: "#b8bb26" },   // Gruvbox green
  blockHigh: { bg: "#3c3836", fg: "#fabd2f" },     // Gruvbox yellow
  weekly: { bg: "#282828", fg: "#fabd2f" },
  opus: { bg: "#282828", fg: "#d3869b" },      // Gruvbox purple for Opus
  sonnet: { bg: "#282828", fg: "#8ec07c" },    // Gruvbox aqua for Sonnet
  context: { bg: "#3c3836", fg: "#83a598" },   // Gruvbox blue for context
  contextLow: { bg: "#3c3836", fg: "#83a598" },      // Gruvbox blue
  contextMedium: { bg: "#3c3836", fg: "#b8bb26" },   // Gruvbox green
  contextHigh: { bg: "#3c3836", fg: "#fabd2f" },     // Gruvbox yellow
  warning: { bg: "#d79921", fg: "#282828" },
  critical: { bg: "#cc241d", fg: "#ebdbb2" },
};

// Tokyo Night theme
export const tokyoNightTheme: ColorTheme = {
  time: { bg: "#2d3748", fg: "#ff9e64" },      // Tokyo orange for time
  directory: { bg: "#2f334d", fg: "#82aaff" },
  git: { bg: "#1e2030", fg: "#c3e88d" },
  model: { bg: "#191b29", fg: "#fca7ea" },
  block: { bg: "#2d3748", fg: "#7aa2f7" },
  blockLow: { bg: "#2d3748", fg: "#7aa2f7" },      // Tokyo blue
  blockMedium: { bg: "#2d3748", fg: "#9ece6a" },   // Tokyo green
  blockHigh: { bg: "#2d3748", fg: "#e0af68" },     // Tokyo yellow
  weekly: { bg: "#1a202c", fg: "#4fd6be" },
  opus: { bg: "#1a202c", fg: "#bb9af7" },      // Tokyo purple for Opus
  sonnet: { bg: "#1a202c", fg: "#7dcfff" },    // Tokyo cyan for Sonnet
  context: { bg: "#2d3748", fg: "#7aa2f7" },   // Tokyo blue for context
  contextLow: { bg: "#2d3748", fg: "#7aa2f7" },      // Tokyo blue
  contextMedium: { bg: "#2d3748", fg: "#9ece6a" },   // Tokyo green
  contextHigh: { bg: "#2d3748", fg: "#e0af68" },     // Tokyo yellow
  warning: { bg: "#e0af68", fg: "#1a1b26" },
  critical: { bg: "#f7768e", fg: "#1a1b26" },
};

// Rose Pine theme
export const rosePineTheme: ColorTheme = {
  time: { bg: "#2a273f", fg: "#ebbcba" },      // Rose Pine rose for time
  directory: { bg: "#26233a", fg: "#c4a7e7" },
  git: { bg: "#1f1d2e", fg: "#9ccfd8" },
  model: { bg: "#191724", fg: "#ebbcba" },
  block: { bg: "#2a273f", fg: "#eb6f92" },
  blockLow: { bg: "#2a273f", fg: "#31748f" },      // Rose Pine pine (blue)
  blockMedium: { bg: "#2a273f", fg: "#9ccfd8" },   // Rose Pine foam (cyan)
  blockHigh: { bg: "#2a273f", fg: "#f6c177" },     // Rose Pine gold
  weekly: { bg: "#232136", fg: "#9ccfd8" },
  opus: { bg: "#232136", fg: "#c4a7e7" },      // Rose Pine iris for Opus
  sonnet: { bg: "#232136", fg: "#31748f" },    // Rose Pine pine for Sonnet
  context: { bg: "#2a273f", fg: "#9ccfd8" },   // Rose Pine foam for context
  contextLow: { bg: "#2a273f", fg: "#31748f" },      // Rose Pine pine (blue)
  contextMedium: { bg: "#2a273f", fg: "#9ccfd8" },   // Rose Pine foam (cyan)
  contextHigh: { bg: "#2a273f", fg: "#f6c177" },     // Rose Pine gold
  warning: { bg: "#f6c177", fg: "#191724" },
  critical: { bg: "#eb6f92", fg: "#191724" },
};

// All themes
export const themes: Record<string, ColorTheme> = {
  dark: darkTheme,
  light: lightTheme,
  nord: nordTheme,
  gruvbox: gruvboxTheme,
  "tokyo-night": tokyoNightTheme,
  "rose-pine": rosePineTheme,
};

// Get theme by name
export function getTheme(name: string): ColorTheme {
  return themes[name] || themes.dark;
}
