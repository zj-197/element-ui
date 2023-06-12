<template>
  <div>
    <el-wp-form ref="form" :model="form"
                :gutter="20"
                @search="onSubmit"
                size="medium"
                label-position="top"
                align="middle"
                :col-count="3" is-show-collapse>
      <!--  中文验证-->
      <el-wp-form-item label="活动名称" required pattern="chinese" prop="name" v-if="isShowActiveArea">
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
      <el-col :span="24">
        <el-wp-form-item label="活动形式">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-wp-form-item>
      </el-col>
    </el-wp-form>
    <el-button @click="isShowActiveArea = !isShowActiveArea">toggle活动名称</el-button>
  </div>
</template>
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
        desc: '',
      },
      isShowActiveArea: false
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
