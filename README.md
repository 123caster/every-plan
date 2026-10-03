# Every Plan

Every Plan 是一个以个人使用为中心、同时向开发者开放插件能力的任务与日历应用。当前仓库只完成了 **批次 A：P0 技术验证与设计系统基线**，不是完整 V1。

## 当前可运行能力

- React 19 + TypeScript 6 + Vite 8 的正式前端骨架。
- Obsidian Mint、Ivory Editorial、Midnight Aura 三套主题。
- 90%、100%、115%、130% 四档字号，以及三种独立密度。
- IndexedDB v2，本地任务与设备偏好可持久化。
- Zustand + TanStack Query + React Hook Form 的状态、缓存和表单切片。
- 任务优先周日历：工作周/完整周、指针拖动、键盘移动、时长调整。
- PWA 应用壳、显式更新确认与离线重新打开。
- Chrome / Edge Playwright 工程配置；其他浏览器留到 P0 后续验证。

## 本地运行

要求 Node.js 24 和 pnpm 10.26.2：

```powershell
cd D:\ouyang\Projects\every-plan
pnpm install
pnpm dev
```

默认地址：`http://127.0.0.1:5173/`。

## 质量命令

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter web test:e2e:edge
pnpm --filter web test:e2e:chrome
```

`test:e2e:chrome` 和 `test:e2e:edge` 使用本机正式浏览器通道。若本机未安装对应浏览器，命令会明确失败，不会用其他浏览器冒充通过。默认 `pnpm test:e2e` 使用 Playwright Chromium，适合开发中的快速回归。

## 目录

```text
every-plan/
├─ apps/web/          React / Vite / PWA 前端
├─ docs/adr/          P0 技术决策记录
├─ .github/workflows/ CI 配置（绑定远程仓库后自动生效）
└─ pnpm-workspace.yaml
```

## 设计与实施边界

- 当前数据只保存在本机浏览器；没有真实账号、Spring Boot API 或云同步。
- PWA 更新由用户确认后执行，不在编辑过程中强制刷新。
- ReactBits 方向只用于背景和页面过渡，任务、表单、日历和焦点管理保持平台自有实现。
- 后续批次依次进入个人任务最小闭环、周日历正式页、插件与导入工作台。

