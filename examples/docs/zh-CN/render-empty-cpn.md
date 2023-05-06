## RenderEmptyCpn 空组件渲染
用于空组件的渲染

### 基础用法
:::demo

```html
<template>
    <el-render-empty-cpn :render-fn="renderFn"/>
</template>

<script>
    export default {
        methods: {
            renderFn (h) {
                return <span>我们不一样</span>
            }
        }
    }
</script>
```

:::
### RenderEmptyCpn Attributes
| 参数        | 说明   | 类型       | 可选值       | 默认值   |
|-----------|------|----------|-------------  |-------- |
| render-fn | 渲染函数 | Function | — | — |
