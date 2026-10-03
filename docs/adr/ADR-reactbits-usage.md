# ADR：ReactBits 使用边界

- 状态：已接受
- 日期：2026-10-03

## 决策

ReactBits 只作为背景、页面过渡和微交互的设计参考与可复制源码来源，不作为运行时 UI 框架。P0 的 `AmbientGlow` 和 `PageTransition` 使用平台 CSS 变量并由仓库持有源码；关闭效果后，内容、按钮和焦点顺序完全不变。

ReactBits 官方采用 copy-paste / CLI 方式提供可定制组件，这与“源码归应用所有”的边界一致。当前没有直接复制某个 ReactBits 组件，因此不引入其额外依赖；后续若复制正式组件，必须在文件中保留来源和许可说明。

## 约束

- `prefers-reduced-motion` 或用户选择“减少”时禁用非必要动画。
- 效果层必须 `pointer-events: none`，不能遮挡任务。
- 不用 ReactBits 替代任务卡、表单、日历、权限项和焦点管理。
- 性能不足或加载失败时采用静态降级。

参考：<https://github.com/DavidHDev/react-bits>

