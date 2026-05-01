---
title: 智能操作
description: 了解 VS Code 中的 AI 智能操作，包括生成提交消息、代码审查、修复错误、生成测试、解释代码等内置 AI 辅助功能。
source: https://code.visualstudio.com/docs/copilot/copilot-smart-actions
---

对于几种常见场景，你可以使用_智能操作(Smart Action)_从 AI 获取帮助，而无需编写提示词(Prompt)。智能操作(Smart Action)的示例包括生成提交消息、生成文档、解释或修复代码，或执行代码审查。这些智能操作(Smart Action)遍布 VS Code UI。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/guides/quickstart)


## 生成提交消息和 PR 信息

获取基于代码变更生成提交消息和拉取请求（PR）标题和描述的帮助。使用源代码管理视图或 GitHub PR 扩展中的_闪光_图标，生成概括变更的标题和描述。

![悬停在源代码管理输入框上的闪光按钮，显示"生成提交消息"选项。](/assets/docs/copilot/copilot-smart-actions/generate-commit-message.png)

## 使用 AI 解决合并冲突（实验性）

使用 AI 帮助解决 Git 合并冲突。选择编辑器中的**使用 AI 解决合并冲突**按钮，打开聊天视图并启动一个智能体(Agent)流程，帮助你解决合并冲突。合并基础和来自每个分支的变更将作为 AI 的上下文。

![编辑器中建议的合并冲突解决方案截图。](/assets/docs/copilot/copilot-smart-actions/ai-merge-conflict-resolution.png)

如果你安装了 [GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) 扩展，可以使用 AI 通过 [Copilot 云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents#_github-copilot-cloud-agent)实现代码中的 `TODO` 注释。

1. 确保安装了 [GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) 扩展。
2. 在代码中添加 `TODO` 注释。注释旁边会出现代码操作（灯泡图标）。
3. 选择代码操作，选择**委托给编码智能体(Agent)**。

## 重命名符号

在代码中重命名符号时，根据符号的上下文和代码库获取 AI 生成的新名称建议。

![内联聊天(Inline Chat)在 Python 文件中为符号建议新名称的截图。](/assets/docs/copilot/copilot-smart-actions/copilot-inline-chat-rename-suggestion.png)

## 为 Markdown 中的图片生成替代文本

使用 AI 为 Markdown 文件中的图片生成或更新替代文本：

1. 打开 Markdown 文件。
2. 将光标放在图片链接上。
3. 选择代码操作（灯泡）图标，选择**生成替代文本**。
4. 如果你已经有了替代文本，选择代码操作，选择**优化替代文本**。

## 生成文档

使用 AI 为多种语言生成代码文档：

1. 打开应用程序代码文件。
2. 可选地，选择要记录的代码。
3. 右键单击并选择**生成代码** > **生成文档**。

## 生成测试

要在不编写提示词(Prompt)的情况下为应用程序代码生成测试，可以使用编辑器智能操作(Smart Action)：

1. 打开应用程序代码文件。
2. 可选地，选择要测试的代码。
3. 右键单击并选择**生成代码** > **生成测试**。

   VS Code 在现有测试文件中生成测试代码，如果不存在测试文件，则创建新的测试文件。

4. 可选地，通过在内联聊天(Inline Chat)提示词(Prompt)中提供额外上下文来优化生成的测试。

## 解释代码

获取有关编辑器中代码块的解释帮助：

1. 打开应用程序代码文件。
2. 选择要解释的代码。
3. 右键单击并选择**解释**。

   VS Code 提供对选定代码块的解释。

## 修复编码错误

要在不编写提示词(Prompt)的情况下修复应用程序代码的编码问题，可以使用编辑器智能操作(Smart Action)：

1. 打开应用程序代码文件。
2. 选择要修复的代码。
3. 右键单击并选择**生成代码** > **修复**。

   VS Code 提供修复代码的代码建议。

4. 可选地，通过在聊天提示词(Prompt)中提供额外上下文来优化生成的代码。

另外，如果代码文件中有编译或 lint 问题，VS Code 会在编辑器中显示代码操作，帮助解决该问题。

![编辑器截图，显示闪光图标和 Copilot 上下文菜单，用于解释或修复问题。](/assets/docs/copilot/copilot-smart-actions/copilot-code-action-fix.png)

## 修复测试错误

直接从测试资源管理器获取修复失败测试的帮助：

1. 在测试资源管理器中，将鼠标悬停在失败的测试上。
2. 选择**修复测试失败**按钮（闪光图标）。
3. 审查并应用 Copilot 的建议修复。

或者：

1. 打开聊天视图。
2. 输入 `/fixTestFailure` 命令。
3. 按照 Copilot 的建议修复测试。

> **提示**
> 使用[智能体(Agent)](/vscode-copilot/agents/local-agents)时，智能体(Agent)在运行测试时会监控测试输出，并自动尝试修复和重新运行失败的测试。

## 修复终端错误

当命令在终端中运行失败时，VS Code 在行号区域显示一个闪光图标，提供快速修复来解释发生了什么。

![终端命令失败后终端中"使用 Copilot 修复"选项的截图。](/assets/docs/copilot/copilot-smart-actions/terminal-command-explanation.png)

## 审查代码

VS Code 可以帮助审查你的代码，无论是编辑器中的代码块，还是拉取请求(Pull Request)中包含的所有变更（需要 [GitHub Pull Requests 扩展](https://marketplace.visualstudio.com/items/?itemName=GitHub.vscode-pull-request-github)）。

审查编辑器中的代码块：

1. 打开应用程序代码文件。
2. 选择要审查的代码。
3. 右键单击并选择**生成代码** > **审查**。

   VS Code 在**注释**面板中创建审查评论，并在编辑器中内联显示。

审查拉取请求(Pull Request)中的所有变更：

1. 使用 GitHub Pull Requests 扩展创建拉取请求(Pull Request)。
2. 在**已更改文件**视图中选择**代码审查**按钮。

## 语义搜索结果（预览版）

VS Code 中的搜索视图让你能够在文件中搜索文本。语义搜索让你能够查找与搜索查询在语义上相关的结果，即使它们与文本不完全匹配。

![搜索视图截图，显示与搜索条件不完全匹配的语义搜索结果。](/assets/docs/copilot/copilot-smart-actions/semantic-search-results.png)

使用 `search.searchView.semanticSearchBehavior` 设置在搜索视图中配置语义搜索。你可以选择自动运行语义搜索，或仅在明确请求时运行。

你还可以获取搜索视图中的 AI 生成关键词建议，提供相关的替代搜索词。使用 `search.searchView.keywordSuggestions` 设置启用搜索关键词建议。

## 使用 AI 搜索设置

如果你不知道要更改的设置的确切名称，可以使用 AI 根据搜索查询帮助找到相关设置。例如，可以搜索"增加文字大小"来查找控制编辑器字体大小的设置。

使用 `workbench.settings.showAISearchToggle` 设置启用此功能。在设置编辑器中，可以使用**使用 AI 搜索设置**按钮切换 AI 搜索结果的开关。

## 延伸阅读

- [AI 使用快速入门](/vscode-copilot/getting-started)
