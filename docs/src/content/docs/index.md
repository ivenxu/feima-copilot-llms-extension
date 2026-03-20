---
title: Feima Copilot Documentation
description: Accelerating intent into execution - Chinese AI models for GitHub Copilot Chat
---

# Welcome to Feima Copilot

**加速创意落地 - Accelerating intent into execution**

Feima Copilot is a VS Code extension that enhances GitHub Copilot Chat with Chinese AI model support.

## What is Feima Copilot?

**Feima Copilot (飞码扣)** is a VS Code extension that provides:

- 🇨🇳 **Chinese AI Models**: Direct access to Qwen3, DeepSeek V3.2, GLM-5, MiniMax M2.5, Kimi K2.5 and other top Chinese models
- 💬 **Seamless Integration**: Works directly within GitHub Copilot Chat without switching interfaces
- 💰 **Pay-Per-Use**: Pay only for requests you make, not monthly subscriptions
- 🔒 **Secure**: OAuth2 authentication with code that never leaves VS Code
- 🧠 **Thinking Models**: Support for chain-of-thought reasoning for complex problems

## Quick Start

<CardGrid stagger>
  <Card title="Install" icon="lucide:download">
    Install the extension from VS Code Marketplace and GitHub Copilot Chat
  </Card>
  <Card title="Authenticate" icon="lucide:user">
    Sign in with your Feimacode account via OAuth2
  </Card>
  <Card title="Select Model" icon="lucide:bot">
    Choose your preferred model in Copilot Chat
  </Card>
  <Card title="Start Coding" icon="lucide:code">
    Ask questions, get code suggestions, and boost your productivity
  </Card>
</CardGrid>

## Supported Models

| Model | Provider | Context | Features |
|-------|----------|---------|----------|
| Qwen3 Max | Alibaba | 256K | Thinking chain, tool calls |
| Qwen3 Coder Plus | Alibaba | 1M | Code specialized, 1M context |
| Qwen3.5 Plus | Alibaba | 1M | 80K thinking chain |
| DeepSeek V3.2 | DeepSeek | 128K | Thinking, sparse attention |
| GLM-5 | Zhipu AI | 200K | Thinking chain, tool calls |
| GLM-4.7 | Zhipu AI | 200K | Advanced reasoning |
| MiniMax M2.5 | MiniMax | 200K | Thinking chain |
| Kimi K2.5 | Moonshot | 256K | Thinking chain |
| GPT-4o | OpenAI | Complex logic, architecture design |
| Claude 3.5 Sonnet | Anthropic | Code review, algorithm optimization |
| Gemini 1.5 Pro | Google | Large codebase understanding |

## Why Feima Copilot?

| Feature | GitHub Copilot Native | Feima Copilot Enhanced |
|---------|----------------------|----------------------|
| Chinese Understanding | ✅ Good | 🔥 **Excellent** (Chinese models) |
| International Model Access | ⚠️ Unstable (GFW) | ✅ **Stable & Accelerated** |
| Model Selection | 3-4 models | 🎉 **6+ models** |
| Pricing | Monthly subscription | 💡 **Pay-per-use** |

## Development Status

**Current Version**: v0.1.0-alpha (In Development)

We're implementing core features:
- ✅ OAuth2 authentication system
- ✅ Language model providers
- 🚧 GitHub Copilot Chat integration testing
- ⏸️ Quota management (pending verification)

## Resources

- [Quick Start Guide](./guides/quickstart.md) - Get up and running in minutes
- [Installation Guide](./guides/installation.md) - Detailed installation instructions
- [Authentication Guide](./guides/authentication.md) - Set up OAuth2 authentication
- [Development Setup](./dev/setup.md) - Contribute to the project

## Get Involved

We welcome community contributions! See our [Development Guide](./dev/setup.md) to learn how to participate.

- 🐛 [Report Issues](https://github.com/feimacode/feima-copilot-llms-extension/issues)
- 💬 [Feature Requests](https://github.com/feimacode/feima-copilot-llms-extension/discussions)
- 📧 [Email Support](mailto:support@feimacode.cn)

---

Made with ❤️ by [Feima Team](https://feimacode.cn)