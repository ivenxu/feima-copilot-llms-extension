---
title: Copilot CLI（后台智能体）
description: 了解如何在 VS Code 中使用 GitHub Copilot CLI 在后台自主运行智能体会话，包括工作区/worktree 隔离模式和多会话并行管理。
source: https://code.visualstudio.com/docs/copilot/agents/copilot-cli
---

Visual Studio Code 支持通过 GitHub Copilot CLI 在后台运行智能体(Agent)会话(Agent Session)。你可以从 VS Code 的统一聊天视图中启动、监控和管理 Copilot CLI 会话，而智能体(Agent)在本机自主运行，你可以继续在编辑器中进行其他工作。并行运行多个 Copilot CLI 会话，同时处理多个独立任务。

要启动 Copilot CLI 会话，可以[创建新会话](#_create-a-copilot-cli-session)，也可以将本地智能体(Local Agent)会话(Agent Session)[移交](#_hand-off-a-local-session-to-copilot-cli)给 Copilot CLI，传递现有上下文。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


![VS Code 中 Copilot CLI 会话（聊天编辑器）的截图。](/assets/docs/copilot/background-agents/copilot-cli-session.png)

> **提示**
> OpenAI Codex 等第三方提供商也提供后台能力。了解更多：[第三方智能体(Third-party Agent)](/docs/copilot/agents/third-party-agents)。

## 什么是 Copilot CLI 会话？

Copilot CLI 会话在本机后台独立运行，使用 Copilot CLI 智能体(Agent)框架。VS Code 通过 Copilot SDK 与这些智能体(Agent)集成，用于启动、停止和监控后台会话的进度。VS Code 会自动为你安装和配置 Copilot CLI。

Copilot SDK 会话在 VS Code 之外运行，当你关闭 VS Code 窗口时仍会继续在后台运行。这与使用 VS Code 智能体(Agent)框架在编辑器内部运行并在 VS Code 停止时也停止的本地智能体(Local Agent)不同。

你可以从统一聊天视图与 Copilot CLI 会话交互。当后台会话需要你的输入或需要[权限](#_permissions-and-approvals)来执行操作时，你可以在聊天中进行操作。智能体(Agent)状态指示器也会在会话需要输入时提供提示。

由于 Copilot CLI 会话在后台运行，它们非常适合范围明确、拥有所有必要上下文且不需要频繁用户交互的任务。例如，从计划实施功能、创建概念验证的多个变体，或实施明确定义的修复或功能。

Copilot CLI 在聊天中支持斜杠命令(Slash Command)，包括[可重用提示词(Prompt)](/docs/copilot/customization/prompt-files)、[智能体(Agent)技能](/docs/copilot/customization/agent-skills)、[Hooks](/docs/copilot/customization/hooks)、用于管理长对话的 `/compact`，以及用于切换[工具自动批准](/docs/copilot/agents/agent-tools#_can-i-automatically-approve-all-tools-and-terminal-commands)的 `/yolo` 或 `/autoApprove`。在 Copilot CLI 会话的聊天输入框中输入 `/` 可查看可用命令。

### 隔离模式

Copilot CLI 支持两种隔离模式来管理智能体(Agent)变更如何应用到代码库：**Worktree** 和 **Workspace** 隔离。你可以在创建新的 Copilot CLI 会话时选择隔离模式。

要隔离 Copilot CLI 智能体(Agent)的变更并防止干扰你的当前工作，使用 **Worktree** 隔离。在此模式下，VS Code 为 Copilot CLI 会话在单独的文件夹中创建一个 [Git worktree](/docs/sourcecontrol/branches-worktrees#_understanding-worktrees)。智能体(Agent)所做的所有变更都应用到 worktree，与你的主工作区保持分离，直到你准备好审查并应用它们。

如果你想将 Copilot CLI 会话的变更直接应用到当前工作区，可以选择 **Workspace** 隔离。在此模式下，智能体(Agent)直接在当前工作区中操作，变更就地应用。

> **注意**
> 要使用 Git worktree 和 worktree 隔离，你的工作区需要是 Git 仓库。

### 权限和审批

Copilot CLI 会话支持与本地智能体(Local Agent)相同的[权限级别](/docs/copilot/agents/agent-tools#_permission-levels)。可用的权限级别取决于你选择的隔离模式：

- **Worktree 隔离**：权限级别自动设置为**跳过批准**，无法更改。由于智能体(Agent)在代码库的隔离副本（Git worktree）上操作，所有工具调用(Tool Call)都会自动批准，无需确认对话框。
- **Workspace 隔离**：所有三个权限级别都可用（**默认批准**、**跳过批准**和**自动驾驶**），与本地智能体(Local Agent)会话(Agent Session)相同。从聊天输入区域的权限选择器中选择级别。

### 远程控制 Copilot CLI 会话（实验性）

`/remote on` 命令让你能够从 github.com 或 GitHub Mobile 应用远程控制 Copilot CLI 会话。通过远程控制，你可以从任何地方监控和引导正在进行的 Copilot CLI 会话，让你更灵活地推进工作而不必绑定在机器旁。会话上下文和历史记录在 VS Code 和 GitHub 之间保持同步。

启用远程控制后，VS Code 实时将会话历史、工具活动和状态更新流式传输到 GitHub 上的关联任务页面。在一个地方执行的操作会反映在另一个地方。如果会话需要批准工具调用(Tool Call)或回答问题，提示会在两处显示，你可以从任何地方响应。

使用远程控制需要在 VS Code 中进行 GitHub 身份验证，以及映射到 GitHub 仓库的工作区。

### Copilot CLI 会话的限制

- Copilot CLI 会话无法访问所有 VS Code 内置工具。你可以在聊天输入框中[添加上下文](/docs/copilot/chat/copilot-chat-context)。
- 无法访问扩展提供的工具，并且仅限于通过 CLI 工具可用的模型。
- 目前只能访问不需要身份验证的本地 MCP 服务器。

## 创建 Copilot CLI 会话

在 VS Code 中创建新的 Copilot CLI 会话：

1. 使用以下方法之一创建新会话：
   - 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I），从**会话目标**下拉菜单选择 **Copilot CLI**
   - 选择顶部的**新建聊天**图标，选择**新建 Copilot CLI 会话**
   - 通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **Chat: New Copilot CLI** 命令

2. 在工作区和 worktree [隔离模式](#_isolation-modes)之间选择。

   如果使用 worktree 隔离，智能体(Agent)会在每轮结束时自动提交 worktree 的变更，使会话历史与提交历史保持一致。

   > **提示**
   > 你可以右键单击会话列表中的会话并选择**在新窗口中打开 Worktree**，来打开会话的 worktree。还可以在源代码管理视图的仓库浏览器中查看 worktree。

3. 提交提示词(Prompt)以启动智能体(Agent)。可选地，添加额外上下文或选择特定的语言模型(Language Model)和自定义智能体(Custom Agent)。

4. 在聊天视图中跟踪会话状态。

> **提示**
> 你可以创建多个 Copilot CLI 会话，并行处理不同任务。

## 将本地会话移交给 Copilot CLI

对于复杂任务，先在 VS Code 中与本地智能体(Local Agent)交互以明确需求，然后将任务移交给 Copilot CLI 在后台自主执行，这通常很有帮助。当使用 [Plan 智能体(Agent)](/docs/copilot/agents/planning)创建计划，然后将该计划的实施移交给 Copilot CLI 时，这非常有用。

将本地智能体(Local Agent)对话移交给 Copilot CLI 会话时，完整的对话历史和上下文会传递给后台会话。

移交本地智能体(Local Agent)会话(Agent Session)给 Copilot CLI：

1. 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I）。
2. 与本地智能体(Local Agent)交互，直到你准备好移交任务。
3. 移交给 Copilot CLI，你有以下选项：
   - 打开**会话目标**下拉菜单，选择 **Copilot CLI**
   - 如果你使用 [Plan 智能体(Agent)](/docs/copilot/agents/planning)，选择**开始实施**下拉菜单，然后选择**在 Copilot CLI 中继续**，在 Copilot CLI 会话中运行实施

Copilot CLI 会话自动启动，携带完整的对话历史和上下文。

## 从终端使用 Copilot CLI

除了从聊天视图启动 Copilot CLI 会话外，你还可以直接从 VS Code 终端使用 Copilot CLI。

### 打开 Copilot CLI 终端

VS Code 注册了一个 **GitHub Copilot CLI** 终端配置文件，可用于打开专用的 Copilot CLI 终端。以下几种方式可以打开 Copilot CLI 终端：

- 选择终端面板中**+**按钮旁边的下拉菜单，选择 **GitHub Copilot CLI**
- 从命令面板运行 **Chat: New Copilot CLI Session** 命令，在面板中打开 Copilot CLI 终端，或运行 **Chat: New CLI Session to the Side** 在当前编辑器旁边的编辑器标签中打开
- 从命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **Terminal: Create New Terminal (With Profile)** 命令，选择 **GitHub Copilot CLI**
- 在任意 VS Code 集成终端中输入 `copilot` 直接启动 Copilot CLI

Copilot CLI 终端支持以下 Shell：
- macOS 和 Linux 上的 **bash** 和 **zsh**
- Windows 上的 **PowerShell** 和 **Command Prompt**

## 多仓库工作区

如果你的工作区包含多个 Git 仓库，VS Code 在启动 Copilot CLI 会话时会在聊天输入框中显示仓库选择器。使用此选择器选择要在哪个仓库中创建 worktree。

会话启动后，该会话的仓库选择器会被禁用。worktree 显示在源代码管理仓库视图的所选仓库下的 **Worktrees** 节点中。

## 延伸阅读

- [智能体(Agent)概览](/docs/copilot/agents/overview)：了解不同智能体(Agent)类型以及如何在智能体(Agent)之间移交任务
- [自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)：创建自定义智能体(Custom Agent)角色和角色身份
- [GitHub Copilot CLI 文档](https://cli.github.com/manual/gh_copilot)
