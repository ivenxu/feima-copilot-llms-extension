---
title: 提示词工程指南
description: 了解如何为 VS Code GitHub Copilot 编写有效的提示词，提高 AI 响应质量和代码生成准确性。
source: https://code.visualstudio.com/docs/copilot/guides/prompt-engineering
---

> **💡 国内用户提示**
> 如果您希望使用国内 AI 模型，安装 **[飞码扣插件](/zh/guides/quickstart)** 即可在 GitHub Copilot Chat 中使用通义千问(Qwen3)、DeepSeek、GLM 等模型，按次计费。[了解更多 →](/zh/guides/quickstart)


提示词(Prompt)工程是编写有效指令以从 AI 模型获得所需输出的技巧。本指南提供在 VS Code GitHub Copilot 中编写有效提示词(Prompt)的实用建议。

## 清晰和具体性

**好的提示词(Prompt)特征：**
- 明确指定编程语言和框架
- 描述预期的输入和输出
- 说明约束条件和边界情况
- 包含示例（如果有帮助）

**示例：**

```
# 不好的提示词(Prompt)
Write a function to validate email

# 好的提示词(Prompt)
Write a TypeScript function that validates email addresses.
Return true for valid addresses, false for invalid ones.
Don't use regex - use the validator.js library.
Example: validateEmail("user@example.com") returns true
Example: validateEmail("notanemail") returns false
```

## 提供足够的上下文

Copilot 的建议质量取决于可用的上下文。提升上下文质量的方法：

1. **使用上下文变量(Context Variable)**引用特定文件和代码：
   ```
   参考 #api-client.ts 的模式，为 UserService 添加类似的错误处理
   ```

2. **引用相关文件**让 Copilot 理解项目结构：
   ```
   查看 #models/user.ts 和 #services/auth.ts，为用户注册实现端点
   ```

3. **描述架构和模式**：
   ```
   这个项目使用 Repository 模式。请按照相同的模式为 Order 实体创建仓库
   ```

## 分解复杂任务

将大型复杂任务分解为更小的步骤：

```
步骤 1: 先描述用户认证流程应该如何工作
步骤 2: 基于上面的描述，创建数据库模型
步骤 3: 然后实现 API 端点
步骤 4: 最后编写测试
```

## 迭代改进

不要期望第一个提示词(Prompt)就完美。使用迭代方式：

1. 发送初始提示词(Prompt)
2. 审查结果
3. 用后续提示词(Prompt)提出具体的改进：
   ```
   很好，但请也添加对空值的处理，并确保函数是纯函数（没有副作用）
   ```

## 指定输出格式

明确告诉 Copilot 你期望的输出格式：

```
生成一个 Markdown 表格，列出以下 API 端点的说明、参数和返回值...

返回 JSON 格式，结构如下：
{
  "name": string,
  "description": string,
  "parameters": object
}
```

## 角色设定

有时候，给 AI 设定一个角色可以帮助获得更专业的回答：

```
作为一个 PostgreSQL 专家，请帮我优化以下查询...

以资深安全工程师的角度审查以下代码，找出潜在的安全漏洞...
```

## 使用 Plan 智能体(Agent)进行复杂任务

对于复杂的编码任务，先使用 **Plan** 智能体(Agent)创建计划：

1. 切换到 Plan 模式
2. 描述你想要构建的内容
3. 审查并完善计划
4. 使用 Agent 模式按计划实施

## 避免常见错误

- **避免过于模糊**："改进这段代码" → "减少时间复杂度，从 O(n²) 优化到 O(n log n)"
- **避免一次要求太多**：拆分成多个聚焦的步骤
- **避免假设 AI 记得之前的上下文**：在新会话中重新提供相关背景

## 延伸阅读

- [最佳实践](/docs/copilot/best-practices)
- [聊天上下文](/docs/copilot/chat/context)
- [提示词(Prompt)编写技巧](/docs/copilot/chat/prompt-crafting)
