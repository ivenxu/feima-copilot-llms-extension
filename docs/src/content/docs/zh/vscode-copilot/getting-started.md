---
title: GitHub Copilot 快速入门
description: 通过构建完整的任务管理 Web 应用，逐步体验 VS Code 中的 AI 能力，包括智能体、内联建议、内联聊天和自定义配置。
source: https://code.visualstudio.com/docs/copilot/getting-started
---

GitHub Copilot 彻底改变了你在 Visual Studio Code 中编写代码的方式。在本实践教程中，你将构建一个完整的任务管理 Web 应用，同时探索 VS Code 的 AI 能力：自主跨多文件实现功能的智能体(Agent)、智能内联建议(Inline Suggestion)、精准的内联聊天(Inline Chat)编辑、集成智能操作(Smart Action)以及强大的自定义选项。

完成本教程后，你将拥有一个可运行的 Web 应用，以及一套适应你开发风格的个性化 AI 编码配置。

## 前提条件

- 在你的计算机上安装 VS Code。从 [Visual Studio Code 官网](https://code.visualstudio.com/)下载。
- 访问 GitHub Copilot。按照步骤[在 VS Code 中设置 GitHub Copilot](/vscode-copilot/setup)。

  > **提示**
  > 如果你没有 Copilot 订阅，可以直接在 VS Code 中注册免费使用，每月可享有一定数量的内联建议(Inline Suggestion)和聊天交互额度。

  > **重要提示**
  > **自 2026 年 4 月 20 日起**，Copilot Pro、Copilot Pro+ 及学生计划暂停新用户注册。详见 [GitHub Copilot 使用限制](https://docs.github.com/copilot/concepts/usage-limits)。

> **💡 国内用户替代方案**
> 除了 GitHub Copilot 官方订阅，您也可以使用 **[飞码扣插件](https://marketplace.visualstudio.com/items?itemName=feima.copilot-cn-models)** — 在 GitHub Copilot Chat 中直接使用通义千问(Qwen3)、DeepSeek V3.2、GLM-5 等国内顶级 AI 模型，按次计费，无需月付订阅。[立即开始 →](/guides/quickstart) [打开飞码扣](vscode:extension/feima.copilot-cn-models)


## 第一步：体验内联建议(Inline Suggestion)

AI 驱动的内联建议(Inline Suggestion)会在你输入时出现，帮助你更快地编写代码，减少错误。让我们先为任务管理应用构建基础结构。

1. 为项目新建一个文件夹并在 VS Code 中打开。
2. 创建一个名为 `index.html` 的新文件。
3. 开始输入以下内容，输入过程中 VS Code 会提供内联建议（_幽灵文字_）：
   ```
   <!DOCTYPE html>
   ```
   
   ![Copilot 建议 HTML 结构的内联建议(Inline Suggestion)截图。](/assets/docs/copilot/getting-started/html-completion.png)
   
   由于大型语言模型(Language Model)具有[不确定性](/vscode-copilot/concepts/language-models#_key-characteristics)，你看到的建议可能有所不同。

4. 按 Tab 键接受建议。恭喜！你刚刚接受了第一个 AI 驱动的内联建议(Inline Suggestion)。

5. 继续构建 HTML 结构。在 `<body>` 标签内开始输入：
   ```html
   <div class="container">
       <h1>My Task Manager</h1>
       <form id="task-form">
   ```
   注意 VS Code 如何随着你构建应用结构，持续建议相关的 HTML 元素。

6. 如果看到多个建议，可将鼠标悬停在幽灵文字上查看导航控件，或使用 ⌥\]（Windows、Linux：Alt+\]）和 ⌥\[（Windows、Linux：Alt+\[）在选项之间循环。

   ![内联建议(Inline Suggestion)导航控件截图。](/assets/docs/copilot/getting-started/inline-suggestion-navigation.png)

内联建议(Inline Suggestion)会在你输入时自动工作，从你的编码模式和项目上下文中学习。对于编写样板代码、HTML 结构和重复模式特别有帮助。

## 第二步：使用智能体(Agent)构建完整功能

AI 智能体(Agent)是 VS Code 最强大的 AI 能力。给定自然语言提示，它们会自主规划并跨多个文件实现复杂功能。让我们用它来创建任务管理应用的核心功能。

1. 按 ⌃⌘I（Windows、Linux：Ctrl+Alt+I）打开聊天视图，或选择 VS Code 标题栏中的聊天图标。

   聊天视图是你使用自然语言提示与 AI 交互的地方，可以进行持续对话并逐步优化请求以获得更好的结果。

2. 在智能体(Agent)下拉菜单中选择 **Agent**，让 AI 端到端独立实现你的请求。

   ![聊天视图中智能体(Agent)选择器截图。](/assets/docs/copilot/getting-started/agent-mode-selection-2.png)

   > **重要提示**
   > 如果没有看到智能体(Agent)选项，请确保在 VS Code 设置中启用了智能体（`chat.agent.enabled`）。你的组织也可能已禁用智能体(Agent)——请联系管理员启用。

3. 输入以下提示并按 Enter。智能体(Agent)会分析你的请求并开始实施。
   ```
   创建一个完整的任务管理 Web 应用，支持添加、删除和标记任务完成。包含现代 CSS 样式，使其响应式。使用语义 HTML 并确保可访问性。将标记、样式和脚本分别放在各自的文件中。
   ```
   
   观察智能体(Agent)生成必要的文件和代码。你应该能看到它更新 `index.html` 文件、创建 `styles.css` 样式文件和 `script.js` 功能文件。

   > **提示**
   > 不同的语言模型(Language Model)可能有不同的优势。使用聊天视图中的模型下拉菜单可以在语言模型(Language Model)之间切换。

4. 审查生成的文件，选择 **Keep** 接受所有变更。

5. 右键单击文件，选择 **Show Preview**，在集成浏览器中打开 `index.html`。你可以添加任务、标记完成和删除任务。

6. 现在添加额外功能。在聊天输入框中输入以下提示：
   ```
   添加筛选系统，用按钮显示全部任务、仅显示已完成任务或仅显示待完成任务。更新样式以匹配现有设计。
   ```
   
   注意智能体(Agent)是如何跨多个文件协调变更来完整实现这一功能的。

智能体(Agent)擅长理解高层需求并将其转化为可运行的代码，非常适合实现新功能、重构大段代码或从头构建整个应用。

## 第三步：使用内联聊天(Inline Chat)进行精准调整

智能体(Agent)处理大型功能，而编辑器内联聊天(Inline Chat)则非常适合对文件内特定代码段进行针对性改进。让我们用它来增强任务管理应用。

1. 打开 JavaScript 文件并找到添加新任务的代码。
2. 选择代码块，然后按 ⌘I（Windows、Linux：Ctrl+I）打开编辑器内联聊天(Inline Chat)。

   ![内联聊天(Inline Chat)为选定代码块启动的截图。](/assets/docs/copilot/getting-started/inline-chat-start.png)

   > **注意**
   > 具体代码可能有所不同，因为大型语言模型(Language Model)具有不确定性。

3. 输入以下提示：
   ```
   添加输入验证，防止添加空任务，并去除任务文本的前后空格。
   ```
   
   注意内联聊天(Inline Chat)是如何专注于选定代码并进行针对性改进的。

   ![内联聊天(Inline Chat)为选定函数添加验证的截图。](/assets/docs/copilot/getting-started/inline-chat-validation.png)

4. 审查变更，选择 **Keep** 应用。

编辑器内联聊天(Inline Chat)非常适合进行小范围、有针对性的修改，而不影响整个代码库，例如添加错误处理、重构单个函数或修复 Bug。

## 第四步：个性化你的 AI 体验

自定义聊天可以让它更好地适应你的具体需求和编码风格。你可以设置自定义说明(Custom Instructions)并构建专门的自定义智能体(Custom Agent)。让我们为项目创建完整的个性化设置。

### 创建自定义说明(Custom Instructions)

自定义说明(Custom Instructions)会告诉 AI 你的编码偏好和标准，并自动应用于所有聊天交互。

1. 在项目根目录创建 `.github` 文件夹。
2. 在 `.github` 文件夹内创建 `copilot-instructions.md` 文件。
3. 添加以下内容：
   ```markdown
   # 项目通用编码指南
   
   ## 代码风格
   - 使用语义 HTML5 元素（header, main, section, article 等）
   - 优先使用现代 JavaScript（ES6+）特性，如 const/let、箭头函数和模板字面量
   
   ## 命名规范
   - 组件名、接口和类型别名使用 PascalCase
   - 变量、函数和方法使用 camelCase
   - 私有类成员前加下划线（_）
   - 常量使用全大写（ALL_CAPS）
   
   ## 代码质量
   - 使用有意义的变量和函数名，清楚描述其用途
   - 对复杂逻辑添加有用的注释
   - 为用户输入和 API 调用添加错误处理
   ```

4. 保存文件。这些说明现在会应用到此项目中所有的聊天交互。

5. 通过要求智能体(Agent)添加新功能来测试自定义说明(Custom Instructions)：
   ```
   为任务管理器添加深色模式切换按钮。
   ```
   
   注意生成的代码如何遵循你指定的指南。

> **提示**
> 使用聊天中的 `/init` 斜杠命令(Slash Command)，可根据项目的结构和编码模式自动生成自定义说明(Custom Instructions)。这对于已有代码库且想为 AI 辅助做准备时非常有用。

### 创建代码审查自定义智能体(Custom Agent)

自定义智能体(Custom Agent)可以为特定任务创建专属 AI 角色。让我们创建一个"代码审查者"智能体(Agent)，专注于分析代码并提供反馈。

1. 打开命令面板，运行 **Chat: New Custom Agent** 命令。
2. 选择 `.github/agents` 作为保存位置。
3. 将自定义智能体(Custom Agent)命名为"Reviewer"，这会在 `.github/agents` 文件夹中创建 `Reviewer.agent.md` 文件。
4. 将文件内容替换为以下内容（注意此智能体(Agent)不允许直接修改代码）：
   ```
   ---
   name: 'Reviewer'
   description: '审查代码质量和最佳实践遵守情况。'
   tools: ['vscode/askQuestions', 'vscode/vscodeAPI', 'read', 'agent', 'search', 'web']
   ---
   # 代码审查者智能体(Agent)
   
   你是一位经验丰富的高级开发者，正在进行全面的代码审查。你的职责是审查代码质量、最佳实践和对[项目标准](../copilot-instructions.md)的遵守情况，但不直接修改代码。
   
   审查代码时，使用清晰的标题和被审查代码中的具体示例来组织你的反馈。
   
   ## 分析重点
   - 分析代码质量、结构和最佳实践
   - 识别潜在的 Bug、安全问题或性能问题
   - 评估可访问性和用户体验考量
   
   ## 重要指南
   - 适当时对设计决策提出澄清性问题
   - 专注于解释应该改什么以及为什么
   - 不要直接编写或建议具体的代码修改
   ```

5. 保存文件。现在可以在聊天视图中从智能体(Agent)选择器选择此自定义智能体(Custom Agent)。

   ![聊天视图中"Reviewer"自定义智能体(Custom Agent)的截图。](/assets/docs/copilot/getting-started/custom-mode-dropdown.png)

6. 从智能体(Agent)选择器选择 **Reviewer** 并输入以下提示来测试你的自定义智能体(Custom Agent)：
   ```
   审查我的整个项目
   ```
   
   注意 AI 现在作为代码审查者行事，提供分析和改进建议。

   ![自定义审查者智能体(Agent)分析代码的截图。](/assets/docs/copilot/getting-started/custom-reviewer-mode.png)

## 第五步：使用智能操作(Smart Action)获得预置 AI 辅助

智能操作(Smart Action)将 AI 功能直接集成到 VS Code 界面中，无缝融入你的开发流程。让我们以提交消息生成为例进行探索。

1. 按 ⌃⇧G（Windows、Linux：Ctrl+Shift+G）或选择活动栏中的源代码管理图标打开**源代码管理**视图。
2. 如果还没有初始化项目的 Git 仓库，在源代码管理视图中选择**初始化仓库**。
3. 通过选择文件旁边的 **+** 按钮暂存你的变更。
4. 选择**闪光图标**，根据暂存的变更生成提交消息。

   AI 会分析你的暂存变更并生成遵循常规提交标准的描述性提交消息，考量以下因素：
   - 哪些文件发生了变更
   - 变更的性质（添加功能、修复 Bug、重构）
   - 修改的范围和影响

   ![源代码管理视图中生成的提交消息截图。](/assets/docs/copilot/getting-started/generated-commit-message.png)

5. 审查生成的消息。如果满意，继续提交；如果想要不同的风格或重点，再次选择闪光图标生成另一个消息。

提交消息生成等智能操作(Smart Action)展示了 AI 如何自然地融入现有工作流程，无需切换到聊天界面。VS Code 还有许多其他智能操作(Smart Action)，帮助你进行调试、测试等工作。

## 后续步骤

恭喜！你已经构建了完整的任务管理应用，并学会了如何在 VS Code 核心能力中有效地使用 AI。

你还可以通过探索其他自定义选项来进一步增强 AI 能力：

- 为不同任务添加更多专业智能体(Agent)，如规划、调试或文档撰写。
- 为特定编程语言或框架创建自定义说明(Custom Instructions)。
- 通过 MCP（Model Context Protocol）服务器或 VS Code 扩展为 AI 添加额外工具。

### 延伸阅读

- [GitHub Copilot 工作原理](https://code.visualstudio.com/docs/copilot/concepts/overview)：Copilot 功能背后的核心概念、术语和架构
- [智能体(Agent)教程](/vscode-copilot/agents/agents-tutorial)：使用不同智能体(Agent)类型的实践教程
- [AI 功能速查表](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)：VS Code 中所有 GitHub Copilot 功能的快速参考
- [聊天文档](https://code.visualstudio.com/docs/copilot/chat/copilot-chat)：深入了解 VS Code 中的自主编码
- [自定义指南](/vscode-copilot/customization/overview)：高级个性化技巧
- [MCP 工具](/vscode-copilot/customization/mcp-servers)：使用外部 API 和服务扩展智能体(Agent)
