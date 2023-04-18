<template>
  <component
    :is="_elTag"
    class="el-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <slot v-if="$slots.default"></slot>
    <el-radio
        v-else
        v-for="option in list"
        :key="'wp-el-radio-option' + option[valueKey]"
        :label="option[valueKey]"
        :border="option.border"
        :disabled="Boolean(option[disabledKey])">{{option[labelKey]}}</el-radio>
  </component>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';
  import ElRadio from 'element-ui/packages/radio';
  import { isObject } from 'element-ui/src/utils/types';
  const keyCode = Object.freeze({
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  });
  export default {
    name: 'ElRadioGroup',

    componentName: 'ElRadioGroup',
    components: {
      ElRadio
    },
    inject: {
      elFormItem: {
        default: ''
      }
    },

    mixins: [Emitter],
    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean,
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
    data() {
      return {
        listData: []
      };
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      list() {
        if (typeof this.optionData === 'function') return this.listData;
        return this.optionData;
      },
      _elTag() {
        let tag = (this.$vnode.data || {}).tag;
        if (!tag || tag === 'component') tag = 'div';
        return tag;
      },
      radioGroupSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      }
    },

    created() {
      if (!this.$isServer && !this.isServer) {
        this.getData();
      }
      this.$on('handleChange', value => {
        this.$emit('change', value);
      });
    },
    fetch() {
      if (this && typeof this.optionData === 'function' && this.isServer) {
        return this.getData();
      }
      if (!this && process.env.NODE_ENV !== 'production') {
        console.error('fetch函数里面的逻辑不会被执行，请查看nuxt版本，建议使用2.15.8及以上的版本');
      }
    },
    mounted() {
      // 当radioGroup没有默认选项时，第一个可以选中Tab导航
      const radios = this.$el.querySelectorAll('[type=radio]');
      const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
      if (![].some.call(radios, radio => radio.checked) && firstLabel) {
        firstLabel.tabIndex = 0;
      }
    },
    methods: {
      getData() {
        if (typeof this.optionData === 'function') {
          return this.optionData().then(res => {
            this.listData = (isObject(res) && (Array.isArray(res.data) || isObject(res.data)) ? res.data : res) || [];
          });
        }
      },
      handleKeydown(e) { // 左右上下按键 可以在radio组内切换不同选项
        const target = e.target;
        const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
        const radios = this.$el.querySelectorAll(className);
        const length = radios.length;
        const index = [].indexOf.call(radios, target);
        const roleRadios = this.$el.querySelectorAll('[role=radio]');
        switch (e.keyCode) {
          case keyCode.LEFT:
          case keyCode.UP:
            e.stopPropagation();
            e.preventDefault();
            if (index === 0) {
              roleRadios[length - 1].click();
              roleRadios[length - 1].focus();
            } else {
              roleRadios[index - 1].click();
              roleRadios[index - 1].focus();
            }
            break;
          case keyCode.RIGHT:
          case keyCode.DOWN:
            if (index === (length - 1)) {
              e.stopPropagation();
              e.preventDefault();
              roleRadios[0].click();
              roleRadios[0].focus();
            } else {
              roleRadios[index + 1].click();
              roleRadios[index + 1].focus();
            }
            break;
          default:
            break;
        }
      }
    },
    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
      }
    }
  };
</script>

