# 飞码扣 (Feima Kou)

> 为 GitHub Copilot 提供中国 AI 模型支持

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/feima-tech/cn-model-for-copilot?style=flat-square)](https://github.com/feima-tech/cn-model-for-copilot)

## 📖 简介

**飞码扣**是 VS Code 的扩展插件，为 GitHub Copilot Chat 添加中国 AI 模型支持，让你在使用 Copilot 的同时，也能使用 DeepSeek、通义千问、混元等更懂中文的国产模型，以及通过飞码加速访问 GPT-4、Claude、Gemini 等海外顶级模型。

### ✨ 核心特点

- 🇨🇳 **国产模型支持**: DeepSeek Coder V2、通义千问3 Coder、腾讯混元
- 🚀 **海外模型加速**: GPT-4o、Claude 3.5 Sonnet、Gemini 1.5 Pro（通过飞码加速）
- 💬 **无缝集成**: 直接在 GitHub Copilot Chat 中使用，无需切换界面
- 💰 **按次计费**: 请求数付费，成本可控，告别按月订阅
- 🔒 **安全可靠**: OAuth2 认证，代码不离开 VS Code

## 🎯 为什么选择飞码扣？

| 对比项 | GitHub Copilot 原生 | 飞码扣增强版 |
|--------|-------------------|-------------|
| 中文理解 | ✅ 良好 | 🔥 **优秀**（国产模型） |
| 海外模型连接 | ⚠️ 不稳定（GFW） | ✅ **稳定加速** |
| 模型选择 | 3-4 个 | 🎉 **6+ 个模型** |
| 付费方式 | 按月订阅 | 💡 **按次付费** |

## 🚧 开发状态

**当前版本**: v0.1.0-alpha（开发中）

我们正在实现核心功能：
- ✅ OAuth2 认证系统
- ✅ 语言模型提供器
- 🚧 与 GitHub Copilot Chat 集成测试
- ⏸️ 配额管理（待验证后实现）

## 🚀 快速开始（开发版本）

### 前置要求

- VS Code >= 1.85.0
- GitHub Copilot Chat 扩展（必须安装）
- Node.js >= 18.x（用于开发）

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/feima-tech/cn-model-for-copilot.git
cd cn-model-for-copilot

# 安装依赖
npm install

# 编译
npm run compile

# 在 VS Code 中打开
code .

# 按 F5 启动调试
```

### 使用步骤（即将推出）

1. **登录飞码账号**
   - 按 `Ctrl+Shift+P` / `Cmd+Shift+P` 打开命令面板
   - 输入 `Feima: 登录`
   - 在浏览器中完成 OAuth 授权

2. **在 Copilot Chat 中选择飞码模型**
   - 打开 Copilot Chat 面板（侧边栏图标或 `Ctrl+Alt+I`）
   - 点击模型选择器（顶部下拉菜单）
   - 选择 `DeepSeek Coder V2` 或其他飞码模型

3. **开始聊天**
   - 输入你的问题或代码需求
   - 飞码模型会提供更懂中文的回答

## 🤖 支持的模型（计划中）

### 国产模型（直连）

| 模型 | 描述 | 适用场景 |
|------|------|---------|
| **DeepSeek Coder V2** | 深度求索最新代码模型 | 代码生成、代码补全、技术问答 |
| **通义千问3 Coder** | 阿里云代码专家模型 | 中文代码注释、文档生成 |
| **腾讯混元** | 腾讯自研大模型 | 通用问答、代码理解 |

### 海外模型（加速）

| 模型 | 描述 | 适用场景 |
|------|------|---------|
| **GPT-4o** | OpenAI 最新多模态模型 | 复杂逻辑、架构设计 |
| **Claude 3.5 Sonnet** | Anthropic 顶级推理模型 | 代码审查、算法优化 |
| **Gemini 1.5 Pro** | Google 长上下文模型 | 大型代码库理解 |

## 💰 计费说明（计划中）

飞码扣采用**请求数计费**，而非按月订阅：

- 🎁 **新用户免费**: 注册即送 100 次请求
- 💵 **按需购买**: 500 次 ¥29，2000 次 ¥99，10000 次 ¥399
- 📊 **实时显示**: 状态栏显示剩余请求数
- ⏰ **永久有效**: 购买的请求数永不过期

> 查看详细价格：https://feima.tech/pricing

## 📝 开发计划

### Phase 0: 核心验证（当前阶段）
- [x] 项目初始化
- [ ] 从 feima-code 提取认证代码
- [ ] 从 feima-code 提取模型提供器代码
- [ ] 与 GitHub Copilot Chat 集成测试
- [ ] **关键决策点**: 验证补充扩展方案是否可行

### Phase 1: 完整 MVP（验证通过后）
- [ ] 配额管理功能
- [ ] 状态栏显示
- [ ] 完整文档
- [ ] 单元测试

### Phase 2: 发布准备（验证通过后）
- [ ] Beta 测试
- [ ] 性能优化
- [ ] 安全审计
- [ ] Marketplace 发布

## ❓ 常见问题

<details>
<summary><strong>Q: 我需要 GitHub Copilot 订阅吗？</strong></summary>

A: **需要安装 GitHub Copilot Chat 扩展**，但不一定需要订阅。飞码扣的模型使用飞码账号认证，与 GitHub 账号独立。
</details>

<details>
<summary><strong>Q: 飞码扣和 GitHub Copilot 有什么区别？</strong></summary>

A: 飞码扣是**补充扩展**，不是替代品。它为 Copilot Chat 添加更多模型选择（国产模型 + 海外模型加速），让你可以根据任务选择最合适的模型。
</details>

<details>
<summary><strong>Q: 我的代码会被上传到飞码服务器吗？</strong></summary>

A: **代码仅用于 AI 推理，不存储不训练**。飞码 API 仅接收你发送的聊天消息（包含代码片段），处理后立即返回结果，不会保存你的代码用于其他用途。详见[隐私政策](https://feima.tech/privacy)。
</details>

<details>
<summary><strong>Q: 项目开发进度如何？</strong></summary>

A: 我们正在进行核心功能的验证阶段（Phase 0）。预计 2-3 周完成关键集成测试，确认技术方案可行后将继续开发完整功能。
</details>

## 🤝 贡献指南

我们欢迎社区贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)（即将添加）了解如何参与开发。

### 开发环境设置

```bash
# 安装依赖
npm install

# 启动监视模式（自动编译）
npm run watch

# 运行测试
npm test

# 打包扩展
npm run package
```

## 🔧 技术架构

```
cn-model-for-copilot/
├── src/
│   ├── extension.ts          # 扩展入口
│   ├── auth/                 # OAuth2 认证
│   ├── models/               # 语言模型提供器
│   ├── services/             # API 客户端
│   └── commands/             # VS Code 命令
├── package.json              # 扩展清单
└── tsconfig.json             # TypeScript 配置
```

**后端服务**（复用现有基础设施）：
- **feima-idp**: OAuth2 认证服务 (https://idp.feima.tech)
- **feima-api**: 模型网关服务 (https://api.feima.tech)

## 📄 开源协议

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢 [GitHub Copilot](https://github.com/features/copilot) 提供优秀的 AI 编程助手
- 感谢 [DeepSeek](https://www.deepseek.com/)、[阿里云](https://www.aliyun.com/)、[腾讯云](https://cloud.tencent.com/) 提供模型 API
- 感谢所有关注和支持飞码扣的开发者们

## 📧 联系我们

- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/feima-tech/cn-model-for-copilot/issues)
- 💬 **功能建议**: [GitHub Discussions](https://github.com/feima-tech/cn-model-for-copilot/discussions)
- 📧 **邮件支持**: support@feima.tech

---

<p align="center">
  <strong>更懂中文，连接更稳</strong><br>
  Made with ❤️ by <a href="https://feima.tech">Feima Team</a>
</p>
