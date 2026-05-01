---
title: 设置 GitHub Copilot
description: 本指南介绍如何在 Visual Studio Code 中设置 GitHub Copilot，包括登录、账号切换及禁用 AI 功能的方法。
source: https://code.visualstudio.com/docs/copilot/setup
---

本指南将引导你完成在 Visual Studio Code 中设置 GitHub Copilot 的全过程。要在 VS Code 中使用 Copilot，你需要通过 GitHub 账号获得 GitHub Copilot 访问权限。

按照以下步骤开始在 VS Code 中使用 Copilot：

1. 将鼠标悬停在状态栏的 Copilot 图标上，选择**使用 AI 功能**。

2. 选择登录方式并按提示操作。
   - 如果你的账号已有 Copilot 订阅，VS Code 将使用该订阅。
   - 如果你还没有 Copilot 订阅，将自动注册 [Copilot 免费计划](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/managing-copilot-free/about-github-copilot-free)，每月可享有一定数量的内联建议(Inline Suggestion)和聊天交互额度。了解不同 [GitHub Copilot 计划](https://docs.github.com/en/copilot/get-started/plans)的详情。

   > **重要提示**
   > **自 2026 年 4 月 20 日起**，Copilot Pro、Copilot Pro+ 及学生计划暂停新用户注册。同时，我们正在收紧每周使用限制。详见 [GitHub Copilot 使用限制](https://docs.github.com/copilot/concepts/usage-limits)。

3. 开始在 VS Code 中使用 Copilot！

> **💡 国内用户替代方案**
> 除了 GitHub Copilot 官方订阅，您也可以使用 **[飞码扣插件](https://marketplace.visualstudio.com/items?itemName=feima.copilot-cn-models)** — 在 GitHub Copilot Chat 中直接使用通义千问(Qwen3)、DeepSeek V3.2、GLM-5 等国内顶级 AI 模型，按次计费，无需月付订阅。[立即开始 →](/guides/quickstart) [打开飞码扣](vscode:extension/feima.copilot-cn-models)


   通过 [Copilot 快速入门](/vscode-copilot/getting-started) 了解基本功能。

4. 在聊天会话中输入 `/init` 为你的项目配置 AI。

   `/init` 命令会分析你的代码库，并创建[自定义说明(Custom Instructions)](/vscode-copilot/customization/custom-instructions)，帮助 AI 生成符合你编码习惯的代码。

> **重要提示**
> 免费版 GitHub Copilot 的遥测功能当前已启用。默认情况下，匹配公开代码的代码建议（包括 VS Code 和 [github.com](http://github.com/copilot) 中的代码引用）是被允许的。你可以在 VS Code 中将 `telemetry.telemetryLevel` 设置为 `off` 来选择退出遥测数据收集，或者在 [Copilot 设置](https://github.com/settings/copilot) 中同时调整遥测和代码建议设置。此设置由组织级别管理，如需更改请联系管理员。

## 使用 GHE 账号使用 Copilot

如果你的 Copilot 订阅与 GitHub Enterprise（GHE）账号关联，可以使用 GHE 凭据在 VS Code 中登录 Copilot。

1. 如果尚未操作，将鼠标悬停在状态栏的 Copilot 图标上，选择**使用 AI 功能**。
2. 在登录对话框中选择**继续使用 GHE.com**，并提供你的 GHE 实例 URL 和凭据。

如需在 GitHub.com 账号和 GHE 账号之间切换，请参阅[为每个工作区或配置文件使用不同的 GitHub 账号](#_use-a-different-github-account-per-workspace-or-profile)。

## 使用不同的 GitHub 账号

如果你的 Copilot 订阅与其他 GitHub 账号关联，请按以下步骤退出当前账号并用另一个账号登录。

1. 选择活动栏中的**账号**菜单，然后为当前登录账号选择**退出登录**。

   ![VS Code 账号菜单截图，显示退出当前 GitHub 账号的选项。](/assets/docs/copilot/setup/vscode-accounts-menu-signout.png)

2. 使用以下任意方式登录 GitHub 账号：
   - 从状态栏的 Copilot 菜单选择**登录以使用 Copilot**。
   
     ![从 Copilot 状态菜单登录的截图。](/assets/docs/copilot/setup/copilot-signedout-sign-in.png)
   
   - 选择活动栏中的**账号**菜单，然后选择**使用 GitHub 登录以使用 GitHub Copilot**。
   
     ![VS Code 账号菜单截图，显示使用 GitHub 登录以使用 GitHub Copilot 的选项。](/assets/docs/copilot/setup/vscode-accounts-menu.png)
   
   - 通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **GitHub Copilot: Sign in** 命令。

## 为每个工作区或配置文件使用不同的 GitHub 账号

你可以在 VS Code 的工作区或配置文件级别使用不同的 GitHub 账号。这在你使用不同账号处理工作和个人项目时非常有用，或者需要为不同扩展使用不同 GitHub 身份验证账号时也很方便。

按以下步骤配置 Copilot 使用的 GitHub 账号，此配置会保存在工作区和配置文件中。

- **对于 GitHub.com 账号**：
  1. 在活动栏的账号菜单中，选择**管理扩展账号首选项**
  2. 从扩展列表中选择 **GitHub Copilot Chat**
  3. 为当前工作区和配置文件选择要使用的 GitHub 账号

- **对于 GHE.com 账号**：

  > **提示**
  > 如果你只想为 Copilot 使用 GHE 账号，请按照[使用 GHE 账号使用 Copilot](#_use-copilot-with-a-ghe-account) 中的步骤登录。

  1. 通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **Preferences: Open User Settings (JSON)** 或 **Preferences: Open Workspace Settings (JSON)**
  
  2. 添加以下设置，将 GitHub Enterprise 指定为 Copilot 的身份验证提供商：
     ```json
     "github.copilot.advanced": {
         "authProvider": "github-enterprise"
     }
     ```
  
  3. 如果尚未登录 GitHub Enterprise 账号，请重新登录

## 从 VS Code 中移除 AI 功能

你可以通过 `chat.disableAIFeatures` 设置禁用 VS Code 的内置 AI 功能，就像配置其他功能一样。这会禁用并隐藏 VS Code 中的聊天或内联建议(Inline Suggestion)等功能，并禁用 Copilot 扩展。可在工作区或用户级别配置此设置。

或者，从标题栏的聊天菜单选择**了解如何隐藏 AI 功能**来访问该设置。

> **注意**
> 如果你之前已禁用了内置 AI 功能，在更新到新版本的 VS Code 后，你的选择将被保留。

## 为工作区禁用 AI 功能

要为特定工作区禁用 AI 功能，请在工作区设置中配置 `chat.disableAIFeatures` 设置。可在设置编辑器（⌘, / Windows、Linux：Ctrl+,）或工作区的 `settings.json` 文件中进行配置。

## 后续步骤

- 继续阅读 [AI 使用快速入门](/vscode-copilot/getting-started)，了解 VS Code 中 AI 驱动开发的核心功能。
