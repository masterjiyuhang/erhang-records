# 封面

- 标题：ChatGPT-Next-Web 本地演示与源码解析
- 副标题：本地跑通、现场 7 分钟 Demo + 技术要点
- 演讲者：你的名字 · 日期

**Speaker notes**
 简短自我介绍 10–15 秒，说明今天目标：把开源项目在本地跑通并演示关键能力（流式响应、切换模型、本地存储等），侧重前端工程实践与 Demo 可复现性。

# 为什么选 ChatGPT-Next-Web？

- 开源、社区活跃、文档完善
- 支持多 provider（OpenAI / Azure / 本地代理）
- 前端工程化好，易定制（PWA、导出、历史）
- 本地可跑，适合现场演示与教学

**Speaker notes**
 强调选这类项目的理由：能把工程化的前端实现（交互/体验/安全）与 AI 模型接入两个层面一起讲清楚，观众更容易理解前端在 AI 产品中的角色。



# 主要功能速览（界面截图/要点）

- 聊天对话（支持流式输出）
- prompt 模板与历史管理、本地导出
- 多 provider 配置（环境变量切换）
- PWA / 桌面打包（可选）

**Speaker notes**
 展示一张项目首页截图（或现场打开），指点主要 UI：输入框、消息区、侧栏的模板与设置。提醒：流式输出是体验的关键点。



# 高层架构（一页图）

- 前端（Next/React） — 渲染交互、管理 prompt 与本地存储
- Provider 层（OpenAI / Azure / 本地代理） — 实际调用模型 API
- 可选后端/代理（LocalAI / Ollama / Docker） — 支持离线/本地模型

**Speaker notes**
 用一张简单连线图解释数据流：用户输入 → 前端发请求 → provider 响应（流式）→ 前端渲染。强调“前端可插拔不同 provider”这一设计。



# 演示目标与时间安排

- 目标：本地启动项目并完成 7 分钟现场 Demo
- 时间分配（示例）：
  - 1 分钟：界面介绍
  - 1.5 分钟：一次流式问答示范
  - 1 分钟：切换 provider（示意）
  - 1 分钟：演示 prompt 模板 / 导出
  - 1.5 分钟：总结与 Q&A

**Speaker notes**
 给出明确 Demo 节奏，便于现场控制时间。提醒准备一段 30s 录屏作为备份。



# 环境准备（先决条件）

- Node.js（建议 v18+）与 npm/yarn/pnpm 任意一种包管理器
- Git、浏览器（Chrome 推荐）
- 一个有效的 `OPENAI_API_KEY`（或已准备好的本地模型代理地址）
- 可选：Docker（快速部署备选）

**Speaker notes**
 提示：不要在公开电脑上暴露你的 API Key。若不能访问云 API，可准备本地代理或录屏备份演示。



# 本地运行步骤（简明命令）

- 克隆仓库：`git clone https://github.com/Yidadaa/ChatGPT-Next-Web.git`
- 进入目录并安装依赖：`yarn install`（或 `npm install`）
- 新建 `.env` 并填写 `OPENAI_API_KEY`（或设置 `BASE_URL` 指向本地代理）
- 启动：`yarn dev` → 打开 http://localhost:3000

**Speaker notes**
 现场演示会按这组命令执行；把 `.env` 的关键字段示例放在下一页以便复制粘贴。



# `.env` 样例（放在一页）

```
# 最简单示例
OPENAI_API_KEY=sk-xxxxxx
CODE=your_access_password    # 可选：页面访问密码
BASE_URL=https://api.openai.com  # 或指向本地代理，比如 http://localhost:8080
```

**Speaker notes**
 说明更多 provider 的 env 名称在 README 中有说明（Azure、Anthropic、Google 等）。演示时常用的是直接填 `OPENAI_API_KEY`。

# 现场演示脚本（浏览器内行为）

- 演示一：输入问题并展示流式输出（例：解释 debounce 并给出 Vue 示例）
- 演示二：打开设置切换 provider（示意 .env 变化或在设置里切换）
- 演示三：选择 prompt 模板、使用“导出聊天”功能保存 Markdown

**Speaker notes**
 在每一步口播要点：为什么选择这个 prompt、流式输出如何改善用户体验、如何保证安全（不在 HTML 中直接运行未过滤的内容）。



# 安全、隐私与工程实践

- 不在公开电脑上保存 API Key；在生产环境用后端代理隐藏 Key
- 对 AI 生成的 HTML / JS 做严格过滤（避免 XSS）
- 流式和错误回退：给用户明确 loading 状态与超时提示
- 本地存储策略：加密敏感记录或提供“清除历史”功能

**Speaker notes**
 强调前端并非把模型当黑盒即可，工程中要考虑到可控性与审计（谁看过对话、如何导出/删除）。





# 常见问题与排查（现场可能遇到）

- `yarn dev` 报错：确认 Node 版本、删除 `node_modules` 重装、尝试 `yarn` 替代 `npm`。
- 401/403（API Key 问题）：Key 是否有效、限额是否用尽。
- 流式不生效：检查 provider 是否支持 streaming、代理是否转发 chunk。
- Docker 问题：查看 `docker logs` 获取错误信息。

**Speaker notes**
 给出快速 fix：如 `rm -rf node_modules yarn.lock && yarn`、或更换 key、或开启本地代理做离线 demo。

# 总结与资源

- 总结要点：开源、可本地跑、前端掌控体验是演示亮点
- 资源链接（放 GitHub 仓库地址、Docker 镜像）
- 备选：如果需要，我可以把本次幻灯片导出为 PPTX / 提供 30s demo 录屏素材

**Speaker notes**
 鼓励观众基于此仓库做二次开发（如接入公司内部模型、做风控策略、集成知识库）。

# Q&A（备用页）

- 常见延伸问题准备（如何接入企业知识库、如何做审计日志、如何在团队内部署）

**Speaker notes**
 准备 2–3 个常见问题的简短回答，便于现场互动环节快速回应。



# 终端演示脚本（逐条命令 + 预期输出 & 台上台词）

> 使用方式：把下面的命令逐条复制到终端运行。每条命令下方给出“预期输出示例”和“你在台上可以说的话”（台词建议），便于照本演出。实际输出会与本机环境、包版本不同，示例以常见输出为准。
>
> ## 1) 克隆仓库
>
> ```
> # 命令
> git clone https://github.com/Yidadaa/ChatGPT-Next-Web.git
> 
> # 台词建议
> “首先把项目克隆到本地。”
> ```
>
> **预期输出示例**
>
> ```
> Cloning into 'ChatGPT-Next-Web'...
> remote: Enumerating objects: 15000, done.
> remote: Counting objects: 100% (15000/15000), done.
> remote: Compressing objects: 100% (8000/8000), done.
> Receiving objects: 100% (15000/15000), 18.45 MiB | 1.23 MiB/s, done.
> ```
>
> ------
>
> ## 2) 进入目录
>
> ```
> # 命令
> cd ChatGPT-Next-Web
> 
> # 台词建议
> “进入仓库目录，准备安装依赖。”
> ```
>
> **预期输出示例**
>
> ```
> # 无输出或显示当前路径
> ```
>
> ------
>
> ## 3) 安装依赖（推荐 yarn）
>
> ```
> # 命令
> yarn install
> 
> # 台词建议
> “安装依赖，通常需要几秒到几分钟，取决于网络。”
> ```
>
> **预期输出示例（节选）**
>
> ```
> yarn install v1.22.19
> [1/4] 🔍  Resolving packages...
> [2/4] 🚚  Fetching packages...
> [3/4] 🔗  Linking dependencies...
> [4/4] 🔨  Building fresh packages...
> Done in 23.45s.
> ```
>
> **常见问题 & 解决台词**
>
> - 如果超时或失败：“遇到网络问题，可换 npm 或用国内镜像；也可以删掉 node_modules 与锁文件重试。”
>
> ------
>
> ## 4) 新建 `.env` 并写入 `OPENAI_API_KEY`（演示快捷方式）
>
> ```
> # 命令（交互式创建示例）
> cat > .env <<'EOF'
> OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
> CODE=demo_password
> BASE_URL=https://api.openai.com
> EOF
> 
> # 台词建议
> “把必需的环境变量写入 .env，主要是 OPENAI_API_KEY；在现场演示时请注意不要泄露真实 key。”
> ```
>
> **预期输出示例**
>
> ```
> # 命令没有输出，但 .env 文件已创建
> ```
>
> ------
>
> ## 5) 启动开发服务器
>
> ```
> # 命令
> yarn dev
> 
> # 台词建议
> “启动开发服务器，默认会在本机 3000 端口提供服务，接下来打开浏览器访问。”
> ```
>
> **预期输出示例（常见）**
>
> ```
> yarn run v1.22.19
> $ next dev
> ready - started server on http://localhost:3000
> info  - Loaded env from /path/to/ChatGPT-Next-Web/.env
> ```
>
> 或（若使用 Vite）
>
> ```
>   VITE v4.4.0  ready in 450 ms
> 
>   ➜  Local:   http://localhost:3000/
>   ➜  Network: use --host to expose
> ```
>
> **台词补充**
>  如果看到 `ready` 或 `Local: http://localhost:3000`，说明启动成功；若不是，请查看控制台报错并按下页的 Troubleshoot 处理步骤修复。
>
> ------
>
> ## 6) 在浏览器打开页面并演示（无终端命令）
>
> ```
> # 打开
> http://localhost:3000
> ```
>
> **台词建议（现场操作说明）**
>
> - “现在我们打开本地页面。界面包含消息区、输入框、模板和设置。”
> - 现场在输入框输入演示问题（示例 prompt）："请解释 debounce 的原理，并给出一个 Vue 3 的实现示例。"
>
> **预期视觉结果**
>
> - 聊天框出现用户的问题，随后模型开始**流式返回**内容（你会看到字符逐步出现而不是一次性加载）。代码段以高亮块显示。
>
> ------
>
> ## 7) 演示导出聊天 / 保存模板（在浏览器内操作）
>
> **台词建议**
>
> - “演示如何保存这个 prompt 为模板并导出聊天记录为 Markdown（或 JSON）供后续分析或审计。”
>
> **预期行为**
>
> - 在侧栏选择“导出”或“保存为模板”，浏览器会下载一个 `.md` 或 `.json` 文件。
>
> ------
>
> ## 8) 切换到本地模型（示意，需另启本地代理）
>
> ```
> # 仅示例：若你本地运行了 LocalAI / Ollama 或其他代理
> # 假设本地代理地址为 http://localhost:8080
> # 修改 .env（演示命令）
> sed -i '' 's|BASE_URL=.*|BASE_URL=http://localhost:8080|' .env
> # 或打开编辑器修改 .env
> 
> # 然后重启服务（Ctrl+C 停止，再次运行）
> yarn dev
> ```
>
> **台词建议**
>
> - “把 BASE_URL 指向本地代理后重启服务，前端会把请求发到本地模型。这样可以做到离线部署与隐私保护。”
>
> **预期输出**
>
> - 启动日志里会显示 `Loaded env from .env` 且请求会走本地地址（需在控制台或代理日志中看到请求记录）。
>
> ------
>
> ## 9) 演示失败时的快速修复命令（备用）
>
> ```
> # 删除依赖并重装（常用）
> rm -rf node_modules yarn.lock
> yarn install
> 
> # 查看容器日志（若用 Docker）
> docker logs <container_id> --follow
> ```
>
> **台词建议**
>
> - “现场如果出现依赖/环境异常，这两条命令通常能救场。并事先准备好录屏作为保险。”
>
> ------
>
> # 常见错误即时快速问答（台上话术）
>
> - **如果看到 401/403**：检查 OPENAI_API_KEY 是否有效或是否在账户里被禁用。
> - **如果端口被占用**：终止占用进程或在 `.env` 或运行命令里指定 `PORT=xxxx`。
> - **流式不工作**：确认 provider 支持流并且中间代理未把 chunk 聚合。
>
> ------
>
> # 额外提示（小技巧）
>
> - 演示前做一次完整演练（包括重启、断网、key 失效场景）
> - 准备一段 30s 录屏，放在最后一页以备现场 API 限制或网络问题
> - 在幻灯片里放上 `git clone`、`.env` 样例和 `yarn dev` 三行命令，观众一看就能复现