---
title: MCP 服务器
description: 了解如何在 VS Code 中添加、配置和管理 Model Context Protocol（MCP）服务器，为 AI 智能体提供访问外部工具和数据的能力。
source: https://code.visualstudio.com/docs/copilot/customization/mcp-servers
---

[Model Context Protocol（MCP）](https://modelcontextprotocol.io/)是连接 AI 模型与外部工具和服务的开放标准。在 Visual Studio Code 中，MCP 服务器为文件操作、数据库或外部 API 等任务提供[工具](https://code.visualstudio.com/docs/copilot/agents/agent-tools)。MCP 服务器还可以提供[资源、提示词(Prompt)和交互式应用](#_other-mcp-capabilities)。

本文介绍如何添加、配置和管理 MCP 服务器。要了解在聊天中使用工具的信息，请参阅[配合智能体(Agent)使用工具](https://code.visualstudio.com/docs/copilot/agents/agent-tools)。

> **提示**
> 使用[智能体(Agent)自定义编辑器](/vscode-copilot/customization/overview#_agent-customizations-editor)（预览版）在一个地方发现、创建和管理所有智能体(Agent)自定义内容。通过命令面板运行 **Chat: Open Customizations** 命令。

## 快速上手：在聊天中使用 MCP 服务器

按照以下步骤安装 MCP 服务器并在聊天中使用其工具。此示例使用 [Playwright](https://github.com/microsoft/playwright-mcp) MCP 服务器通过浏览器与网页交互。

1. 打开扩展视图（⇧⌘X / Windows、Linux：Ctrl+Shift+X），在搜索框中输入 `@mcp playwright`。

2. 选择**安装**将 Playwright MCP 服务器安装到你的用户配置文件中。

3. 当系统提示时，确认信任该服务器以启动它。VS Code 会发现服务器的工具并使其在聊天中可用。

4. 打开聊天视图（⌃⌘I / Windows、Linux：Ctrl+Alt+I），输入一个使用 Playwright 工具的提示词(Prompt)。例如：
   ```
   访问 code.visualstudio.com，拒绝 Cookie 横幅，并给我首页截图。
   ```
   
   VS Code 会调用 Playwright 工具在浏览器中打开页面并截图。你可能需要确认每次工具调用(Tool Call)。

> **提示**
> 选择聊天输入框中的**配置工具**按钮，查看 Playwright MCP 服务器的所有可用工具，并可逐个开启或关闭。

## 添加 MCP 服务器

从 MCP 服务器图库安装 MCP 服务器：

1. 打开扩展视图（⇧⌘X / Windows、Linux：Ctrl+Shift+X），在搜索框中输入 `@mcp`。这会显示图库中可用的 MCP 服务器列表。

2. 可以将 MCP 服务器安装到用户配置文件或工作区中：
   - 安装到用户配置文件：选择**安装**。
   - 安装到工作区：右键单击 MCP 服务器并选择**安装到工作区**。这会更新工作区中的 `.vscode/mcp.json` 文件。

3. 要查看 MCP 服务器详情，在列表中选择该服务器打开详情页。

> **注意**
> 本地 MCP 服务器可以在你的机器上运行任意代码。仅从[受信任的来源](#_mcp-server-trust)添加服务器，并在启动前审查发布者和服务器配置。阅读[安全文档](/vscode-copilot/security)了解在 VS Code 中使用 AI 的注意事项。

### 配置 `mcp.json` 文件

你可以通过编辑 `mcp.json` 文件手动配置 MCP 服务器。该文件有两个位置：

- **工作区**：在项目中创建或打开 `.vscode/mcp.json`。将此文件包含在源代码管理中，与团队共享 MCP 服务器配置。
- **用户配置文件**：运行 **MCP: Open User Configuration** 命令，打开[用户配置文件](https://code.visualstudio.com/docs/configure/profiles)文件夹中的 `mcp.json` 文件。此处配置的服务器在所有工作区中可用。

你也可以通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **MCP: Add Server** 命令，通过引导流程添加服务器，选择**工作区**或**全局**为目标。

> **重要提示**
> 避免硬编码 API 密钥等敏感信息。请使用[输入变量](https://code.visualstudio.com/docs/copilot/reference/mcp-configuration#_input-variables-for-sensitive-data)或环境文件代替。

以下示例展示了一个配置远程 MCP 服务器和本地 MCP 服务器的 `mcp.json` 文件：

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright"]
    }
  }
}
```

VS Code 为配置文件提供 IntelliSense。完整的配置 Schema 和字段参考，请参阅 [MCP 配置参考](https://code.visualstudio.com/docs/copilot/reference/mcp-configuration)。

## 其他 MCP 功能

除工具外，MCP 服务器还可以提供以下功能：

| 功能 | 描述 | 使用方式 |
|------|------|----------|
| **资源（Resources）** | 从 MCP 服务器访问数据（如文件、数据库表或 API 响应）作为提示词(Prompt)上下文。资源提供只读上下文，可附加到聊天请求。 | 在聊天视图中选择**添加上下文** > **MCP 资源**，也可使用 **MCP: Browse Resources** 命令。 |
| **提示词（Prompts）** | 使用 MCP 服务器提供的预配置提示词(Prompt)模板来标准化常见任务。 | 在聊天输入框中输入 `/<MCP 服务器>.<提示词(Prompt)>`。 |
| **MCP 应用（MCP Apps）** | 在聊天中直接渲染表单、可视化效果和拖放列表等交互式 UI 组件。 | 当 MCP 服务器支持时，MCP 应用会内联出现。 |

## 沙箱化 MCP 服务器

在 macOS 和 Linux 上，可以为本地运行的 stdio MCP 服务器启用沙箱化，限制其对文件系统和网络的访问。

在 `mcp.json` 的服务器配置中设置 `"sandboxEnabled": true` 启用沙箱化：

```json
{
  "servers": {
    "myServer": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@example/mcp-server"],
      "sandboxEnabled": true,
      "sandbox": {
        "filesystem": {
          "allowWrite": ["${workspaceFolder}"]
        },
        "network": {
          "allowedDomains": ["api.example.com"]
        }
      }
    }
  }
}
```

> **注意**
> 沙箱化目前在 Windows 上不可用。

## 管理 MCP 服务器

VS Code 提供多种管理 MCP 服务器的方式，例如启动或停止服务器、查看日志、卸载或清除缓存的工具。

| 方式 | 描述 |
|------|------|
| **扩展视图** | 右键单击 **MCP 服务器 - 已安装** 部分中的服务器，或选择齿轮图标。 |
| **`mcp.json` 编辑器** | 打开配置文件并使用内联操作（代码镜头）。 |
| **命令面板** | 运行 **MCP: List Servers**，选择服务器并选择操作。 |

## 启用或禁用 MCP 服务器

可以全局或针对特定工作区启用或禁用 MCP 服务器。禁用时，服务器不会启动，其工具、提示词(Prompt)、资源和 MCP 应用将从聊天中排除。

启用/禁用状态与 `mcp.json` 中的服务器配置分开存储，不会影响共享配置文件。

## 同步 MCP 配置

启用[设置同步](https://code.visualstudio.com/docs/configure/settings-sync)后，可以跨设备同步设置和配置，包括 MCP 服务器配置：

1. 通过命令面板运行 **Settings Sync: Configure** 命令。
2. 在同步配置列表中启用 **MCP Servers** 选项。

## 排除 MCP 服务器问题

当 VS Code 遇到 MCP 服务器问题时，会在聊天视图中显示错误指示。

要查看服务器日志：
1. 选择聊天视图中的错误通知，然后选择**显示输出**选项
2. 或者：通过命令面板运行 **MCP: List Servers**，选择服务器，然后选择**显示输出**

## 常见问题

**使用 Docker 时 MCP 服务器无法启动**

验证命令参数是否正确，以及容器是否未以分离模式（`-d` 选项）运行。你也可以查看 MCP 服务器输出中的错误消息。

- [MCP 配置参考](https://code.visualstudio.com/docs/copilot/reference/mcp-configuration)
- [配合智能体(Agent)使用工具](https://code.visualstudio.com/docs/copilot/agents/agent-tools)
- [Model Context Protocol 文档](https://modelcontextprotocol.io/)
