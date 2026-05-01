---
title: Agents 应用
description: 了解 VS Code Agents 应用，一个专为智能体优先体验设计的伴随应用，支持跨工作区管理多个智能体会话。
source: https://code.visualstudio.com/docs/copilot/agents-app
---

Visual Studio Code Agents 应用是与 VS Code 一同安装的独立应用，专为智能体(Agent)优先体验而构建。Agents 应用让你无需分别在独立窗口中打开每个工作区，就可以访问所有工作区。你可以在所有项目中并行运行多个会话，都在一个地方管理。

Agents 应用与主 VS Code 窗口共享你的会话，因此你可以随时在它们之间切换。

## 前提条件

Agents 应用与 VS Code Insiders 一同安装，无需单独下载或安装。

- 安装 Visual Studio Code Insiders。[下载 VS Code Insiders](https://code.visualstudio.com/insiders)。
- 访问 GitHub Copilot。按照[在 VS Code 中设置 GitHub Copilot](/vscode-copilot/setup)的步骤登录并激活订阅。

> **💡 国内用户替代方案**
> 除了 GitHub Copilot 官方订阅，您也可以使用 **[飞码扣插件](https://marketplace.visualstudio.com/items?itemName=feima.copilot-cn-models)** — 在 GitHub Copilot Chat 中直接使用通义千问(Qwen3)、DeepSeek V3.2、GLM-5 等国内顶级 AI 模型，按次计费，无需月付订阅。[立即开始 →](/guides/quickstart) [打开飞码扣](vscode:extension/feima.copilot-cn-models)


## 代码优先与智能体(Agent)优先

在 VS Code 中使用 AI 有两种主要方式：

- **代码优先**：你在编辑器中编写代码，使用 AI 作为编码助手帮助实现功能、修复 Bug 和重构代码。主要界面是用于编辑代码、测试和调试的编辑器，你使用 AI 来增强现有的编码工作流程。
- **智能体(Agent)优先**：你通过将（高层级）任务交给 AI 智能体(Agent)来构建应用程序。智能体(Agent)规划、实施并验证结果。主要界面是聊天和用于组织工作的会话列表，而编辑器是在必要时审查和调整 AI 实现的次要界面。你使用 AI 来改变工作方式，更专注于定义问题和审查解决方案。

Agents 应用为智能体(Agent)优先方法而构建。它提供专注的环境来管理所有项目中的智能体(Agent)会话(Agent Session)，以聊天为与智能体(Agent)交互的核心界面。Agents 应用是 VS Code 的补充，VS Code 针对代码优先方法进行优化。

## 打开 Agents 应用

Agents 应用是与主 VS Code 窗口并排运行的独立应用。打开方式：

- 直接从开始菜单或应用程序文件夹启动 **Visual Studio Code Agents - Insiders**（Windows 和 macOS）。

  > **注意**
  > 目前在 Linux 上无法从操作系统启动 Agents 应用。你仍可以通过命令行或在 VS Code 中访问 Linux 上的 Agents 应用。

- 在 VS Code 中，选择标题栏中的 Agents 图标，或通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **Chat: Open Agents Application**。
- 从命令行运行 `code-insiders --agents`。

Agents 应用需要 GitHub 身份验证才能访问你的 Copilot 订阅和会话。如果你已在 VS Code 中登录 GitHub，首次启动后会自动登录。

## 界面概览

Agents 应用会拾取你在所有工作区中现有的 Copilot CLI、云端和 Claude 智能体(Agent)会话(Agent Session)。你可以在不同工作区的智能体(Agent)会话(Agent Session)之间切换，而无需在单独的窗口中打开每个工作区。

Agents 窗口有以下主要区域：

1. **会话列表**：在侧边栏中，可以查看和管理所有工作区中的所有会话。默认情况下，会话按工作区分组。右键单击会话可以查看更多命令，如重命名、标记为完成、固定等。
2. **自定义面板**：在会话列表下方，可以访问智能体(Agent)自定义内容，根据工作流程和偏好定制智能体(Agent)行为。
3. **聊天区域**：在中央，显示聊天对话历史，通过提示词(Prompt)与智能体(Agent)交互。
4. **变更面板**：在右侧，可以审查会话中智能体(Agent)生成的文件变更和其他产物，以及查看工作区的文件浏览器。

![Agents 应用界面截图，显示会话列表、自定义面板、聊天区域和变更面板。](/assets/docs/copilot/agents-app/agents-app-ui-annotated.png)

## 启动智能体(Agent)会话(Agent Session)

Agents 应用和 VS Code 共享相同的底层智能体(Agent)会话（Copilot CLI、Copilot 云端和 Claude 智能体(Agent)）。这意味着你在 Agents 应用中启动的任何会话都会立即在 VS Code 中可用。

在 Agents 应用中启动新智能体(Agent)会话(Agent Session)：

1. 选择侧边栏顶部的**新建**，或按 ⌘N（Windows、Linux：Ctrl+N）。

2. 使用工作区下拉菜单为聊天会话选择本地文件夹或 GitHub 仓库。
   
   智能体(Agent)类型由你选择的工作区类型决定：
   - **文件夹**：在 Copilot CLI 或 Claude 智能体(Agent)之间选择开始新会话。你可以在会话中随时选择**继续于...**将会话移交给 Copilot 云端智能体(Cloud Agent)。
   - **仓库**：在 GitHub 仓库中启动的会话使用 Copilot 云端智能体(Cloud Agent)。

3. 对于 Copilot CLI 会话，为会话选择文件夹和 worktree [隔离](/vscode-copilot/agents/copilot-cli#_isolation-modes)模式。
   
   使用 **worktree 隔离**时，智能体(Agent)在 Git worktree 创建的单独文件夹中操作，使变更与主工作区隔离，直到你准备好合并它们。
   
   使用**文件夹隔离**时，智能体(Agent)直接在主工作区中操作，变更直接应用到文件。这是非 Git 项目的默认行为。

4. 可选地，为会话选择自定义智能体(Custom Agent)和语言模型(Language Model)。

5. 输入描述你想完成的任务的提示词(Prompt)，按 Enter。
   
   智能体(Agent)将任务分解为步骤，编写代码，运行命令，并在出错时自我纠正。继续对话来优化结果或改变方向。

## 管理和审查文件变更

Agents 应用中的变更面板提供了一个专用视图，显示会话中文件和智能体(Agent)编辑的详细信息。变更面板分为两个主要标签页：

- **文件标签页**：工作区所有文件的文件浏览器视图。
- **变更标签页**：智能体(Agent)添加、更改或删除的文件列表。选择**分支变更**下拉菜单选择要查看的变更。

要审查智能体(Agent)所做的变更，在**变更**标签页中选择文件，打开差异视图，显示与工作区当前状态相比，智能体(Agent)所做的编辑。在差异视图中查看变更时，你可以直接在文件中评论，提示智能体(Agent)进行调整。

在 Agents 应用内，你可以并排打开差异视图和聊天视图，也可以在模态窗口中打开专注于变更。

审查变更后，变更面板提供以下选项：

- **提交（Commit）**：使用文件夹隔离时，直接将智能体(Agent)所做的变更提交到工作区。
- **合并（Merge）**：使用 worktree 隔离时，合并（可选地同步上游）并创建拉取请求(Pull Request)。
- **检出（Checkout）**：对于 Copilot 云端会话，在本地检出与会话拉取请求(Pull Request)关联的分支以审查或请求进一步编辑。

## 本地验证智能体(Agent)变更

除了在变更面板中审查变更外，你还可以在提交或合并前在本地验证智能体(Agent)所做的编辑。Agents 应用支持在当前会话上下文中运行任务和命令。例如，可以运行构建或测试，确保智能体(Agent)所做的变更不会破坏项目，或启动开发服务器验证编辑在运行环境中是否按预期工作。

配置任务：

1. 启动或打开会话。
2. 选择标题栏中的**任务**下拉菜单，选择**添加任务**。
3. 提供任务详情：
   - **名称**：任务的描述性名称
   - **命令**：执行任务时运行的命令（例如 `npm run build` 或 `pytest`）
   - **运行选项**：在创建会话 worktree 时自动运行任务
   - **保存位置**：选择将任务配置保存在工作区还是用户配置文件中，以便跨项目重用
4. 选择**添加任务**保存任务配置。

任务配置后会出现在**任务**下拉菜单中，你可以在当前会话上下文中运行它来验证智能体(Agent)所做的变更。

如果应用程序涉及基于浏览器的行为，可以在 Agents 应用中使用[集成浏览器](https://code.visualstudio.com/docs/debugtest/integrated-browser)。从聊天会话中选择 `localhost` 链接，在 Agents 应用内的集成浏览器中打开它。

## 延伸阅读

- [智能体(Agent)概览](/vscode-copilot/agents/overview)
- [Copilot CLI](/vscode-copilot/agents/copilot-cli)
- [云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents)
