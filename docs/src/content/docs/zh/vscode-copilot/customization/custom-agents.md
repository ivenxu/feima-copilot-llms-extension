---
title: 自定义智能体
description: 了解如何在 VS Code 中创建自定义智能体，为特定开发角色定制 AI 行为、工具访问和工作流移交。
source: https://code.visualstudio.com/docs/copilot/customization/custom-agents
---

自定义智能体(Custom Agent)让你能够配置 AI 采用专为特定开发角色和任务定制的不同角色身份。例如，你可以为安全审查者、规划师、解决方案架构师或其他专业角色创建智能体(Agent)。每个角色身份可以有自己的行为、可用工具和说明。

你还可以使用移交（handoffs）在智能体(Agent)之间创建引导式工作流。通过一次选择即可从一个专业智能体(Agent)无缝切换到另一个，并携带相关上下文。例如，从规划智能体(Agent)直接进入实施智能体(Agent)，或携带相关上下文移交给代码审查者。

> **提示**
> 使用[智能体(Agent)自定义编辑器](/docs/copilot/customization/overview#_agent-customizations-editor)（预览版）在一个地方发现、创建和管理所有智能体(Agent)自定义内容。通过命令面板运行 **Chat: Open Customizations** 命令。

> **提示**
> **智能体(Agent)、提示词(Prompt)文件还是技能？** 当你需要带有特定工具限制、模型偏好或智能体(Agent)之间移交的持久化角色时，使用自定义智能体(Custom Agent)。对于不需要工具限制的一次性任务，使用[提示词(Prompt)文件](/docs/copilot/customization/prompt-files)。对于带有脚本和资源的可移植、可重用能力，使用[智能体(Agent)技能](/docs/copilot/customization/agent-skills)。

## 什么是自定义智能体(Custom Agent)？

[内置智能体(Agent)](/docs/copilot/agents/local-agents)为 VS Code 中的聊天提供通用配置。对于更贴合需求的聊天体验，你可以创建自己的自定义智能体(Custom Agent)。

自定义智能体(Custom Agent)由一套说明和工具组成，当你切换到该智能体(Agent)时会自动应用。例如，"Plan" 智能体(Agent)可以包含生成实施计划的说明，并且只使用只读工具。通过创建自定义智能体(Custom Agent)，你可以快速切换到该特定配置，而无需每次手动选择相关工具和说明。

自定义智能体(Custom Agent)在 `.agent.md` Markdown 文件中定义，可以存储在工作区中供他人使用，或存储在用户配置文件中，让你可以跨不同工作区重用。

## 移交（Handoffs）

移交让你能够创建引导式顺序工作流，通过建议的后续步骤在智能体(Agent)之间切换。聊天响应完成后，会出现移交按钮，让用户携带相关上下文和预填写的提示词(Prompt)切换到下一个智能体(Agent)。

移交对于需要开发者在进行下一步之前审查和批准每一步的多步骤工作流非常有用。例如：

- **规划 → 实施**：在规划智能体(Agent)中生成计划，然后移交给实施智能体(Agent)开始编码。
- **实施 → 审查**：完成实施，然后切换到代码审查智能体(Agent)检查质量和安全问题。
- **编写失败测试 → 编写通过测试**：生成比大型实施更易审查的失败测试，然后移交以通过实施所需代码变更让这些测试通过。

要在智能体(Agent)文件中定义移交，将其添加到 frontmatter。每个移交指定目标智能体(Agent)、按钮标签和可选的发送提示词(Prompt)：

```yaml
---
description: Generate an implementation plan
tools: ['search', 'web']
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
    model: GPT-5.2 (copilot)
---
```

当用户看到移交按钮并选择它时，会切换到目标智能体(Agent)，提示词(Prompt)已预填写。如果 `send: true`，提示词(Prompt)会自动提交以启动下一个工作流步骤。

## 自定义智能体(Custom Agent)文件位置

你可以为特定工作区或在用户级别定义自定义智能体(Custom Agent)。下表列出了基于范围的自定义智能体(Custom Agent)文件默认位置。可以使用 `chat.agentFilesLocations` 设置为工作区自定义智能体(Custom Agent)文件配置其他文件位置。

| 范围 | 默认文件位置 |
|------|-------------|
| 工作区 | `.github/agents` 文件夹 |
| 工作区（Claude 格式） | `.claude/agents` 文件夹 |
| 用户配置文件 | `~/.copilot/agents` 或用户数据（特定于你的 VS Code 配置文件） |

要在用户数据中创建自定义智能体(Custom Agent)，使用智能体(Agent)自定义编辑器或使用 **Chat: New Custom Agent** 命令。

## 自定义智能体(Custom Agent)文件格式

自定义智能体(Custom Agent)文件是 Markdown 文件，使用 `.agent.md` 扩展名，具有以下结构。

头部以 YAML frontmatter 格式包含以下主要字段：

| 字段 | 描述 |
|------|------|
| `description` | 对自定义智能体(Custom Agent)的简短描述，显示为聊天输入框中的占位符文本。 |
| `name` | 自定义智能体(Custom Agent)的名称。如未指定，使用文件名。 |
| `tools` | 此自定义智能体(Custom Agent)可用的工具或工具集名称列表。可以包括内置工具、工具集、MCP 工具或扩展贡献的工具。 |
| `model` | 运行提示词(Prompt)时使用的 AI 模型。指定单个模型名称（字符串）或优先级列表（数组）。未指定时，使用模型选择器中当前选定的模型。 |
| `handoffs` | 在聊天响应完成后作为交互式建议出现的建议后续操作或提示词(Prompt)列表，用于在自定义智能体(Custom Agent)之间切换。 |

### 正文

自定义智能体(Custom Agent)文件正文包含自定义智能体(Custom Agent)实现，以 Markdown 格式书写。在这里提供特定提示词(Prompt)、指南或你想让 AI 在此自定义智能体(Custom Agent)中遵循的任何其他相关信息。

当你在聊天视图中选择自定义智能体(Custom Agent)时，自定义智能体(Custom Agent)文件正文中的指南会被添加到用户聊天提示词(Prompt)之前。

### 示例：规划智能体(Agent)

以下代码片段展示了一个"Plan"自定义智能体(Custom Agent)文件示例，它生成实施计划且不进行任何代码编辑。

```markdown
---
description: Generate an implementation plan for new features or refactoring existing code.
name: Planner
tools: ['web/fetch', 'search/codebase', 'search/usages']
model: ['Claude Opus 4.5', 'GPT-5.2']  # Tries models in order
handoffs:
  - label: Implement Plan
    agent: agent
    prompt: Implement the plan outlined above.
    send: false
---
# Planning instructions
You are in planning mode. Your task is to generate an implementation plan for a new feature or for refactoring existing code.
Don't make any code edits, just generate a plan.

The plan consists of a Markdown document that describes the implementation plan, including the following sections:

* Overview: A brief description of the feature or refactoring task.
* Requirements: A list of requirements for the feature or refactoring task.
* Implementation Steps: A detailed list of steps to implement the feature or refactoring task.
* Testing: A list of tests that need to be implemented to verify the feature or refactoring task.
```

## 创建自定义智能体(Custom Agent)

你可以在工作区或用户配置文件中创建自定义智能体(Custom Agent)文件。

> **提示**
> 在聊天输入框中输入 `/agents`，可快速打开**配置自定义智能体(Custom Agent)**菜单。

1. 在聊天视图中，选择**配置聊天**（齿轮图标）打开智能体(Agent)自定义编辑器，然后选择**智能体(Agent)**标签页。

2. 根据存储位置，从下拉菜单选择**新建智能体（工作区）**或**新建智能体（用户）**。

3. 选择位置并输入智能体(Agent)名称。

4. 使用 Markdown 格式定义你的自定义智能体(Custom Agent)，包括 frontmatter 头部字段和智能体(Agent)说明正文。

### 使用 AI 生成自定义智能体(Custom Agent)

你可以使用 AI 生成自定义智能体(Custom Agent)文件。在聊天中输入 `/create-agent <描述>`，让 AI 辅助创建智能体(Agent)文件。AI 会根据你的描述生成带有适当字段的智能体(Agent)文件。

### Claude 智能体(Agent)格式

`.claude/agents` 文件夹中的智能体(Agent)文件使用普通 `.md` 文件，支持 Claude 特定的 frontmatter 属性。VS Code 将 Claude 特定的工具名称映射到相应的 VS Code 工具。

> **注意**
> VS Code 还会检测 `.claude/agents` 文件夹中的 `.md` 文件，遵循 [Claude 子智能体(Agent)格式](https://code.claude.com/docs/en/sub-agents)。这让你可以在 VS Code 和 Claude Code 中使用相同的智能体(Agent)定义。

## 延伸阅读

- [使用智能体(Agent)的工具](/docs/copilot/agents/agent-tools)
- [智能体(Agent)技能](/docs/copilot/customization/agent-skills)
- [MCP 服务器](/docs/copilot/customization/mcp-servers)
- [Hooks](/docs/copilot/customization/hooks)
- [社区贡献的自定义示例](https://github.com/github/awesome-copilot/tree/main)
