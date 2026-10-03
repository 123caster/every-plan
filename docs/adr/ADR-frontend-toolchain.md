# ADR：前端工具链基线

- 状态：已接受
- 日期：2026-10-03

## 决策

使用 React 19.3、TypeScript 6.0、Vite 8.3 和 pnpm 10.26.2。仓库采用 pnpm workspace，当前只有 `apps/web`，为以后增加共享 SDK、桌面壳和移动壳保留目录边界。

CI 使用 Windows runner、Node 24、`pnpm/action-setup@v6`、`actions/setup-node@v7` 和 `actions/checkout@v7`，执行 lint、typecheck、unit test、build，以及 Chrome / Edge 冒烟测试。

## 原因

- Node 24 满足 Vite 8 的运行要求。
- TypeScript 7 当天虽已发布，但 `typescript-eslint` 的稳定版本仍只声明支持 `<6.1`，因此锁定 6.0.3，避免无依据地越过兼容范围。
- 所有核心依赖使用精确版本并提交 `pnpm-lock.yaml`，保证本地与 CI 可复现。
- 现在不引入 Tauri 或 Capacitor，但业务代码禁止直接依赖 Node.js API。

## 后果

升级 TypeScript、Vite 或 pnpm 时必须先验证 lint、PWA 构建和 branded browser 测试。GitHub Actions 文件已经存在，但在未绑定远程仓库前不会自动运行。

