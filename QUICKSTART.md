# 🚀 Quick Start Guide - Feature 1 Testing

## Prerequisites

- ✅ feima-idp running at https://idp.feima.tech
- ✅ Python 3.11+ with feima-idp dependencies
- ✅ VS Code 1.85+
- ✅ Node.js 18+

## Step 1: Verify feima-idp is Running

```bash
# Check feima-idp is accessible
curl https://idp.feima.tech/.well-known/openid-configuration
```

**No configuration needed!** This extension reuses the `vscode-feima-client` OAuth client from feima-code.

The current feima-idp MVP accepts any redirect URI for this client, so both extensions work without configuration changes.

## Step 2: Install Dependencies & Build

```bash
npm install
npm run compile
```

**Expected output**: No errors, `dist/extension.js` created

## Step 3: Test Authentication

1. **Open project in VS Code**:
   ```bash
   code /home/iven/toys/feima /cn-model-for-copilot
   ```

2. **Launch Extension Development Host**:
   - Press `F5`
   - New VS Code window opens

3. **Check activation**:
   - Open Output panel: `View` → `Output`
   - Select "Feima" from dropdown
   - Should see: "✅ 飞码扣 (Feima) extension activated successfully!"

4. **Test Sign In**:
   - Press `Ctrl+Shift+P`
   - Type: `Feima: 登录`
   - Browser opens → Login with Feima account
   - Success message: "✅ 已登录为: [your-email]"

5. **Test Show Account**:
   - Press `Ctrl+Shift+P`
   - Type: `Feima: 查看账号`
   - Shows your account details

6. **Test Sign Out**:
   - Press `Ctrl+Shift+P`
   - Type: `Feima: 登出`
   - Success message: "✅ 已登出 Feima 账号"

## Troubleshooting

### Browser doesn't open
- Check VS Code permissions
- Check default browser configuration

### "No pending callback" error
- Timeout (try again within 5 minutes - callback expires after 5 min)
- OAuth state mismatch (browser security blocked the redirect)
- Check Extension Host logs: `Developer: Show Logs...` → `Extension Host`

### "Token exchange failed"
- Check feima-idp is running
- Check network connectivity
- Check feima-idp logs

## What's Working

✅ OAuth2 + PKCE authentication flow  
✅ Token storage in VS Code secrets  
✅ Automatic token refresh  
✅ Complete sign-in/sign-out flow  
✅ Account information display  

## Next Steps

Once authentication works:
- **Feature 2**: Extract language model provider from feima-code
- **Week 3**: Test with GitHub Copilot Chat (critical validation)

---

**📝 See TESTING.md for detailed testing instructions**
