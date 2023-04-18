<script>
  import Emitter from 'element-ui/src/mixins/emitter';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import { isObject } from 'element-ui/src/utils/types';
  export default {
    name: 'ElCheckboxGroup',

    componentName: 'ElCheckboxGroup',
    components: {
      ElCheckbox
    },
    data() {
      return {
        listData: []
      };
    },

    created() {
      if (!this.$isServer && !this.isServer) {
        this.getData();
      }
    },
    fetch() {
      if (this && typeof this.optionData === 'function' && this.isServer) {
        return this.getData();
      }
      if (!this && process.env.NODE_ENV !== 'production') {
        console.error('fetch函数里面的逻辑不会被执行，请查看nuxt版本，建议使用2.15.8及以上的版本');
      }
    },

    mixins: [Emitter],

    inject: {
      elFormItem: {
        default: ''
      }
    },

    props: {
      value: {},
      disabled: Boolean,
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String,
      optionData: {
        type: [Function, Array]
      },
      isServer: Boolean,
      labelKey: {
        type: String,
        default: 'label'
      },
      valueKey: {
        type: String,
        default: 'value'
      },
      disabledKey: {
        type: String,
        default: 'disabled'
      }
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      checkboxGroupSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      list() {
        if (typeof this.optionData === 'function') return this.listData;
        return this.optionData;
      }
    },
    methods: {
      getData() {
        if (typeof this.optionData === 'function') {
          return this.optionData().then(res => {
            this.listData = (isObject(res) && (Array.isArray(res.data) || isObject(res.data)) ? res.data : res) || [];
          });
        }
      }
    },

    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    }
  };
</script>

<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot v-if="$slots.default"></slot>
    <el-checkbox
        v-else
        v-for="option in list"
        :key="'wp-el-checkbox-option' + option[valueKey]"
        :label="option[valueKey]"
        :disabled="Boolean(option[disabledKey])">{{option[labelKey]}}</el-checkbox>
  </div>
</template>
