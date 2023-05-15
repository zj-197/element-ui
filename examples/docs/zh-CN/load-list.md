## LoadList 加载分页列表
用于加载带分页的列表

### 基本使用

基础的分页列表展示用法。(加载到第五页，可以查看为列表为空时的样式)

:::demo 传入`load-data`函数，以及分页相关的key配置即可
```html
  <template>
    <el-load-list :load-data="getList">
      <template slot-scope="{list, isError}">
          <el-row type="flex" is-wrap :gutter="20">
              <el-col :span="8" v-for="item in list" style="margin-bottom: 20px">
                  <el-card header="item.name">
                      <div style="padding: 20px">
                          电话：{{item.mobile}}
                      </div>
                      <div style="padding: 20px">
                          地址： {{item.address}}
                      </div>
                      <div style="padding: 20px">
                          班级： {{item.classes}}
                      </div>
                  </el-card>
              </el-col>
          </el-row>
      </template>
    </el-load-list>
  </template>

  <script>
    export default {
      data() {
          const list = Array.from({ length: 20 }, (_, i) => {
              const index = (i + 1)
              return {
                  id: index,
                  address: '重庆' + Math.random() > 0.5 ? '渝北' : '江北',
                  sex: {text: Math.random() > 0.5 ? '女' : '男'},
                  mobile: (Math.random() * Math.pow(10, 11)).toString(),
                  card: (Math.random() * Math.pow(10, 18)).toString(),
                  name: Math.random() > 0.4 ? '张' + index : '李' + index,
                  classes: '一年级' + (Math.ceil(Math.random() * 10)) + '班',
                  chineseScore: Math.floor(Math.random() * 100),
                  mathScore: Math.floor(Math.random() * 100),
                  englishScore: Math.floor(Math.random() * 100),
                  totalScore: Math.ceil(Math.random() * 100)
              }
          })
        return {
          list
        }
      },
      methods: {
        getList (params) {
          const { page, pageSize } = params
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  const list = Array.from({ length: pageSize }, (_, i) => {
                      const index = ((page - 1) * pageSize) + (i + 1)
                      return {
                          id: index,
                          address: '重庆' + Math.random() > 0.5 ? '渝北' : '江北',
                          sex: {text: Math.random() > 0.5 ? '女' : '男'},
                          mobile: (Math.random() * Math.pow(10, 11)).toString(),
                          card: (Math.random() * Math.pow(10, 18)).toString(),
                          name: Math.random() > 0.4 ? '张' + index : '李' + index,
                          classes: '一年级' + (Math.ceil(Math.random() * 10)) + '班',
                          chineseScore: Math.floor(Math.random() * 100),
                          mathScore: Math.floor(Math.random() * 100),
                          englishScore: Math.floor(Math.random() * 100),
                          totalScore: Math.ceil(Math.random() * 100)
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
      }  
    }
  </script>
```
:::

### LoadList Attribute
| 参数               | 说明                                                                                                                                                       | 类型       | 可选值       | 默认值                                                                |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------  |--------------------------------------------------------------------|
| load-data        | 记载数据项的promise函数(必传)                                                                                                                                      | Function | — | —                                                                  |
| page-size        | 每页条数                                                                                                                                                     | number   | — | 20                                                                 |
| pagination-key   | 分页相关key，比如服务端返回的是{page: 1, pageSize: 20, list: [{}], total: 100 }, 那么paginationKey就是: {page: 'page', pageSize: 'pageSize', total: 'total', list: 'list'} | object   | — | {page: 'page', pageSize: 'pageSize', total: 'total', list: 'list'} |
| pagination-props | 分页组件的prop 详见pagination                                                                                                                                   | object   | — | —                                                                  |
| empty-text       | 列表为空时的描述文字                                                                                                                                               | string   |—| 暂无数据                                                               |
| empty-btn-text   | 列表为空时按钮的文字                                                                                                                                               | string   | — | 重新加载                                                               |
| empty-image      | 列表为空时的图片                                                                                                                                                 | string   | — | —                                                                  |
| error-text       | 列表加载错误时的描述文字                                                                                                                                             | string   | — | —                                                                  |
| error-btn-text   | 列表加载错误时按钮文字                                                                                                                                              | string   | — | —                                                                  |
| error-image      | 列表加载错误时的图片                                                                                                                                               | string   | — | —                                                                  |
| loading-text     | 加载中的文字                                                                                                                                                   | string   | — | 加载中                                                                |
| auto-scroll-top  | 是否自动滚动到顶部                                                                                                                                                | boolean  | — | true                                                               |
| init-value       | 初始列表值                                                                                                                                                    | array    | — |       —                                                         |
| total            | 分页总条数，传入`init-value`的时候此属性必传                                                                                                                             | number   | — |       —                                                         |


### LoadList SlotScoped

| name | 说明                        |
|------|---------------------------|
| ---- | 默认插槽参数为 { list, isError } |
| empty | 参数为 { isError } |
| empty-btn | 参数为 { isError } |
