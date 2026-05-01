---
title: 编辑模式（已弃用）
description: 了解 VS Code GitHub Copilot 的编辑模式（已弃用），以及迁移到智能体模式的指南。
source: https://code.visualstudio.com/docs/copilot/chat/edit-mode
---

> **注意**
> 编辑模式（Edit mode）已弃用。请改用**智能体(Agent)模式**（Agent mode）进行多文件代码编辑。智能体(Agent)模式提供了编辑模式的所有功能，以及更强大的自主规划和工具使用能力。
>
> 如果需要，可以通过启用 `chat.editMode.hidden` 设置恢复编辑模式。

## 从编辑模式迁移到智能体(Agent)模式

编辑模式曾用于在多个文件中进行协调的代码编辑。现在，**智能体(Agent)模式**（Agent）提供了相同的功能，同时还支持：

- 自主规划和拆解任务
- 运行终端命令
- 调用 MCP 工具和扩展工具
- 自我纠错和迭代

## 使用智能体(Agent)模式替代编辑模式

1. 在聊天视图的智能体(Agent)选择器中选择 **Agent**。
2. 描述你想要进行的代码更改，例如：
   ```
   Refactor the authentication module to use JWT tokens
   ```
3. 智能体(Agent)会规划变更，编辑相关文件，并在完成后请求你确认。

## 延伸阅读

- [智能体(Agent)模式](/vscode-copilot/chat/agent-mode)
- [本地智能体(Local Agent)](/vscode-copilot/agents/local-agents)
