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
        return {
          
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
        // 编辑  
        edit (row) {
            
        },
        // 删除  
        del (row) {
            
        },
      }  
    }
  </script>
```
:::
