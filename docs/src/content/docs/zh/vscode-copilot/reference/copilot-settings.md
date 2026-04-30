---
title: GitHub Copilot 设置参考
description: VS Code 中 GitHub Copilot 的配置设置完整参考，涵盖通用、代码编辑、聊天、智能体和会话相关设置。
source: https://code.visualstudio.com/docs/copilot/reference/copilot-settings
---

本文列出 Visual Studio Code 中 GitHub Copilot 的配置设置。有关在 VS Code 中使用设置的一般信息，请参阅[用户和工作区设置](/docs/configure/settings)。

## 通用设置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `chat.commandCenter.enabled` | 控制是否在 VS Code 标题栏中显示聊天菜单 | `true` |
| `workbench.settings.showAISearchToggle` | 在设置编辑器中启用使用 AI 搜索设置 | `true` |
| `search.searchView.semanticSearchBehavior` | 配置何时在搜索视图中运行语义搜索：手动（默认）、无文本搜索结果时、或始终 | `"manual"` |
| `search.searchView.keywordSuggestions` | 控制是否在搜索视图中显示关键词建议 | `false` |
| `chat.disableAIFeatures` | 禁用并隐藏 VS Code 中的内置 AI 功能，如聊天和内联建议(Inline Suggestion)，并禁用 Copilot 扩展 | `false` |

## 代码编辑设置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `github.copilot.editor.enableCodeActions` | 控制 Copilot 命令是否在可用时显示为代码操作 | `true` |
| `github.copilot.renameSuggestions.triggerAutomatically` | 生成符号重命名建议 | `true` |
| `github.copilot.enable` | 为指定语言启用或禁用内联建议(Inline Suggestion) | `{ "*": true, "plaintext": false, "markdown": false, "scminput": false }` |
| `github.copilot.nextEditSuggestions.enabled` | 启用下一个编辑建议（NES） | `true` |
| `editor.inlineSuggest.edits.allowCodeShifting` | 配置 NES 是否能移动代码以显示建议 | `"always"` |
| `editor.inlineSuggest.edits.renderSideBySide` | 配置 NES 是否可以并排显示较大建议 | `"auto"` |
| `github.copilot.nextEditSuggestions.fixes` | 启用基于诊断（波浪线）的下一个编辑建议，如缺少导入 | `true` |
| `editor.inlineSuggest.edits.showCollapsed` | 仅在按 Tab 导航到建议或悬停时显示 NES 代码变更 | `false` |
| `editor.inlineSuggest.fontFamily` | 配置内联补全的字体系列 | `"default"` |
| `editor.inlineSuggest.showToolbar` | 启用或禁用内联补全显示的工具栏 | `"onHover"` |
| `editor.inlineSuggest.minShowDelay` | 显示内联建议(Inline Suggestion)前等待的时间（毫秒） | `0` |

## 聊天设置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `github.copilot.chat.localeOverride` | 指定聊天响应的语言区域，如 `en` 或 `fr` | `"auto"` |
| `chat.checkpoints.enabled` | 启用或禁用聊天中的检查点 | `true` |
| `chat.checkpoints.showFileChanges` | 在每次聊天请求结束时显示文件变更摘要 | `false` |
| `chat.editor.fontFamily` | 聊天代码块中的字体系列 | `"default"` |
| `chat.editor.fontSize` | 聊天代码块中的字体大小（像素） | `14` |
| `chat.editing.autoAcceptDelay` | 配置自动接受建议编辑的延迟，0 表示禁用自动接受 | `0` |
| `chat.notifyWindowOnConfirmation` | 配置何时在需要用户输入时显示操作系统通知 | `"windowNotFocused"` |
| `chat.notifyWindowOnResponseReceived` | 配置何时在收到聊天响应时显示操作系统通知 | `"windowNotFocused"` |
| `chat.hookFilesLocations` | 配置额外的 Hook 文件位置 | `{}` |
| `chat.useCustomAgentHooks` | 启用在自定义智能体(Custom Agent) frontmatter 中定义的智能体(Agent)作用域 Hooks | `false` |
| `chat.useAgentsMdFile` | 启用或禁用使用 `AGENTS.md` 文件作为聊天请求的上下文 | `true` |
| `chat.useClaudeMdFile` | 启用或禁用使用 `CLAUDE.md` 文件作为始终启用的自定义说明(Custom Instructions) | `true` |

## 智能体(Agent)设置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `chat.agent.enabled` | 启用或禁用使用智能体（需要 VS Code 1.99 或更高版本） | `true` |
| `chat.agent.maxRequests` | Copilot 使用智能体(Agent)可以发出的最大请求数 | `25` |
| `github.copilot.chat.agent.autoFix` | 自动诊断和修复生成的代码变更中的问题 | `true` |
| `chat.mcp.access` | 管理哪些 MCP 服务器可以在 VS Code 中使用 | `true` |
| `chat.mcp.discovery.enabled` | 配置从其他应用程序自动发现 MCP 服务器配置 | `false` |
| `chat.tools.terminal.autoApprove` | 控制使用智能体(Agent)时哪些终端命令被自动批准 | 危险命令默认为 `false` |
| `chat.permissions.default` | 配置新聊天会话的默认权限级别 | `"default"` |

## 延伸阅读

- [GitHub Copilot 常见问题](/docs/copilot/faq)
- [自定义概览](/docs/copilot/customization/overview)
- [MCP 服务器](/docs/copilot/customization/mcp-servers)
