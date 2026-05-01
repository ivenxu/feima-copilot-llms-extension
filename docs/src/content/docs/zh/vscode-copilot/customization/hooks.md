---
title: Hooks（钩子）
description: 了解如何在 VS Code 中配置智能体 Hooks，在智能体会话生命周期的关键节点执行自定义 Shell 命令，实现自动化和策略执行。
source: https://code.visualstudio.com/docs/copilot/customization/hooks
---

Hooks 让你能够在智能体(Agent)会话(Agent Session)的关键生命周期节点执行自定义 Shell 命令。使用 Hooks 来自动化工作流、强制执行安全策略、验证操作以及与外部工具集成。

> **注意**
> 智能体(Agent) Hooks 目前处于预览阶段。配置格式和行为可能在未来版本中更改。

> **提示**
> 使用[智能体(Agent)自定义编辑器](/vscode-copilot/customization/overview#_agent-customizations-editor)（预览版）在一个地方发现、创建和管理所有智能体(Agent)自定义内容。通过命令面板运行 **Chat: Open Customizations** 命令。

Hooks 设计用于跨智能体(Agent)类型工作，包括本地智能体(Local Agent)、后台智能体(Agent)和云端智能体(Cloud Agent)。每个 Hook 接收结构化的 JSON 输入，并可以返回 JSON 输出来影响智能体(Agent)行为。

## 为什么使用 Hooks？

Hooks 提供确定性的、代码驱动的自动化。与指导智能体(Agent)行为的说明或自定义提示词(Prompt)不同，Hooks 在特定生命周期节点以有保证的结果执行你的代码：

- **强制执行安全策略**：在命令执行之前阻止危险命令（如 `rm -rf` 或 `DROP TABLE`），无论智能体(Agent)如何被提示。
- **自动化代码质量**：在文件修改后自动运行格式化程序、Linter 或测试。
- **创建审计跟踪**：记录每次工具调用(Tool Call)、命令执行或文件变更，用于合规性和调试。
- **注入上下文**：添加项目特定信息、API 密钥或环境详情，帮助智能体(Agent)做出更好的决策。
- **控制审批**：自动批准安全操作，同时要求对敏感操作进行确认。

## 快速上手：你的第一个 Hook

以下示例创建一个在每次文件编辑后运行 Prettier 的 Hook。在工作区中创建 `.github/hooks/format.json` 文件：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "npx prettier --write \"$TOOL_INPUT_FILE_PATH\""
      }
    ]
  }
}
```

保存此文件后，VS Code 会自动加载该 Hook。下次智能体(Agent)编辑文件时，Prettier 会对修改的文件运行。查看 **GitHub Copilot Chat Hooks** 输出频道以验证 Hook 已执行。

## Hook 生命周期事件

VS Code 支持八个 Hook 事件，在智能体(Agent)会话(Agent Session)的特定节点触发：

| Hook 事件 | 触发时机 | 常见用途 |
|-----------|----------|----------|
| `SessionStart` | 用户提交新会话的第一个提示词(Prompt)时 | 初始化资源、记录会话开始、验证项目状态 |
| `UserPromptSubmit` | 用户提交提示词(Prompt)时 | 审计用户请求、注入系统上下文 |
| `PreToolUse` | 智能体(Agent)调用任何工具之前 | 阻止危险操作、要求审批、修改工具输入 |
| `PostToolUse` | 工具成功完成后 | 运行格式化程序、记录结果、触发后续操作 |
| `PreCompact` | 在对话上下文压缩之前 | 导出重要上下文、在截断前保存状态 |
| `SubagentStart` | 子智能体(Agent)被创建时 | 跟踪嵌套智能体(Agent)使用、初始化子智能体(Agent)资源 |
| `SubagentStop` | 子智能体(Agent)完成时 | 聚合结果、清理子智能体(Agent)资源 |
| `Stop` | 智能体(Agent)会话(Agent Session)结束时 | 生成报告、清理资源、发送通知 |

## 配置 Hooks

Hooks 在存储于工作区或用户目录中的 JSON 文件中配置。

### Hook 文件位置

VS Code 在以下位置搜索 Hook 配置文件：

| 范围 | 默认文件位置 |
|------|-------------|
| 工作区 | `.github/hooks/*.json` |
| 工作区（Claude 格式） | `.claude/settings.json`、`.claude/settings.local.json` |
| 用户 | `~/.copilot/hooks`、`~/.claude/settings.json` |
| 自定义智能体(Custom Agent) | `.agent.md` frontmatter 中的 `hooks` 字段（参见[智能体(Agent)作用域 Hooks](#_agentscoped-hooks)） |

工作区 Hooks 优先于同一事件类型的用户 Hooks。

使用 `chat.hookFilesLocations` 设置自定义加载哪些 Hook 文件。

### 智能体(Agent)作用域 Hooks

可以直接在[自定义智能体(Custom Agent)](/vscode-copilot/customization/custom-agents)的 YAML frontmatter 中定义 Hooks。智能体(Agent)作用域 Hooks 仅在该自定义智能体(Custom Agent)活跃时运行，与工作区或用户级别为同一事件配置的 Hooks 同时运行。

要启用智能体(Agent)作用域 Hooks，将 `chat.useCustomAgentHooks` 设置为 `true`。

```yaml
---
name: "Strict Formatter"
description: "Agent that auto-formats code after every edit"
hooks:
  PostToolUse:
    - type: command
      command: "./scripts/format-changed-files.sh"
---

You are a code editing agent. After making changes, files are automatically formatted.
```

### Hook 配置格式

创建一个 JSON 文件，包含每个事件类型的 Hook 命令数组：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/validate-tool.sh",
        "timeout": 15
      }
    ],
    "PostToolUse": [
      {
        "type": "command",
        "command": "npx prettier --write \"$TOOL_INPUT_FILE_PATH\""
      }
    ]
  }
}
```

### Hook 命令属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `type` | string | 必须为 `"command"` |
| `command` | string | 要运行的默认命令（跨平台） |
| `windows` | string | Windows 特定命令覆盖 |
| `linux` | string | Linux 特定命令覆盖 |
| `osx` | string | macOS 特定命令覆盖 |
| `cwd` | string | 工作目录（相对于仓库根目录） |
| `env` | object | 额外的环境变量 |
| `timeout` | number | 超时时间（秒）（默认：30） |

## Hook 输入和输出

Hooks 通过 stdin（输入）和 stdout（输出）使用 JSON 与 VS Code 通信。

### 通用输入字段

每个 Hook 通过 stdin 接收包含以下公共字段的 JSON 对象：

```json
{
  "timestamp": "2026-02-09T10:30:00.000Z",
  "cwd": "/path/to/workspace",
  "sessionId": "session-identifier",
  "hookEventName": "PreToolUse",
  "transcript_path": "/path/to/transcript.json"
}
```

### 通用输出格式

Hooks 可以通过 stdout 返回 JSON 来影响智能体(Agent)行为：

```json
{
  "continue": true,
  "stopReason": "Security policy violation",
  "systemMessage": "Unit tests failed"
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| `continue` | boolean | 设置为 `false` 停止处理（默认：`true`） |
| `stopReason` | string | 停止原因，当 `continue` 为 `false` 时显示给用户 |
| `systemMessage` | string | 显示给用户的警告消息 |

### 退出码

Hook 的退出码决定 VS Code 如何处理结果：

| 退出码 | 行为 |
|--------|------|
| `0` | 成功：将 stdout 解析为 JSON |
| `2` | 阻塞错误：停止处理并向模型显示错误 |
| 其他 | 非阻塞警告：向用户显示警告，继续处理 |

## PreToolUse

`PreToolUse` Hook 在智能体(Agent)调用工具之前触发，可以通过 `hookSpecificOutput` 对象控制工具执行：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Destructive command blocked by policy",
    "updatedInput": { "files": ["src/safe.ts"] },
    "additionalContext": "User has read-only access to production files"
  }
}
```

`permissionDecision` 值：`"allow"`（自动批准）、`"deny"`（阻止执行）、`"ask"`（要求用户确认）。

**权限决策优先级**：当多个 Hooks 为同一工具调用(Tool Call)运行时，最严格的决策优先：`deny` > `ask` > `allow`。

## PostToolUse

`PostToolUse` Hook 在工具成功完成后触发，可以向模型提供额外上下文或阻止进一步处理：

```json
{
  "decision": "block",
  "reason": "Post-processing validation failed",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "The edited file has lint errors that need to be fixed"
  }
}
```

## SessionStart

`SessionStart` Hook 在新智能体(Agent)会话(Agent Session)开始时触发，可以向智能体(Agent)的对话中注入额外上下文：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Project: my-app v2.1.0 | Branch: main | Node: v20.11.0"
  }
}
```

## Stop

`Stop` Hook 在智能体(Agent)会话(Agent Session)结束时触发，可以阻止智能体(Agent)停止：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "decision": "block",
    "reason": "Run the test suite before finishing"
  }
}
```

> **重要提示**
> 当 `Stop` Hook 阻止智能体(Agent)停止时，智能体(Agent)会继续运行，额外的轮次会消耗高级请求额度。检查 `stop_hook_active` 字段（当智能体(Agent)已因之前的 Stop Hook 而继续时为 `true`），以防止智能体(Agent)无限运行。

## 延伸阅读

- [自定义智能体(Custom Agent)](/vscode-copilot/customization/custom-agents)
- [自定义概览](/vscode-copilot/customization/overview)
