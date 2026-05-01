---
title: AI 安全与隐私
description: 了解 VS Code GitHub Copilot 的安全和隐私机制，包括数据处理、内容过滤和企业级安全控制。
source: https://code.visualstudio.com/docs/copilot/copilot-security
---

GitHub Copilot 将安全性和隐私保护放在首位。本文概述 Copilot 在 VS Code 中的安全和隐私机制。

## 数据处理

### 代码被发送到哪里？

当你使用 Copilot 时，相关上下文（包括部分代码）会发送到 GitHub 的服务器，用于生成响应。具体行为取决于你的 Copilot 计划和组织设置。

了解更多：[GitHub Copilot 隐私声明](https://docs.github.com/en/site-policy/privacy-policies/github-copilot-privacy-statement)。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/guides/quickstart)


### 遥测数据

Copilot 免费版默认启用遥测。你可以：
- 通过将 `telemetry.telemetryLevel` 设置为 `off` 禁用 VS Code 中的遥测数据收集
- 在 [Copilot 设置](https://github.com/settings/copilot)中调整遥测和代码建议设置

### 内容排除

GitHub Copilot Business 和 Enterprise 计划的组织可以配置内容排除，防止某些文件或路径被 Copilot 处理。

了解更多：[配置 Copilot 内容排除](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)。

## 内容过滤

Copilot 内置内容过滤，防止生成不当内容：

- **公共代码过滤**：默认情况下，匹配公共代码的建议会被标记
- **敏感内容过滤**：自动过滤可能包含密码、私钥等敏感信息的建议
- **有害内容过滤**：防止生成有害或攻击性内容

## 企业级安全控制

GitHub Copilot Business 和 Enterprise 计划提供额外的安全控制：

- **策略管理**：管理员可以控制哪些功能可用、哪些模型可以访问
- **内容排除**：配置哪些代码不被 Copilot 处理
- **审计日志**：跟踪 Copilot 的使用情况
- **网络控制**：通过 IP 允许列表限制访问

了解更多：[GitHub Copilot 信任中心](https://copilot.github.trust.page/)。

## 安全最佳实践

使用 Copilot 时的安全建议：

1. **不要在提示词(Prompt)中粘贴凭据**：不要在聊天中包含 API 密钥、密码或其他凭据
2. **审查生成的代码**：检查 Copilot 建议中的安全漏洞
3. **了解公共代码**：Copilot 的建议可能受到公共代码的影响，注意许可证合规
4. **使用内容排除**：为包含敏感业务逻辑的文件配置内容排除

## 延伸阅读

- [GitHub Copilot 信任中心 FAQ](https://copilot.github.trust.page/faq)
- [GitHub Copilot 隐私声明](https://docs.github.com/en/site-policy/privacy-policies/github-copilot-privacy-statement)
- [GitHub Copilot 常见问题](/vscode-copilot/faq)
