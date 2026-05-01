---
title: GitHub Copilot 概览
description: GitHub Copilot 为 Visual Studio Code 带来了 AI 智能体，助你规划、编写并验证代码。
source: https://code.visualstudio.com/docs/copilot/overview
---

GitHub Copilot 为 Visual Studio Code 带来了 AI 智能体(Agent)。描述你想构建的内容，智能体(Agent)会规划方案、编写代码并在整个项目中验证结果。你可以选择 Copilot 内置智能体(Agent)、来自 Anthropic 和 OpenAI 等提供商的第三方智能体(Third-party Agent)，或你自己的自定义智能体(Custom Agent)，并在本地、后台或云端运行。对于更精准的修改，编辑器中的内联建议(Inline Suggestion)和聊天功能可提供直接控制。

## 智能体（Agents）

智能体(Agent)是一种能自主完成编码任务的 AI 助手。与传统代码补全(Code Completion)只建议几行代码不同，智能体(Agent)接收目标后会将其拆解为多个步骤，跨文件编辑项目、运行命令，并在出现问题时自我纠正。

向智能体(Agent)提供高层级描述，它就会开始工作。每个任务都在**智能体(Agent)会话(Agent Session)**（agent session）中运行，这是一个可追踪、可暂停、可恢复或移交给其他智能体(Agent)的持久会话。

> **重要提示**
> 您的组织可能已在 VS Code 中禁用了智能体(Agent)。请联系管理员以启用此功能。

### 先规划，再构建

使用内置的 **Plan** 智能体(Agent)，在编写任何代码之前将任务拆解为结构化的实施计划。Plan 智能体(Agent)会分析你的代码库、提出澄清性问题，并生成逐步执行的计划。计划就绪后，可将其移交给实施智能体(Agent)，在本地、后台或云端执行。

了解更多：[使用智能体(Agent)规划](/vscode-copilot/agents/planning)。

### 随处运行智能体(Agent)

智能体(Agent)在需要工作的地方运行。可在 VS Code 中本地交互式运行，在后台自主运行，或通过拉取请求(Pull Request)在云端进行团队协作。你还可以使用来自 Anthropic 和 OpenAI 等提供商的第三方智能体(Third-party Agent)。随时可以将任务从一种智能体(Agent)类型移交给另一种，相关上下文也会随之传递。

![会话类型选择器截图，显示本地、后台、云端和第三方智能体(Third-party Agent)选项。](/assets/docs/copilot/agents-overview/sessions-type-picker.png)

了解更多：[智能体(Agent)类型与移交](/vscode-copilot/agents/overview) 或跟随 [智能体(Agent)教程](/vscode-copilot/agents/agents-tutorial)。

### 从统一视图管理会话

并行运行多个智能体(Agent)会话(Agent Session)，每个会话专注于不同任务。**聊天（Chat）** 面板中的**会话（Sessions）**视图提供统一监控入口，无论会话在本地、后台还是云端运行，都可以在这里查看每个会话的状态、切换会话、审查文件变更，以及从上次中断处继续。

了解更多：[管理智能体(Agent)会话(Agent Session)](/vscode-copilot/chat/chat-sessions)。

### Agents 应用

如果你更倾向于描述需求而非直接编写代码，[Agents 应用](/vscode-copilot/agents-app)提供了一个专用界面，以会话和聊天为核心体验。可将其作为独立窗口启动，专注于输入提示、监控会话和配置 AI 设置。Agents 应用还可以从单个侧边栏面板直接访问所有 AI 自定义内容，例如智能体(Agent)、说明、提示词(Prompt)和 MCP 服务器。

了解更多：[Agents 应用](/vscode-copilot/agents-app)。

## 你能构建什么

智能体(Agent)可以端到端地处理编码任务，从单个文件变更到以拉取请求(Pull Request)形式交付完整功能。

- **端到端构建功能。** 用自然语言描述功能，智能体(Agent)会搭建项目框架、跨多个文件实现逻辑，并运行测试验证结果。
- **调试并修复失败的测试。** 将智能体(Agent)指向失败的测试，它会读取错误、在代码库中追踪根本原因、应用修复并重新运行测试确认。了解更多：[使用 AI 调试](/vscode-copilot/guides/debug-with-copilot)。
- **重构或迁移代码库。** 要求智能体(Agent)规划迁移（例如从一个框架迁移到另一个框架），它会在各文件间协调变更，同时通过构建进行验证。
- **测试并与 Web 应用交互。** _(实验性)_ 要求智能体(Agent)在[集成浏览器](https://code.visualstudio.com/docs/debugtest/integrated-browser)中打开你的 Web 应用，验证功能是否正常、检查布局问题或截图。参考 [浏览器智能体(Agent)测试指南](/vscode-copilot/guides/browser-agent-testing-guide)。
- **通过拉取请求(Pull Request)协作。** 将任务委托给云端智能体(Cloud Agent)，它会创建分支、实施变更，并开启拉取请求(Pull Request)供团队审查。了解更多：[云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents)。

## 快速上手

### 第一步：设置 Copilot

1. 将鼠标悬停在状态栏的 Copilot 图标上，选择**设置 Copilot**。

   ![状态栏 Copilot 图标截图，显示"设置 Copilot"选项。](/assets/docs/copilot/setup/setup-copilot-status-bar.png)

2. 选择登录方式并按提示操作。如果你还没有 Copilot 订阅，将自动注册 [Copilot 免费计划](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/managing-copilot-free/about-github-copilot-free)。

### 第二步：开始你的第一个智能体(Agent)会话(Agent Session)

1. 打开**聊天**视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I）。
2. 输入描述你想构建内容的提示词(Prompt)，例如：
   ```
   创建一个用于分享食谱的基础 Node.js Web 应用，使其现代且响应式。
   ```
3. 审查生成的代码。智能体(Agent)会按需创建文件、安装依赖并运行命令。
4. 输入 `/init` 为 AI 配置你的项目。这会创建[自定义说明(Custom Instructions)](/vscode-copilot/customization/custom-instructions)，帮助智能体(Agent)理解你的代码库并生成更好的代码。

完整的上手教程（涵盖内联建议(Inline Suggestion)、智能体(Agent)、内联聊天(Inline Chat)和自定义），请参阅 [VS Code 中 GitHub Copilot 快速入门](/vscode-copilot/getting-started)。

## 在输入时获得 AI 辅助

对于较小的改动或需要更精准控制时，Copilot 可直接在编辑器中提供辅助。

### 内联建议(Inline Suggestion)

Copilot 在你输入时提供代码建议，从单行补全到完整函数实现都有涵盖。下一个编辑建议（Next edit suggestions）会根据你当前的编辑预测下一个合理的变更。

了解更多：[VS Code 中的内联建议(Inline Suggestion)](/vscode-copilot/inline-suggestions)。

### 内联聊天(Inline Chat)

按 ⌘I（Windows、Linux：Ctrl+I）可直接在编辑器中打开聊天提示框。描述你想做的变更，Copilot 会在原位建议修改，让你保持编码流畅。可用于针对性重构、解释代码或快速修复，无需切换上下文。

了解更多：[VS Code 中的内联聊天(Inline Chat)](/vscode-copilot/chat/inline-chat)。

### 智能操作(Smart Action)

VS Code 内置了适用于常见任务的预定义 AI 操作：生成提交消息、重命名符号、修复错误以及跨项目进行语义搜索。

![智能操作(Smart Action)菜单截图，显示修复测试失败的选项。](/assets/docs/copilot/overview/copilot-chat-fix-test-failure.png)

了解更多：[VS Code 中的智能操作(Smart Action)](/vscode-copilot/smart-actions)。

## 为你的工作流自定义 AI

智能体(Agent)在理解项目规范、拥有合适工具并使用适合任务的模型时效果最佳。VS Code 提供多种方式来[定制 AI](/vscode-copilot/customization/overview)，使其从一开始就生成符合代码库风格的代码，而无需事后手动修正。

- **[自定义说明(Custom Instructions)](/vscode-copilot/customization/custom-instructions)**：定义项目范围的编码规范，让 AI 生成符合你风格的代码。
- **[智能体(Agent)技能](/vscode-copilot/customization/agent-skills)**：为 Copilot 添加专业能力，适用于 VS Code、GitHub Copilot CLI 和 GitHub Copilot 云端智能体(Cloud Agent)。
- **[自定义智能体(Custom Agent)](/vscode-copilot/customization/custom-agents)**：创建承担特定角色（如代码审查者或文档撰写者）的智能体(Agent)，并配备专属工具和说明。
- **[MCP 服务器](/vscode-copilot/customization/mcp-servers)**：通过 MCP 服务器或 Marketplace 扩展为智能体(Agent)添加工具。
- **[Hooks](/vscode-copilot/customization/hooks)**：在特定事件触发时执行自定义命令，用于自动化和策略执行。

## 支持

GitHub Copilot Chat 的支持由 GitHub 提供，可访问 [https://support.github.com](https://support.github.com)。

了解 Copilot 的安全性、隐私、合规性和透明度，请参阅 [GitHub Copilot Trust Center FAQ](https://copilot.github.trust.page/faq)。

## 定价

> **💡 国内用户替代方案**
> 除了 GitHub Copilot 官方订阅，您也可以使用 **[飞码扣插件](/guides/quickstart)** — 在 GitHub Copilot Chat 中直接使用通义千问(Qwen3)、DeepSeek V3.2、GLM-5 等国内顶级 AI 模型，按次计费，无需月付订阅。[立即开始 →](/guides/quickstart)


> **重要提示**
> **自 2026 年 4 月 20 日起**，Copilot Pro、Copilot Pro+ 及学生计划暂停新用户注册。同时，我们正在收紧每周使用限制。详见 [GitHub Copilot 使用限制](https://docs.github.com/copilot/concepts/usage-limits)。

你可以免费使用 GitHub Copilot，每月有一定数量的内联建议(Inline Suggestion)和聊天交互额度。如需更多使用量，可以选择付费计划。

[查看 GitHub Copilot 详细定价](https://docs.github.com/en/copilot/get-started/plans)

## 后续步骤

- [快速入门：VS Code 中 GitHub Copilot 入门](/vscode-copilot/getting-started)
- [教程：VS Code 中的智能体(Agent)入门](/vscode-copilot/agents/agents-tutorial)
- [为你的工作流自定义 AI](/vscode-copilot/customization/overview)
