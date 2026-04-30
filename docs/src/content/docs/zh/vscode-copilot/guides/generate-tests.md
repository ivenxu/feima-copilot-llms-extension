---
title: 使用 Copilot 生成测试
description: 了解如何在 VS Code 中使用 GitHub Copilot 生成测试代码，包括单元测试、集成测试和测试驱动开发。
source: https://code.visualstudio.com/docs/copilot/guides/generate-tests
---

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


GitHub Copilot 可以帮助你为应用程序代码生成测试，从单元测试到集成测试，支持多种测试框架。

## 使用智能操作(Smart Action)生成测试

最简单的测试生成方式是使用编辑器智能操作(Smart Action)：

1. 打开应用程序代码文件。
2. 可选地，选择要测试的特定函数或类。
3. 右键单击，选择**生成代码** > **生成测试**。

VS Code 在现有测试文件中生成测试代码，如果不存在测试文件，则创建新文件。

## 使用聊天生成测试

通过聊天视图，你可以更精细地控制测试生成：

1. 打开聊天视图（⌃⌘I / Ctrl+Alt+I）。
2. 输入提示词(Prompt)，例如：
   ```
   Generate unit tests for the UserService class in #user-service.ts
   using Jest. Include tests for edge cases and error conditions.
   ```

3. Copilot 生成测试代码，你可以应用到现有测试文件或新文件。

## 使用内联聊天(Inline Chat)生成测试

在测试文件中使用内联聊天(Inline Chat)：

1. 打开或创建测试文件。
2. 按 ⌘I（Windows、Linux：Ctrl+I）打开内联聊天(Inline Chat)。
3. 输入：
   ```
   Add tests for the calculateTax function covering: standard tax rate,
   zero income, negative income, and maximum income edge cases
   ```

## 测试驱动开发（TDD）

Copilot 非常适合测试驱动开发工作流程：

1. 先描述想要的行为，让 Copilot 生成失败的测试：
   ```
   Write failing tests for a function that should validate US phone numbers.
   The function should accept formats: (555) 555-5555, 555-555-5555, 5555555555
   ```

2. 然后让智能体(Agent)实现使测试通过的代码：
   ```
   Now implement the validatePhoneNumber function to make these tests pass
   ```

## 修复失败的测试

使用 Copilot 分析和修复失败的测试：

1. 在测试资源管理器中，将鼠标悬停在失败的测试上。
2. 选择**修复测试失败**按钮（闪光图标）。

或者在聊天中输入 `/fixTestFailure` 命令。

当使用智能体(Agent)模式时，智能体(Agent)会自动监控测试输出，发现失败时尝试自动修复并重新运行。

## 使用智能体(Agent)生成测试套件

对于需要全面测试套件的情况，使用智能体(Agent)模式：

```
Create a comprehensive test suite for the authentication module.
Include unit tests for each function, integration tests for the
authentication flow, and mock the database calls. Use Jest with TypeScript.
Run the tests and fix any failures.
```

智能体(Agent)会创建测试文件，运行测试，并在遇到失败时自动修复。

## 支持的测试框架

Copilot 支持主要的测试框架：

- **JavaScript/TypeScript**：Jest、Mocha、Vitest、Jasmine
- **Python**：pytest、unittest、nose
- **Java**：JUnit、TestNG
- **C#**：MSTest、xUnit、NUnit
- **Go**：testing 包
- **Ruby**：RSpec、Minitest

## 延伸阅读

- [使用 Copilot 修复 Bug](/docs/copilot/guides/fix-bugs)
- [智能操作(Smart Action)](/docs/copilot/copilot-smart-actions)
- [最佳实践](/docs/copilot/best-practices)
