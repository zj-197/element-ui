<template>
  <div>
     <el-wp-date-picker  placeholder="我们不一样"></el-wp-date-picker>
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
    getRandomImageUrl (width, height) {
      if (!width) width = 200
      if (!height) height = width;
      const randomStr = Math.random().toString(16)
      return `https://picsum.photos/${width}/${height}?q=${randomStr}`
    }
  }
};
</script>
