---
title: 斜杠命令参考
description: VS Code GitHub Copilot 聊天中可用斜杠命令的完整参考，包括各命令的用途和用法说明。
source: https://code.visualstudio.com/docs/copilot/reference/slash-commands
---

斜杠命令(Slash Command)是 GitHub Copilot Chat 中的快捷方式，用于触发常见任务或行为。在聊天输入框中输入 `/` 可以看到所有可用的斜杠命令(Slash Command)列表。

## 通用斜杠命令(Slash Command)

| 命令 | 说明 |
|------|------|
| `/clear` | 开始新的聊天会话，清除当前会话历史 |
| `/help` | 显示 Copilot Chat 的使用帮助信息 |
| `/fix` | 修复选定代码或当前文件中的问题 |
| `/explain` | 解释选定代码或代码概念 |
| `/tests` | 为选定代码生成测试 |
| `/doc` | 为选定代码生成文档注释 |
| `/new` | 创建新文件或项目 |
| `/search` | 在工作区中搜索代码 |
| `/startDebugging` | 为当前项目设置和启动调试配置 |
| `/init` | 分析代码库并为项目生成自定义说明(Custom Instructions)文件 |

## 智能体(Agent)模式斜杠命令(Slash Command)

在智能体(Agent)会话（包括本地智能体(Local Agent)、Copilot CLI 等）中，可以使用以下额外命令：

| 命令 | 说明 |
|------|------|
| `/compact` | 压缩对话上下文以节省空间，可选地附加自定义说明(Custom Instructions)，例如 `/compact focus on API design` |
| `/yolo` | 切换工具的自动批准（等同于 `/autoApprove`） |
| `/autoApprove` | 切换工具的自动批准 |
| `/delegate` | 在 Copilot CLI 会话中，将任务委托给云端智能体(Cloud Agent) |
| `/remote` | 查看 Copilot CLI 会话的远程控制状态 |
| `/remote on` | 启用 Copilot CLI 会话的远程控制 |
| `/remote off` | 停止将 Copilot CLI 会话镜像到 GitHub |
| `/fixTestFailure` | 诊断并修复失败的测试 |
| `/troubleshoot` | 分析调试日志以诊断聊天会话问题 |

## 可重用提示词（技能）

使用 `@<技能名称>` 格式调用自定义智能体(Custom Agent)技能。例如，如果你创建了名为 `code-review` 的技能：

```
@code-review 请审查我最近的变更
```

了解更多：[智能体(Agent)技能](/docs/copilot/customization/agent-skills)。

## 创建自定义斜杠命令(Slash Command)

你可以通过创建[提示词(Prompt)文件](/docs/copilot/customization/prompt-files)创建自定义斜杠命令(Slash Command)。将 `.prompt.md` 文件保存在 `.github/prompts/` 目录中，就可以在聊天中通过 `/<文件名>` 调用。

## 延伸阅读

- [上下文变量(Context Variable)参考](/docs/copilot/reference/context-variables)
- [自定义说明(Custom Instructions)](/docs/copilot/customization/custom-instructions)
- [智能体(Agent)技能](/docs/copilot/customization/agent-skills)
