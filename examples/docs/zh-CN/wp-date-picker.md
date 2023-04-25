
## WpDatePicker 维普日期选择器

用法与date-picker基本一致，增加了一些快捷选项来选择日期

###  禁用日期

内置了禁用当前时间之前或者之后的日期，分别传入`disabled`属性值 `before`或者`after`即可

:::demo 这个禁用规则使用于`type`所有的属性值
```html
<template>
  <div class="block">
    <span class="demonstration" style="margin-right: 10px">禁用之前的日期</span>
    <el-wp-date-picker
      v-model="value1"
      type="datetime"
      disabled="before">
    </el-wp-date-picker>
  </div>
  <div class="block" style="margin-top: 30px">
    <span class="demonstration" style="margin-right: 10px">禁用之后的日期</span>
    <el-wp-date-picker
      v-model="value2"
      align="right"
      type="week"
      disabled="after">
    </el-wp-date-picker>
    <el-button type="primary" @click="handleClick">查看周绑定的值</el-button>  
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value1: '',
        value2: [],
      };
    },
    methods: {
        handleClick () {
            alert(JSON.stringify(this.value2) + '\n说明：' + `[weekStartDate(选择周的开始日期), weekEndDate(选择周的结束日期), year(选择周所在的年份), number(选择周所在年份的第几周)]`)
        }
    }  
  };
</script>
```
:::

### Attributes
| 参数                       | 说明                                                             | 类型                                                                                                                                                                          | 可选值                          | 默认值                  |
|--------------------------|----------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------  |----------------------|
| value / v-model          | 绑定值                                                            | date(DatePicker) / array(DateRangePicker) / array(type=week) 当`type`等于week的时候，value的值为[weekStartDate(选择周的开始日期), weekEndDate(选择周的结束日期), year(选择周所在的年份), number(选择周所在年份的第几周)] | — | —                    |
| readonly                 | 完全只读                                                           | boolean                                                                                                                                                                     | — | false                |
| current-date-add-minutes | 当前时间往后或者往前延长多少取决于disabled=before还是after                        | number                                                                                                                                                                      | — | 0                    |
| week-value-format        | 选择周时的value绑定值的格式化(注意当传入的时间为字符串时(比如：2020-12-04 12:14:57)，此参数必传) | string                                                                                                                                                                      | 见[日期格式](#/zh-CN/component/date-picker#ri-qi-ge-shi) | yyyy-MM-dd           |
| disabled                 | 禁用                                                             | boolean                                                                                                                                                                     | — | false                |
| editable                 | 文本框可输入                                                         | boolean                                                                                                                                                                     | — | true                 |
| clearable                | 是否显示清除按钮                                                       | boolean                                                                                                                                                                     | — | true                 |
| size                     | 输入框尺寸                                                          | string                                                                                                                                                                      | large, small, mini | —                    |
| placeholder              | 非范围选择时的占位内容                                                    | string                                                                                                                                                                      | — | —                    |
| start-placeholder        | 范围选择时开始日期的占位内容                                                 | string                                                                                                                                                                      | — | —                    |
| end-placeholder          | 范围选择时结束日期的占位内容                                                 | string                                                                                                                                                                      | — | —                    |
| type                     | 显示类型                                                           | string                                                                                                                                                                      | year/month/date/dates/months/years week/datetime/datetimerange/ daterange/monthrange | date                 |
| format                   | 显示在输入框中的格式(这点将date-picker的`format`和`value-format`统一成`format`)  | string                                                                                                                                                                      | 见[日期格式](#/zh-CN/component/date-picker#ri-qi-ge-shi) | yyyy-MM-dd           |
| align                    | 对齐方式                                                           | string                                                                                                                                                                      | left, center, right | left                 |
| picker-options           | 当前时间日期选择器特有的选项参考下表                                             | object                                                                                                                                                                      |  — | {}                   |
| range-separator          | 选择范围时的分隔符                                                      | string                                                                                                                                                                      | — | '-'                  |
| default-value            | 可选，选择器打开时默认显示的时间                                               | Date                                                                                                                                                                        | 可被`new Date()`解析 | —                    |
| default-time             | 范围选择时选中日期所使用的当日内具体时刻                                           | string[]                                                                                                                                                                    | 数组，长度为 2，每项值为字符串，形如`12:00:00`，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 `00:00:00` | —                    |
| name                     | 原生属性                                                           | string                                                                                                                                                                      | — | —                    |
| unlink-panels            | 在范围选择器里取消两个日期面板之间的联动                                           | boolean                                                                                                                                                                     | — | false                |
| prefix-icon              | 自定义头部图标的类名                                                     | string                                                                                                                                                                      | — | el-icon-date         |
| clear-icon               | 自定义清空图标的类名                                                     | string                                                                                                                                                                      | — | el-icon-circle-close |
| validate-event           | 输入时是否触发表单的校验                                                   | boolean                                                                                                                                                                     | - | true                 |

### Picker Options
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| shortcuts | 设置快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表 | Object[] | — | — |
| disabledDate | 设置禁用状态，参数为当前日期，要求返回 Boolean | Function | — | — |
| cellClassName | 设置日期的 className | Function(Date) | — | — |
| firstDayOfWeek | 周起始日 | Number | 1 到 7 | 7 |
| onPick | 选中日期后会执行的回调，只有当 `daterange` 或 `datetimerange` 才生效 | Function({ maxDate, minDate }) | — | — |

### Shortcuts
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| text | 标题文本 | string | — | — |
| onClick | 选中后的回调函数，参数是 vm，可通过触发 'pick' 事件设置选择器的值。例如 vm.$emit('pick', new Date()) | function | — | — |

### Events
| 事件名称      | 说明    | 回调参数      |
|---------|--------|---------|
| change | 用户确认选定的值时触发 | 组件绑定值。格式与绑定值一致，可受 `value-format` 控制 |
| blur | 当 input 失去焦点时触发 | 组件实例 |
| focus | 当 input 获得焦点时触发 | 组件实例 |

### Methods
| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| focus | 使 input 获取焦点 | — |
