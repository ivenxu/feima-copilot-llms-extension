---
title: 云端智能体
description: 了解 VS Code 中的云端智能体，包括如何创建新会话、移交本地会话，以及如何查看和管理云端智能体会话。
source: https://code.visualstudio.com/docs/copilot/agents/cloud-agents
---

云端智能体(Cloud Agent)运行在远程基础设施上，并通过拉取请求(Pull Request)与 GitHub 仓库集成，实现团队协作。例如，GitHub Copilot 云端智能体(Cloud Agent)运行在 GitHub 的基础设施上，能够自主实现功能、处理代码审查反馈并开启拉取请求(Pull Request)。

本文介绍云端智能体(Cloud Agent)的核心功能，以及如何启动和管理云端智能体(Cloud Agent)会话(Agent Session)，适用于从简单到复杂的各类编码任务。

![VS Code 中云端智能体(Cloud Agent)会话（聊天编辑器）的截图。](/assets/docs/copilot/cloud-agents/cloud-agent-session.png)

## 什么是云端智能体(Cloud Agent)？

与在本机运行的本地智能体(Local Agent)和后台智能体(Agent)不同，云端智能体（如 Copilot 云端智能体(Cloud Agent)）运行在远程基础设施上。你可以从 VS Code 中统一的聊天视图查看和管理所有云端智能体(Cloud Agent)会话(Agent Session)。该视图还支持直接在 VS Code 中创建新的云端智能体(Cloud Agent)会话(Agent Session)，或将本地/后台智能体(Agent)对话移交给云端智能体(Cloud Agent)。

VS Code 支持多种云端智能体(Cloud Agent)，例如 Copilot 云端智能体(Cloud Agent)，以及 Claude 和 Codex 等[第三方智能体(Third-party Agent)](/docs/copilot/agents/third-party-agents)。

由于云端智能体(Cloud Agent)在没有用户交互的情况下远程运行，非常适合范围明确、所需上下文齐备的任务。与拉取请求(Pull Request)的集成使它们对于团队协作非常有效。

但由于远程执行环境的限制，云端智能体(Cloud Agent)无法直接访问 VS Code 内置工具和运行时上下文（如失败的测试或文本选择）。它们仅限于云端智能体(Cloud Agent)服务中配置的 MCP 服务器和语言模型(Language Model)。

要将任务分配给云端智能体(Cloud Agent)，可以直接从聊天视图创建新的云端会话，也可以将 VS Code 中的本地或后台智能体(Agent)对话移交给云端智能体(Cloud Agent)。

### GitHub Copilot 云端智能体(Cloud Agent)

**GitHub Copilot 云端智能体(Cloud Agent)**是 VS Code 中随 Copilot 订阅提供的主要云端智能体(Cloud Agent)。

> **💡 国内用户替代方案**
> 除了 GitHub Copilot 官方订阅，您也可以使用 **[飞码扣插件](/zh/guides/quickstart)** — 在 GitHub Copilot Chat 中直接使用通义千问(Qwen3)、DeepSeek V3.2、GLM-5 等国内顶级 AI 模型，按次计费，无需月付订阅。[立即开始 →](/zh/guides/quickstart)


核心功能包括：

- 跨 GitHub 仓库的大规模重构
- 从高层需求完整实现功能
- 自动生成详细描述的拉取请求(Pull Request)
- 代码审查集成和反馈处理

### 第三方云端智能体(Cloud Agent)

VS Code 支持将 Claude 编程智能体(Agent)和 Codex 编程智能体(Agent)等第三方云端智能体(Cloud Agent)作为云端会话选项。在 VS Code 中使用它们之前，需要在 Copilot 账号设置中启用对云端第三方智能体(Third-party Agent)的支持。

无需安装提供商的 VS Code 扩展即可在 VS Code 中使用其云端智能体(Cloud Agent)。

了解更多：[VS Code 中的第三方智能体(Third-party Agent)](/docs/copilot/agents/third-party-agents)以及如何启用它们。

## 启动云端智能体(Cloud Agent)会话(Agent Session)

你可以通过直接发送聊天提示来启动云端智能体(Cloud Agent)会话(Agent Session)，也可以将正在进行的本地或后台对话移交给云端智能体(Cloud Agent)。将正在进行的对话移交对于在自主执行前需要初始澄清或规划的复杂任务特别有用。

如果你更喜欢在浏览器中操作，也可以直接从 GitHub.com 使用 [GitHub Copilot 云端智能体(Cloud Agent)](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/manage-agents)启动云端智能体(Cloud Agent)会话(Agent Session)。

### 创建新的云端智能体(Cloud Agent)会话(Agent Session)

创建新的云端智能体(Cloud Agent)会话(Agent Session)：

1. 在聊天视图中，从会话列表下拉菜单选择**新建聊天**，然后从会话类型下拉菜单选择 **Cloud**。

   或者，可以通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **Chat: New Cloud Agent** 命令。

2. 从下拉菜单选择云端智能体(Cloud Agent)提供商，并可选择选择自定义智能体(Custom Agent)和模型。

3. 输入提示，让云端智能体(Cloud Agent)处理任务。

   例如，你可以输入：
   ```
   重构认证模块以提高安全性和性能。实现 OAuth2 和 JWT 进行令牌管理，并优化用户会话的数据库查询。
   ```

4. 云端智能体(Cloud Agent)开始远程处理任务。可以在聊天视图中监控会话进度并继续与之交互。

> **注意**
> 如果你在 GitHub.com 上将 Issue 或拉取请求(Pull Request)分配给了 Copilot 云端智能体(Cloud Agent)，会话会自动出现在 VS Code 的会话列表中。

### 将智能体(Agent)会话(Agent Session)移交给云端智能体(Cloud Agent)

对于复杂任务，先在 VS Code 聊天中与本地智能体(Local Agent)交互（例如使用 Plan 智能体(Agent)）以明确需求，然后再将任务移交给云端智能体(Cloud Agent)进行自主执行，这种方式往往很有帮助。将本地智能体(Local Agent)对话移交给云端智能体(Cloud Agent)会话(Agent Session)时，整个聊天上下文都会传递给云端智能体(Cloud Agent)。

将本地智能体(Local Agent)会话(Agent Session)移交给云端智能体(Cloud Agent)会话(Agent Session)：

1. 在聊天视图中打开正在进行的本地智能体(Local Agent)会话(Agent Session)。
2. 选择会话类型下拉菜单，选择 **Cloud** 以继续作为云端智能体(Cloud Agent)会话(Agent Session)。

   如果你正在使用 [Plan 智能体(Agent)](/docs/copilot/agents/planning)，可以从**开始实施**下拉菜单选择**在云端继续**，在云端智能体(Cloud Agent)会话(Agent Session)中运行计划实施。

将后台智能体(Agent)会话(Agent Session)移交给云端智能体(Cloud Agent)会话(Agent Session)，可在后台智能体(Agent)会话(Agent Session)的聊天输入框中输入 `/delegate`。此命令会将完整的聊天历史和上下文传递给新的云端智能体(Cloud Agent)会话(Agent Session)，然后你可以在聊天视图中进行监控。

## 查看和管理云端智能体(Cloud Agent)会话(Agent Session)

可以从 VS Code 的聊天视图查看和管理所有云端智能体(Cloud Agent)会话(Agent Session)。从筛选选项中选择**Cloud Agents**，将会话列表筛选为仅显示云端智能体(Cloud Agent)会话(Agent Session)。

![VS Code 聊天视图中云端智能体(Cloud Agent)筛选器截图。](/assets/docs/copilot/cloud-agents/cloud-agent-filter.png)

从列表中选择云端智能体(Cloud Agent)会话(Agent Session)，可在聊天视图中打开会话详情。如果想在编辑器标签页（聊天编辑器）中查看会话，右键单击会话并选择**以编辑器方式打开**。

![VS Code 中云端智能体(Cloud Agent)会话（聊天编辑器）的截图。](/assets/docs/copilot/cloud-agents/cloud-agent-session.png)

## 延伸阅读

- [智能体(Agent)概览](/docs/copilot/agents/overview)：了解不同智能体(Agent)类型和移交机制
- [后台智能体(Agent)](/docs/copilot/agents/copilot-cli)：了解基于 CLI 的自主智能体(Agent)，用于隔离开发
- [自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)：创建自定义智能体(Custom Agent)角色和身份
- [GitHub Copilot 云端智能体(Cloud Agent)](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/manage-agents)：在 GitHub.com 上管理智能体(Agent)
