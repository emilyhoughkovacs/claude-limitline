# Claude Limitline Status and Next Steps

## Goal

Create a custom statusline for Claude Code that displays:
- **Time**: HH:MM:SS in salmon/pink (ANSI 210)
- **Directory**: Current directory in yellow (ANSI 226)
- **Git Branch**: Branch with flags (*, +, $, %) in cyan/teal (ANSI 50) - only when in git repo
- **Context %**: Context window usage in parentheses like `(35%)` - color-coded:
  - Blue (0-50%): ANSI 33
  - Green (50-70%): ANSI 46
  - Yellow (70-90%): ANSI 226
  - Red (90%+): ANSI 196
- **5-Hour Block**: Visual progress bar + percentage + time remaining - color-coded same as context
  - Example: `██████░░░░ 58% 2h 35m`

**Format**: `17:03:49 directory (main *) (35%) ██████░░░░ 58% 2h 35m`
- Single space between each component
- No background colors (transparent)
- No pipe separators
- Hide components that don't exist (no `--` placeholders)

## What We've Done

### 1. Forked and Modified claude-limitline

**Repository**: `https://github.com/emilyhoughkovacs/claude-limitline`
**Local Path**: `/Users/emilyhk/Documents/claude-limitline`

**Changes Made**:
- Added `time` segment (HH:MM:SS format)
- Modified color scheme to match original statusline colors (ANSI color codes)
- Changed context segment to display as `(X%)` instead of `◐ X%`
- Removed powerline arrows and background colors
- Updated color thresholds:
  - Block & Context: Blue (0-50%), Green (50-70%), Yellow (70-90%), Red (90%+)
- Changed segment order to: `["time", "directory", "git", "context", "block"]`
- Disabled weekly and model segments by default
- Fixed spacing to use single space between components
- Hide segments when no data (instead of showing `--`)

### 2. Built and Installed

```bash
cd /Users/emilyhk/Documents/claude-limitline
npm install
npm run build
npm link
```

### 3. Updated Settings

**File**: `/Users/emilyhk/.claude/settings.json`
```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-limitline"
  }
}
```

**Config**: `/Users/emilyhk/.claude/claude-limitline.json`
```json
{
  "display": {
    "useNerdFonts": false,
    "compactMode": "never"
  },
  "time": { "enabled": true },
  "directory": { "enabled": true },
  "git": { "enabled": true },
  "model": { "enabled": false },
  "block": {
    "enabled": true,
    "displayStyle": "bar",
    "barWidth": 10,
    "showTimeRemaining": true
  },
  "weekly": { "enabled": false },
  "context": { "enabled": true },
  "budget": { "pollInterval": 15 },
  "theme": "dark",
  "segmentOrder": ["time", "directory", "git", "context", "block"],
  "showTrend": false
}
```

## Current Problem

### Issue: 403 Forbidden on OAuth Usage API

**Debug Output**:
```
[DEBUG] Found OAuth token in macOS Keychain under claudeAiOauth.accessToken
[DEBUG] Usage API returned status 403: Forbidden
```

**Root Cause**:
The OAuth token in Keychain has scope `["user:inference"]` but the usage API requires scope `["user:profile"]`.

**Error from API**:
```json
{
  "type": "permission_error",
  "message": "OAuth token does not meet scope requirement user:profile"
}
```

**OAuth Token Location**: macOS Keychain under service `Claude Code-credentials`
**Current Scopes**: `["user:inference"]`
**Needed Scopes**: `["user:profile"]` (to access usage data)

**API Endpoint**: `https://api.anthropic.com/api/oauth/usage`
**Headers Required**:
- `Authorization: Bearer {oauth_token}`
- `anthropic-beta: oauth-2025-04-20`

## Next Steps

### Step 1: Try Re-login (First Attempt)

```bash
claude --logout
claude --login
```

This should refresh the OAuth token with the correct `user:profile` scope.

**Test if it worked**:
```bash
CLAUDE_LIMITLINE_DEBUG=true claude-limitline 2>&1 | grep -E "Usage API|percentUsed"
```

If successful, you should see:
```
[DEBUG] Usage API response: {...}
[DEBUG] Block info: {"percentUsed":XX,...}
```

### Step 2: If Re-login Doesn't Work

#### Option A: Check if API Endpoint Changed

The endpoint might have changed. Try researching:
1. Check Anthropic API docs for OAuth usage endpoint
2. Search for updated `anthropic-beta` header versions
3. Check if there's a different endpoint for usage data

#### Option B: Use Different Token Source

Check if there's a `.credentials.json` file with a different token:
```bash
ls -la ~/.claude/.credentials.json
cat ~/.claude/.credentials.json | jq .
```

Look for a token with `user:profile` scope.

#### Option C: Generate New OAuth Token

If the existing token can't be refreshed, you may need to:
1. Go to https://console.anthropic.com
2. Generate a new OAuth application/token with `user:profile` scope
3. Manually update the keychain:
   ```bash
   # This would require knowing the exact keychain update process
   ```

#### Option D: Contact Anthropic Support

If none of the above work, the OAuth usage API might:
- Not be available for your subscription tier
- Require special access/permissions
- Have been deprecated/changed

#### Option E: Fall Back to Local Tracking

**Last Resort**: Revert to the original bash script's local tracking method:
- Track tokens locally by reading session data from Claude Code hook
- Sum tokens across sessions in 5-hour window
- Less accurate but doesn't require API access
- Your original script at `/Users/emilyhk/.claude/statusline-command.sh` has this logic

## Key Files

- **Forked repo**: `/Users/emilyhk/Documents/claude-limitline`
- **Original statusline script**: `/Users/emilyhk/.claude/statusline-command.sh`
- **Settings**: `/Users/emilyhk/.claude/settings.json`
- **Config**: `/Users/emilyhk/.claude/claude-limitline.json`
- **API key file**: `/Users/emilyhk/.claude/api_key` (contains `sk-ant-api03-...` - won't work for usage API)

## Debugging Commands

**Test statusline with debug output**:
```bash
CLAUDE_LIMITLINE_DEBUG=true claude-limitline 2>&1
```

**Check OAuth token in Keychain**:
```bash
security find-generic-password -s "Claude Code-credentials" -g 2>&1 | grep "password:"
```

**Test API endpoint directly**:
```bash
token="<oauth_token_here>"
curl -s "https://api.anthropic.com/api/oauth/usage" \
  -H "Authorization: Bearer $token" \
  -H "anthropic-beta: oauth-2025-04-20"
```

**Rebuild after code changes**:
```bash
cd /Users/emilyhk/Documents/claude-limitline
npm run build
```

## User Context

- **Subscription**: Individual Annual Pro Plan
- **5-Hour Limit**: 500,000 tokens
- **Currently seeing**: `17:03:49 practice (0%)` (no block data due to 403 error)
- **Should see**: `17:03:49 practice (main *) (35%) ██████░░░░ 58% 2h 35m`
- **Original colors**: Time=ANSI 210, Directory=ANSI 226, Git=ANSI 50, Context/Block color-coded

## Success Criteria

When working correctly, the statusline should:
1. Show real-time context % (from Claude Code hook data) - **Currently working at 0% because hook data only available when Claude Code is running**
2. Show real 5-hour block % from Anthropic API - **NOT WORKING: 403 Forbidden**
3. Show visual progress bar color-coded by usage - **NOT WORKING: no block data**
4. Show time remaining until block resets - **NOT WORKING: no block data**
5. Auto-update every 15 minutes (configurable via `pollInterval`)
