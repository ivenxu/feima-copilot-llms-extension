---
title: 浏览器智能体测试指南
description: 了解如何使用 VS Code 的浏览器智能体工具，让 AI 自主构建、测试和调试 Web 应用程序，实现闭环开发测试。
source: https://code.visualstudio.com/docs/copilot/guides/browser-agent-testing-guide
---

浏览器智能体(Agent)工具让 AI 能够在闭合开发循环中自主构建和验证 Web 应用程序。智能体(Agent)可以创建 HTML、CSS 和 JavaScript，在集成浏览器中打开应用，与之交互以验证功能，通过控制台错误和视觉检查识别问题，并无需人工干预就能修复问题。

本指南带你使用浏览器智能体(Agent)工具构建计算器应用，并观察智能体(Agent)如何通过自动化测试发现和修复 Bug。

> **注意**
> 浏览器智能体(Agent)工具目前处于实验阶段，在未来版本中可能会更改。

## 前提条件

- [安装 Visual Studio Code](/download)
- [GitHub Copilot 订阅](/docs/copilot/setup)

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)

- 使用 `workbench.browser.enableChatTools` 设置启用浏览器智能体(Agent)工具

## 浏览器智能体(Agent)工具的工作原理

启用浏览器智能体(Agent)工具后，智能体(Agent)可以访问允许它们读取并与集成浏览器中的页面交互的工具。这些工具包括：

- **页面导航**：`openBrowserPage`、`navigatePage`
- **页面内容和外观**：`readPage`、`screenshotPage`
- **用户交互**：`clickElement`、`hoverElement`、`dragElement`、`typeInPage`、`handleDialog`
- **自定义浏览器自动化**：`runPlaywrightCode`

默认情况下，智能体(Agent)打开的页面在私有的内存会话中运行，不与其他浏览器标签页共享 cookie 或存储。这让你能控制智能体(Agent)可以访问哪些浏览数据。

## 第一步：为智能体(Agent)启用浏览器工具

1. 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I），从智能体(Agent)下拉菜单选择 **Agent**。
2. 选择聊天输入区域中的**工具**按钮打开工具选择器。
3. 验证所有浏览器工具已启用（它们在**内置** > **浏览器**下分组）。

智能体(Agent)现在可以使用这些工具与网页交互。

## 第二步：让智能体(Agent)构建计算器

启用浏览器工具后，让智能体(Agent)创建一个简单的计算器应用程序。

1. 创建新项目文件夹并在 VS Code 中打开。
2. 在聊天视图中，输入以下提示词(Prompt)：
   ```
   Create a calculator with buttons for digits 0-9, operations (add, subtract, multiply, divide), clear, and equals. Use HTML, CSS, and JavaScript. Style it with a clean, modern design.
   ```
3. 审查智能体(Agent)创建 `index.html`、`styles.css` 和 `script.js` 时生成的文件。
4. 选择**保留**将文件保存到工作区。

## 第三步：让智能体(Agent)测试计算器

要求智能体(Agent)在集成浏览器中打开计算器并验证其是否正常工作。

1. 在聊天视图中，输入以下提示词(Prompt)：
   ```
   Open the calculator in the browser and test if all the operations work correctly.
   ```
2. 观察智能体(Agent)在集成浏览器中打开 `index.html`，解析页面内容以了解结构，并通过模拟点击和检查结果系统地测试每个按钮和操作。

智能体(Agent)报告哪些操作工作正常，并识别发现的任何问题。

## 第四步：观察智能体(Agent)调试和修复问题

如果智能体(Agent)在测试期间发现 Bug，它会自动分析问题并实施修复。

1. 引入一个 Bug：
   ```
   function calculate() {
       if (!operator || shouldReset) return;
       const a = parseFloat(previous);
       const b = parseFloat(current);
       let result;
       switch (operator) {
       case '+': result = a + b; break;
       case '-': result = a - b; break;
       case '*': result = a * b; break;
       case '/': result = a / b; break;
   }
   ```

2. 要求智能体(Agent)测试除法操作并修复发现的任何问题：
   ```
   Verify the division operation works correctly. If you find any issues, fix them.
   ```

3. 观察智能体(Agent)在除以零时遇到错误，然后分析和修复代码，最后验证 Bug 修复。

智能体(Agent)完成了一个完整的开发循环：构建、测试、调试和修复，通过浏览器自动化实现。

## 与智能体(Agent)共享手动打开的页面

你也可以手动打开网页并明确与智能体(Agent)共享以进行分析或交互。

1. 通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **Browser: Open Integrated Browser** 命令打开集成浏览器。
2. 导航到要让智能体(Agent)分析或交互的网页。
3. 选择浏览器工具栏中的**与智能体(Agent)共享**按钮。
4. 要求智能体(Agent)在共享页面上执行操作：
   ```
   What is the main heading on this page? Click the first link and tell me where it goes.
   ```

完成后，再次选择**与智能体(Agent)共享**按钮撤销访问。

> **提示**
> 共享页面使用你现有的浏览器会话，包括 cookie 和登录状态。智能体(Agent)打开的页面使用隔离的临时会话，不与其他浏览器标签页共享 cookie 或存储。

## 可尝试的场景

- **表单验证测试**：让智能体(Agent)构建并测试联系表单，验证验证规则、错误消息和成功提交
- **响应式布局验证**：要求智能体(Agent)在不同视口大小下截图并验证响应式行为
- **认证流程测试**：让智能体(Agent)测试登录页面的凭据验证、错误处理和成功重定向
- **交互功能测试**：让智能体(Agent)验证用户交互和状态管理
- **无障碍审计**：要求智能体(Agent)检查任何网页的缺失 alt 文本、标题层次结构、键盘导航和颜色对比度问题

## 延伸阅读

- [集成浏览器](/docs/debugtest/integrated-browser)
- [智能体(Agent)概览](/docs/copilot/agents/overview)
