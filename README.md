# claude-limitline

A statusline for Claude Code showing real-time usage limits and weekly tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue.svg)

## Features

- **5-Hour Block Limit** - Shows current usage percentage with time remaining until reset
- **7-Day Rolling Limit** - Tracks weekly usage with progress indicator
- **Real-time Tracking** - Uses Anthropic's OAuth usage API for accurate usage data
- **Progress Bar Display** - Visual progress bars for quick status checks
- **Cross-Platform** - Works on Windows, macOS, and Linux
- **Zero Runtime Dependencies** - Lightweight and fast
- **Multiple Themes** - Dark, light, nord, and gruvbox themes included

## Prerequisites

- **Node.js** 18.0.0 or higher
- **Claude Code** CLI installed and authenticated (for OAuth token)
- **Nerd Font** (optional, for powerline symbols)

## Installation

### From npm (recommended)

```bash
npm install -g claude-limitline
```

### From Source

```bash
git clone https://github.com/tylergraydev/claude-limitline.git
cd claude-limitline
npm install
npm run build
npm link
```

### Using Docker

```bash
# Build the image
docker build -t claude-limitline .

# Run (mount your .claude directory for OAuth token access)
docker run --rm -v ~/.claude:/root/.claude claude-limitline
```

## Quick Start

The easiest way to use claude-limitline is to add it directly to your Claude Code settings.

**Add to your Claude Code settings file** (`~/.claude/settings.json`):

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx claude-limitline"
  }
}
```

That's it! The status line will now show your usage limits in Claude Code.

### Full Settings Example

Here's a complete example with other common settings:

```json
{
  "permissions": {
    "defaultMode": "default"
  },
  "statusLine": {
    "type": "command",
    "command": "npx claude-limitline"
  }
}
```

### Alternative: Global Install

If you prefer a global installation (slightly faster startup):

```bash
npm install -g claude-limitline
```

Then update your settings:

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-limitline"
  }
}
```

### Test It

Run standalone to verify it's working:

```bash
npx claude-limitline
```

You should see output like:
```
⏳ ████████░░ 45% (2h 30m left) | 📅 ██████░░░░ 62% (wk 43%)
```

## Configuration

Create a `.claude-limitline.json` file in your home directory (`~/.claude-limitline.json`) or current working directory:

```json
{
  "display": {
    "style": "minimal",
    "useNerdFonts": true
  },
  "block": {
    "enabled": true,
    "displayStyle": "bar",
    "barWidth": 10,
    "showTimeRemaining": true
  },
  "weekly": {
    "enabled": true,
    "displayStyle": "bar",
    "barWidth": 10,
    "showWeekProgress": true
  },
  "budget": {
    "pollInterval": 15,
    "warningThreshold": 80
  },
  "theme": "dark"
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `display.useNerdFonts` | Use Nerd Font symbols (⏳📅) vs ASCII | `true` |
| `block.enabled` | Show 5-hour block usage | `true` |
| `block.displayStyle` | `"bar"` or `"text"` | `"bar"` |
| `block.barWidth` | Width of progress bar in characters | `10` |
| `block.showTimeRemaining` | Show time until block resets | `true` |
| `weekly.enabled` | Show 7-day rolling usage | `true` |
| `weekly.displayStyle` | `"bar"` or `"text"` | `"bar"` |
| `weekly.barWidth` | Width of progress bar in characters | `10` |
| `weekly.showWeekProgress` | Show week progress percentage | `true` |
| `budget.pollInterval` | Minutes between API calls | `15` |
| `budget.warningThreshold` | Percentage to trigger warning color | `80` |
| `theme` | Color theme name | `"dark"` |

### Available Themes

- `dark` - Default dark theme
- `light` - Light background theme
- `nord` - Nord color palette
- `gruvbox` - Gruvbox color palette

## How It Works

claude-limitline retrieves your Claude usage data from Anthropic's OAuth usage API. It reads your OAuth token from:

| Platform | Location |
|----------|----------|
| **Windows** | Credential Manager or `~/.claude/.credentials.json` |
| **macOS** | Keychain or `~/.claude/.credentials.json` |
| **Linux** | secret-tool (GNOME Keyring) or `~/.claude/.credentials.json` |

The usage data is cached locally to respect API rate limits. The cache duration is configurable via `budget.pollInterval` (default: 15 minutes).

### API Response

The tool queries Anthropic's usage endpoint which returns:

- **5-hour block**: Usage percentage and reset time for the rolling 5-hour window
- **7-day rolling**: Usage percentage and reset time for the rolling 7-day window

## Development

### Setup

```bash
git clone https://github.com/tylergraydev/claude-limitline.git
cd claude-limitline
npm install
```

### Build

```bash
npm run build
```

### Development Mode (watch)

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Run Locally

```bash
node dist/index.js
```

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

### "No data" or empty output

1. **Check OAuth token**: Make sure you're logged into Claude Code (`claude --login`)
2. **Check credentials file**: Verify `~/.claude/.credentials.json` exists and contains `claudeAiOauth.accessToken`
3. **Enable debug mode**: Run with `CLAUDE_LIMITLINE_DEBUG=true` to see detailed logs

### Token not found

The OAuth token is stored by Claude Code when you authenticate. Try:

```bash
# Re-authenticate with Claude Code
claude --login
```

### API returns errors

- Ensure your Claude subscription is active
- Check if you've exceeded API rate limits (try increasing `pollInterval`)

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

- Inspired by [claude-powerline](https://github.com/Owloops/claude-powerline)
- Built for use with [Claude Code](https://claude.com/claude-code)
