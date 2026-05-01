---
title: 智能体概览
description: 了解 VS Code 中不同类型的 AI 智能体、如何选择合适的智能体类型，以及如何在智能体之间移交任务。
source: https://code.visualstudio.com/docs/copilot/agents/overview
---

智能体(Agent)是一种能自主完成编码任务的 AI 助手。给它一个高层目标，它会将目标分解为步骤、跨文件编辑项目、运行命令，并在出现问题时自我纠正。例如，智能体(Agent)不会仅仅建议如何修复失败的测试，而是跨文件识别根本原因、更新代码、重新运行测试并提交变更。

VS Code 让你能够按照最适合工作流程的方式运行智能体(Agent)。可以在编辑器中与它们交互，或通过 CLI 让它们在后台自主运行。智能体(Agent)可以在你的机器上、远程云环境中，或通过 Anthropic、OpenAI 等第三方提供商运行。你可以控制给予它们多少自主权——从批准每次工具调用(Tool Call)到让它们完全自主工作——还可以创建自定义智能体(Custom Agent)来定制其行为以适应你的项目。

无论智能体(Agent)在哪里运行，你都可以从聊天视图中的统一[会话列表](/vscode-copilot/chat/chat-sessions#_sessions-list)中监控和交互所有会话。如果你更倾向于通过提示词(Prompt)工作，[Agents 应用](/vscode-copilot/agents-app)提供了专用界面，以会话和聊天为核心体验，并内置所有 AI 自定义内容的访问入口。

![VS Code 中智能体(Agent)会话(Agent Session)的截图，显示代码变更和聊天交互。](/assets/docs/copilot/agents-overview/chat-sessions-view.png)

> **提示**
> 在 VS Code 设置中启用智能体（`chat.agent.enabled`）。你的组织也可能禁用了智能体(Agent)——请联系管理员启用此功能。

> **💡 国内用户替代方案**
> 除了 GitHub Copilot 官方订阅，您也可以使用 **[飞码扣插件](/guides/quickstart)** — 在 GitHub Copilot Chat 中直接使用通义千问(Qwen3)、DeepSeek V3.2、GLM-5 等国内顶级 AI 模型，按次计费，无需月付订阅。[立即开始 →](/guides/quickstart)


## 智能体(Agent)类型

智能体(Agent)根据需要运行在不同的环境中。两个关键维度是：智能体(Agent)在_哪里_运行（你的机器或云端）以及_如何_与之交互（交互式还是在后台自主运行）。

- [**本地（Local）**](/vscode-copilot/agents/local-agents)：使用 VS Code 智能体(Agent)循环在编辑器中交互式运行，可完全访问工作区、工具和模型。
- [**Copilot CLI**](/vscode-copilot/agents/copilot-cli)：使用 Copilot CLI 在本机后台运行，可选择使用 Git worktree 进行隔离。
- [**云端（Cloud）**](/vscode-copilot/agents/cloud-agents)：使用 GitHub Copilot 远程运行，并与 GitHub 拉取请求(Pull Request)集成以进行团队协作。
- [**第三方（Third-party）**](/vscode-copilot/agents/third-party-agents)：使用 Anthropic 和 OpenAI 的第三方智能体(Third-party Agent) SDK，既可在本机运行也可在云端运行。

从聊天视图中的智能体(Agent)目标下拉菜单选择智能体(Agent)类型。

![聊天视图中智能体(Agent)目标下拉菜单截图。](/assets/docs/copilot/agents-overview/agent-type-dropdown.png)

### 我应该使用哪种智能体(Agent)类型？

使用下表找到适合你任务的智能体(Agent)类型：

| 我想要... | 使用 |
|-----------|------|
| 交互式地头脑风暴、探索或迭代一个想法 | [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents) |
| 查询我的代码库 | [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents)（Ask） |
| 创建结构化实施计划 | [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents)（Plan） |
| 修复需要编辑器上下文的问题（测试失败、lint 错误、调试输出） | [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents) |
| 使用集成浏览器构建和测试 Web 应用 _(实验性)_ | [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents)。参见[浏览器智能体(Agent)测试指南](/vscode-copilot/guides/browser-agent-testing-guide)。 |
| 使用特定的 VS Code 扩展工具或 MCP 服务器 | [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents) |
| 在我继续工作的同时实现定义明确的任务 | [Copilot CLI](/vscode-copilot/agents/copilot-cli) 或 [云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents) |
| 探索多个变体或概念验证 | [Copilot CLI](/vscode-copilot/agents/copilot-cli) 或 [云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents) |
| 为团队审查创建 PR | [云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents) |
| 将 GitHub Issue 分配给智能体(Agent) | [云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents) |
| 使用特定 AI 提供商（Anthropic、OpenAI） | [第三方智能体(Third-party Agent)](/vscode-copilot/agents/third-party-agents) |

## 选择智能体(Agent)

如果智能体(Agent)类型决定智能体(Agent)在_哪里_运行，那么智能体(Agent)则根据其角色或身份决定_如何_执行任务。例如，代码审查者身份的智能体(Agent)专注于审查代码变更的质量和风格并提供反馈，而不是直接修改代码。智能体(Agent)的定义决定了它可以使用哪些工具、如何执行任务以及潜在的移交点。

从聊天视图中的智能体(Agent)下拉菜单选择智能体(Agent)，可以在会话中随时切换。

![聊天视图中智能体(Agent)选择器截图。](/assets/docs/copilot/getting-started/agent-mode-selection-2.png)

VS Code 有三个[内置智能体(Agent)](/vscode-copilot/agents/local-agents)：

- **Agent**：自主规划并跨文件实施变更、运行终端命令和调用工具。
- **Plan**：在编写任何代码之前创建结构化的逐步实施计划，计划就绪后可移交给实施智能体(Agent)。
- **Ask**：回答有关编码概念、代码库或 VS Code 本身的问题，不进行文件修改。

对于更专业的工作流程，可以创建自己的[自定义智能体(Custom Agent)](/vscode-copilot/customization/custom-agents)，定义特定角色、可用工具和语言模型(Language Model)。

## 选择权限级别

智能体(Agent)自主执行任务，但你可以控制它们在调用工具和终端命令时的自主程度。给予智能体(Agent)更多自主权可以提高效率，但可能会减少监督。聊天视图中的权限选择器让你为每个会话选择权限级别。

| 权限级别 | 说明 |
|----------|------|
| **默认批准（Default Approvals）** | 使用 VS Code 设置中指定的批准方式。默认情况下，只有只读和安全的工具不需要明确批准。 |
| **跳过批准（Bypass Approvals）** | 自动批准所有工具调用(Tool Call)，无需确认对话框。智能体(Agent)在工作时可能会提出澄清性问题。 |
| **自动驾驶（Autopilot）**（预览版） | 自动批准所有工具调用(Tool Call)，自动响应问题，智能体(Agent)会持续工作直到任务完成。 |

要在会话间保持首选权限级别，请配置 `chat.permissions.default` 设置。

了解更多：[权限级别和 Autopilot](https://code.visualstudio.com/docs/copilot/agents/agent-tools#_permission-levels)。

## 将会话移交给另一个智能体(Agent)

你可以将现有任务从一个智能体(Agent)移交给另一个智能体(Agent)，以利用它们各自的优势。例如，使用本地智能体(Local Agent)创建计划，移交给 Copilot CLI 进行概念验证，然后继续使用云端智能体(Cloud Agent)提交拉取请求(Pull Request)供团队审查。

要移交本地智能体(Local Agent)会话(Agent Session)，从聊天输入框中的会话类型下拉菜单选择不同的智能体(Agent)类型。VS Code 会创建一个新会话，并携带完整的对话历史和上下文。原始会话在移交后会被归档。

![显示用于移交给其他智能体(Agent)的会话类型下拉菜单截图。](/assets/docs/copilot/background-agents/continue-in-cli.png)

在 Copilot CLI 会话中，通过在聊天输入框中输入 `/delegate` 命令可以委托给云端智能体(Cloud Agent)，也可以在 `/delegate` 命令后提供额外说明。

### 将编码任务分配给智能体(Agent)

如果你安装了 [GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) 扩展，可以将智能体(Agent)分配给代码中的 `TODO` 注释。

![将 TODO 注释分配给 Copilot 云端智能体(Cloud Agent)的截图。](/assets/docs/copilot/agents-overview/assign-todo-to-agent.png)

在 GitHub.com 上，或通过使用 GitHub Pull Requests 扩展，可以通过将 Issue 分配给 `copilot` 或在 Issue 评论或拉取请求(Pull Request)中提及它来将 GitHub Issue 分配给 Copilot 云端智能体(Cloud Agent)。

## 延伸阅读

- [管理聊天会话](/vscode-copilot/chat/chat-sessions)：创建、切换和组织你的智能体(Agent)会话(Agent Session)。
- [智能体(Agent)教程](/vscode-copilot/agents/agents-tutorial)：使用不同智能体(Agent)类型的实践教程。
- [工具](https://code.visualstudio.com/docs/copilot/agents/agent-tools)：使用内置、MCP 和扩展工具扩展智能体(Agent)。
- [Hooks](/vscode-copilot/customization/hooks)：在生命周期事件触发时执行自定义命令，用于自动化和策略执行。
- [自定义智能体(Custom Agent)](/vscode-copilot/customization/custom-agents)：创建你自己的 AI 智能体(Agent)和扩展。
