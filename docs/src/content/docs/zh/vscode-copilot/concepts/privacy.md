---
title: 隐私与数据处理
description: 了解 VS Code GitHub Copilot 如何处理你的代码和数据，包括遥测、内容排除和隐私控制选项。
source: https://code.visualstudio.com/docs/copilot/concepts/privacy
---

了解 GitHub Copilot 如何处理你的数据对于在企业和个人环境中负责任地使用 AI 至关重要。

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/guides/quickstart)


## 什么数据被发送到 GitHub？

当你使用 GitHub Copilot 时，相关上下文会被发送到 GitHub 服务器来生成响应。这通常包括：

- 你正在编辑的文件的部分内容（用于内联建议(Inline Suggestion)）
- 你的聊天提示词(Prompt)和会话历史
- 为提供上下文而选择的其他文件

**不会发送**的内容：
- 配置了内容排除的文件（Copilot Business/Enterprise）
- 标记为排除的目录

## 遥测数据

### Copilot 免费版

Copilot 免费版默认启用遥测。GitHub 使用此数据改进 Copilot 服务。

禁用遥测：
```json
// settings.json
"telemetry.telemetryLevel": "off"
```

或在 VS Code 的设置编辑器中搜索"遥测"进行配置。

### Copilot 付费计划

通过 [Copilot 设置](https://github.com/settings/copilot)管理数据处理偏好，包括是否允许 GitHub 使用你的提示词(Prompt)和建议来改进模型。

## 内容排除（Copilot Business/Enterprise）

组织管理员可以配置内容排除，防止特定文件被 Copilot 处理：

```json
// .github/copilot-exclusions.json 示例
{
  "paths": [
    "**/.env",
    "**/secrets/**",
    "**/credentials/**"
  ]
}
```

了解更多：[配置 Copilot 内容排除](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)。

## 代码用于训练

默认情况下，在 Copilot 免费版中，代码建议（匹配公共代码的建议）是被允许的，GitHub 可能使用交互数据来改进服务。

在付费计划中，你可以配置：
- 是否允许使用提示词(Prompt)和建议改进 Copilot 模型
- 是否允许匹配公共代码的建议

## 数据保留

GitHub Copilot 的数据保留政策：
- **实时提示词(Prompt)**：不为 Copilot 用户存储超过 28 天
- **会话数据**：遵循 GitHub 的数据保留政策

详细信息请参阅 [GitHub 隐私声明](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)和 [GitHub Copilot 隐私声明](https://docs.github.com/en/site-policy/privacy-policies/github-copilot-privacy-statement)。

## 企业数据处理

GitHub Copilot Business 和 Enterprise 提供额外的数据保护：
- 提示词(Prompt)和建议不用于训练 GitHub Copilot 或任何 Microsoft/GitHub 产品
- 数据传输加密
- 符合行业标准合规框架

了解更多：[GitHub Copilot 信任中心](https://copilot.github.trust.page/)。

## 延伸阅读

- [GitHub Copilot 隐私声明](https://docs.github.com/en/site-policy/privacy-policies/github-copilot-privacy-statement)
- [GitHub Copilot 信任中心 FAQ](https://copilot.github.trust.page/faq)
- [安全与隐私](/vscode-copilot/security)
