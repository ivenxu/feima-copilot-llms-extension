---
title: 优化 AI 提示词
description: 本指南介绍在 VS Code 中使用 AI 的最佳实践，包括项目配置、选择合适工具与模型、编写有效提示词以及管理上下文窗口等技巧。
source: https://code.visualstudio.com/docs/copilot/chat/prompt-crafting
---

本文涵盖在 Visual Studio Code 中使用 AI 的经过验证的最佳实践。每个部分提供可操作的指导，并附有相关深度文档链接。

## 针对 AI 优化项目配置

通过为 AI 配置项目和代码库，可以提高 AI 响应的准确性，并确保 AI 遵循团队的编码规范和实践。

VS Code 支持多种机制来为项目配置 AI 行为。在聊天中输入 `/init` 可以生成入门配置。

| 机制 | 最适用于 | 入门方式 |
|------|----------|----------|
| [自定义说明(Custom Instructions)](/vscode-copilot/customization/custom-instructions) | 项目范围编码标准和架构上下文 | 输入 `/init` 为项目生成始终启用的说明 |
| [自定义智能体(Custom Agent)](/vscode-copilot/customization/custom-agents) | 特定工作流或角色（TDD、安全审计） | 输入 `/create-agent <描述>` 生成自定义智能体(Custom Agent) |
| [技能](/vscode-copilot/customization/agent-skills) | 领域特定能力（测试、部署） | 输入 `/create-skill <描述>` 生成技能 |
| [工具和 MCP 服务器](https://code.visualstudio.com/docs/copilot/agents/agent-tools) | 连接外部系统（数据库、API、CLI） | 在 `mcp.json` 中配置 |

有效项目配置的技巧：

- **保持说明文件简洁。** 每次聊天交互都会加载它们。专注于 AI 无法从代码推断的信息，例如非默认约定、架构决策或环境设置。
- **使用 `applyTo` 模式限定说明范围。** 输入 `/instructions` 创建语言特定或文件夹特定的说明文件，而不是把所有内容放在一个文件中。
- **限制启用的工具数量。** 活跃工具越少，响应越快且越相关。只在任务需要时才启用工具。

完整设置详情，请参阅[自定义概览](/vscode-copilot/customization/overview)。

## 为任务选择合适的工具

VS Code 中的 AI 提供多种交互模式。为手头的任务选择合适的工具可以节省时间并产生更好的结果。

| 工具 | 最适用于 | 示例 |
|------|----------|------|
| [内联建议(Inline Suggestion)](/vscode-copilot/inline-suggestions) | 在编写代码时保持流畅 | 代码补全(Code Completion)、变量名、样板代码 |
| [Ask（聊天）](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) | 提问、头脑风暴、探索想法 | "这个项目中的认证是如何工作的？" |
| [内联聊天(Inline Chat)](/vscode-copilot/chat/inline-chat) | 不切换上下文的有针对性的原位编辑 | 重构函数、添加错误处理 |
| [智能体(Agent)](/vscode-copilot/agents/overview) | 需要自主规划和工具使用的多文件变更 | 端到端实现功能 |
| [Plan](/vscode-copilot/agents/planning) | 实施前的结构化规划 | 设计架构或迁移策略 |
| [智能操作(Smart Action)](/vscode-copilot/smart-actions) | 内置的专业一步任务 | 生成提交消息、修复错误、重命名符号 |

## 选择合适的智能体(Agent)类型

使用智能体(Agent)时，选择与任务和工作流匹配的智能体(Agent)类型。每种类型在交互性、速度和隔离性方面有不同的权衡。

- **对交互式工作使用本地智能体(Local Agent)。** 本地智能体(Local Agent)在编辑器中运行，可完全访问工作区、工具和扩展。当需要快速迭代、实时审查变更，或使用 VS Code 特定工具（如[集成浏览器](https://code.visualstudio.com/docs/debugtest/integrated-browser)或 MCP 服务器）时，选择本地智能体(Local Agent)。
  
- **将定义明确的任务卸载给后台智能体(Agent)。** 当任务足够清晰，不需要观察每个步骤时，使用 [Copilot CLI](/vscode-copilot/agents/copilot-cli) 或[云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents)。
  
- **将云端智能体(Cloud Agent)用于团队协作。** [云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents)远程运行并创建拉取请求(Pull Request)，非常适合需要团队审查的任务，或者你想直接将 GitHub Issue 分配给智能体(Agent)时。
  
- **为独立任务运行并行会话。** 在本地、后台和云端环境中启动多个智能体(Agent)会话(Agent Session)，同时处理不相关的任务。通过[会话列表](/vscode-copilot/chat/chat-sessions#_sessions-list)监控它们。
  
- **在智能体(Agent)类型之间移交。** 先用本地智能体(Local Agent)进行探索和规划，然后[移交](/vscode-copilot/agents/overview#_hand-off-a-session-to-another-agent)给后台或云端智能体(Cloud Agent)进行实施。对话历史会随之传递。

更多信息，请参阅[使用智能体(Agent)](/vscode-copilot/agents/overview)和[智能体(Agent)教程](/vscode-copilot/agents/agents-tutorial)。

## 编写有效提示词(Prompt)

AI 响应的质量取决于提示词(Prompt)的清晰度和具体性。以下技术有助于获得更好的结果：

- **具体说明输入、输出和约束条件。** 明确编程语言、框架和库。描述预期行为或包含示例输入和输出。
  
  ```
  写一个验证电子邮件地址的 TypeScript 函数。
  有效地址返回 true，否则返回 false。不要使用正则表达式。
  示例：validateEmail("user@example.com") 返回 true
  示例：validateEmail("invalid") 返回 false
  ```

- **分解复杂任务。** 不要一次请求整个功能，而是将其分解为更小、范围明确的步骤。这种方法产生更可靠的结果，并且更容易早期发现问题。

- **包含预期输出以便验证。** 提供测试用例、预期结果或验收标准，让 AI 能够验证自己的工作。这是你能做的最高杠杆的事情之一。
  
  ```
  使用令牌桶算法实现速率限制器。
  编写单元测试验证：每秒允许 10 个请求，
  第 11 个请求被拒绝，1 秒后桶重新填充。
  实现后运行测试。
  ```

- **避免模糊提示词(Prompt)。** 像"让这个更好"这样的提示词(Prompt)没有给 AI 任何方向。换成指定"更好"的含义："减少时间复杂度"或"为 null 值添加输入验证"。

- **用后续提示词(Prompt)迭代。** 通过在后续消息中添加约束或更正来优化响应，而不是重写整个提示词(Prompt)。

- **尽早纠偏。** 如果 AI 走向错误方向，用后续消息[引导它](/vscode-copilot/chat/chat-sessions#_send-messages-while-a-request-is-running)重定向当前请求，排队后续请求，或停止并发送新提示词(Prompt)。

- **告诉 AI 提出澄清性问题。** 如果任务不明确，指示 AI 在继续之前向你提问。这比猜测需求能产生更准确的结果。

- **并行任务。** 如果有多个独立任务，让 AI 并行运行以节省时间。例如："并行独立研究 X 和 Y，并总结发现。"

更多信息，请参阅 GitHub Copilot 文档中的实用[提示词(Prompt)示例](https://docs.github.com/en/copilot/copilot-chat-cookbook)。

## 提供正确的上下文

当 AI 拥有相关上下文时，响应会更准确。使用以下技术将 AI 指向正确信息：

- AI 会自动执行代码搜索来收集相关上下文。当提示词(Prompt)不明确时，可以在提示词(Prompt)中使用 `#<文件>`、`#<文件夹>` 或 `#<符号>` 引用特定文件、文件夹或符号来引导 AI。

- 要从网页或 GitHub 仓库拉取信息，使用 `#fetch` 为 AI 提供代码库之外的最新信息，或使用 GitHub MCP 等 MCP 服务器的工具。

- 引用 VS Code 环境上下文，如源代码管理变更、终端输出或测试失败，帮助 AI 了解项目的当前状态并提供更相关的响应。

- 添加图片或截图让 AI 分析可视内容。

- 使用[集成浏览器](https://code.visualstudio.com/docs/debugtest/integrated-browser)预览应用并选择页面元素作为上下文。

更多信息，请参阅[向聊天提示词(Prompt)添加上下文](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context)和[配置工具](https://code.visualstudio.com/docs/copilot/agents/agent-tools)。

## 选择合适的模型

每个 AI 模型有不同的优势。有些更擅长推理，有些擅长代码生成或更快的响应。为任务选择合适的模型可以改善结果。

- **将模型与任务复杂度匹配。** 对简单补全和样板代码使用快速模型；对规划、调试或架构决策切换到推理优化模型。

- **使用最新模型。** 较新的模型通常具有改进的能力。VS Code 持续添加对新模型和模型版本的支持。查看[可用模型](/vscode-copilot/customization/model-selection)并使用最新模型。

- **在提示词(Prompt)文件和智能体(Agent)中固定模型。** 在提示词(Prompt)文件或自定义智能体(Custom Agent)定义中指定首选模型，以确保为特定任务一致地使用正确模型。

- **实验和比较。** 如果对响应不满意，尝试不同的模型。对于相同的提示词(Prompt)，不同模型可能产生截然不同的结果。

- **调整推理模型的思考强度。** 使用模型选择器中的[思考强度控件](/vscode-copilot/customization/model-selection#_configure-thinking-effort)，对复杂任务提高强度，对简单任务降低强度。

- **使用 BYOK 获得额外控制。** 携带自己的 API 密钥可以获得更多模型选择和托管选项。

更多信息，请参阅[选择 AI 模型](/vscode-copilot/customization/model-selection)和 [Copilot Chat 可用模型](https://docs.github.com/en/copilot/using-github-copilot/ai-models/changing-the-ai-model-for-copilot-chat)。

## 先规划，再实施

对于跨多个文件的复杂变更，将规划与实施分开。这种方法可以防止 AI 解决错误的问题。

1. **探索。** 使用 Ask 模式或子智能体(Agent)读取相关代码，在做出变更之前了解其工作方式。
2. **规划。** 使用 [Plan 智能体(Agent)](/vscode-copilot/agents/planning)创建结构化实施计划。在执行前审查并完善计划。
3. **实施。** 切换到智能体(Agent)模式，按计划实施。包含测试或预期输出，让智能体(Agent)可以验证自己的工作。对于较长的任务，移交给[后台智能体(Agent)](/vscode-copilot/agents/copilot-cli)或[云端智能体(Cloud Agent)](/vscode-copilot/agents/cloud-agents)。
4. **审查。** 使用[检查点](https://code.visualstudio.com/docs/copilot/chat/chat-checkpoints)审查进度，如果智能体(Agent)偏离轨道则回滚，或对生成的拉取请求(Pull Request)[请求 Copilot 代码审查](https://docs.github.com/en/copilot/concepts/agents/code-review)。

更多信息，请参阅[上下文工程工作流](https://code.visualstudio.com/docs/copilot/guides/context-engineering-guide)。

## 审查和验证 AI 输出

AI 生成的代码可能包含 Bug、安全问题或微妙的逻辑错误。始终将 AI 输出视为需要审查的起点。

- **接受前先审查。** 在接受变更之前通读生成的代码。注意边界情况、错误处理以及 AI 可能做出的假设。

- **AI 变更后运行测试。** 在提示词(Prompt)中包含测试用例，让 AI 可以验证自己的工作。如果 AI 没有自动运行测试，在继续之前自己运行。

- **使用检查点回滚。** 如果智能体(Agent)偏离轨道，使用[检查点](https://code.visualstudio.com/docs/copilot/chat/chat-checkpoints)回滚到已知良好状态，而不是尝试修复级联错误。

- **检查安全问题。** 审查 AI 生成的代码是否存在常见漏洞，如注入缺陷、硬编码密钥或缺少输入验证。避免在提示词(Prompt)中粘贴凭据或敏感数据。

更多信息，请参阅 [GitHub Copilot 安全性](/vscode-copilot/security)和 [GitHub Copilot Trust Center](https://copilot.github.trust.page/faq)。

## 管理上下文和会话

随着对话填充了不相关的上下文，AI 响应可能会降质。主动管理你的会话。

- **对不相关的任务开始新会话。** 不要将不相关的问题堆积在一个对话中。上下文污染会降低响应质量。

- **删除不相关的历史。** 删除不再相关的过去问题和响应，或开始全新的会话。

- **压缩上下文。** 使用 [/compact](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context#_context-compaction) 并提供说明，有选择地压缩上下文，只保留最相关的信息。

- **使用子智能体(Agent)进行调查。** 提示 AI 使用[子智能体(Agent)](https://code.visualstudio.com/docs/copilot/agents/subagents)隔离地执行研究和探索，使发现不会混乱你的主要上下文。

- **选择合适的会话类型。** 对需要立即关注的当前代码快速任务使用本地会话，对可以在本地隔离运行的任务使用后台任务，或使用可以受益于团队协作的云端会话。

- **通过并行会话扩展。** 为独立任务并行运行多个会话，节省时间并保持上下文分离。可以同时在本地、后台和云端环境中运行多个会话，并通过 VS Code 中的[会话列表](/vscode-copilot/chat/chat-sessions#_sessions-list)在它们之间切换。

更多信息，请参阅[会话管理](/vscode-copilot/chat/chat-sessions)和[工作区索引](https://code.visualstudio.com/docs/copilot/reference/workspace-context)。

## 使用大型代码库

Copilot 设计用于在大型、复杂和多根工作区中有效工作。使用这些实践在规模上获得最佳结果。

- **使用工作区索引。** VS Code 使用语义搜索、语言智能和 GitHub 代码搜索自动索引项目，实现深度跨文件推理。对于大型仓库，使用[远程索引](https://code.visualstudio.com/docs/copilot/reference/workspace-context#_remote-index)在仓库及 GitHub 上相关仓库中获得快速、全面的结果。

- **使用多根工作区限定工作范围。** 对于 monorepo 或有多个服务的项目，使用[多根工作区](https://code.visualstudio.com/docs/editing/workspaces/multi-root-workspaces)为 AI 提供清晰的边界和专注的上下文。

- **提供项目级别的说明。** 使用[自定义说明(Custom Instructions)](/vscode-copilot/customization/custom-instructions)描述项目的架构、模块边界和 AI 无法从代码中推断的约定。这为 AI 提供了架构级别变更所需的上下文。
