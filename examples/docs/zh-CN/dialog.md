## Dialog 对话框
在保留当前页面状态的情况下，告知用户并承载相关操作。

### 基本用法

Dialog 弹出一个对话框，适合需要定制性更大的场景，内置了footer，

:::demo 需要设置`visible`属性，它接收`Boolean`，当为`true`时显示 Dialog。Dialog 分为两个部分：`body`和`footer`，`footer`需要具名为`footer`的`slot`。`title`属性用于定义标题，它是可选的，默认值为空。另外，指定属性`is-drag`为`true`, 还可以对其进行拖动，最后，本例还展示了`before-close`的用法。

```html
<el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

<el-dialog
  title="离骚"
  :visible.sync="dialogVisible"
  width="60%"
  center
  is-drag
  @confirm="onConfirm"
  :before-close="handleClose">
  <template slot-scope="{bodyHeight}">
    <el-scrollbar :view-style="[{height: bodyHeight}]" ref="scrollbar">
        <el-button type="primary" @click="handleSkip" size="medium">跳转指定位置</el-button>
        <pre style="margin: 0; padding: 0">
                       离骚 
            
              【作者】屈原 【朝代】先秦
            
            帝高阳之苗裔兮，朕皇考曰伯庸。

            摄提贞于孟陬兮，惟庚寅吾以降。

            皇览揆余初度兮，肇锡余以嘉名。

            名余曰正则兮，字余曰灵均。

            纷吾既有此内美兮，又重之以修能。

            扈江离与辟芷兮，纫秋兰以为佩。

            汩余若将不及兮，恐年岁之不吾与。

            朝搴阰之木兰兮，夕揽洲之宿莽。

            日月忽其不淹兮，春与秋其代序。

            惟草木之零落兮，恐美人之迟暮。

            不抚壮而弃秽兮，何不改乎此度？

            乘骐骥以驰骋兮，来吾道夫先路！

            昔三后之纯粹兮，固众芳之所在。

            杂申椒与菌桂兮，岂惟纫夫蕙茝！

            彼尧、舜之耿介兮，既遵道而得路。

            何桀纣之昌披兮，夫唯捷径以窘步。

            惟夫党人之偷乐兮，路幽昧以险隘。

            岂余身之惮殃兮，恐皇舆之败绩。

            忽奔走以先后兮，及前王之踵武。

            荃不查余之中情兮，反信谗而齌怒。

            余固知謇謇之为患兮，忍而不能舍也。
            

            指九天以为正兮，夫唯灵修之故也。

            曰黄昏以为期兮，羌中道而改路。

            初既与余成言兮，后悔遁而有他。

            余既不难夫离别兮，伤灵修之数化。

            余既滋兰之九畹兮，又树蕙之百亩。

            畦留夷与揭车兮，杂杜衡与芳芷。

            冀枝叶之峻茂兮，愿俟时乎吾将刈。

            虽萎绝其亦何伤兮，哀众芳之芜秽。

            众皆竞进以贪婪兮，凭不厌乎求索。

            羌内恕己以量人兮，各兴心而嫉妒。

            忽驰骛以追逐兮，非余心之所急。

            老冉冉其将至兮，恐修名之不立。

            朝饮木兰之坠露兮，夕餐秋菊之落英。

            苟余情其信姱以练要兮，长顑颔亦何伤。

            掔木根以结茝兮，贯薜荔之落蕊。

            矫菌桂以纫蕙兮，索胡绳之纚纚。

            謇吾法夫前修兮，非世俗之所服。

            虽不周于今之人兮，愿依彭咸之遗则。

            长太息以掩涕兮，哀民生之多艰。

            余虽好修姱以鞿羁兮，謇朝谇而夕替。

            既替余以蕙纕兮，又申之以揽茝。

            亦余心之所善兮，虽九死其犹未悔。

            怨灵修之浩荡兮，终不察夫民心。

            众女嫉余之蛾眉兮，谣诼谓余以善淫。

            固时俗之工巧兮，偭规矩而改错。

            背绳墨以追曲兮，竞周容以为度。

            忳郁邑余侘傺兮，吾独穷困乎此时也。

            宁溘死以流亡兮，余不忍为此态也。

            鸷鸟之不群兮，自前世而固然。

            何方圜之能周兮，夫孰异道而相安？

            屈心而抑志兮，忍尤而攘诟。

            伏清白以死直兮，固前圣之所厚。

            悔相道之不察兮，延伫乎吾将反。

            回朕车以复路兮，及行迷之未远。

            步余马于兰皋兮，驰椒丘且焉止息。

            进不入以离尤兮，退将复修吾初服。

            制芰荷以为衣兮，集芙蓉以为裳。

            不吾知其亦已兮，苟余情其信芳。

            高余冠之岌岌兮，长余佩之陆离。

            芳与泽其杂糅兮，唯昭质其犹未亏。

            忽反顾以游目兮，将往观乎四荒。

            佩缤纷其繁饰兮，芳菲菲其弥章。

            民生各有所乐兮，余独好修以为常。

            虽体解吾犹未变兮，岂余心之可惩。

            女嬃之婵媛兮，申申其詈予。
            <div ref="testSkip" style="height: 200px; background: #f00"></div>

            曰：“鲧婞直以亡身兮，终然夭乎羽之野。

            汝何博謇而好修兮，纷独有此姱节。
            
            薋菉葹以盈室兮，判独离而不服。

            众不可户说兮，孰云察余之中情。

            世并举而好朋兮，夫何茕独而不予听？

            依前圣以节中兮，喟凭心而历兹。

            济沅、湘以南征兮，就重华而敶词：

            启《九辩》与《九歌》兮，夏康娱以自纵。
        </pre>
        
    </el-scrollbar>
  </template>  
 
</el-dialog>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }, 
      onConfirm (openLoading, closeLoading) {
          // 打开确定loading
          openLoading()
          // 关闭loading
          setTimeout(closeLoading, 1500)
      }, 
      handleSkip () {
        this.$refs.scrollbar.scrollIntoView(this.$refs.testSkip)
      }  
    }
  };
</script>
```
:::
### 通过showDialog实例方法打开

Dialog 可以调用`showDialog`方法来打开对话框，调用`closeDialog`来关闭对话框

:::demo 为组件指定ref来获取实例，从而调用实例方法，另外还可以指定custom来完全自定义dialog

```html
<el-button type="text" @click="$refs.dialog.showDialog()">点击打开 Dialog</el-button>

<el-dialog
  ref="dialog"      
  title="提示"
  width="60%"
  center
  custom
  @confirm="onConfirm"
  :before-close="handleClose">
  <div style="background: #fff; height: 500px; line-height: 500px">
      <span>这是一段信息</span>
      <el-button type="primary" @click="$refs.dialog.closeDialog()">关闭dialog</el-button>
  </div>
</el-dialog>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }, 
      onConfirm (openLoading, closeLoading) {
          // 打开确定loading
          openLoading()
          // 关闭loading
          setTimeout(closeLoading, 1500)
      }
    }
  };
</script>
```
:::

:::tip
`before-close` 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效。如果你在 `footer` 具名 slot 里添加了用于关闭 Dialog 的按钮，那么可以在按钮的点击回调函数里加入 `before-close` 的相关逻辑。
:::

### 自定义内容

Dialog 组件的内容可以是任意的，甚至可以是表格或表单，下面是应用了 Element Table 和 Form 组件的两个样例。

:::demo
```html
<!-- Table -->
<el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>

<el-dialog title="收货地址" :visible.sync="dialogTableVisible">
  <el-table :data="gridData">
    <el-table-column property="date" label="日期" width="150"></el-table-column>
    <el-table-column property="name" label="姓名" width="200"></el-table-column>
    <el-table-column property="address" label="地址"></el-table-column>
  </el-table>
</el-dialog>

<!-- Form -->
<el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>

<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="活动名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="活动区域" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>

<script>
  export default {
    data() {
      return {
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      };
    }
  };
</script>
```
:::

### 嵌套的 Dialog
如果需要在一个 Dialog 内部嵌套另一个 Dialog，需要使用 `append-to-body` 属性。
:::demo 正常情况下，我们不建议使用嵌套的 Dialog，如果需要在页面上同时显示多个 Dialog，可以将它们平级放置。对于确实需要嵌套 Dialog 的场景，我们提供了`append-to-body`属性。将内层 Dialog 的该属性设置为 true，它就会插入至 body 元素上，从而保证内外层 Dialog 和遮罩层级关系的正确。
```html
<template>
  <el-button type="text" @click="outerVisible = true">点击打开外层 Dialog</el-button>
  
  <el-dialog title="外层 Dialog" :visible.sync="outerVisible">
    <el-dialog
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="outerVisible = false">取 消</el-button>
      <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        outerVisible: false,
        innerVisible: false
      };
    }
  }
</script>
```
:::

### 居中布局

标题和底部可水平居中

:::demo 将`center`设置为`true`即可使标题和底部居中。`center`仅影响标题和底部区域。Dialog 的内容是任意的，在一些情况下，内容并不适合居中布局。如果需要内容也水平居中，请自行为其添加 CSS。

```html
<el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button>

<el-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
  <span>需要注意的是内容是默认不居中的</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

<script>
  export default {
    data() {
      return {
        centerDialogVisible: false
      };
    }
  };
</script>
```
:::

:::tip
Dialog 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。因此，如果需要执行 DOM 操作，或通过 `ref` 获取相应组件，请在 `open` 事件回调中进行。
:::

:::tip
如果 `visible` 属性绑定的变量位于 Vuex 的 store 内，那么 `.sync` 不会正常工作。此时需要去除 `.sync` 修饰符，同时监听 Dialog 的 `open` 和 `close` 事件，在事件回调中执行 Vuex 中对应的 mutation 更新 `visible` 属性绑定的变量的值。
:::

### Attributes
| 参数                    | 说明                                                  | 类型                              | 可选值                                         | 默认值   |
|-----------------------|-----------------------------------------------------|---------------------------------|---------------------------------------------|-------|
| visible               | 是否显示 Dialog，支持 .sync 修饰符                            | boolean                         | —                                           | false |
| title                 | Dialog 的标题，也可通过具名 slot （见下表）传入                      | string                          | —                                           | —     |
| width                 | Dialog 的宽度                                          | string                          | —                                           | 50%   |
| is-drag               | Dialog是否可以拖动（仅对`custom`为false的时候生效）                 | boolean                         | —                                           | false |
| custom                | 是否完全自定义Dialog                                       | boolean                         | —                                           | false |
| is-show-footer        | 是否显示footer                                          | boolean                         | —                                           | true  |
| is-show-confirm-btn   | 是否显示footer中的确定按钮                                    | boolean                         | —                                           | true  |
| is-show-cancel-btn    | 是否显示footer中的取消按钮                                    | boolean                         | —                                           | true  |
| confirm-btn-text      | footer中的确定按钮文字                                      | string                          | —                                           | 确定    |
| cancel-btn-text       | footer中取消按钮文字                                       | string                          | —                                           | 取消    |
| footer-justify        | footer内容的排列方式                                       | string                          | start/end/center/space-around/space-between | end   |
| fullscreen            | 是否为全屏 Dialog                                        | boolean                         | —                                           | false |
| top                   | Dialog CSS 中的 margin-top 值                          | string                          | —                                           | 15vh  |
| modal                 | 是否需要遮罩层                                             | boolean                         | —                                           | true  |
| modal-append-to-body  | 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上    | boolean                         | —                                           | true  |
| append-to-body        | Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true | boolean                         | —                                           | false |
| lock-scroll           | 是否在 Dialog 出现时将 body 滚动锁定                           | boolean                         | —                                           | true  |
| custom-class          | Dialog 的自定义类名                                       | string                          | —                                           | —     |
| close-on-click-modal  | 是否可以通过点击 modal 关闭 Dialog                            | boolean                         | —                                           | true  |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Dialog                              | boolean                         | —                                           | true  |
| show-close            | 是否显示关闭按钮                                            | boolean                         | —                                           | true  |
| before-close          | 关闭前的回调，会暂停 Dialog 的关闭                               | function(done)，done 用于关闭 Dialog | —                                           | —     |
| center                | 是否对头部和底部采用居中布局                                      | boolean                         | —                                           | false |
| destroy-on-close      | 关闭时销毁 Dialog 中的元素                                   | boolean                         | —                                           | false |

### Slot
| name | 说明 |
|------|--------|
| — | Dialog 的内容 |
| title | Dialog 标题区的内容 |
| footer | Dialog 按钮操作区的内容 |

### Scoped Slot
| name | 说明                                                                                           |
|------|----------------------------------------------------------------------------------------------|
| — | 自定义Dialog中的内容，参数为`{ bodyHeight: string }`dialog的内容高度（除去header以及内置footer的高度, custom为false时生效） |

### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| open  | Dialog 打开的回调 | — |
| opened  | Dialog 打开动画结束时的回调 | — |
| close  | Dialog 关闭的回调 | — |
| closed | Dialog 关闭动画结束时的回调 | — |

### Methods
| 方法名  | 说明                     | 参数      |
|------|------------------------|---------- |
| closeDialog | 关闭dialog               | — |
| showDialog     | 打开dialog               | — |
| closeLoading | 打开`footer`确定按钮的loading | — |
| openLoading | 关闭`footer`确定按钮的loading | — |
