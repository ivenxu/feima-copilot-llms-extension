---
title: 本地智能体
description: 了解 VS Code 中的本地智能体，包括内置的 Agent、Plan 和 Ask 三种模式，以及如何启动和使用本地智能体会话。
source: https://code.visualstudio.com/docs/copilot/agents/local-agents
---

本地智能体(Local Agent)在 Visual Studio Code 内部以交互方式运行，在你的机器上工作。它们使用当前工作区，可以访问 VS Code 中可用的所有工具和模型，包括扩展提供的工具和 MCP 服务器。通过[创建自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)，你可以让智能体(Agent)承担特定角色或角色身份，例如代码审查者、测试工程师或文档撰写者。

本地智能体(Local Agent)在 VS Code 的聊天界面中运行。当你关闭聊天会话时，本地智能体(Local Agent)保持活跃，你可以在会话视图中跟踪它。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


## 为什么使用本地智能体(Local Agent)？

- 需要即时反馈的交互式对话，例如头脑风暴、规划或尚未完全定义的任务
- 需要从开发环境获取上下文的任务，例如 lint 错误、堆栈跟踪、单元测试结果
- 需要访问 VS Code 扩展或 MCP 服务器的特定工具，或需要使用特定模型（如 BYOK 模型）的任务
- 不需要与其他团队成员协作的任务

## 主要特性

- 在本机 VS Code 中运行，使用当前工作区
- 基于聊天的交互界面，支持实时反馈和迭代
- 完全访问工作区、文件和上下文
- 可以访问 VS Code 中配置的所有智能体(Agent)工具，包括内置工具、MCP 工具和扩展提供的工具
- 可以使用 VS Code 中为你可用的所有模型，包括 BYOK 模型和其他提供商的模型

## 内置智能体(Agent)

本地智能体(Local Agent)会话(Agent Session)使用三种内置智能体(Agent)之一，每种针对不同类型的任务进行优化。你可以在聊天会话中随时通过聊天视图中的智能体(Agent)选择器切换智能体(Agent)。对于更专业的工作流程，你可以创建自己的[自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)。

### Agent

Agent 针对基于高层需求的复杂编码任务进行优化，可能需要运行终端命令和工具。AI 自主操作，确定相关上下文和要编辑的文件，规划所需工作，并在出现问题时迭代解决。

VS Code 直接在编辑器中应用代码变更，编辑器覆盖控件让你能够在建议的编辑之间导航并审查它们。智能体(Agent)可能会调用多个[工具](/docs/copilot/agents/agent-tools)来完成不同任务。

你可以通过添加 MCP 服务器或安装提供工具的扩展来[用额外工具自定义聊天](/docs/copilot/agents/agent-tools)。

> **重要提示**
> 如果你没有看到智能体(Agent)选项，请确保在 VS Code 设置中启用了智能体（`chat.agent.enabled`，此设置由组织级别管理）。你的组织也可能禁用了智能体(Agent)，请联系管理员启用。

### Plan

Plan 智能体(Agent)针对为编码任务创建结构化实施计划进行优化。当你想在实施之前将复杂功能或变更分解为更小、更易管理的步骤时，使用 Plan 智能体(Agent)。

Plan 智能体(Agent)生成详细计划，概述所需步骤，并提出澄清性问题以确保全面理解任务。然后你可以将计划移交给实施智能体(Agent)，或将其作为指导使用。

了解更多：[使用智能体(Agent)规划](/docs/copilot/agents/planning)。

### Ask

Ask 最适合回答有关代码库、编码和通用技术概念的问题。当你想了解某些工作原理、探索想法或获得编码任务帮助时，使用 Ask。

Ask 使用智能体(Agent)能力研究你的代码库并收集相关上下文。响应可以包含代码块，你可以单独应用到代码库中。要应用代码块，将鼠标悬停在代码块上并选择**在编辑器中应用**按钮。

### 编辑模式（已弃用）

编辑模式已弃用。请改用智能体(Agent)模式进行多文件代码编辑。可以通过启用 `chat.editMode.hidden` 设置恢复编辑模式。

## 快速上手

> **提示**
> 要体验包括后台和云端智能体(Cloud Agent)在内的不同智能体(Agent)类型的实践教程，请参阅[智能体(Agent)教程](/docs/copilot/agents/agents-tutorial)。

启动本地智能体(Local Agent)会话(Agent Session)：

1. 在聊天视图的智能体(Agent)选择器中选择 **Agent**。

2. 在聊天输入框中输入高层级提示词(Prompt)。例如，你可以询问：
   ```
   Implement a user authentication system with OAuth2 and JWT.
   ```
   或
   ```
   Set up a CI/CD pipeline for this project.
   ```

3. 使用工具选择器[启用工具](/docs/copilot/agents/agent-tools)，为智能体(Agent)提供更多能力。

4. 选择**发送**或按 Enter 提交提示词(Prompt)。

5. 随着智能体(Agent)处理请求，审查并确认代码变更和工具调用(Tool Call)。

   在智能体(Agent)工作时，你可以发送后续提示词(Prompt)。将消息添加到队列，引导智能体(Agent)走向新方向，或停止并立即发送。了解更多：[在请求运行时发送消息](/docs/copilot/chat/chat-sessions#_send-messages-while-a-request-is-running)。

   > **提示**
   > VS Code 帮助你防止对敏感文件进行意外编辑，例如工作区配置设置或环境设置。了解更多：[编辑敏感文件](/docs/copilot/chat/review-code-edits#_edit-sensitive-files)。

启动 Ask 会话：

1. 在聊天输入框中输入提示词(Prompt)。例如：
   ```
   Provide 3 ways to implement a search feature in React.
   ```
   或
   ```
   Where is the db connection configured in this project? #codebase
   ```

2. 在聊天视图的智能体(Agent)选择器中选择 **Ask**。

3. 可选地，[向提示词(Prompt)添加上下文](/docs/copilot/chat/copilot-chat-context)以获得更准确的响应。

4. 选择**发送**或按 Enter 提交提示词(Prompt)。

## 常见问题

**语言模型(Language Model)是否在我的机器本地运行？**

语言模型(Language Model)的位置不取决于智能体(Agent)类型。智能体(Agent)类型决定了智能体(Agent)框架在哪里运行，即智能体(Agent)编排逻辑在哪里运行。例如，本地智能体(Local Agent)在你机器上的 VS Code 中运行，而 Copilot 云端智能体(Cloud Agent)运行在远程服务器上。

语言模型(Language Model)的位置取决于你为请求选择的模型提供商。例如，如果你选择 GitHub Copilot 提供的模型，它将在远程基础设施上运行。如果你选择连接到在你的机器或私有基础设施上运行的模型的 [BYOK 模型](/docs/copilot/customization/language-models#_bring-your-own-language-model-key)，则模型将在那里运行。

## 延伸阅读

- [智能体(Agent)概览](/docs/copilot/agents/overview)：选择智能体(Agent)、配置权限并在智能体(Agent)类型之间移交
- [管理聊天会话](/docs/copilot/chat/chat-sessions)：创建、切换和组织会话
- [智能体(Agent)教程](/docs/copilot/agents/agents-tutorial)：使用不同智能体(Agent)类型的实践教程
- [工具](/docs/copilot/agents/agent-tools)：使用内置、MCP 和扩展工具扩展智能体(Agent)
- [自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)：创建你自己的 AI 智能体(Agent)
