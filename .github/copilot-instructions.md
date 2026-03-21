# Feima Copilot LLMs Extension - Copilot Instructions

## Localization

This extension has **two separate and distinct localization systems**. Do not mix them up.

### 1. Runtime strings — `l10n/bundle.l10n.zh-cn.json`

Used for strings displayed at runtime from TypeScript code via `vscode.l10n.t()`.

**Key rule: the key IS the full English string**, not a short identifier.

```typescript
// ✅ Correct — full English string as key
vscode.l10n.t('Signed in as {0}', session.account.label)
vscode.l10n.t('Please sign in to Feima first')

// ❌ Wrong — short identifier keys do NOT resolve to translations
vscode.l10n.t('error.signIn')
vscode.l10n.t('message.loggedIn')
```

When adding a new runtime string:
1. Use the full English text as the `vscode.l10n.t()` argument
2. Add the translation to `l10n/bundle.l10n.zh-cn.json` with the same full English string as the key:

```json
{
    "Signed in as {0}": "已登录为: {0}",
    "Please sign in to Feima first": "请先登录 Feima 账号"
}
```

### 2. Manifest strings — `package.nls.json` / `package.nls.zh-cn.json`

Used **only** for static strings declared in `package.json` contributions (commands, settings, etc.) via `%key%` syntax.

```json
// package.json
{ "title": "%command.signIn.title%" }

// package.nls.json (English default)
{ "command.signIn.title": "Sign In" }

// package.nls.zh-cn.json (Chinese translation)
{ "command.signIn.title": "登录" }
```

These keys are **never** used in TypeScript code. `vscode.l10n.t('command.signIn.title')` would display the literal string `"command.signIn.title"` — not the translation.
