---
title: Ask 模式
description: 了解 VS Code GitHub Copilot 的 Ask 模式，用于探索代码库、理解代码、提问和头脑风暴，不直接修改文件。
source: https://code.visualstudio.com/docs/copilot/chat/ask-mode
---

Ask 模式（**Ask**）是 VS Code GitHub Copilot 的一种聊天模式，专为回答问题、探索代码库和理解代码而设计。它使用智能体(Agent)能力自主搜索和分析代码，但不会自动修改文件。

## 什么时候使用 Ask 模式？

Ask 模式最适合以下场景：

- 了解代码库的结构和工作原理
- 探索架构和设计模式
- 获取技术概念的解释
- 在实施之前研究和规划
- 理解不熟悉的代码或库

当你想要更改代码时，请切换到 **Agent** 模式。

## 开始使用 Ask 模式

1. 在聊天视图（⌃⌘I / Ctrl+Alt+I）的智能体(Agent)选择器中选择 **Ask**。
2. 输入你的问题，例如：
   ```
   Where is the authentication logic implemented in this project?
   ```
   或
   ```
   How does the data flow from the API endpoint to the database?
   ```
3. Copilot 自动搜索代码库，找到相关上下文，并提供详细的解答。

## Ask 模式的能力

Ask 模式会自主使用以下工具来收集信息：

- **代码搜索**：在工作区中搜索相关文件和符号
- **文件读取**：读取相关代码文件的内容
- **符号解析**：理解类、函数和变量的定义和用法

## 应用代码建议

Ask 的响应中可能包含代码块。要将代码块应用到编辑器：

1. 将鼠标悬停在代码块上
2. 选择**在编辑器中应用**按钮

代码会应用到当前光标位置或与代码块相关的文件中。

## 使用 #codebase 搜索

使用 `#codebase` 上下文变量(Context Variable)指示 Copilot 搜索整个代码库寻找相关信息：

```
#codebase 哪里处理了用户权限验证？
```

## 延伸阅读

- [智能体(Agent)模式](/docs/copilot/chat/agent-mode)：自主实施代码变更
- [聊天视图](/docs/copilot/chat/chat-view)
- [提示词(Prompt)编写技巧](/docs/copilot/chat/prompt-crafting)
