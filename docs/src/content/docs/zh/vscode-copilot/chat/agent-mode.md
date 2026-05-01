---
title: 智能体模式
description: 了解 VS Code GitHub Copilot 的智能体模式（Agent mode），用于自主规划和实施跨多文件的复杂代码变更。
source: https://code.visualstudio.com/docs/copilot/chat/agent-mode
---

智能体(Agent)模式（**Agent mode**）是 VS Code GitHub Copilot 最强大的聊天模式。在智能体(Agent)模式下，AI 自主规划和实施复杂的编码任务，跨多个文件进行协调变更，运行终端命令，并在遇到问题时自我纠正。

## 什么时候使用智能体(Agent)模式？

智能体(Agent)模式最适合以下场景：

- 实现跨多个文件的新功能
- 重构代码库的某个部分
- 配置和运行构建/测试
- 从高层级描述构建完整的应用组件
- 需要规划、迭代和自我纠错的复杂任务

对于简单的问答，使用 **Ask** 模式。对于有针对性的单文件编辑，使用**内联聊天(Inline Chat)**。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](https://marketplace.visualstudio.com/items?itemName=feima.copilot-cn-models)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/guides/quickstart) [打开飞码扣](vscode:extension/feima.copilot-cn-models)


## 开始使用智能体(Agent)模式

1. 在聊天视图（⌃⌘I / Ctrl+Alt+I）的智能体(Agent)选择器中选择 **Agent**。

   > **重要提示**
   > 如果你看不到智能体(Agent)选项，请确保在 VS Code 设置中启用了 `chat.agent.enabled`。

2. 输入高层级描述，例如：
   ```
   Create a REST API endpoint for user authentication with JWT tokens
   ```

3. 智能体(Agent)开始工作：分析代码库，规划需要的变更，创建/修改文件，并在需要时运行命令。

4. 审查智能体(Agent)提出的变更，选择**保留**接受或**撤销**拒绝。

## 智能体(Agent)循环

智能体(Agent)在循环中工作，直到任务完成：

1. **规划**：分析代码库，确定需要做什么
2. **执行**：调用工具（读取文件、修改代码、运行命令）
3. **验证**：检查结果，如果有错误则纠正
4. **重复**：继续直到任务完成或需要用户确认

## 权限控制

通过聊天输入区域的权限选择器控制智能体(Agent)的自主程度：

- **默认批准**：需要确认某些操作（如运行命令）
- **跳过批准**：自动批准所有工具调用(Tool Call)
- **自动驾驶**（预览版）：完全自主，包括自动回答问题

## 审查变更

智能体(Agent)完成工作后：

1. 在编辑器中查看文件更改（有差异高亮）
2. 选择**保留**接受变更，或**撤销**拒绝
3. 可以用后续提示词(Prompt)要求进一步调整

使用**检查点**（checkpoints）可以随时回滚到之前的状态。

## 工具支持

智能体(Agent)模式可以使用：
- 内置工具（文件操作、终端、搜索等）
- MCP 服务器提供的工具
- VS Code 扩展提供的工具

通过工具选择器选择哪些工具可用。

## 延伸阅读

- [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents)
- [智能体(Agent)工具](https://code.visualstudio.com/docs/copilot/agents/agent-tools)
- [最佳实践](/vscode-copilot/best-practices)
