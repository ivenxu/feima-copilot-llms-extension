---
title: AI 驱动的内联建议
description: 了解 VS Code 中的 AI 驱动内联建议，包括幽灵文字补全和下一个编辑建议（NES），以及如何启用、使用和自定义这些功能。
source: https://code.visualstudio.com/docs/copilot/ai-powered-suggestions
---

VS Code 中的 GitHub Copilot 在你输入时提供 AI 驱动的内联建议(Inline Suggestion)，自动补全代码、注释、测试等内容。内联建议(Inline Suggestion)支持广泛的编程语言和框架，是 VS Code 中多种 AI 功能之一，与用于自主多文件任务的[智能体(Agent)](/vscode-copilot/agents/overview)、[聊天](https://code.visualstudio.com/docs/copilot/chat/copilot-chat)和[智能操作(Smart Action)](/vscode-copilot/smart-actions)并列。

Copilot 提供两种内联建议(Inline Suggestion)，都会匹配你的编码风格并考虑现有代码：

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](https://marketplace.visualstudio.com/items?itemName=feima.copilot-cn-models)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/guides/quickstart) [打开飞码扣](vscode:extension/feima.copilot-cn-models)


- **幽灵文字建议**：在编辑器中开始输入，Copilot 在光标位置以暗淡的_幽灵文字_提供建议。
- **下一个编辑建议**：通过 Copilot 下一个编辑建议（NES）预测你的下一次代码编辑。根据你正在进行的编辑，NES 既预测下一次编辑的位置，也预测该编辑的内容。

## 幽灵文字建议

### 获取第一个建议

Copilot 在你输入时提供暗淡的_幽灵文字_建议：有时是当前行的补全，有时是全新的代码块。

1. 用你选择的编程语言打开一个文件并开始输入。你应该会看到 Copilot 在输入时提供内联建议(Inline Suggestion)。

   以下示例展示了 Copilot 使用暗淡的_幽灵文字_建议 `calculateDaysBetweenDates` JavaScript 函数的实现：
   
   ![JavaScript 幽灵文字建议截图。](/assets/docs/copilot/inline-suggestions/js-suggest.png)

2. 按 Tab 键接受建议。

   要部分接受建议，使用 ⌘→（Windows、Linux：Ctrl+Right）键盘快捷键逐词或逐行接受建议。

### 替代建议

对于任何给定的输入，Copilot 可能提供多个替代建议。将鼠标悬停在建议上可以查看其他建议。

![悬停在内联建议(Inline Suggestion)上可以从多个建议中选择的截图。](/assets/docs/copilot/inline-suggestions/copilot-hover-highlight.png)

你也可以通过使用代码注释来提示 Copilot 你期望的代码，而不是依赖 Copilot 主动提供建议。例如，可以指定使用的算法或概念（如"使用递归"或"使用单例模式"），或要添加到类中的方法和属性。

## 下一个编辑建议

幽灵文字建议擅长自动补全代码段。但由于大多数编码活动是编辑现有代码，内联建议(Inline Suggestion)自然地进化为也帮助编辑——包括光标处和更远的地方。编辑通常不是孤立进行的——在不同场景下需要进行的编辑有一种逻辑流程。下一个编辑建议（Copilot NES）就是这种进化。

根据你正在进行的编辑，下一个编辑建议既预测你下一次要进行的编辑位置，也预测该编辑应该是什么。Copilot NES 帮助你保持流畅，建议与当前工作相关的未来更改，你可以按 Tab 快速导航和接受 Copilot 的建议。建议可能跨越单个符号、整行或多行，取决于潜在变更的范围。

要开始使用 Copilot NES，启用 VS Code 设置 `github.copilot.nextEditSuggestions.enabled`。

### 导航和接受编辑建议

使用 Tab 键快速导航到建议的代码变更，节省查找下一个相关编辑的时间（无需手动搜索文件或引用）。然后可以再次按 Tab 键接受建议。

行号区域中的箭头表示有可用的编辑建议。箭头相对于当前光标位置指示下一个编辑建议的位置。

你可以将鼠标悬停在箭头上，探索包含键盘快捷键和设置配置的编辑建议菜单。

### 下一个编辑建议的使用场景

**捕捉和纠正错误**

- **Copilot 帮助处理拼写错误等简单错误。** 它会建议修复缺少或交换字母的地方，例如 `cont x = 5` 或 `conts x = 5`，应该是 `const x = 5`。
- **Copilot 还可以帮助处理逻辑中更复杂的错误**，例如反转的三元表达式，或者应该使用 `&&` 而不是 `||` 的比较。

**改变意图**

- **Copilot 建议对代码其余部分进行更改，以匹配意图的新变更。** 例如，将类从 `Point` 改为 `Point3D` 时，Copilot 会建议在类定义中添加 `z` 变量。接受变更后，Copilot NES 接下来建议将 `z` 添加到距离计算中。

**重构**

- **在文件中重命名一次变量，Copilot 会建议在其他地方更新它。**
- **匹配代码风格。** 粘贴代码后，Copilot 会建议如何调整以匹配粘贴位置的当前代码。

## 启用或禁用内联建议(Inline Suggestion)

可以全局启用/禁用内联建议(Inline Suggestion)，也可以仅针对特定语言启用/禁用。选择状态栏中的 Copilot 菜单，然后勾选或取消勾选启用/禁用内联建议(Inline Suggestion)的选项。禁用特定语言内联建议(Inline Suggestion)的选项取决于活跃编辑器的语言。

也可以在设置编辑器中修改 `github.copilot.enable` 设置。为你想启用或禁用内联建议(Inline Suggestion)的每种语言添加条目。要对所有语言启用/禁用，将 `*` 的值设置为 `true` 或 `false`。

要临时禁用编辑器中的所有内联建议(Inline Suggestion)，选择状态栏中的 Copilot 菜单，然后选择**暂停**按钮，每次增加 5 分钟的暂停时间。要恢复内联建议(Inline Suggestion)，选择 Copilot 菜单中的**取消暂停**按钮。

## 更改建议的 AI 模型

不同的大型语言模型(Language Model)使用不同类型的数据进行训练，可能有不同的能力和优势。了解更多：[在 VS Code 中选择不同的 AI 语言模型(Language Model)](/vscode-copilot/customization/model-selection)。

要更改用于生成幽灵文字建议的语言模型(Language Model)：

1. 打开命令面板（F1）。
2. 输入 **change completions model** 并选择 **GitHub Copilot: Change Completions Model** 命令。
3. 在下拉菜单中选择要使用的模型。

## 设置

**幽灵文字建议设置：**

- `github.copilot.enable` — 为所有或特定语言启用或禁用内联补全
- `editor.inlineSuggest.fontFamily` — 配置内联补全的字体
- `editor.inlineSuggest.showToolbar` — 启用或禁用内联补全显示的工具栏
- `editor.inlineSuggest.syntaxHighlightingEnabled` — 启用或禁用内联补全的语法高亮

**下一个编辑建议设置：**

- `github.copilot.nextEditSuggestions.enabled` — 启用 Copilot 下一个编辑建议（NES）
- `editor.inlineSuggest.edits.allowCodeShifting` — 配置 NES 是否能移动代码以显示建议
- `editor.inlineSuggest.edits.renderSideBySide` — 配置 NES 是否可以并排显示较大的建议
  - `auto`（默认）：视口有足够空间时并排显示，否则在相关代码下方显示
  - `never`：从不并排显示，始终在相关代码下方显示
- `github.copilot.nextEditSuggestions.fixes` — 启用基于诊断（波浪线）的下一个编辑建议，例如缺少的导入

## 延伸阅读

- [AI 使用快速入门](/vscode-copilot/getting-started)
- [选择 AI 模型](/vscode-copilot/customization/model-selection)
