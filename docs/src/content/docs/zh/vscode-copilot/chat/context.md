---
title: 聊天上下文
description: 了解如何在 VS Code GitHub Copilot 聊天中添加和管理上下文，以获得更准确、更相关的 AI 响应。
source: https://code.visualstudio.com/docs/copilot/chat/context
---

上下文是影响 AI 响应质量的最重要因素之一。向聊天添加相关上下文，帮助 Copilot 理解你的代码库、当前任务和期望的结果。

## 自动上下文收集

Copilot 会自动从多个来源收集上下文：

- **活跃编辑器**：当前打开的文件内容
- **工作区索引**：VS Code 对工作区的语义理解
- **代码搜索**：自动查找代码库中的相关文件和符号
- **自定义说明(Custom Instructions)**：在 `.github/copilot-instructions.md` 或 `AGENTS.md` 中定义的项目级说明

## 手动添加上下文

### 使用 # 上下文变量(Context Variable)

在聊天输入框中使用 `#` 前缀引用特定资源：

```
解释 #utils.ts 中的 parseDate 函数
```

```
#codebase 认证逻辑在哪里实现的？
```

```
根据 #terminalLastCommand 的错误，如何修复这个问题？
```

常用上下文变量(Context Variable)：
- `#<文件名>` — 引用特定文件
- `#<文件夹名>` — 引用文件夹
- `#<符号名>` — 引用特定函数、类或变量
- `#codebase` — 在整个代码库中搜索
- `#selection` — 当前选中的代码
- `#editor` — 活跃编辑器内容
- `#terminalLastCommand` — 终端最后运行的命令输出
- `#problems` — 当前错误和警告
- `#fetch <URL>` — 从 URL 获取内容

### 拖放文件

将文件从资源管理器直接拖放到聊天输入框，作为上下文添加。

### 添加图片

将截图或图片添加到聊天，让 AI 分析视觉内容。支持的格式包括 PNG、JPEG、GIF 和 WebP。

### 从上下文菜单添加

右键单击编辑器中的代码，选择 **Copilot** > **添加到聊天** 将代码段添加为上下文。

## 代码库索引

VS Code 使用多种技术索引你的工作区以提供上下文：

- **语义搜索**：理解代码意图而非仅匹配文字
- **语言智能（LSP）**：符号定义、引用和类型信息
- **GitHub 代码搜索**：用于远程仓库的快速全文搜索（需要 GitHub 账号）

### 远程索引

对于大型仓库，启用远程索引可获得更快、更全面的搜索结果：

1. 打开命令面板，运行 **GitHub Copilot: Build Remote Index**
2. 索引构建后，搜索结果将包括整个仓库的内容

了解更多：[工作区上下文和代码库搜索](/docs/copilot/reference/workspace-context)。

## 上下文压缩

在长对话中，上下文窗口可能填满。VS Code 自动压缩旧的对话内容以腾出空间。你也可以手动触发压缩：

- 在聊天输入框输入 `/compact` 压缩当前会话
- 可附加说明：`/compact focus on the API design decisions`

## 最佳实践

- 对不明确的问题使用 `#codebase` 让 Copilot 自行搜索
- 对已知的特定文件使用 `#<文件名>` 直接引用
- 添加测试失败、终端错误等运行时上下文以获得精准帮助
- 在 `.github/copilot-instructions.md` 中设置项目级别的永久上下文

## 延伸阅读

- [上下文变量(Context Variable)参考](/docs/copilot/reference/context-variables)
- [自定义说明(Custom Instructions)](/docs/copilot/customization/custom-instructions)
- [提示词(Prompt)编写技巧](/docs/copilot/chat/prompt-crafting)
