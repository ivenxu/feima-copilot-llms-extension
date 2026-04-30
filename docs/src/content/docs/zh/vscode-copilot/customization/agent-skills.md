---
title: 智能体技能
description: 了解如何在 VS Code 中创建智能体技能（Skill），使 AI 能够运行脚本和工具，从而实现可在不同工具间共享的专业化编码工作流。
source: https://code.visualstudio.com/docs/copilot/customization/agent-skills
---

智能体(Agent)技能让 AI 能够通过运行脚本和工具来执行特定任务。技能可以在不同工具之间共享，例如 VS Code、Copilot CLI、CLI 工具及 GitHub Copilot。例如，你可以创建一个技能，从内部 CRM 中获取用户数据，以便在编写与用户相关的功能时使用。

与只提供文本说明的[自定义说明(Custom Instructions)](/docs/copilot/customization/custom-instructions)和提供可重用聊天提示词(Prompt)的[提示词(Prompt)文件](/docs/copilot/customization/prompt-files)不同，技能通过脚本、命令行工具、程序或任何可通过命令行调用的工具提供可执行能力。

你还可以将技能打包为[智能体(Agent)插件](/docs/copilot/customization/agent-plugins)。

> **提示**
> 使用[智能体(Agent)自定义编辑器](/docs/copilot/customization/overview#_agent-customizations-editor)（预览版）在一个地方发现、创建和管理所有智能体(Agent)自定义内容。通过命令面板运行 **Chat: Open Customizations** 命令。

> **提示**
> **智能体(Agent)、提示词(Prompt)文件还是技能？** 当你需要带有特定工具限制、模型偏好或智能体(Agent)之间移交的持久化角色时，使用[自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)。对于不需要工具限制的一次性任务，使用[提示词(Prompt)文件](/docs/copilot/customization/prompt-files)。对于带有脚本和资源的可移植、可重用能力，使用技能。

## 什么是智能体(Agent)技能？

智能体(Agent)技能是定义在 Markdown 文件中的工具，与 VS Code 中的工具非常相似，但你用自己的脚本和工具来定义。技能文件描述如何向 AI 展示该技能，以及 AI 想使用该技能时应执行什么命令。

例如，你可以创建一个 `fetch-user-data.skill.md` 文件，定义一个从 CRM 获取用户数据的技能。该技能让 AI 能够检索当前客户、账户状态和偏好等信息，在编写与用户相关的功能时提供真实数据，而无需在代码中硬编码测试数据。

技能扩展了你可以在 AI 工作流中使用的能力范围，特别适合以下场景：

- **访问内部系统**：连接到 CRM 或 ERP 系统，或其他没有 MCP 服务器的系统。
- **执行复杂计算**：运行需要专业数据处理或分析的脚本。
- **部署和基础设施**：运行自动化部署流程或基础设施管理脚本。
- **开发工具集成**：连接到代码分析工具、质量检查器或其他开发流程工具。
- **业务特定处理**：执行公司内部工具或与业务工作流集成的脚本。

技能文件可以作为独立文件共享，也可以打包为[智能体(Agent)插件](/docs/copilot/customization/agent-plugins)，实现更结构化的分发。

## 技能文件位置

你可以为特定工作区或在用户级别定义技能，用户级别的技能可跨所有工作区使用。下表列出了基于范围的技能文件默认位置。可以使用 `chat.skillFilesLocations` 设置为工作区技能文件配置其他文件位置。

| 范围 | 默认文件位置 |
|------|-------------|
| 工作区 | `.github/skills` 文件夹 |
| 用户配置文件 | `~/.copilot/skills` 或用户数据（特定于你的 VS Code 配置文件） |

## 技能文件格式

技能文件是带有 `.skill.md` 扩展名的 Markdown 文件，具有以下结构。

头部以 YAML frontmatter 格式包含以下字段：

| 字段 | 描述 |
|------|------|
| `description` | 对技能的描述，显示为聊天输入框中的占位符文本。也用于语义技能匹配，AI 根据此描述决定是否使用该技能。 |
| `name` | 技能名称。如未指定，使用文件名。在聊天视图和工具列表中使用。 |
| `input-schema` | 定义工具期望的参数的 JSON Schema（如有需要）。 |
| `command` | 执行技能时运行的命令。也可以指定 `osx`、`linux` 和 `windows` 特定命令，分别覆盖各平台的 `command`。 |
| `timeout` | 技能应在其中完成的最大时长（以秒为单位）（可选，默认：30 秒）。 |

正文是技能实现，包含 AI 执行任务时应遵循的说明或上下文信息，以 Markdown 格式书写。

### 示例

从 CRM 获取用户数据的技能：

```markdown
---
description: Fetch user account data from the CRM system
name: Fetch User Data
input-schema:
  type: object
  properties:
    userId:
      type: string
      description: The user ID to look up
  required:
    - userId
command: node scripts/fetch-user-data.js ${input.userId}
timeout: 10
---
Use this tool to retrieve current customer data when working on user-related features.
Return the raw data as-is.
```

## 创建智能体(Agent)技能

在工作区或用户配置文件中创建技能文件。

> **提示**
> 在聊天输入框中输入 `/skills`，可快速打开**配置技能**菜单。

1. 在聊天视图中，选择**配置聊天**（齿轮图标）打开智能体(Agent)自定义编辑器，然后选择**技能**标签页。

2. 根据存储位置，从下拉菜单选择**新建技能（工作区）**或**新建技能（用户）**。

3. 选择位置并输入技能文件的文件名。

4. 使用 Markdown 格式定义你的技能，包括头部信息和技能实现。

### 使用 AI 生成技能文件

你可以使用 AI 来生成技能文件。在聊天中输入 `/create-skill <描述>`，让 AI 辅助创建技能文件。AI 会根据你的描述提出澄清性问题，并生成带有适当字段和内容的技能文件。

## 使用智能体(Agent)技能

在自定义智能体(Custom Agent)或在聊天输入框中的**配置工具**对话框中选择技能。

## 延伸阅读

- [自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)
- [智能体(Agent)插件](/docs/copilot/customization/agent-plugins)
- [使用智能体(Agent)的工具](/docs/copilot/agents/agent-tools)
