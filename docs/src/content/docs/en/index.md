---
title: Feima Copilot Documentation
description: VS Code extension for GitHub Copilot with Chinese AI model support
---

# Welcome to Feima Copilot

Feima Copilot is a VS Code extension that enhances GitHub Copilot Chat with Chinese AI model support and accelerated access to international models.

## What is Feima Copilot?

**Feima Copilot (飞码扣)** is a VS Code extension that provides:

- 🇨🇳 **Chinese AI Models**: Direct access to DeepSeek Coder V2, Tongyi Qianwen Coder, Tencent Hunyuan, and other Chinese models
- 🚀 **Accelerated International Models**: Stable access to GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro via Feima acceleration
- 💬 **Seamless Integration**: Works directly within GitHub Copilot Chat without switching interfaces
- 💰 **Pay-Per-Use**: Pay only for requests you make, not monthly subscriptions
- 🔒 **Secure**: OAuth2 authentication with code that never leaves VS Code

## Quick Start

<CardGrid stagger>
  <Card title="Install" icon="lucide:download">
    Install the extension from VS Code Marketplace and GitHub Copilot Chat
  </Card>
  <Card title="Authenticate" icon="lucide:user">
    Sign in with your Feima account via OAuth2
  </Card>
  <Card title="Select Model" icon="lucide:bot">
    Choose your preferred model in Copilot Chat
  </Card>
  <Card title="Start Coding" icon="lucide:code">
    Ask questions, get code suggestions, and boost your productivity
  </Card>
</CardGrid>

## Supported Models

### Chinese Models (Direct Connection)

| Model | Provider | Best For |
|-------|----------|----------|
| DeepSeek Coder V2 | DeepSeek | Code generation, code completion, technical Q&A |
| Tongyi Qianwen 3 Coder | Alibaba | Chinese code comments, documentation generation |
| Tencent Hunyuan | Tencent | General Q&A, code understanding |

### International Models (Accelerated)

| Model | Provider | Best For |
|-------|----------|----------|
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

- 🐛 [Report Issues](https://github.com/feima-tech/feima-copilot-llms-extension/issues)
- 💬 [Feature Requests](https://github.com/feima-tech/feima-copilot-llms-extension/discussions)
- 📧 [Email Support](mailto:support@feima.tech)

---

Made with ❤️ by [Feima Team](https://feima.tech)