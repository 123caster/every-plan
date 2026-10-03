# ADR：P0 浏览器范围

- 状态：已接受
- 日期：2026-10-03

## 决策

Demo 首批正式支持 Chrome Stable 和 Edge Stable，Playwright 分别使用 `channel: chrome` 与 `channel: msedge`。开发快速回归另设 Chromium 项目，但不能把 Chromium 结果冒充成品牌浏览器结果。

Firefox、WebKit/Safari 和移动端真实浏览器在 P0 后续验证，发现差异后再决定 polyfill 和降级策略。

## 当前机器证据

- Edge：已安装并用于真实 P0 冒烟验证。
- Chrome：未在常见安装路径和系统 App Paths 中发现，因此本机品牌 Chrome 验证保持“未执行”。

CI 使用 `windows-latest` 的预装品牌浏览器运行 Chrome / Edge 项目；若镜像浏览器发生变化，测试应明确失败。

