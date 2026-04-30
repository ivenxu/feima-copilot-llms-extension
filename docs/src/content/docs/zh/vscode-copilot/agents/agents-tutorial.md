---
title: 智能体教程
description: 通过构建待办应用，逐步体验 VS Code 中的不同智能体类型，包括本地智能体、Plan 智能体、Copilot CLI 和云端智能体。
source: https://code.visualstudio.com/docs/copilot/agents/agents-tutorial
---

本教程带你了解如何在 Visual Studio Code 中使用不同类型的智能体(Agent)。你将从头构建一个待办应用，添加主题切换，并通过在本地、Plan、后台和云端智能体(Cloud Agent)之间分配工作来重新设计布局。

> **提示**
> 如果你还没有 Copilot 订阅，可以注册 [Copilot 免费计划](https://github.com/github-copilot/signup)，每月可享有一定数量的内联建议(Inline Suggestion)和聊天交互额度，免费使用 Copilot。

## 前提条件

完成本教程需要：

- [在计算机上安装 Visual Studio Code](/download)
- 在 VS Code 中安装 [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) 扩展（用于预览待办应用）
- [一个 GitHub 账号](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github)（用于云端智能体(Cloud Agent)工作流）
- [一个 GitHub Copilot 订阅](/docs/copilot/setup)

> **💡 国内用户替代方案**
> 除了 GitHub Copilot 官方订阅，您也可以使用 **[飞码扣插件](/zh/guides/quickstart)** — 在 GitHub Copilot Chat 中直接使用通义千问(Qwen3)、DeepSeek V3.2、GLM-5 等国内顶级 AI 模型，按次计费，无需月付订阅。[立即开始 →](/zh/guides/quickstart)


## 第一步：使用本地智能体(Local Agent)搭建应用框架

在这一步，你将使用本地智能体(Local Agent)创建初始待办应用结构。本地智能体(Local Agent)非常适合需要即时反馈的交互式任务，例如搭建新项目框架或迭代新功能。

1. 新建项目文件夹并确保其处于 Git 版本控制下。

   ```
   mkdir todo-app
   cd todo-app
   git init
   ```

2. 在 VS Code 中打开项目文件夹。

3. 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I），从智能体(Agent)下拉菜单选择 **Agent**。

   > **重要提示**
   > 如果没有看到智能体(Agent)选项，请确保在 VS Code 设置中启用了智能体（`chat.agent.enabled`）。你的组织也可能禁用了智能体(Agent)——请联系管理员启用。

4. 在聊天输入框中输入以下提示并选择**发送**，来搭建待办应用框架。

   ```
   创建一个简单的待办应用，包含 HTML、CSS 和 JavaScript。包括添加待办事项的输入框、显示待办列表，以及每项的删除按钮。
   ```

5. 审查智能体(Agent)生成的不同文件。根据需要使用 **Keep** 或 **Undo** 接受或拒绝变更。

6. 可以在集成浏览器中预览变更。

   - 通过配置 `workbench.browser.openLocalhostLinks` 来为 `localhost` URL 启用集成浏览器。
   - 打开 `index.html` 文件并选择**预览**按钮。
   
     ![编辑器右上角预览按钮截图（打开 HTML 文件时可见）。](/assets/docs/copilot/agents-tutorial/preview-button.png)
     
     > **注意**
     > 如果没有看到预览按钮，请确保已安装 [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) 扩展。

7. 发送更多提示进一步增强应用。注意在你进行修改时预览会实时更新。

   例如，可以要求：
   ```
   用删除线效果将待办事项标记为已完成。
   ```

你现在有了一个可运行的待办应用，可以继续添加功能。通过使用本地智能体(Local Agent)，你可以实时交互式地生成和优化代码。

## 第二步：使用 Copilot CLI 实现功能计划

在这一步，你将使用 Plan 智能体(Agent)为主题切换创建实施计划，然后将实施工作移交给后台的 Copilot CLI。Copilot CLI 非常适合委托不需要即时交互的任务，可以使用 Git worktree 将文件变更与主工作区隔离，防止冲突。

1. 首先在源代码管理视图中提交当前变更，以保持干净的状态。

2. 在聊天视图中，选择**新建聊天 (+)** > **新建聊天**，开始新的本地智能体(Local Agent)会话(Agent Session)。注意你之前的聊天会话已保存在会话列表中。

3. 从智能体(Agent)下拉菜单选择 **Plan** 切换到 Plan 智能体(Agent)，并输入以下提示：

   ```
   创建一个为应用添加深色/浅色主题切换的计划。切换应能在主题之间切换，并持久保存用户的偏好设置。
   ```

4. Plan 智能体(Agent)可能会提出澄清性问题以完善计划。根据需要回答。

5. 准备好后，选择**开始实施** > **在 Copilot CLI 中继续**，将计划移交给 Copilot CLI。

   ![聊天视图中"开始实施"按钮截图。](/assets/docs/copilot/agents-tutorial/plan-agent-start-implementation-cli.png)

6. Copilot CLI 创建一个 Git worktree 并开始实施功能。当提示时，选择**复制变更**以确保所有当前变更对 Copilot CLI 可用。

7. 可以在**会话**视图中跟踪 Copilot CLI 会话。选择会话查看进度详情。

   > **提示**
   > Copilot CLI 在后台工作时，你可以继续编辑主工作区而不会产生冲突。

8. 智能体(Agent)完成后，选择任意修改的文件审查其变更，或选择**查看所有变更**打开多文件差异编辑器查看所有变更。

   > **提示**
   > 可以向 Copilot CLI 发送后续提示，对功能进行调整或改进。

9. 在聊天视图中，选择**应用**将变更应用到主工作区。

你已成功使用 Copilot CLI 在后台自主执行任务。可以为不同任务启动多个 Copilot CLI 会话，而不会中断主要工作流程。

## 第三步：使用云端智能体(Cloud Agent)协作实现功能

在这一步，你将使用云端智能体（Copilot 云端智能体(Cloud Agent)）重新设计应用布局，并使用 GitHub 中的拉取请求(Pull Request)和协作功能。Copilot 云端智能体(Cloud Agent)运行在远程基础设施上，非常适合不需要即时反馈、不需要在本地运行或涉及通过 GitHub 协作的任务。

1. 首先将项目发布到 GitHub 仓库，并将其添加为远程仓库，以便在项目上使用 Copilot 云端智能体(Cloud Agent)。

   1. 通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行**发布到 GitHub** 命令，按提示创建新仓库。
   2. 通过命令面板运行 **Git: Add Remote** 命令，按提示将 GitHub 仓库添加为远程仓库。

2. 在聊天视图中，选择**新建聊天 (+)** > **新建聊天**。

3. 从会话类型下拉菜单选择 **Cloud** 切换到云端智能体(Cloud Agent)，并输入以下提示：

   ```
   重新设计待办应用的布局以改善用户体验。更新颜色、间距、字体排版，并添加动画效果，赋予其现代感。
   ```

4. 云端智能体(Cloud Agent)开始新会话处理你的请求，它会在 GitHub 仓库中创建分支和拉取请求(Pull Request)。

5. 可以在聊天视图的**会话**视图中跟踪云端智能体(Cloud Agent)，或选择链接查看拉取请求(Pull Request)详情。

   > **提示**
   > 如果你安装了 GitHub Pull Requests 扩展，还可以在 GitHub Pull Requests 视图的 **Copilot on my Behalf** 视图中跟踪拉取请求(Pull Request)进度。

6. 完成后，云端智能体(Cloud Agent)会将拉取请求(Pull Request)分配给你进行审查。

   ![云端智能体(Cloud Agent)会话(Agent Session)详情截图，显示文件变更详情。](/assets/docs/copilot/agents-tutorial/cloud-agent-pull-request.png)

7. 右键单击**会话**视图中的云端智能体(Cloud Agent)会话(Agent Session)，查看更多选项，或选择会话并选择**检出**或**应用**。

你已成功使用云端智能体(Cloud Agent)通过 GitHub 协作实现功能。云端智能体(Cloud Agent)让你能够使用远程资源，并通过 GitHub Issue 和拉取请求(Pull Request)进行协作变更。

## 后续步骤

你已成功使用不同类型的智能体(Agent)来构建、增强和重新设计待办应用。继续探索智能体(Agent)：

- 了解[智能体(Agent)类型及何时使用它们](/docs/copilot/agents/overview)
- [使用 Plan 智能体(Agent)规划和研究任务](/docs/copilot/agents/planning)
- 探索[创建自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)
