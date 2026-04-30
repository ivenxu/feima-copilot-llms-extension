---
title: 内联聊天
description: 了解如何在 VS Code 编辑器和终端中使用内联聊天，直接在编辑器中生成代码或进行精准编辑，无需切换到聊天视图。
source: https://code.visualstudio.com/docs/copilot/chat/inline-chat
---

借助 Visual Studio Code 中的内联聊天(Inline Chat)，你可以直接在编辑器中请求生成代码或进行编辑，也可以在集成终端中获取 Shell 命令方面的帮助。内联聊天(Inline Chat)让你无需切换到单独的聊天视图即可保持工作流程。

当你想在可见代码上下文中进行快速、有针对性的编辑时，请使用内联聊天(Inline Chat)。对于多步骤任务、多文件变更或更广泛的代码库探索，请改用[聊天视图](/docs/copilot/chat/copilot-chat)。

## 使用编辑器内联聊天(Inline Chat)

使用编辑器内联聊天(Inline Chat)时，你的提示词(Prompt)仅限于当前活动编辑器中的代码。内联聊天(Inline Chat)可能会使用工作区中其他文件的内容作为提示词(Prompt)的上下文。

使用编辑器内联聊天(Inline Chat)：

1. 在编辑器中打开一个文件。

2. 使用 ⌘I（Windows、Linux：Ctrl+I）键盘快捷键，或从标题栏的聊天菜单中选择**打开内联聊天(Inline Chat)**，打开编辑器内联聊天(Inline Chat)。

3. 在聊天输入框中输入提示词(Prompt)并按 Enter。

   ![内联聊天(Inline Chat)控件截图。](/assets/docs/copilot/chat/copilot-chat/inline-chat-control.png)
   
   > **提示**
   > 在编辑器中选择一段代码，可将提示词(Prompt)范围限定为该代码。

4. VS Code 会在编辑器中以差异形式内联显示代码建议。使用 **Keep** 或 **Undo** 接受或拒绝变更。

   ![编辑器内联聊天(Inline Chat)建议非递归阶乘实现的截图。](/assets/docs/copilot/chat/copilot-chat/inline-chat-recursion.png)

### 活动编辑会话中的内联聊天(Inline Chat)

当文件属于活动聊天编辑会话时，按 ⌘I（Windows、Linux：Ctrl+I）会打开聊天视图中的"在聊天中提问"，而不是普通内联聊天(Inline Chat)。这会将你的提示词(Prompt)路由到现有会话，以便使用完整的对话上下文。编辑器上下文菜单也会对这些文件显示**在聊天中提问**，而不是**打开内联聊天(Inline Chat)**。

要始终使用普通内联聊天（即使对属于聊天会话的文件），请将 `inlineChat.askInChat` 设置为 `false`。

对于不属于任何聊天会话的文件，⌘I（Windows、Linux：Ctrl+I）始终打开普通内联聊天(Inline Chat)，与此设置无关。

### 文本选择时显示视觉提示（实验性）

在编辑器中选择文本时，VS Code 可以显示视觉提示，帮助你对选定代码启动内联聊天(Inline Chat)。使用 `inlineChat.affordance` 设置控制提示的显示方式：

- `off`：选择文本时不显示提示
- `gutter`：提示显示在选区旁边的行号区域
- `editor`：提示显示在选区内的光标位置，与代码操作灯泡集成

![编辑器中选择文本时内联聊天(Inline Chat)提示显示在侧边栏的截图。](/assets/docs/copilot/chat/copilot-chat/inline-chat-hint-gutter.png)

提示会显示内联聊天(Inline Chat)输入框，以及添加选区到聊天、解释代码和开始代码审查的操作。

> **注意**
> 此功能是实验性的，需要将 `inlineChat.renderMode` 设置为 `hover`。

## 使用终端内联聊天(Inline Chat)

可以在[集成终端](/docs/terminal/basics)中调出终端内联聊天(Inline Chat)，获取 Shell 命令帮助或提问与终端相关的问题。

使用终端内联聊天(Inline Chat)：

1. 通过选择**视图** > **终端**菜单项，或使用 ⌃\`（Windows、Linux：Ctrl+\`）键盘快捷键，在 VS Code 中打开终端。

2. 使用 ⌘I（Windows、Linux：Ctrl+I）键盘快捷键，或在命令面板中运行**终端内联聊天(Inline Chat)**命令，启动终端内联聊天(Inline Chat)。

3. 在聊天输入框中输入提示词(Prompt)并按 Enter。

   ![终端聊天截图，显示可以提复杂问题如"列出 src 目录中最大的 5 个文件"](/assets/docs/copilot/chat/copilot-chat/terminal-chat.png)

4. 审查响应并选择**运行**（⌘Enter / Windows、Linux：Ctrl+Enter）在终端中运行命令。

   或者，选择**插入**（⌥Enter / Windows、Linux：Alt+Enter）将命令插入终端，在运行前进行修改。

## 更改内联聊天(Inline Chat)的模型

你可以更改用于编辑器内联聊天(Inline Chat)的语言模型(Language Model)。要配置内联聊天(Inline Chat)的默认模型，请使用 `inlineChat.defaultModel` 设置。该设置列出了模型选择器中的所有可用模型。

如果在内联聊天(Inline Chat)会话中更改了模型，选择会在会话的剩余时间内保持。重新加载 VS Code 后，模型会重置为 `inlineChat.defaultModel` 设置中指定的值。

了解更多：[为任务选择合适的模型](/docs/copilot/customization/language-models#_choose-the-right-model-for-your-task)。

## 使用快速聊天

快速聊天提供一个在编辑器顶部打开的轻量级聊天面板。适用于快速提问和简短交互，无需打开完整的聊天视图或离开当前工作流程。

按 ⇧⌥⌘L（Windows、Linux：Ctrl+Shift+Alt+L）或从标题栏的**聊天**菜单选择**快速聊天**，可打开快速聊天。

输入提示词(Prompt)并按 Enter 获取响应。快速聊天支持与聊天视图相同的 `#` 提及和 `@` 提及，用于添加上下文。选择**在聊天视图中打开**按钮可在完整的聊天视图中继续对话。

## 延伸阅读

- [聊天概览](/docs/copilot/chat/copilot-chat)
- [向聊天提示词(Prompt)添加上下文](/docs/copilot/chat/copilot-chat-context)
- [审查 AI 生成的代码编辑](/docs/copilot/chat/review-code-edits)
- [VS Code 中的 AI 语言模型(Language Model)](/docs/copilot/customization/language-models)
