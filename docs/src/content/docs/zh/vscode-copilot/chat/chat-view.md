---
title: 聊天视图
description: 了解 VS Code 中的聊天视图（Chat view），用于与 GitHub Copilot 进行对话交互，管理会话和访问各类 AI 功能。
source: https://code.visualstudio.com/docs/copilot/chat/chat-view
---

聊天视图（**Chat view**）是 VS Code 中与 GitHub Copilot 交互的主要界面。通过聊天视图，你可以向 AI 提出问题、请求代码更改、管理智能体(Agent)会话(Agent Session)和配置 AI 工具。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


## 打开聊天视图

使用以下方式打开聊天视图：

- 按 ⌃⌘I（Windows、Linux：Ctrl+Alt+I）
- 选择 VS Code 标题栏中的聊天图标
- 从命令面板（⇧⌘P / Ctrl+Shift+P）运行 **Chat: Open Chat View**

默认情况下，聊天视图显示在辅助侧边栏中。

## 聊天视图界面

聊天视图包含以下主要区域：

- **会话列表**：在侧边栏顶部，列出所有活跃的聊天会话。可以切换不同会话、查看状态、重命名和管理会话。
- **聊天对话区域**：显示当前会话的完整对话历史，包括你的提示词(Prompt)和 AI 的响应。
- **聊天输入框**：底部的输入区域，用于输入提示词(Prompt)。包含智能体(Agent)选择器、权限选择器、工具选择器和上下文选择器。

## 智能体(Agent)选择器

使用聊天输入框中的智能体(Agent)选择器切换不同的智能体(Agent)类型和智能体(Agent)：

- **Ask**：回答问题，探索代码库
- **Plan**：创建结构化实施计划
- **Agent**：自主实施代码变更
- **Copilot CLI**：在后台启动智能体(Agent)会话(Agent Session)
- **Cloud**：在 GitHub 上运行智能体(Agent)并创建 PR

## 上下文管理

在聊天输入框中使用 `#` 前缀添加上下文：

- `#<文件名>` — 引用特定文件
- `#codebase` — 在代码库中搜索相关内容
- `#selection` — 引用当前选中的代码
- `#terminalLastCommand` — 引用终端最后运行的命令

也可以将文件直接拖放到聊天输入框，或从工具栏选择**添加上下文**（附加图标）。

## 工具选择器

通过工具选择器启用或禁用智能体(Agent)可以使用的工具。工具包括：

- **内置工具**：文件读写、终端命令、代码搜索等
- **MCP 工具**：来自配置的 MCP 服务器的工具
- **扩展工具**：VS Code 扩展提供的工具

## 聊天历史

VS Code 保存聊天会话历史。你可以通过以下方式访问历史：

- 从会话列表选择之前的会话
- 使用搜索功能查找特定对话

## 延伸阅读

- [内联聊天(Inline Chat)](/docs/copilot/chat/inline-chat)
- [聊天会话管理](/docs/copilot/chat/chat-sessions)
- [提示词(Prompt)编写技巧](/docs/copilot/chat/prompt-crafting)
- [向聊天添加上下文](/docs/copilot/chat/copilot-chat-context)
