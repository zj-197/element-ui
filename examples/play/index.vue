<template>
  <div>
    <el-upload action="" :auto-upload="false" :before-start="handleStart">
      <el-button>选择文件</el-button>
    </el-upload>
    <el-form label-position="top" :model="form" size="medium" ref="form">
      <!-- S 标题 -->
      <el-wp-form-item required label="标题" prop="title">
        <el-input v-model="form.title" type="text" placeholder="请输入标题"></el-input>
      </el-wp-form-item>
      <!-- E 标题 -->

      <!-- S 资源分类 -->
      <el-wp-form-item required label="资源分类" prop="sourceType">
        <el-radio-group v-model="form.sourceType"
                        :option-data="[{label: '自制资源', value: 'CREATE'}, {label: '网络资源', value: 'ONLINE'}]"></el-radio-group>
      </el-wp-form-item>
      <!-- E 资源分类 -->
      <!-- S 资源链接 -->
      <template v-if="form.sourceType === 'ONLINE'">
        <el-wp-form-item label="资源链接" prop="assetsLink"
                         required>
          <el-input placeholder="请输入资源链接" v-model="form.assetsLink" type="text"></el-input>
        </el-wp-form-item>
      </template>
      <!-- E 资源链接 -->

      <!-- S 栏目分类 -->
      <el-wp-form-item required label="栏目分类" prop="clumnTypes" value-type="array">
        <el-checkbox-group v-model="form.clumnTypes">
          <el-checkbox v-for="item in Columns" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-wp-form-item>
      <!-- E 栏目分类 -->

      <!-- S 在线课程分类 -->
      <el-wp-form-item required label="在线视频分类" prop="videoTypes" value-type="array">
        <el-checkbox-group v-model="form.videoTypes" label-key="name" value-key="id"
                           :option-data="Videos"></el-checkbox-group>
      </el-wp-form-item>
      <!-- E 在线课程分类 -->

      <!-- S 积分设置 -->
      <el-wp-form-item label="积分设置">
        <div style=" line-height: 1px">
          <span>学员播放达</span>
          <el-wp-form-item pattern="number" prop="creditsTime"
                           style="width: 100px; margin: 0 10px; display: inline-block;">
            <el-input v-model="form.creditsTime" placeholder="时间" type="text"/>
          </el-wp-form-item>
          <span>分钟后，即完成课程，并获得积分</span>
          <el-wp-form-item pattern="number" prop="credit"
                           style="width: 100px; margin: 0 10px; display: inline-block;">
            <el-input v-model="form.credit" placeholder="分数" type="text"/>
          </el-wp-form-item>
          分
        </div>
      </el-wp-form-item>
      <!-- E 积分设置 -->
      <el-wp-form-item class="mt-125">
        <el-button type="primary" style="min-width: 8rem" @click.stop="handlePublic">{{courseId ? '确定' : '发布资源'}}</el-button>
      </el-wp-form-item>
    </el-form>
    <el-button @click="form.isShowActiveArea = !form.isShowActiveArea">toggle活动名称</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        creditsTime: "",
        credit: "",
        resourceModels: [], // 视频文件
        videoTypes: [],
        sourceType: "CREATE",
        clumnTypes: [],
        assetsLink: "",
      },
      Columns: [],
      Videos: []
    }
  },
  computed: {
    courseId () {
      return 'xxx'
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
    },
    handleStart (fileList) {
      console.log(fileList, 'fileList');
      return fileList
      // return null
    }
  }
}
</script>
