---
title: 使用 Copilot 修复 Bug
description: 了解如何在 VS Code 中使用 GitHub Copilot 识别和修复代码中的 Bug，包括使用聊天、内联聊天和智能操作。
source: https://code.visualstudio.com/docs/copilot/guides/fix-bugs
---

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


GitHub Copilot 可以帮助你识别和修复代码中的 Bug，从简单的语法错误到复杂的逻辑问题。

## 使用智能操作(Smart Action)修复错误

### 修复代码操作

当 VS Code 在代码中检测到问题（如编译错误或 lint 问题）时，会显示代码操作：

1. 将鼠标悬停在错误上。
2. 选择**使用 Copilot 修复**选项（闪光图标）。
3. Copilot 分析错误并建议修复。

### 修复终端错误

当终端命令失败时：

1. 注意终端行号区域显示的闪光图标。
2. 选择**使用 Copilot 修复**来解释错误并获取修复建议。

### 修复测试失败

直接从测试资源管理器：

1. 将鼠标悬停在失败的测试上。
2. 选择**修复测试失败**按钮（闪光图标）。
3. Copilot 分析失败原因并建议修复。

## 使用内联聊天(Inline Chat)修复 Bug

对于特定代码块中的 Bug：

1. 选择有问题的代码。
2. 按 ⌘I（Windows、Linux：Ctrl+I）打开内联聊天(Inline Chat)。
3. 输入：
   ```
   /fix
   ```
   或更具体地：
   ```
   This function has a bug when the input array is empty. Fix it.
   ```

## 使用聊天视图深度调试

对于更复杂的 Bug，使用聊天视图进行深度分析：

1. 打开聊天视图（⌃⌘I / Ctrl+Alt+I）。
2. 描述问题：
   ```
   I'm getting a NullPointerException in the UserService.findById method.
   Here's the stack trace: [粘贴堆栈跟踪]
   #user-service.ts
   ```
3. Copilot 分析代码和错误，建议修复方案。

## 使用智能体(Agent)自动修复 Bug

对于需要跨多个文件修复的 Bug，使用智能体(Agent)模式：

```
There's a bug in the authentication flow where users can bypass 2FA.
Find the issue in the codebase and fix it. Then write a test to
prevent regression.
```

智能体(Agent)会：
1. 搜索代码库找到相关代码
2. 分析并识别根本原因
3. 实施修复
4. 可选地编写测试防止回归

## 调试配置

使用 Copilot 帮助设置调试：

```
/startDebugging
```

或：
```
Create a debug configuration for a Node.js Express app with
environment variables loaded from .env file
```

了解更多：[使用 Copilot 调试](/docs/copilot/guides/debug-with-copilot)。

## 分析错误模式

Copilot 可以帮助你理解错误模式：

```
Analyze this error and explain what's happening:
[粘贴错误信息和堆栈跟踪]

What are the common causes of this type of error,
and how should I prevent it in the future?
```

## 延伸阅读

- [使用 Copilot 调试](/docs/copilot/guides/debug-with-copilot)
- [使用 Copilot 生成测试](/docs/copilot/guides/generate-tests)
- [智能操作(Smart Action)](/docs/copilot/copilot-smart-actions)
