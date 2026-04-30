---
title: 自定义说明
description: 了解如何在 VS Code 中使用自定义说明文件，定义编码规范和项目约定，让 AI 生成符合你风格的代码。
source: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
---

自定义说明(Custom Instructions)让你能够定义通用的指南和规则，自动影响 AI 生成代码和处理其他开发任务的方式。无需在每个聊天提示词(Prompt)中手动包含上下文，只需在 Markdown 文件中指定自定义说明(Custom Instructions)，即可确保 AI 响应与你的编码实践和项目要求保持一致。

你可以配置自定义说明(Custom Instructions)，让其自动应用于所有聊天请求，或仅应用于特定文件。也可以手动将自定义说明(Custom Instructions)附加到特定的聊天提示词(Prompt)。

> **提示**
> 使用[智能体(Agent)自定义编辑器](/docs/copilot/customization/overview#_agent-customizations-editor)（预览版）在一个地方发现、创建和管理所有智能体(Agent)自定义内容。通过命令面板运行 **Chat: Open Customizations** 命令。

> **注意**
> 自定义说明(Custom Instructions)不适用于你在编辑器中输入时的[内联建议(Inline Suggestion)](/docs/copilot/ai-powered-suggestions)。

## 说明文件类型

VS Code 支持两类自定义说明(Custom Instructions)。如果你的项目中有多个说明文件，VS Code 会将它们合并并添加到聊天上下文中，具体顺序不做保证。

### 始终启用的说明

始终启用的说明会自动包含在每个聊天请求中。将其用于项目范围的编码标准、架构决策和适用于所有代码的约定。

- 单个 [`.github/copilot-instructions.md`](#_use-a-githubcopilot-instructionsmd-file) 文件
  - 自动应用于工作区中的所有聊天请求
  - 存储在工作区内

- 一个或多个 [`AGENTS.md`](#_use-an-agentsmd-file) 文件
  - 如果你在工作区中使用多个 AI 智能体(Agent)，非常有用
  - 自动应用于工作区或特定子文件夹（实验性）中的所有聊天请求
  - 存储在工作区根目录或子文件夹中（实验性）

- [组织级别的说明](#_share-custom-instructions-across-teams)
  - 在 GitHub 组织内跨多个工作区和仓库共享说明
  - 在 GitHub 组织级别定义

- [`CLAUDE.md`](#_use-a-claudemd-file) 文件
  - 与 Claude Code 和其他基于 Claude 的工具兼容
  - 存储在工作区根目录、`.claude` 文件夹或用户主目录

### 基于文件的说明

基于文件的说明在智能体(Agent)正在处理的文件与指定模式匹配时应用，或者说明描述与当前任务语义匹配时应用。将基于文件的说明用于特定语言约定、框架模式或仅适用于代码库特定部分的规则。

- 一个或多个 [`.instructions.md`](#_use-instructionsmd-files) 文件
  - 使用 glob 模式根据文件类型或位置有条件地应用说明
  - 存储在工作区或用户配置文件中

要在说明中引用特定上下文（如文件或 URL），可以使用 Markdown 链接。

> **提示**
> **应该使用哪种方式？** 对于项目范围的编码标准，从单个 `.github/copilot-instructions.md` 文件开始。当你需要针对不同文件类型或框架应用不同规则时，添加 `.instructions.md` 文件。如果你在工作区中使用多个 AI 智能体(Agent)，使用 `AGENTS.md`。

## 使用 `.github/copilot-instructions.md` 文件

VS Code 会自动检测工作区根目录中的 `.github/copilot-instructions.md` Markdown 文件，并将该文件中的说明应用于此工作区内的所有聊天请求。

`copilot-instructions.md` 适用于：

- 应用于整个项目的编码风格和命名约定
- 技术栈声明和首选库
- 要遵循或避免的架构模式
- 安全要求和错误处理方式
- 文档标准

在工作区中创建 `.github/copilot-instructions.md` 文件的步骤：

1. 在工作区根目录创建 `.github/copilot-instructions.md` 文件。如需要，先创建 `.github` 目录。

2. 用 Markdown 格式描述你的说明。保持简洁和专注以获得最佳结果。

> **注意**
> VS Code 还支持使用 [`AGENTS.md` 文件](#_use-an-agentsmd-file)作为始终启用的说明。

通用编码指南示例：

```markdown
---
applyTo: "**"
---
# 项目通用编码标准

## 命名约定
- 组件名、接口和类型别名使用 PascalCase
- 变量、函数和方法使用 camelCase
- 私有类成员前加下划线（_）
- 常量使用全大写（ALL_CAPS）

## 错误处理
- 异步操作使用 try/catch 块
- 在 React 组件中实现适当的错误边界
- 始终记录带有上下文信息的错误
```

## 使用 `.instructions.md` 文件

你可以使用 `*.instructions.md` Markdown 文件创建基于文件的说明，这些说明根据智能体(Agent)正在处理的文件或任务动态应用。

智能体(Agent)根据说明文件头部的 `applyTo` 属性中指定的文件模式，或通过将说明描述与当前任务进行语义匹配，来决定应用哪些说明文件。

`.instructions.md` 文件适用于：

- 前端与后端代码的不同约定
- monorepo 中的语言特定指南
- 特定模块的框架特定模式
- 测试文件或文档的专业规则

### 说明文件位置

你可以为特定工作区或在用户级别定义说明，用户级别的说明可跨所有工作区应用。下表列出了基于范围的说明文件默认位置。可以使用 `chat.instructionsFilesLocations` 设置为工作区说明文件配置其他文件位置。

| 范围 | 默认文件位置 |
|------|-------------|
| 工作区 | `.github/instructions` 文件夹 |
| 工作区（Claude 格式） | `.claude/rules` 文件夹 |
| 用户配置文件 | `~/.copilot/instructions`、`~/.claude/rules` 或用户数据（特定于你的 VS Code 配置文件） |

VS Code 递归搜索这些文件夹，让你能够在子目录中组织说明文件。例如，按团队、语言或模块分组说明：

```
.github/instructions/
  frontend/
    react.instructions.md
    accessibility.instructions.md
  backend/
    api-design.instructions.md
  testing/
    unit-tests.instructions.md
```

### 说明文件格式

说明文件是带有 `.instructions.md` 扩展名的 Markdown 文件。可选的 YAML frontmatter 头部控制何时应用说明：

| 字段 | 是否必需 | 描述 |
|------|----------|------|
| `name` | 否 | UI 中显示的名称。默认为文件名。 |
| `description` | 否 | 在聊天视图中鼠标悬停时显示的简短描述。 |
| `applyTo` | 否 | 定义说明自动应用于哪些文件的 glob 模式，相对于工作区根目录。使用 `**` 应用于所有文件。如未指定，说明不会自动应用，但你仍可以手动将其添加到聊天请求中。 |

正文包含 Markdown 格式的说明。要引用智能体(Agent)工具，使用 `#tool:<工具名>` 语法（例如 `#tool:web/fetch`）。

```markdown
---
name: 'Python 标准'
description: 'Python 文件的编码约定'
applyTo: '**/*.py'
---
# Python 编码标准
- 遵循 PEP 8 风格指南。
- 为所有函数签名使用类型提示。
- 为公共函数编写文档字符串。
- 使用 4 个空格缩进。
```

### 创建说明文件

创建说明文件时，选择将其存储在工作区还是用户配置文件中。工作区说明文件仅适用于该工作区，而用户说明文件可跨多个工作区使用。

> **提示**
> 在聊天输入框中输入 `/instructions`，可快速打开**配置说明和规则**菜单。

1. 在聊天视图中，选择**配置聊天**（齿轮图标）打开智能体(Agent)自定义编辑器，然后选择**说明**标签页。

2. 根据存储位置，从下拉菜单选择**新建说明（工作区）**或**新建说明（用户）**。

   ![智能体(Agent)自定义编辑器截图，显示说明标签页和创建新说明文件的下拉菜单。](/assets/docs/copilot/customization/create-instructions-file.png)

   也可以通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）使用 **Chat: New Instructions File** 命令。

3. 选择位置并输入说明文件的文件名。这是 UI 中使用的默认名称。

4. 使用 Markdown 格式编写自定义说明(Custom Instructions)。
   - 填写文件顶部的 YAML frontmatter，配置说明的描述、名称和应用时机。
   - 在文件正文中添加说明。

你可以通过在智能体(Agent)自定义编辑器中打开现有说明文件来修改它们。

### 使用 AI 生成说明文件

你可以使用 AI 生成有针对性的说明文件。在聊天中输入 `/create-instruction`，描述你想强制执行的约定或指南（例如，"此项目中始终使用制表符和单引号"）。智能体(Agent)会提出澄清性问题，并生成带有适当 `applyTo` 模式和内容的 `.instructions.md` 文件。

你也可以从正在进行的对话中提取说明。例如，如果你在聊天会话中纠正了智能体(Agent)的导入风格，请求"从中提取一条说明"，将该更正作为项目约定捕获。

> **注意**
> `/create-instruction` 生成有针对性的按需说明文件。要生成工作区范围的始终启用说明，请改用 [`/init` 命令](#_generate-custom-instructions-for-your-workspace)。

TypeScript 和 React 语言特定编码指南示例：

```markdown
---
applyTo: "**/*.ts,**/*.tsx"
---
# TypeScript 和 React 的项目编码标准

将[通用编码指南](./general-coding.instructions.md)应用于所有代码。

## TypeScript 指南
- 所有新代码使用 TypeScript
- 尽可能遵循函数式编程原则
- 数据结构和类型定义使用接口
- 优先使用不可变数据（const, readonly）
- 使用可选链（?.）和空值合并（??）运算符

## React 指南
- 使用带有 Hooks 的函数组件
- 遵循 React Hooks 规则（无条件 Hooks）
- 带有 children 的组件使用 React.FC 类型
- 保持组件小而专注
- 使用 CSS 模块进行组件样式
```

## 使用 `AGENTS.md` 文件

VS Code 会自动检测工作区根目录中的 `AGENTS.md` Markdown 文件，并将该文件中的说明应用于此工作区内的所有聊天请求。如果你在工作区中使用多个 AI 智能体(Agent)，想要一套所有智能体(Agent)都识别的说明，或者想要应用于 monorepo 特定部分的子文件夹级别说明，这非常有用。

在以下情况使用 `AGENTS.md`：
- 你使用多个 AI 编码智能体(Agent)，并希望所有智能体(Agent)识别一套说明
- 你想要应用于项目特定部分的子文件夹级别说明

要启用或禁用对 `AGENTS.md` 文件的支持，配置 `chat.useAgentsMdFile` 设置。

## 使用 `CLAUDE.md` 文件

VS Code 会自动检测 `CLAUDE.md` 文件并将其作为始终启用的说明应用，类似于 `AGENTS.md`。如果你同时使用 Claude Code 或其他基于 Claude 的工具以及 VS Code，并希望所有工具识别一套说明，这非常有用。

VS Code 在以下位置搜索 `CLAUDE.md` 文件：

| 位置 | 描述 |
|------|------|
| 工作区根目录 | 工作区根目录中的 `CLAUDE.md` |
| `.claude` 文件夹 | 工作区中的 `.claude/CLAUDE.md` |
| 用户主目录 | 用于跨所有项目的个人说明 `~/.claude/CLAUDE.md` |
| 本地变体 | `CLAUDE.local.md` 用于不提交到版本控制的本地说明 |

要启用或禁用对 `CLAUDE.md` 文件的支持，配置 `chat.useClaudeMdFile` 设置。

## 跨团队共享自定义说明(Custom Instructions)

如果你是 GitHub 组织的管理员，可以在组织级别定义自定义说明(Custom Instructions)，自动应用于 GitHub Copilot 订阅者的所有工作区（包括 VS Code）。这样你可以在整个组织中强制执行一致的编码标准，无需每个开发者单独配置。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


了解更多：[为你的 GitHub 组织创建自定义说明(Custom Instructions)](https://docs.github.com/en/copilot/customizing-copilot/creating-a-custom-instructions-file-for-your-github-organization-or-enterprise)。

## 延伸阅读

- [向聊天提示词(Prompt)添加上下文](/docs/copilot/chat/copilot-chat-context)
- [自定义概览](/docs/copilot/customization/overview)
- [社区贡献的自定义示例](https://github.com/github/awesome-copilot/tree/main)
