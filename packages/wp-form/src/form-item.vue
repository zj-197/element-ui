<template>
  <el-form-item :label="label"
                :label-width="labelWidth"
                :size="size"
                :prop="prop"
                :rules="realRules"
                :error="error"
                :validate-status="validateStatus"
                :inline-message="inlineMessage"
                :show-message="showMessage">
    <slot/>
    <slot name="label" slot="label">
      {{ label }}
      <template v-if="tooltip">
        <el-tooltip :content="tooltip" :placement="tooltipPlacement">
          <i class="el-icon-question"/>
        </el-tooltip>
      </template>
    </slot>
    <template slot="error" slot-scope="{ error }" v-if="$scopedSlots.error || $slots.error">
      <slot name="error" :error="error"/>
    </template>
  </el-form-item>
</template>

<script>
import { PATTERN, regExp } from './config';
import ElFormItem from 'element-ui/packages/form-item';
import ElTooltip from 'element-ui/packages/tooltip';
export default {
  name: 'ElWpFormItem',
  components: {
    ElFormItem,
    ElTooltip
  },
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    // 绑定值得类型
    valueType: {
      type: String,
      default: 'string',
      validator(val) {
        return ['string', 'number', 'boolean', 'array', 'object', 'date'].includes(val);
      }
    },
    pattern: {
      type: [String, RegExp],
      default: '',
      validator(val) {
        return val == null || val === '' || Object.keys(PATTERN).includes(val) || regExp(val);
      }
    },
    patternMsg: {
      type: String,
      default: ''
    },
    validator: {
      type: Function
    },
    tooltipPlacement: {
      type: String,
      default: 'bottom'
    },
    label: {
      type: String,
      default: ''
    },
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String
  },
  data() {
    return {
      componentTag: ''
    };
  },
  mounted() {
    this.selectChild = this.getChildrenByComponentTag(this.$children);
    if (!this.selectChild) return;
    const componentTag = this.selectChild.$options._componentTag;
    this.componentTag = componentTag;
    if (componentTag === 'el-input') {
      const input = this.selectChild.$el.children[0];
      if (input && !input.placeholder) {
        input.placeholder = '请输入';
      }
    }
  },
  computed: {
    realRules({ rules, required, valueType, componentTag, pattern }) {
      if (rules) return rules;
      const rulesArray = [];
      if (required) {
        const isSelect = componentTag ? !(['el-input-number', 'el-input'].includes(componentTag)) : false;
        const prefix = isSelect ? '请选择' : '请输入';
        rulesArray.push({
          type: valueType,
          message: prefix + this.label,
          required,
          // trigger: isSelect ? 'change' : 'blur'
          trigger: ['blur', 'change']
        });
      }
      if (pattern) {
        const obj = {
          type: valueType,
          trigger: ['blur', 'change']
        };
        if (regExp(pattern)) {
          obj.pattern = pattern;
        } else {
          if (PATTERN[pattern]) {
            obj.pattern = PATTERN[pattern].pattern;
            obj.message = PATTERN[pattern].message;
          }
        }
        if (this.patternMsg) {
          obj.message = this.patternMsg;
        }
        rulesArray.push(obj);
      }
      if (typeof this.validator === 'function') {
        rulesArray.push({
          trigger: ['blur', 'change'],
          validator: this.validator
        });
      }
      return rulesArray.length === 0 ? undefined : rulesArray;
    }
  },
  methods: {
    getChildrenByComponentTag(children) {
      const allChildren = children;
      let ch = null;
      const select = [
        'el-select', 'el-cascader', 'el-radio-group', 'el-switch',
        'el-slider', 'el-checkbox-group',
        'el-date-picker', 'el-rate', 'el-color-picker', 'el-upload',
        'el-input-number',
        'el-input'
      ];
      if (allChildren.length) {
        for (let i = 0; i < allChildren.length; i++) {
          const child = allChildren[i];
          if (select.includes(child.$options._componentTag)) {
            ch = child;
            break;
          } else {
            ch = this.getChildrenByComponentTag(child.$children);
            if (ch) break;
          }
        }
      }
      return ch;
    },
    getFormItemInstance() {
      return this.$children[0];
    },
    emitChange() {
      const instance = this.getFormItemInstance();
      if (instance) {
        instance.$emit('el.form.change');
      }
    },
    emitBlur() {
      const instance = this.getFormItemInstance();
      if (instance) {
        instance.$emit('el.form.blur');
      }
    },
    resetField() {
      this.getFormItemInstance() && this.getFormItemInstance().resetField();
    },
    clearValidate() {
      this.getFormItemInstance() && this.getFormItemInstance().clearValidate();
    }
  }
};
</script>
