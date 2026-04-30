---
title: 第三方智能体
description: 了解如何在 VS Code 中使用 Claude、Codex 等第三方 AI 智能体，统一管理体验并通过 GitHub Copilot 订阅计费。
source: https://code.visualstudio.com/docs/copilot/agents/third-party-agents
---

Visual Studio Code 中的第三方智能体(Third-party Agent)是由外部提供商（如 Anthropic 和 OpenAI）开发的 AI 智能体(Agent)。第三方智能体(Third-party Agent)让你能够使用这些 AI 提供商的独特能力，同时仍可受益于 VS Code 统一的智能体(Agent)会话(Agent Session)管理以及用于编码、调试、测试等的丰富编辑器体验。此外，你还可以通过现有的 GitHub Copilot 订阅使用这些提供商的服务。

VS Code 使用提供商的 SDK 和智能体(Agent)框架来访问智能体(Agent)的独特能力。你可以在 VS Code 中使用本地和云端第三方智能体(Third-party Agent)。云端第三方智能体(Third-party Agent)的集成通过你的 GitHub Copilot 计划启用。

> **注意**
> 云端第三方编程智能体(Agent)目前处于预览阶段。

## 为什么使用第三方智能体(Third-party Agent)？

在 VS Code 中使用第三方智能体(Third-party Agent)的优势：

- **使用独特能力**：每个第三方智能体(Third-party Agent)都有自己的优势和专业功能。VS Code 使用提供商的 SDK 和智能体(Agent)框架访问这些能力，让你能够为编程任务选择最合适的智能体(Agent)。
- **统一体验**：从同一个 VS Code 智能体(Agent)体验中管理所有智能体(Agent)会话(Agent Session)，包括第三方智能体(Third-party Agent)。
- **丰富的编辑器集成**：将 VS Code 的编码功能（如丰富的调试和测试）与智能体(Agent)能力相结合。
- **计费**：通过现有的 GitHub Copilot 订阅进行身份验证和计费管理，无需额外设置。

## 启用第三方云端智能体(Cloud Agent)

在 VS Code 中使用云端第三方智能体(Third-party Agent)之前，需要在 Copilot 账号设置中启用对云端第三方智能体(Third-party Agent)的支持。请按照 GitHub 文档中[在仓库中启用或禁用第三方编程智能体(Agent)](https://docs.github.com/en/copilot/how-tos/manage-your-account/manage-policies#enabling-or-disabling-third-party-coding-agents-in-your-repositories)的步骤操作。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


无需安装提供商的 VS Code 扩展即可在 VS Code 中使用其云端智能体(Cloud Agent)。

## Claude 智能体（预览版）

Claude 智能体(Agent)会话(Agent Session)直接在 VS Code 中提供由 Anthropic Claude Agent SDK 驱动的自主编程能力。Claude 智能体(Agent)会自主操作你的工作区，使用自己的工具集和能力来规划、执行和迭代编程任务。

可通过 `github.copilot.chat.claudeAgent.enabled` 设置（由组织级别管理，如需更改请联系管理员）启用或禁用 Claude 智能体(Agent)会话(Agent Session)的支持。

### 启动 Claude 智能体(Agent)会话(Agent Session)

启动新的 Claude 智能体(Agent)会话(Agent Session)：

1. 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I），选择**新建聊天**（`+`）。

2. 选择本地或云端智能体(Cloud Agent)会话(Agent Session)：

   - 对于本地会话，从**会话类型**下拉菜单选择 **Claude**
   
     ![会话类型下拉菜单显示已选 Claude 智能体选项的截图。](/assets/docs/copilot/third-party-agents/claude-agent-new-chat.png)
   
   - 对于云端会话，从**会话类型**下拉菜单选择 **Cloud**，然后从**合作伙伴智能体(Partner Agent)**下拉菜单选择 **Claude**
   
     ![聊天输入框中云端智能体合作伙伴选择器截图。](/assets/docs/copilot/third-party-agents/partner-agent-cloud-chat.png)

3. 输入提示，让智能体(Agent)处理任务。

   Claude 智能体(Agent)会自主决定使用哪些工具并对工作区进行变更。

### Claude 智能体(Agent)斜杠命令(Slash Command)

Claude 智能体(Agent)提供用于高级工作流程的专用斜杠命令(Slash Command)。在聊天输入框中输入 `/` 可查看可用命令。

| 斜杠命令(Slash Command) | 描述 |
|----------|------|
| `/agents` | 为特定任务创建和管理专业 Claude 智能体(Agent)。通过向导定义自定义智能体(Custom Agent)行为。了解更多 [Claude 子智能体(Agent)](https://code.claude.com/docs/en/sub-agents)。 |
| `/hooks` | 配置在 Claude 智能体(Agent)会话(Agent Session)关键节点执行的生命周期钩子，例如工具执行前后。了解更多 [Claude hooks](https://code.claude.com/docs/en/hooks)。 |
| `/memory` | 打开并编辑 `CLAUDE.md` 记忆文件，为跨会话的 Claude 智能体(Agent)提供持久上下文。 |
| `/init` | 为项目初始化新的 `CLAUDE.md` 记忆文件。 |
| `/pr-comments` | 获取拉取请求(Pull Request)中的评论。 |
| `/review` | 审查拉取请求(Pull Request)中的代码变更。 |
| `/security-review` | 对当前分支上的待处理代码变更进行安全审查。 |

### 权限模式

Claude 智能体(Agent)在执行某些操作之前会请求权限。默认情况下，工作区内的文件编辑会被自动批准，而运行终端命令等其他操作可能需要确认。

你可以选择智能体(Agent)如何将变更应用到工作区：

- **自动编辑**：Claude 智能体(Agent)在处理任务时自主对工作区进行变更。
- **请求批准**：Claude 智能体(Agent)在对工作区进行变更之前请求你审查。
- **规划**：Claude 智能体(Agent)在开始任务之前概述其预期方案。

![Claude 智能体(Agent)权限模式选项截图。](/assets/docs/copilot/third-party-agents/claude-agent-permission-modes.png)

> **注意**
> `github.copilot.chat.claudeAgent.allowDangerouslySkipPermissions` 设置会绕过所有权限检查。仅在无法访问互联网的隔离沙箱环境中启用此设置。

## OpenAI Codex

OpenAI Codex 智能体(Agent)使用 OpenAI 的 Codex 自主执行编程任务。Codex 可以在 VS Code 中交互式运行，也可以在后台无人值守运行。

要禁用 OpenAI Codex 智能体(Agent)，请在 VS Code 中禁用或卸载 [OpenAI Codex](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt) 扩展。

### 前提条件

- 用于身份验证的 Copilot Pro+ 订阅
- 对于本地会话，需安装 [OpenAI Codex](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt) 扩展

VS Code 中的 OpenAI Codex 允许你使用 Copilot Pro+ 订阅进行身份验证和访问 Codex，无需额外设置。了解更多 [GitHub Copilot 计费和高级请求](https://docs.github.com/en/copilot/concepts/billing/copilot-requests)信息。

### 启动 Codex 会话

启动新的 OpenAI Codex 智能体(Agent)会话(Agent Session)：

1. 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I），选择**新建聊天**（`+`）。

2. 选择本地或云端智能体(Cloud Agent)会话(Agent Session)：

   - 对于本地会话，从**会话类型**下拉菜单选择 **Codex**
   
     ![会话类型下拉菜单显示已选 Codex 智能体选项的截图。](/assets/docs/copilot/third-party-agents/codex-agent-new-chat.png)
   
   - 对于云端会话，从**会话类型**下拉菜单选择 **Cloud**，然后从**合作伙伴智能体(Partner Agent)**下拉菜单选择 **Codex**
   
     ![聊天输入框中云端智能体合作伙伴选择器截图。](/assets/docs/copilot/third-party-agents/partner-agent-cloud-chat.png)

3. 在聊天编辑器输入框中输入提示，让智能体(Agent)处理任务。

## 常见问题

**能否使用现有的 Copilot 订阅使用第三方智能体(Third-party Agent)？**

可以，VS Code 中的第三方智能体(Third-party Agent)通过现有的 GitHub Copilot 订阅进行身份验证和计费管理。对于云端第三方智能体(Third-party Agent)，请按照步骤启用。

对于云端第三方智能体(Third-party Agent)，可用性可能因 Copilot 订阅计划而异。请查阅 GitHub 文档中的[关于第三方智能体(Third-party Agent)](https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents)了解更多信息。

**第三方智能体(Third-party Agent)与使用提供商的 VS Code 扩展有何不同？**

提供商的 VS Code 扩展和 VS Code 中的第三方智能体(Third-party Agent)集成都允许你使用提供商的 AI 能力和智能体(Agent)框架。区别在于计费方式：使用 VS Code 中的第三方智能体(Third-party Agent)时，GitHub 通过你的 Copilot 订阅计费；使用提供商的扩展时，你通过提供商的订阅计费。

**为什么有两个 Claude/Codex 智能体(Agent)？**

VS Code 允许你根据提供商的可用性选择本地或云端第三方智能体(Third-party Agent)。从**会话类型**下拉菜单选择第三方智能体(Third-party Agent)时，会为该提供商创建本地智能体(Local Agent)会话(Agent Session)。

要选择云端第三方智能体(Third-party Agent)，先从**会话类型**下拉菜单选择 **Cloud**，然后从**合作伙伴智能体(Partner Agent)**下拉菜单选择提供商。

## 延伸阅读

- [智能体(Agent)概览](/docs/copilot/agents/overview)：了解不同智能体(Agent)类型以及如何在智能体(Agent)之间移交任务
- [关于第三方智能体(Third-party Agent)](https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents)：在 GitHub 文档中了解更多第三方智能体(Third-party Agent)
