<script>
import ElForm from 'element-ui/packages/form';
import ElButton from 'element-ui/packages/button';
import ElRow from 'element-ui/packages/row';
import ElCol from 'element-ui/packages/col';
import {noop} from 'element-ui/src/utils/util';
import {t} from 'element-ui/src/locale';
import {assign} from 'element-ui/src/utils/lodash';
import {on, off} from 'element-ui/src/utils/dom';
import { debounce } from 'throttle-debounce';
export default {
  name: 'ElWpForm',
  components: {
    ElForm,
    ElButton,
    ElRow,
    ElCol
  },
  props: {
    isShowResetBtn: {
      type: Boolean,
      default: true
    },
    resetBtnText: {
      type: String,
      default: t('el.table.resetFilter')
    },
    isShowSearchBtn: {
      type: Boolean,
      default: true
    },
    // 是否需要展开收起
    isShowCollapse: {
      type: Boolean,
      default: true
    },
    // 默认是否展开
    isInitCollapse: {
      type: Boolean,
      default: true
    },
    searchBtnText: {
      type: String,
      default: t('el.table.confirmFilter')
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
    // 收起文字
    collapseText: {
      type: String,
      default: '收起'
    },
    // 展开文字
    spreadText: {
      type: String,
      default: '展开'
    },
    align: {
      type: String,
      default: 'top'
    },
    model: Object,
    rules: Object,
    labelPosition: {
      type: String,
      default: 'top'
    },
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
    size: {
      type: String,
      default: 'default'
    },
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    searchBtnProps: {
      type: Object,
      default() {
        return Object.create(null);
      }
    },
    resetBtnProps: {
      type: Object,
      default() {
        return Object.create(null);
      }
    }
  },
  computed: {
    contentSpan() {
      return Math.floor(24 / this.span);
    },
    spanCol() {
      const span = Math.ceil(24 / this.colCount);
      const contentSpan = Math.floor(24 / span);
      return {
        xl: span,
        lg: span,
        md: Math.ceil(24 / Math.max(contentSpan - 1, 1)),
        sm: Math.ceil(24 / Math.max(contentSpan - 2, 1)),
        xs: Math.ceil(24 / Math.max(contentSpan - 3, 1))
      };
    },
    isShowActions() {
      return this.isShowCollapse || this.isShowSearchBtn || this.isShowResetBtn;
    },
    toolMarginTop() {
      const obj = {
        default: '26px',
        undefined: '26px',
        medium: '24px',
        small: '22px',
        mini: '20px'
      };
      return obj[this.size];
    }
  },
  data() {
    return {
      toggleCollapse: this.isInitCollapse, // 是否收起, 默认为收起
      isResetting: false,
      isSearching: false,
      span: Math.ceil(24 / this.colCount)
    };
  },
  created() {
    const obj = {
      xl: this.contentSpan,
      lg: this.contentSpan,
      md: Math.max(this.contentSpan - 1, 1),
      sm: Math.max(this.contentSpan - 2, 1),
      xs: Math.max(this.contentSpan - 3, 1)
    };
    this.resizeOberverfn = debounce(50, (e) => {
      const innerWidth = e.target.innerWidth;
      if (innerWidth >= 1920) {
        this.span = Math.ceil(24 / obj.xl);
        return;
      }
      if (innerWidth >= 1200) {
        this.span = Math.ceil(24 / obj.lg);
        return;
      }
      if (innerWidth >= 992) {
        this.span = Math.ceil(24 / obj.md);
        return;
      }
      if (innerWidth >= 768) {
        this.span = Math.ceil(24 / obj.sm);
        return;
      }
      if (innerWidth >= 767) {
        this.span = Math.ceil(24 / obj.xs);
        return;
      }
    });
    if (!this.$isServer) {
      on(window, 'resize', this.resizeOberverfn);
    }
  },
  render(h) {
    if (!this.$slots.default) return this.$slots.default;
    const slotDefault = this.$slots.default;
    let index = 0;
    const slotDefaultContent = [];
    for (let i = 0; i < slotDefault.length; i++) {
      const item = slotDefault[i];
      if (!item.tag) {
        slotDefaultContent.push(item);
        continue;
      }
      const display = this.isShowCollapse && this.toggleCollapse && (index >= Math.max(this.contentSpan - 1, 1)) ? 'none' : undefined;
      if (/ElCol$/g.test(item.tag)) {
        slotDefaultContent.push(h('div', {
          style: {display},
          class: 'el-form-item-col-outer'
        }, [item]));
      } else {
        slotDefaultContent.push(h('el-col', {
          props: {
            xl: this.spanCol.xl,
            lg: this.spanCol.lg,
            md: this.spanCol.md,
            sm: this.spanCol.sm,
            xs: this.spanCol.xs
          },
          style: {display}
        }, [item]));
      }
      index++;
    }
    // 如果需要展开收起
    if (this.isShowActions || Array.isArray(this.$slots.actions)) {
      const actions = (Array.isArray(this.$slots.actions) ? this.$slots.actions : [])
        .concat([this.renderBtnSearch(h), this.renderBtnReset(h), this.renderCollapse(h)]);
      slotDefaultContent.push(h('el-col', {
        props: {
          xl: this.spanCol.xl,
          lg: this.spanCol.lg,
          md: this.spanCol.md,
          sm: this.spanCol.sm,
          xs: this.spanCol.xs
        },
        style: {
          marginLeft: 'auto',
          textAlign: 'right',
          marginTop: this.align === 'middle' && this.labelPosition === 'top' ? this.toolMarginTop : undefined
        }
      }, actions));
    }
    const rowNode = h('el-row', {
      props: {
        gutter: this.gutter,
        type: 'flex',
        align: this.align,
        isWrap: true
      }
    }, slotDefaultContent);
    return h('el-form', {
      props: {
        model: this.model,
        rules: this.rules,
        labelPosition: this.labelPosition,
        labelWidth: this.labelWidth,
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
      ref: 'wpForm',
      class: 'el-wp-form',
      on: {
        validate: this.$listeners.validate || noop
      }
    }, [rowNode]);
  },
  beforeDestroy() {
    off(window, 'resize', this.resizeOberverfn);
  },
  methods: {
    renderCollapse(h) {
      if (!this.isShowCollapse) return;
      return h('span', {
        on: {
          click: (e) => {
            this.toggleCollapse = !this.toggleCollapse;
          }
        },
        class: 'el-wp-form-collapse-wrapper'
      }, [
        h('span', this.toggleCollapse ? this.spreadText : this.collapseText),
        h('i', {class: ['el-icon-arrow-down', 'el-wp-form-collapse-icon', !this.toggleCollapse && 'is-spread']})
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
        props: assign({
          type: 'default',
          size: this.size,
          loading: this.isResetting,
          disabled: this.isSearching,
          icon: 'el-icon-refresh-right'
        }, this.resetBtnProps),
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
        props: assign({
          type: 'primary',
          size: this.size,
          loading: this.isSearching,
          disabled: this.isResetting,
          icon: 'el-icon-search'
        }, this.searchBtnProps),
        on: {
          click: (e) => {
            if (e && typeof e.stopPropagation === 'function') {
              e.stopPropagation();
            }
            this.validate((valid) => {
              if (valid) {
                this.$emit('search', this.openSearching, this.closeSearching);
              }
            });
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
      return this.$refs.wpForm;
    }
  }
};
</script>
