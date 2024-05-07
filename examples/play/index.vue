<template>
  <div>

    <el-button type="primary" v-popover-mul:confirm="confirmTips">确认提示</el-button>
    <el-button type="primary" @click="confirmTips = '我是改变之后的提示'">改变提示</el-button>
    <el-popconfirm ref="confirm"></el-popconfirm>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: '',
        creditsTime: '',
        credit: '',
        resourceModels: [], // 视频文件
        videoTypes: [],
        sourceType: '',
        clumnTypes: [],
        assetsLink: ''
      },
      Columns: [],
      Videos: [],
      confirmTips: '我是之前的提示'
    };
  },
  computed: {
    courseId() {
      return 'xxx';
    },
  },

  mounted() {

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
      });
    },
    handleStart(fileList) {
      console.log(fileList, 'fileList');
      return fileList;
      // return null
    }
  }
};
</script>
