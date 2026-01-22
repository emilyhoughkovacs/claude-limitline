export interface SegmentConfig {
  enabled: boolean;
  displayStyle?: "text" | "bar";
  barWidth?: number;
}

export interface SimpleSegmentConfig {
  enabled: boolean;
}

export interface BlockSegmentConfig extends SegmentConfig {
  showTimeRemaining?: boolean;
}

export type WeeklyViewMode = "simple" | "smart";

export interface WeeklySegmentConfig extends SegmentConfig {
  showWeekProgress?: boolean;
  viewMode?: WeeklyViewMode;  // default "simple"
}

export interface BudgetConfig {
  pollInterval?: number; // minutes between API calls (default 15)
  resetDay?: number;     // 0=Sunday, 1=Monday, ..., 6=Saturday
  resetHour?: number;    // 0-23
  resetMinute?: number;  // 0-59
  warningThreshold?: number; // percentage to show warning color
}

export interface DisplayConfig {
  style?: "powerline" | "minimal" | "capsule";
  useNerdFonts?: boolean;
  compactMode?: "auto" | "always" | "never";  // Auto-compact when terminal is narrow
  compactWidth?: number;  // Terminal width threshold for compact mode (default 80)
}

export type SegmentName = "time" | "directory" | "git" | "model" | "block" | "weekly" | "context";

export interface LimitlineConfig {
  display?: DisplayConfig;
  time?: SimpleSegmentConfig;       // Show current time
  directory?: SimpleSegmentConfig;  // Show repo/directory name
  git?: SimpleSegmentConfig;        // Show git branch
  model?: SimpleSegmentConfig;      // Show Claude model
  block?: BlockSegmentConfig;
  weekly?: WeeklySegmentConfig;
  context?: SimpleSegmentConfig;    // Show context window usage (right side)
  budget?: BudgetConfig;
  theme?: string;
  segmentOrder?: SegmentName[];     // Custom order for segments
  showTrend?: boolean;              // Show ↑↓ trend arrows for usage
}

export const DEFAULT_CONFIG: LimitlineConfig = {
  display: {
    style: "powerline",
    useNerdFonts: true,
    compactMode: "auto",
    compactWidth: 80,
  },
  time: {
    enabled: true,
  },
  directory: {
    enabled: true,
  },
  git: {
    enabled: true,
  },
  model: {
    enabled: false,
  },
  block: {
    enabled: true,
    displayStyle: "bar",
    barWidth: 10,
    showTimeRemaining: true,
  },
  weekly: {
    enabled: false,
    displayStyle: "text",
    barWidth: 10,
    showWeekProgress: true,
    viewMode: "simple",
  },
  context: {
    enabled: true,
  },
  budget: {
    pollInterval: 15,
    warningThreshold: 80,
  },
  theme: "dark",
  segmentOrder: ["time", "directory", "git", "context", "block"],
  showTrend: false,
};
