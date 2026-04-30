---
title: 使用 Plan 智能体规划任务
description: 了解如何使用 Plan 智能体在 VS Code 中为编码任务创建详细的实施计划，以及如何使用待办事项列表跟踪进度。
source: https://code.visualstudio.com/docs/copilot/agents/planning
---

Plan 智能体(Agent)让你能够在开始实施之前创建详细的实施计划，确保所有需求都得到满足。借助待办事项列表，智能体(Agent)可以专注于整体目标并有效跟踪进度。

有关 Plan 智能体(Agent)如何适应整体智能体(Agent)架构的背景知识，请参阅[智能体(Agent)概念](/docs/copilot/concepts/agents#_planning)。

本文介绍如何在 VS Code 中使用 Plan 智能体(Agent)和待办事项列表。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


## 如何规划任务

要规划任务，可在聊天视图中使用内置的 **Plan** 智能体(Agent)，描述你的任务，然后对生成的计划进行迭代。

1. 按 ⌃⌘I（Windows、Linux：Ctrl+Alt+I）打开聊天视图，从智能体(Agent)下拉菜单选择 **Plan**。

   或者，输入 `/plan` 后跟任务描述，可以同时切换到 Plan 智能体(Agent)并开始规划。

2. 输入高层级任务（功能、重构、Bug 等）并提交。例如：
   ```
   实现一个支持 OAuth2 和 JWT 的用户认证系统
   ```
   
   使用 `/plan` 斜杠命令(Slash Command)直接从聊天输入框开始规划：
   ```
   /plan 为所有 API 端点添加单元测试
   ```

3. 在智能体(Agent)研究你的任务后，回答它提出的澄清性问题。

4. Plan 智能体(Agent)会生成高层级计划摘要、实施步骤和验证步骤。审查计划草案并提交后续提示进行迭代，直到计划满足你的需求。

5. 计划确定后，选择开始实施，或在编辑器中打开规划提示词(Prompt)以进一步审查。

   要实施计划，可以在同一会话中继续，也可以启动新的 [Copilot CLI 会话](/docs/copilot/agents/copilot-cli)在后台实施计划。

> **提示**
> Plan 智能体(Agent)会自动将实施计划保存到会话记忆文件（`/memories/session/plan.md`）。要访问此文件，运行 **Chat: Show Memory Files** 命令并从列表中选择 `plan.md`。会话记忆在对话结束时会被清除，因此计划在后续会话中不可用。

## 自定义规划过程

你可以根据团队的工作流程定制规划过程：

- **创建自定义规划智能体(Agent)。** 定义一个[自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)，包含你规划过程的特定说明，例如强制执行架构指南或要求特定的规划交付物。

- **为规划和实施选择模型。** 使用 `chat.planAgent.defaultModel` 设置为 Plan 智能体(Agent)选择默认模型，使用 `github.copilot.chat.implementAgent.model` 设置实施步骤的模型。

- **为 Plan 智能体(Agent)添加额外工具（实验性）。** 使用 `github.copilot.chat.planAgent.additionalTools` 设置为 Plan 智能体(Agent)在研究和规划阶段提供额外工具访问权限。例如，使用 MCP 服务器连接内部数据源或工具。

## 延伸阅读

- [VS Code 智能体(Agent)中的记忆](/docs/copilot/agents/memory)
- [为智能体(Agent)配置工具](/docs/copilot/agents/agent-tools)
- [上下文工程用户指南](/docs/copilot/guides/context-engineering-guide)
