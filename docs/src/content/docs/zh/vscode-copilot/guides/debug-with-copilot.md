---
title: 使用 Copilot 调试
description: 了解如何在 VS Code 中使用 GitHub Copilot 辅助调试，包括配置调试设置、使用 copilot-debug 命令和修复代码问题。
source: https://code.visualstudio.com/docs/copilot/guides/debug-with-copilot
---

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


GitHub Copilot 可以帮助改善你在 Visual Studio Code 中的调试工作流程。Copilot 可以帮助设置项目的调试配置，并提供修复调试过程中发现问题的建议。本文概述如何在 VS Code 中使用 Copilot 调试应用程序。

Copilot 可以帮助以下调试任务：

- **配置调试设置**：生成和自定义项目的启动配置。
- **启动调试会话**：使用 `copilot-debug` 从终端启动调试会话。
- **修复问题**：接收修复调试过程中发现问题的建议。

## 使用 Copilot 设置调试配置

VS Code 使用 `launch.json` 文件存储[调试配置](/docs/debugtest/debugging-configuration)。Copilot 可以帮助你创建和自定义此文件，为项目设置调试。

1. 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I）。
2. 输入 `/startDebugging` 命令。
3. 按照 Copilot 的指导为项目设置调试。

你也可以使用自然语言提示，例如：
- "Create a debug configuration for a Django app"
- "Set up debugging for a React Native app"
- "Configure debugging for a Flask application"

## 使用 Copilot 启动调试

`copilot-debug` 终端命令简化了配置和启动调试会话的过程。在用于启动应用程序的命令前加上 `copilot-debug`，Copilot 会自动配置并启动调试会话。

1. 打开集成终端（⌃`（Windows、Linux：Ctrl+`））。

2. 输入 `copilot-debug`，后跟应用程序的启动命令。例如：
   ```
   copilot-debug node app.js
   ```
   或
   ```
   copilot-debug python manage.py
   ```

3. Copilot 为你的应用程序启动调试会话。现在可以使用 VS Code 中的内置调试功能。

了解更多：[VS Code 中的调试](/docs/debugtest/debugging)。

## 使用 Copilot 修复编码问题

可以使用 Copilot Chat 帮助修复编码问题或改进代码。

### 使用聊天提示词(Prompt)

1. 打开应用程序代码文件。
2. 打开以下视图之一：
   - 聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I）
   - 内联聊天（⌘I / Windows、Linux：Ctrl+I）
3. 输入以下提示词(Prompt)之一：
   - "/fix"
   - "Fix this #selection"
   - "Validate input for this function"
   - "Refactor this code"
   - "Improve the performance of this code"

### 使用编辑器智能操作(Smart Action)

要在不编写提示词(Prompt)的情况下修复应用程序代码问题，可以使用编辑器智能操作(Smart Action)：

1. 打开应用程序代码文件。
2. 选择要修复的代码。
3. 右键单击，选择**生成代码** > **修复**。
4. 可选地，通过在聊天提示词(Prompt)中提供额外上下文来优化生成的代码。

## 延伸阅读

- [VS Code 中的通用调试功能](/docs/debugtest/debugging)
- [VS Code 中的 Copilot 概览](/docs/copilot/overview)
