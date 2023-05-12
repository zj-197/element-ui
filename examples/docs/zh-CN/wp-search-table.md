## WpSearchTable 维普搜索表格

将wp-form和wp-table结合，通过JSON配置即可生成查询表格

### 基本使用

配置columns以及loadData

:::demo 配置`columns`，传入wp-el-table的`load-data`即可, 注意`columns`配置中的组件tag，必须为全局组件或者为原生标签（div, span等）

```html

<template>
    <div>
        <el-wp-search-table
                size="medium"
                row-key="id"
                :columns="columns"
                :load-data="getList">
            <template slot="actions" slot-scope="{row}">
                <el-button type="primary" icon="el-icon-edit" size="medium" @click="edit(row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="medium" @click="del(row)">删除</el-button>
            </template>
            <template slot="toolbar-prefix">
                <el-button type="primary" size="medium" icon="el-icon-plus">新增</el-button>
                <el-button type="danger" size="medium" icon="el-icon-delete">删除</el-button>
            </template>
        </el-wp-search-table>
    </div>
    
</template>

<script>
    // import {ElWpSearchTable} from "wp-element-ui";
    // const columns =  ElWpSearchTable.defineColumnsConfig([{}]) 这样可以获得更好的代码提示
    export default {
        data() {
            return {
                columns: [
                    {
                        prop: 'id',
                        label: 'id',
                        tagInitValue: '', // tag中的默认值
                        hiddenInTable: true, // 在表格中隐藏
                        tag: 'el-input',
                        pattern: 'number',
                        required: true // 必填
                    },
                    {
                        prop: 'name',
                        label: '姓名',
                        tag: 'el-input',
                        hiddenInForm: true // 在表单中隐藏
                    },
                    {
                        prop: 'nick_name',
                        tagInitValue: '张三', // tag中的默认值
                        tag: 'el-input',
                        formItemProps: {label: '表单中的昵称'},
                        columnProps: {label: '表格中的昵称'},
                        pattern: 'chinese' // 正则校验
                    },
                    {
                        prop: 'address',
                        label: '地址',
                        tag: 'el-select',
                        tagInitValue: 'cq',
                        tagProps: {optionData: [{label: '重庆', value: 'cq'}, {label: '上海', value: 'sh'}]}
                    },
                    {
                        prop: 'sex',
                        label: '性别',
                        tag: 'el-radio-group',
                        tagProps: {optionData: [{label: '男', value: 'male'}, {label: '女', value: 'female'}]}
                    },
                    {
                        prop: 'mobile',
                        label: '手机号',
                        tag: 'el-input'
                    },
                    {
                        prop: 'card',
                        label: '身份证',
                        tag: 'el-input'
                    },
                    {
                        prop: 'actions',
                        hiddenInForm: true,
                        label: '操作',
                        width: 220,
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            getList(searchParams, formatSearchParams) {
                alert(`这是searchParams：${JSON.stringify(searchParams)}，这是formatSearchParams：${JSON.stringify(formatSearchParams)}`)
                const {page, pageSize} = searchParams
                return new Promise((resolve, reject) => {
                    // 模拟后端数据
                    setTimeout(() => {
                        const list = Array.from({length: pageSize}, (_, i) => {
                            const index = ((page - 1) * pageSize) + (i + 1)
                            return {
                                id: Math.floor(Math.random() * 10000),
                                nick_name: '昵称' + index,
                                address: '重庆' + Math.random() > 0.5 ? '渝北' : '江北',
                                sex: {text: Math.random() > 0.5 ? '女' : '男'},
                                mobile: (Math.random() * Math.pow(10, 11)).toString(),
                                card: (Math.random() * Math.pow(10, 18)).toString(),
                                name: Math.random() > 0.4 ? '张三' : '李四'
                            }
                        })
                        if (page < 5) {
                            resolve({
                                total: 100,
                                page: page,
                                pageSize: pageSize,
                                list
                            })
                        } else {
                            reject([])
                        }
                    }, 3000)
                })
            },
            edit(row) {
                console.log(row, 'bianji')
            },
            del(row) {
                console.log(row, '删除')
            }
        }
    }
</script>
```
:::

### 多选表格

传入el-wp-table中的`max-select`即可

:::demo 当传入`max-select`属性后，可通过调用`this.$refs.wpSearchTable.getSelected()`方法来获取选择的`row-key`的集合

```html

<template>
    <el-wp-search-table
            size="medium"
            ref="wpSearchTable"
            row-key="id"
            label-position="left"
            label-width="110px"
            :col-count="2"
            :max-select="5"
            :is-init-collapse="false"
            :columns="columns"
            :load-data="getList">
    </el-wp-search-table>
</template>

<script>

    export default {
        data() {
            return {
                columns: [
                    {
                        prop: 'id',
                        label: 'id',
                        tagInitValue: '',
                        hiddenInTable: true, // 在表格中隐藏
                        tag: 'el-input',
                        pattern: 'number',
                        required: true // 必填
                    },
                    {
                        prop: 'name',
                        label: '姓名',
                        tag: 'el-input',
                        hiddenInForm: true // 在表单中隐藏
                    },
                    {
                        prop: 'major',
                        label: '专业',
                        tag: 'el-cascader',
                        hiddenInTable: true,
                        tagProps: {
                            optionData: function () {
                                return new Promise(resolve => {
                                    setTimeout(() => {
                                        resolve([
                                            {
                                                label: '重庆大学',
                                                value: 'cqdx',
                                                children: [
                                                    {
                                                        label: '马克思主义学院',
                                                        value: 'mks',
                                                        children: [{label: '政治', value: 'zz'}]
                                                    },
                                                    {
                                                        label: '信息工程学院',
                                                        value: 'xxgg',
                                                        children: [{label: '计算机应用', value: 'jsjyy'}]
                                                    }
                                                ]
                                            }
                                        ])
                                    }, 1000)
                                })
                            },
                            triggerMethod: 'focus'
                        }
                    },
                    {
                        prop: 'nick_name',
                        tagInitValue: '张三',
                        tag: 'el-input',
                        formItemProps: {label: '表单中的昵称'},
                        columnProps: {label: '表格中的昵称'},
                        pattern: 'chinese' // 正则校验
                    },
                    {
                        prop: 'address',
                        label: '地址',
                        tag: 'el-select',
                        tagInitValue: 'cq',
                        tagProps: {optionData: [{label: '重庆', value: 'cq'}, {label: '上海', value: 'sh'}]}
                    },
                    {
                        prop: 'sex',
                        label: '性别',
                        tag: 'el-radio-group',
                        tagProps: {optionData: [{label: '男', value: 'male'}, {label: '女', value: 'female'}]}
                    },
                    {
                        prop: 'mobile',
                        label: '手机号',
                        tag: 'el-input'
                    },
                    {
                        prop: 'card',
                        label: '身份证',
                        tag: 'el-input'
                    }
                ]
            }
        },
        methods: {
            getList(searchParams, formatSearchParams) {
                const {page, pageSize} = formatSearchParams
                return new Promise((resolve, reject) => {
                    // 模拟后端数据
                    setTimeout(() => {
                        const list = Array.from({length: pageSize}, (_, i) => {
                            const index = ((page - 1) * pageSize) + (i + 1)
                            return {
                                id: Math.floor(Math.random() * 10000),
                                nick_name: '昵称' + index,
                                address: '重庆' + Math.random() > 0.5 ? '渝北' : '江北',
                                sex: {text: Math.random() > 0.5 ? '女' : '男'},
                                mobile: (Math.random() * Math.pow(10, 11)).toString(),
                                card: (Math.random() * Math.pow(10, 18)).toString(),
                                name: Math.random() > 0.4 ? '张三' : '李四'
                            }
                        })
                        if (page < 5) {
                            resolve({
                                total: 100,
                                page: page,
                                pageSize: pageSize,
                                list
                            })
                        } else {
                            reject([])
                        }
                    }, 3000)
                })
            },
            // 获取选择的
            getSelected() {
                this.$refs.wpSearchTable.getSelected()
            },
            // 获取el-wp-table实例
            getTableInstance() {
                const instance = this.$refs.wpSearchTable.getTableInstance()
            },
            // 获取form表单实例
            getFormInstance() {
                const instance = this.$refs.wpSearchTable.getFormInstance()
            }
        }
    }
</script>
```
:::

### WpSearchTable Attributes

| 参数               | 说明                                                                                                                                                       | 类型                                                                                                 | 可选值            | 默认值                                                              |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|----------------|------------------------------------------------------------------|
| load-data        | 必传，加载数据的函数须返回一个promise                                                                                                                                   | Function:promise<{list: Array, page: Number, pageSize: Number, total: Number}>                     | —              | —                                                                |
| columns          | 列配置对象                                                                                                                                                    | Array`<Columns>` 详情见[Columns Type 配置对象](#/zh-CN/component/wp-search-table#columns-type) | —              | —                                                                |
| pagination-key   | 分页相关key，比如服务端返回的是{page: 1, pageSize: 20, list: [{}], total: 100 }, 那么paginationKey就是: {page: 'page', pageSize: 'pageSize', total: 'total', list: 'list'} | object                                                                                             | —              | {page: 'page', pageSize: 'pageSize', total: 'total', list: 'list'} |
| page-size        | 每页条数                                                                                                                                                     | number                                                                                             | —              | 10                                                               |                                                        |
| max-select       | 表格最大选择数量，传入之后表格可多选                                                                                                                                       | number                                                                                             | —              |                                                                  |
| table-props      | el-wp-table的props属性, 详见el-wp-table Attributes                                                                                                            | object                                                                                             | —              |                                                                  |
| form-props       | el-wp-form的props属性, 详见el-wp-form Attributes                                                                                                              | object                                                                                             | —              |                                                                  |
| label-position   | el-wp-form的`label-position` label的排列方式                                                                                                                   | string                                                                                             | left/right/top | top                                                              |
| label-width      | el-wp-form的`label-width` label的宽度                                                                                                                        | string                                                                                             | —              |  —                                                                |
| is-init-collapse | el-wp-form的`is-init-collapse`属性, 初始默认值是否为收起                                                                                                              | boolean                                                                                            | —                     | true  |
| auto-scroll-top  | 点击分页时是否自动滚动到顶部                                                                                                                                           | boolean                                                                                            | —                     | true  |

### Columns Type

| 参数            | 说明                                                  | 类型                           | 可选值              | 默认值    |
|---------------|-----------------------------------------------------|------------------------------|------------------|--------|
| tag           | 搜索表单项的组件tag(需要为全局注册过的组件), eg: `el-input`, `el-select` .... | string                       | —                | —      |
| tagProps      | tag组件的props配置对象                                     | object                       | —                | —      |
| label         | 搜索表单项，以及表格列的label                                   | string                       | —                | —      |
| prop          | 搜索表单项，以及表格列的prop                                    | string                       | —                | —      |                                                        |
| formItemProps | 搜索表单项`el-form-item`的props属性                         | object                       | —                | —      |
| columnProps   | 该表格列`el-table-column`的props属性                       | object                       | —                | —      |
| tagInitValue  | 搜索表单项组件的默认值                                         | string/number/object/boolean | —                |        |
| pattern       | 表单项验证的pattern，即`el-wp-form-item`的pattern            | RegExp/string                | —                 |        |
| hiddenInForm  | 是否在搜索表单中隐藏该项                                        | boolean                      | —                | —      |
| hiddenInTable | 是否在表格当中隐藏该列                                         | boolean                      | —                | —      |
| required      | 表单项是否必填                                             | boolean                      | —                | —      |
| align         | 该表格列横向对齐方式                                          | string                       | left/center/right | center |
| width         | 该表格列的宽度                                             | string                       | —                | — |
| minWidth      | 该表格列的最小宽度                                           | string                       | —                | — |
| formatter     | 该表格列的`formatter`函数                                  | Function                     | —                | — |

### WpSearchTable Slot

| name        | 说明  |
|-------------|-----|
| toolbar-suffix | 插入工具栏后面的内容                                                               |
| toolbar-prefix | 插入工具栏前面的内容                                                               |

### WpSearchTable SlotScoped

| name   | 说明                                                                             |
|--------|--------------------------------------------------------------------------------|
| `prop` | 自定义列的内容，插槽名为`columns`配置中的prop, 或columnProps中的prop, 参数为 { row, column, $index } |

### WpSearchTable Methods

| 方法名              | 说明                       | 参数                          |
|------------------|--------------------------|-----------------------------|
| getSelected      | 获取当前选择的行`传入max-select`生效 |   |
| getTableInstance | 获取el-wp-table实例          |   |
| getFormInstance  | 获取el-wp-form实例           |   |
