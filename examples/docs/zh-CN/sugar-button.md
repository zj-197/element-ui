## SugarButton 按钮
实用按钮

### 基础用法

基础的按钮用法。

:::demo 使用`type`、`plain`、`round`和`circle`属性来定义 SugarButton 的样式。

```html
<el-row>
  <el-sugar-button>默认按钮</el-sugar-button>
  <el-sugar-button type="primary" tooltip="我们不一样">hoverMe</el-sugar-button>
  <el-sugar-button type="success" tooltip-placement="bottom" tooltip="每个人都有不同的境遇">hoverMe</el-sugar-button>
  <el-sugar-button type="info" tooltip="我们不一样" popconfirm-title="确认删除吗">clickMe</el-sugar-button>
  <el-sugar-button type="warning" :auto-loading="true" @click="handleLoading">自动loading</el-sugar-button>
  <el-sugar-button type="danger">危险按钮</el-sugar-button>
   
  <el-sugar-button theme="#3a3bc2">自定义按钮</el-sugar-button>
</el-row>

<el-row>
  <el-sugar-button plain>朴素按钮</el-sugar-button>
  <el-sugar-button type="primary" plain>主要按钮</el-sugar-button>
  <el-sugar-button type="success" plain>成功按钮</el-sugar-button>
  <el-sugar-button type="info" plain>信息按钮</el-sugar-button>
  <el-sugar-button type="warning" plain>警告按钮</el-sugar-button>
  <el-sugar-button type="danger" plain>危险按钮</el-sugar-button>
  <el-sugar-button theme="#3a3bc2" plain>自定义按钮</el-sugar-button>
</el-row>

<el-row>
  <el-sugar-button round>圆角按钮</el-sugar-button>
  <el-sugar-button type="primary" round>主要按钮</el-sugar-button>
  <el-sugar-button type="success" round>成功按钮</el-sugar-button>
  <el-sugar-button type="info" round>信息按钮</el-sugar-button>
  <el-sugar-button type="warning" round>警告按钮</el-sugar-button>
  <el-sugar-button type="danger" round>危险按钮</el-sugar-button>
  <el-sugar-button theme="#3a3bc2" round>自定义按钮</el-sugar-button>  
</el-row>

<el-row>
  <el-sugar-button icon="el-icon-search" circle></el-sugar-button>
  <el-sugar-button type="primary" icon="el-icon-edit" circle></el-sugar-button>
  <el-sugar-button type="success" icon="el-icon-check" circle></el-sugar-button>
  <el-sugar-button type="info" icon="el-icon-message" circle></el-sugar-button>
  <el-sugar-button type="warning" icon="el-icon-star-off" circle></el-sugar-button>
  <el-sugar-button type="danger" icon="el-icon-delete" circle></el-sugar-button>
  <el-sugar-button theme="#3a3bc2" icon="el-icon-upload" circle></el-sugar-button>
</el-row>
<script>
    export default {
      methods: {
          handleLoading (openLoading, closeLoading, event) {
            openLoading();
            setTimeout(closeLoading, 1500)
          }
      }
    }
</script>
```
:::

### 禁用状态

按钮不可用状态。

:::demo 你可以使用`disabled`属性来定义按钮是否可用，它接受一个`Boolean`值。

```html
<el-row>
  <el-sugar-button disabled>默认按钮</el-sugar-button>
  <el-sugar-button type="primary" disabled>主要按钮</el-sugar-button>
  <el-sugar-button type="success" disabled>成功按钮</el-sugar-button>
  <el-sugar-button type="info" disabled>信息按钮</el-sugar-button>
  <el-sugar-button type="warning" disabled>警告按钮</el-sugar-button>
  <el-sugar-button type="danger" disabled>危险按钮</el-sugar-button>
  <el-sugar-button theme="#3a3bc2" disabled>自定义按钮</el-sugar-button>
</el-row>

<el-row>
  <el-sugar-button plain disabled>朴素按钮</el-sugar-button>
  <el-sugar-button type="primary" plain disabled>主要按钮</el-sugar-button>
  <el-sugar-button type="success" plain disabled>成功按钮</el-sugar-button>
  <el-sugar-button type="info" plain disabled>信息按钮</el-sugar-button>
  <el-sugar-button type="warning" plain disabled>警告按钮</el-sugar-button>
  <el-sugar-button type="danger" plain disabled>危险按钮</el-sugar-button>
  <el-sugar-button theme="#3a3bc2" plain disabled>自定义按钮</el-sugar-button>  
</el-row>
```
:::

### 文字按钮

没有边框和背景色的按钮。

:::demo
```html
<el-sugar-button type="text">文字按钮</el-sugar-button>
<el-sugar-button type="text" disabled>文字按钮</el-sugar-button>
```
:::

### 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置`icon`属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用`i`标签即可，可以使用自定义图标。

```html
<el-sugar-button type="primary" icon="el-icon-edit"></el-sugar-button>
<el-sugar-button type="primary" icon="el-icon-share"></el-sugar-button>
<el-sugar-button type="primary" icon="el-icon-delete"></el-sugar-button>
<el-sugar-button type="primary" icon="el-icon-search">搜索</el-sugar-button>
<el-sugar-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-sugar-button>
```
:::


### 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo 要设置为 loading 状态，只要设置`loading`属性为`true`即可。

```html
<el-sugar-button type="primary" :loading="true">加载中</el-sugar-button>
<el-sugar-button type="primary" theme="#3a3bc2" :loading="true">自定义按钮加载中</el-sugar-button>
```
:::

### 不同尺寸

SugarButton 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<el-row>
  <el-sugar-button>默认按钮</el-sugar-button>
  <el-sugar-button tooltip="我们不一样" size="medium" theme="#3a3bc2">中等按钮</el-sugar-button>
  <el-sugar-button tooltip="每个人都有不同得境遇" size="small" type="primary">小型按钮</el-sugar-button>
  <el-sugar-button size="mini" type="success">超小按钮</el-sugar-button>
</el-row>
<el-row>
  <el-sugar-button round>默认按钮</el-sugar-button>
  <el-sugar-button size="medium" round theme="#3a3bc2">中等按钮</el-sugar-button>
  <el-sugar-button size="small" round type="primary">小型按钮</el-sugar-button>
  <el-sugar-button size="mini" round type="success">超小按钮</el-sugar-button>
</el-row>
```
:::

### SugarButton Attributes
| 参数                | 说明                  | 类型      | 可选值       | 默认值   |
|-------------------|---------------------|---------|-------------  |-------- |
| auto-loading      | 是否自动loading         | boolean | — | — |
| tooltip           | tooltip组件的content   | string  | — | — |
| tooltip-placement | tooltip组件的placement | string  | — | — |
| popconfirm-title  | popconfirm组件的title  | string  | — | — |
| size              | 尺寸                  | string  |   medium / small / mini           |    —     |
| theme             | 自定义主题（16进制的颜色）      | string  |      —          |    —     |
| type              | 类型                  | string  |   primary / success / warning / danger / info / text |     —    |
| plain             | 是否朴素按钮              | boolean | — | false   |
| round             | 是否圆角按钮              | boolean | — | false   |
| circle            | 是否圆形按钮              | boolean | — | false   |
| loading           | 是否加载中状态             | boolean | — | false   |
| disabled          | 是否禁用状态              | boolean | —   | false   |
| icon              | 图标类名                | string  |  —  |  —  |
| autofocus         | 是否默认聚焦              | boolean |  —  |  false  |
| native-type       | 原生 type 属性          | string  | button / submit / reset | button |
| icon-loading-style | loading状态下的icon样式 | string/object/array | —                                                  |—|
| icon-loading-class | loading状态下的icon类  | string/object/array | —                                                  | — |

