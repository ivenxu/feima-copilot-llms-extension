---
title: 上下文变量参考
description: VS Code GitHub Copilot 聊天中可用上下文变量（#变量）的完整参考，用于精确控制聊天请求的上下文。
source: https://code.visualstudio.com/docs/copilot/reference/context-variables
---

上下文变量（以 `#` 前缀标识）让你能够在聊天提示词(Prompt)中明确引用特定的上下文来源。在聊天输入框中输入 `#` 可以看到所有可用的上下文变量(Context Variable)列表。

## 文件和代码上下文

| 变量 | 说明 |
|------|------|
| `#<文件名>` | 引用工作区中的特定文件，例如 `#index.ts` |
| `#<文件夹名>` | 引用工作区中的特定文件夹 |
| `#<符号名>` | 引用代码中的特定符号（函数、类、变量等） |
| `#codebase` | 在整个代码库中搜索相关上下文 |
| `#selection` | 引用编辑器中当前选定的代码 |
| `#editor` | 引用当前活跃编辑器的内容 |

## VS Code 环境上下文

| 变量 | 说明 |
|------|------|
| `#terminalLastCommand` | 终端中运行的最后一个命令及其输出 |
| `#terminalSelection` | 终端中当前选定的文本 |
| `#problems` | 当前工作区中的错误和警告（Problems 面板内容） |
| `#testFailure` | 最近失败的测试信息 |
| `#debugConsole` | 调试控制台的输出内容 |

## 工具和搜索上下文

| 变量 | 说明 |
|------|------|
| `#fetch` | 从 URL 获取内容，例如 `#fetch https://example.com` |
| `#searchResults` | 搜索视图中的当前搜索结果 |
| `#session` | 引用之前的聊天会话（与 `/troubleshoot` 配合使用） |

## 使用示例

```
# 引用特定文件
解释 #utils.ts 中的代码

# 引用符号
#UserService 类是如何工作的？

# 使用代码库搜索
#codebase 哪里处理了身份验证？

# 引用终端输出
我的终端出现了这个错误：#terminalLastCommand，请帮我修复

# 获取外部内容
根据 #fetch https://api.example.com/docs 的文档，帮我实现一个客户端

# 引用搜索结果
根据 #searchResults 的结果，这些代码的作用是什么？
```

## 延伸阅读

- [斜杠命令(Slash Command)参考](/vscode-copilot/reference/slash-commands)
- [向聊天添加上下文](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context)
- [提示词(Prompt)编写技巧](/vscode-copilot/chat/prompt-crafting)
