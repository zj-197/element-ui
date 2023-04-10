<script>
export default {
  name: 'ElWpForm',
  props: {
    isShowResetBtn: {
      type: Boolean,
      default: true
    },
    resetBtnText: {
      type: String,
      default: '重 置'
    },
    isShowSearchBtn: {
      type: Boolean,
      default: true
    },
    searchBtnText: {
      type: String,
      default: '搜 索'
    },
    gutter: {
      type: [Number, String],
      default: 20,
      validator(val) {
        return val == null || val === '' || /^[0-9]+$/.test(String(val));
      }
    },
    // 列数
    colCount: {
      type: [Number, String],
      default: 3,
      validator(val) {
        return val == null || val === '' || /^[0-9]+$/.test(String(val));
      }
    },
    // 是否需要展开收起
    isCollapse: {
      type: Boolean
    },
    align: {
      type: String,
      default: 'top'
    },
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    span() {
      return Math.ceil(24 / this.colCount);
    },
    contentSpan() {
      return Math.floor(24 / this.span) - 1;
    },
    isShowActions() {
      return this.isCollapse || this.isShowSearchBtn || this.isShowResetBtn;
    }
  },
  data() {
    return {
      toggleCollapse: true, // 是否收起, 默认为收起
      isResetting: false,
      isSearching: false
    };
  },
  render(h) {
    const children = (Array.isArray(this.$slots.default) ? this.$slots.default : []).reduce((preVal, curVal, index) => {
      const display = this.isCollapse && this.toggleCollapse && (index >= this.contentSpan) ? 'none' : undefined;
      if (/ElCol$/g.test(curVal.tag)) {
        preVal.push(h('div', {
          style: { display }
        }, [curVal]));
      } else {
        preVal.push(h('el-col', {
          props: {
            span: this.span
          },
          style: { display }
        }, [curVal]));
      }
      return preVal;
    }, []);
    // 如果需要展开收起
    if (this.isShowActions) {
      const actions = (Array.isArray(this.$slots.actions) ? this.$slots.actions : [])
        .concat([this.renderBtnSearch(h), this.renderBtnReset(h), this.renderCollapse(h)]);
      children.push(h('el-col', {
        props: {
          span: this.span
        },
        style: {
          marginLeft: 'auto',
          textAlign: 'right'
        }
      }, actions));
    }
    const rowNode = h('el-row', {
      props: {
        gutter: this.gutter,
        type: 'flex',
        align: this.align
      },
      style: { flexWrap: 'wrap' }
    }, children);
    return h('el-form', {
      props: {
        model: this.model,
        rules: this.rules,
        labelPosition: this.labelPosition,
        labelSuffix: this.labelSuffix,
        inline: this.inline,
        inlineMessage: this.inlineMessage,
        statusIcon: this.statusIcon,
        showMessage: this.showMessage,
        size: this.size,
        disabled: this.disabled,
        validateOnRuleChange: this.validateOnRuleChange,
        hideRequiredAsterisk: this.hideRequiredAsterisk
      },
      ref: 'ZjForm',
      class: 'wp-form',
      on: this.$listeners
    }, [rowNode]);
  },
  methods: {
    renderCollapse(h) {
      if (!this.isCollapse) return;
      return h('span', {
        on: {
          click: (e) => {
            this.toggleCollapse = !this.toggleCollapse;
          }
        },
        class: 'collapse-wrapper'
      }, [
        h('span', this.toggleCollapse ? '展开' : '收起'),
        h('i', { class: ['el-icon-arrow-down', 'form-collapse-icon', !this.toggleCollapse && 'is-spread'] })
      ]);
    },
    openResetting() {
      this.isResetting = true;
    },
    closeResetting() {
      this.isResetting = false;
    },
    openSearching() {
      this.isSearching = true;
    },
    closeSearching() {
      this.isSearching = false;
    },
    // 渲染重置按钮
    renderBtnReset(h) {
      if (!this.isShowResetBtn) return;
      return h('el-button', {
        props: {
          type: 'default',
          size: this.size,
          loading: this.isResetting,
          disabled: this.isSearching,
          icon: 'el-icon-refresh-right'
        },
        on: {
          click: (e) => {
            if (e && typeof e.stopPropagation === 'function') {
              e.stopPropagation();
            }
            this.$emit('reset', this.openResetting, this.closeResetting);
          }
        }
      }, this.resetBtnText);
    },
    // 渲染搜索按钮
    renderBtnSearch(h) {
      if (!this.isShowSearchBtn) return;
      return h('el-button', {
        props: {
          type: 'primary',
          size: this.size,
          loading: this.isSearching,
          disabled: this.isResetting,
          icon: 'el-icon-search'
        },
        on: {
          click: (e) => {
            if (e && typeof e.stopPropagation === 'function') {
              e.stopPropagation();
            }
            this.$emit('search', this.openSearching, this.closeSearching);
          }
        }
      }, this.searchBtnText);
    },
    // el-form的方法 获取表单验证
    validate(callback) {
      return this.getFormInstance().validate(callback);
    },
    // el-form的方法 对部分表单字段进行校验的方法
    validateField(prop, callback) {
      this.getFormInstance().validateField(prop, callback);
    },
    // el-form的方法 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    resetFields() {
      this.getFormInstance().resetFields();
    },
    // el-form的方法
    // 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单地校验结果
    clearValidate() {
      this.getFormInstance().clearValidate();
    },
    // 获取表单实例
    getFormInstance() {
      return this.$refs.ZjForm;
    }
  }
};
</script>
