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
      if (!this.$isServer) {
        this.getData();
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
