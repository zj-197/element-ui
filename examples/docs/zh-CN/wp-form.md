## WpForm 维普表单，多用于搜索
由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据，使用方式与form表单保持一致，新增了表单布局, 以及内置表单正则验证
### 布局

列数（col-count）和列之间的间隔（gutter），gutter单位固定为px（通过el-row，el-col实现）

:::demo 在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件，包括 Input、Select、Checkbox、Radio、Switch、DatePicker、TimePicker
```html
<el-wp-form ref="form" :model="form"
            :gutter="20"
            @search="onSubmit"
            size="medium"
            label-position="top"
            align="middle"
            :col-count="3" is-show-collapse>
  <!--  中文验证-->
  <el-wp-form-item label="活动名称" pattern="chinese" prop="name">
    <el-input v-model="form.name"></el-input>
  </el-wp-form-item>
  <el-wp-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-wp-form-item>
  <el-wp-form-item label="活动时间">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
  </el-wp-form-item>
  <el-wp-form-item label="即时配送">
    <el-switch v-model="form.delivery"></el-switch>
  </el-wp-form-item>
  <el-wp-form-item label="活动性质">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-wp-form-item>
  <el-wp-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-wp-form-item>
  <el-wp-form-item label="活动形式">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-wp-form-item>
</el-wp-form>
<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate((valid) => {
         if (valid) {
          alert('submit!');
         } else {
          console.log('error submit!!');
          return false;
         }
        })
      }
    }
  }
</script>
```
:::

:::tip
W3C 标准中有如下[规定](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2)：
> <i>When there is only one single-line text input field in a form, the user agent should accept Enter in that field as a request to submit the form.</i>

即：当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 `<el-form>` 标签上添加 `@submit.native.prevent`。
:::
### 横向排列

通过设置label-position和label-width即可实现label标签横向排列

:::demo 通过设置label-position和label-width即可实现label标签横向排列
```html
<el-wp-form ref="form" :model="form"
            :gutter="20"
            label-position="left"
            label-width="100px"
            align="top"
            :is-init-collapse="false"
            :col-count="3">
  <el-wp-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-wp-form-item>
  <el-wp-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-wp-form-item>
  <el-wp-form-item label="活动时间">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
  </el-wp-form-item>
  <el-wp-form-item label="即时配送">
    <el-switch v-model="form.delivery"></el-switch>
  </el-wp-form-item>
  <el-wp-form-item label="活动性质">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-wp-form-item>
  <el-wp-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-wp-form-item>
  <el-wp-form-item label="活动形式">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-wp-form-item>
</el-wp-form>
<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
```
:::
### 隐藏右边工具栏
将is-collapse，is-show-reset-btn，is-show-search-btn设置为false即可隐藏

:::demo 将is-collapse，is-show-reset-btn，is-show-search-btn设置为false即可隐藏
```html
<el-wp-form ref="form" :model="form"
            :gutter="20"
            @search="onSubmit"
            label-position="left"
            label-width="100px"
            :is-show-collapse="false"
            :is-show-reset-btn="false"
            :is-show-search-btn="false"
            :col-count="3">
  <el-wp-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-wp-form-item>
  <el-wp-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-wp-form-item>
  <el-wp-form-item label="活动时间">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
  </el-wp-form-item>
  <el-wp-form-item label="即时配送">
    <el-switch v-model="form.delivery"></el-switch>
  </el-wp-form-item>
  <el-wp-form-item label="活动性质">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-wp-form-item>
  <el-wp-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-wp-form-item>
  <el-wp-form-item label="活动形式">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-wp-form-item>
</el-wp-form>
<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        
      }
    }
  }
</script>
```
:::
### 设置工具栏插槽
如果想自定义工具栏可以通过actions插槽实现

:::demo 如果想自定义工具栏可以通过actions插槽实现
```html
<el-wp-form ref="form" :model="form"
            :gutter="20"
            label-position="left"
            label-width="100px"
            :is-show-collapse="false"
            :is-show-reset-btn="false"
            :is-show-search-btn="false"
            :col-count="3">
  <el-wp-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-wp-form-item>
  <el-wp-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-wp-form-item>
  <el-wp-form-item label="活动时间">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
  </el-wp-form-item>
  <el-wp-form-item label="即时配送">
    <el-switch v-model="form.delivery"></el-switch>
  </el-wp-form-item>
  <el-wp-form-item label="活动性质">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-wp-form-item>
  <el-wp-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-wp-form-item>
  <el-wp-form-item label="活动形式">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-wp-form-item>
  <template slot="actions">
      <el-button type="primary" icon="el-icon-plus">新增</el-button>
  </template>
</el-wp-form>
<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
```
:::
### 表单验证
内置了一些常用的正则验证传入pattern即可, pattern可选值见下方

:::demo 内置了一些常用的正则验证传入pattern即可
```html
<el-wp-form ref="form" :model="form"
            :gutter="20"
            label-position="left"
            label-width="140px"
            :is-show-collapse="false"
            :is-show-reset-btn="false"
            :is-show-search-btn="false"
            :col-count="1">
 <el-wp-form-item label="活动名称" prop="name" :validator="validatorName">
  <el-input v-model="form.name"></el-input>
 </el-wp-form-item>
 <el-wp-form-item label="活动联系电话" required prop="phone" pattern="mobile">
  <el-input v-model="form.phone"></el-input>
 </el-wp-form-item>
 <el-wp-form-item label="活动联系邮箱" required prop="email" pattern="email">
  <el-input v-model="form.email"></el-input>
 </el-wp-form-item>
 <el-wp-form-item label="活动金额" prop="money" pattern="money">
  <el-input v-model="form.money"></el-input>
 </el-wp-form-item>
  <el-wp-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-wp-form-item>
  <el-wp-form-item prop="date" label="活动时间" value-type="array" required>
      <el-date-picker type="daterange" placeholder="选择日期" v-model="form.date"></el-date-picker>
  </el-wp-form-item>
  <el-wp-form-item label="即时配送" tooltip="提供接送服务">
    <el-switch v-model="form.delivery"></el-switch>
  </el-wp-form-item>
  <el-wp-form-item label="活动性质" value-type="array" required prop="type">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-wp-form-item>
  <el-wp-form-item label="特殊资源" tooltip="活动有哪些资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-wp-form-item>
  <el-wp-form-item label="活动描述">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-wp-form-item>
 <el-wp-form-item>
  <el-button type="primary" @click="onSubmit">提 交</el-button>
 </el-wp-form-item>
</el-wp-form>
<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          phone: '',
          email: '',
          money: '',
          date: [],
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(valid => {
            if (valid) {
                alert('submit')
            }
        })
      },
     validatorName (rule, value, callback) {
       if (/^维普/.test(value)) {
          callback();
       } else {
        return callback(new Error('活动名称须以维普开头'));
       }
     }
    }
  }
</script>
```
:::

### Wp-Form New Attributes 新增的prop

| 参数                 | 说明          | 类型            | 可选值                   | 默认值   |
|--------------------|-------------|---------------|-----------------------|-------|
| col-count          | 表单列数        | number/string | —                     | 3     |
| gutter             | 表单每列间隔      | number/string | —                     | 20    |
| is-show-reset-btn  | 是否显示重置按钮    | boolean       | —                     | true  |
| reset-btn-text     | 重置按钮文字      | string        | —                     | 重 置   |
| is-show-search-btn | 是否展示搜索按钮    | boolean       | —                     | true  |
| search-btn-text    | 搜索按钮文字      | string        | —                     | 搜 索   |
| is-show-collapse   | 是否显示展开收起    | boolean       | —                     | true  |
| is-init-collapse   | 初始默认值是否为收起  | boolean       | —                     | true  |
| collapse-text      | 收起文字        | string        | —                     | 收起    |
| spread-text        | 展开文字        | string        | —                     | 展开    |
| align              | 垂直方向对齐方式    | string        | top/middle/bottom     | top   |
| search-btn-props   | 搜索按钮props配置 | object        |  —    | —   |
| reset-btn-props    | 重置按钮props配置 | object        |  —    | —   |

### Form Attributes

| 参数                      | 说明                                                           | 类型            | 可选值                   | 默认值   |
|-------------------------|--------------------------------------------------------------|---------------|-----------------------|-------|
| model                   | 表单数据对象                                                       | object        | —                     | —     |
| rules                   | 表单验证规则                                                       | object        | —                     | —     |
| inline                  | 行内表单模式                                                       | boolean       | —                     | false |
| label-position          | 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 `label-width`            | string        | right/left/top        | top   |
| label-width             | 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 `auto`。 | string        | —                     | —     |
| label-suffix            | 表单域标签的后缀                                                     | string        | —                     | —     |
| hide-required-asterisk  | 是否隐藏必填字段的标签旁边的红色星号                                           | boolean       | —                     | false |
| show-message            | 是否显示校验错误信息                                                   | boolean       | —                     | true  |
| inline-message          | 是否以行内形式展示校验信息                                                | boolean       | —                     | false |
| status-icon             | 是否在输入框中显示校验结果反馈图标                                            | boolean       | —                     | false |
| validate-on-rule-change | 是否在 `rules` 属性改变后立即触发一次验证                                    | boolean       | —                     | true  |
| size                    | 用于控制该表单内组件的尺寸                                                | string        | medium / small / mini | —     |
| disabled                | 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效             | boolean       | —                     | false |

### Wp-Form Slot
| name    | 说明       |
|---------|----------|
| —       | Form 的内容 |
| actions | 工具栏内容    |

### Wp-Form Methods

| 方法名      | 说明                                                                                     | 参数
|---------- |----------------------------------------------------------------------------------------| --------------
| validate | 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise | Function(callback: Function(boolean, object))
| validateField | 对部分表单字段进行校验的方法                                                                         | Function(props: array \| string, callback: Function(errorMessage: string))
| resetFields | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果                                                          | —
| clearValidate | 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果                             | Function(props: array \| string)
| openResetting | 打开重置按钮loading                                                                          | Function()
| closeResetting | 关闭重置按钮loading                                                                          | Function()
| openSearching | 打开搜索按钮loading                                                                          | Function()
| closeSearching | 关闭搜索按钮loading                                                                          | Function()

### Wp-Form Events
| 事件名称     | 说明                 | 回调参数                                                |
|----------|--------------------|-----------------------------------------------------|
| validate | 任一表单项被校验后触发        | 被校验的表单项 prop 值，校验是否通过，错误消息（如果存在）                    |
| reset    | 重置按钮点击（重置按钮显示的情况下） | openResetting（打开按钮loading）, closeResetting（关闭按钮loading） |
| search   | 搜索按钮点击（搜索按钮显示的情况下） | openSearching（打开按钮loading）, closeSearching（关闭按钮loading） |

### Wp-Form-Item Attributes

| 参数                | 说明                                                   | 类型            | 可选值                                     | 默认值    |
|-------------------|------------------------------------------------------|---------------|-----------------------------------------|--------|
| prop              | 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 | string        | 传入 Form 组件的 `model` 中的字段                | —      |
| label             | 标签文本                                                 | string        | —                                       | —      |
| pattern           | 内置正则验证的key                                           | string/RegExp | —  详见下面pattern可选值                       | —      |
| pattern-msg       | 内置正则验证的key对应的message                                 | string        | —                         | —      |
| tooltip           | tooltip的content提示文字                                  | string        | —            详见tool-tip                 | bottom |
| tooltip-placement | tooltip的placement                                    | string        | —                                       | —      |
| validator         | 验证函数                                                 | function      | —                                       | —      |
| value-type        | 绑定值的类型                                               | string        | string/number/boolean/array/object/date | string |
| label-width       | 表单域标签的的宽度，例如 '50px'。支持 `auto`。                       | string        | —                                       | —      |
| required          | 是否必填，如不设置，则会根据校验规则自动生成                               | boolean       | —                                       | false  |
| rules             | 表单验证规则                                               | object        | —                                       | —      |
| error             | 表单域验证错误信息, 设置该值会使表单验证状态变为`error`，并显示该错误信息            | string        | —                                       | —      |
| show-message      | 是否显示校验错误信息                                           | boolean       | —                                       | true   |
| inline-message    | 以行内形式展示校验信息                                          | boolean       | —                                       | false  |
| size              | 用于控制该表单域下组件的尺寸                                       | string        | medium / small / mini                   | -      |

### Wp-Form-Item pattern 可选值
| key          | 说明（所有验证均可为空）                                 |
|--------------|----------------------------------------------|
| number       | 只能输入数字                                       |
| mobile       | 手机号                                          |
| email        | 邮箱                                           |
| strongPasswd | 密码强度校验，长度6-12位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符 |
| middlePasswd | 密码强度校验，长度6-12位，同时包含大小写字母及数字                  |
| weakPasswd   | 密码强度校验，长度6-12位，由大小写字母或数字组成                   |
| number10     | 十进制数字，比如 12.00, 12, 12.22                    |
| landline     | 固定电话 比如 86-10-66778899                       |
| code         | 6位验证码                                        |
| code4        | 4位验证码                                        |
| chinese      | 中文                                           |
| letter       | 字母 比如 a, A, B, c                             |
| money        | 金额                                           |
| card         | 身份证                                          |
| enOrNum      | 字母或者数字                                       |
| url          | 链接地址                                         |

### Wp-Form-Item Slot
| name | 说明 |
|------|--------|
| — | Form Item 的内容 |
| label | 标签文本的内容 |

### Wp-Form-Item Scoped Slot
|  name  |   说明  |
|--------|--------|
|  error | 自定义表单校验信息的显示方式，参数为 { error } |

### Wp-Form-Item Methods

| 方法名      | 说明                         | 参数
|---------- |----------------------------| --------------
| resetField | 对该表单项进行重置，将其值重置为初始值并移除校验结果 | -
| clearValidate | 移除该表单项的校验结果                | -
| emitChange | 自定义验证发送change事件让form表单重新验证 | -
| emitBlur | 自定义验证发送blur事件让form表单重新验证   | -
