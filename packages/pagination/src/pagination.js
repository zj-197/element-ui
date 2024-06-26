import Pager from './pager.vue';
import ElSelect from 'element-ui/packages/select';
import ElOption from 'element-ui/packages/option';
import ElInput from 'element-ui/packages/input';
import Locale from 'element-ui/src/mixins/locale';
import { valueEquals } from 'element-ui/src/utils/util';

export default {
  name: 'ElPagination',

  props: {
    pageSize: {
      type: [Number, String],
      default: 10
    },
    hidden: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: '',
      validator(val) {
        return ['left', 'center', 'right', '', undefined].indexOf(val) > -1;
      }
    },
    small: Boolean,

    total: Number,

    pageCount: Number,

    pagerCount: {
      type: Number,
      validator(value) {
        return (value | 0) === value && value > 4 && value < 22 && (value % 2) === 1;
      },
      default: 7
    },

    currentPage: {
      type: Number,
      default: 1
    },

    layout: {
      default: 'total, sizes, tips, prev, pager, next, jumper'
    },

    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100];
      }
    },

    popperClass: String,

    prevText: String,

    nextText: String,

    background: {
      type: Boolean,
      default: true
    },

    disabled: Boolean,

    hideOnSinglePage: Boolean
  },

  data() {
    return {
      internalCurrentPage: 1,
      internalPageSize: 0,
      bindPageSize: 0,
      lastEmittedPage: -1,
      userChangePageSize: false
    };
  },

  render(h) {
    const layout = this.layout;
    if (!layout || this.hidden) return null;
    if (this.hideOnSinglePage && (!this.internalPageCount || this.internalPageCount === 1)) return null;

    let template = <div class={['el-pagination', this.align, {
      'is-background': this.background,
      'el-pagination--small': this.small
    }] }></div>;
    const TEMPLATE_MAP = {
      prev: <prev></prev>,
      jumper: <jumper></jumper>,
      pager: <pager currentPage={ this.internalCurrentPage } pageCount={ this.internalPageCount } pagerCount={ this.pagerCount } on-change={ this.handleCurrentChange } disabled={ this.disabled }></pager>,
      next: <next></next>,
      sizes: <sizes pageSizes={ this.pageSizes }></sizes>,
      slot: <slot>{ this.$slots.default ? this.$slots.default : '' }</slot>,
      total: <total></total>,
      tips: this.tips ? <span class="el-pagination-tips">{ this.tips }</span> : null
    };
    const components = layout.split(',').map((item) => item.trim());
    const rightWrapper = <div class="el-pagination__rightwrapper"></div>;
    let haveRightWrapper = false;

    template.children = template.children || [];
    rightWrapper.children = rightWrapper.children || [];
    components.forEach(compo => {
      if (compo === '->') {
        haveRightWrapper = true;
        return;
      }

      if (!haveRightWrapper) {
        if (TEMPLATE_MAP[compo]) {
          template.children.push(TEMPLATE_MAP[compo]);
        }
      } else {
        if (TEMPLATE_MAP[compo]) {
          rightWrapper.children.push(TEMPLATE_MAP[compo]);
        }
      }
    });

    if (haveRightWrapper) {
      template.children.unshift(rightWrapper);
    }

    return template;
  },

  components: {
    Prev: {
      render(h) {
        return (
          <button
            type="button"
            class="btn-prev"
            disabled={ this.$parent.disabled || this.$parent.internalCurrentPage <= 1 }
            on-click={ this.$parent.prev }>
            {
              this.$parent.prevText
                ? <span>{ this.$parent.prevText }</span>
                : <i class="el-icon el-icon-arrow-left"></i>
            }
          </button>
        );
      }
    },

    Next: {
      render(h) {
        return (
          <button
            type="button"
            class="btn-next"
            disabled={ this.$parent.disabled || this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
            on-click={ this.$parent.next }>
            {
              this.$parent.nextText
                ? <span>{ this.$parent.nextText }</span>
                : <i class="el-icon el-icon-arrow-right"></i>
            }
          </button>
        );
      }
    },

    Sizes: {
      mixins: [Locale],

      props: {
        pageSizes: Array
      },

      watch: {
        pageSizes: {
          immediate: true,
          handler(newVal, oldVal) {
            if (valueEquals(newVal, oldVal)) return;
            if (Array.isArray(newVal)) {
              const val = newVal.indexOf(this.$parent.pageSize) > -1
                ? this.$parent.pageSize
                : this.pageSizes[0];
              this.$parent.bindPageSize = val === 'all' ? this.$parent.total + val : val;
              this.$parent.internalPageSize = val === 'all' ? this.$parent.total : (isNaN(parseInt(val, 10)) ? val : parseInt(val, 10));
            }
          }
        }
      },

      render(h) {
        return (
          <span class="el-pagination__sizes">
            <el-select
              value={ this.$parent.bindPageSize }
              popperClass={ this.$parent.popperClass || '' }
              size="mini"
              clearable={false}
              on-input={ this.handleChange }
              disabled={ this.$parent.disabled }>
              {
                this.pageSizes.map(item =>
                  <el-option
                    value={ item === 'all' ? this.$parent.total + item : item }
                    label={ isNaN(Number(item)) ? (item === 'all' ? this.t('el.table.clearFilter') : item) : item + this.t('el.pagination.pagesize') }>
                  </el-option>
                )
              }
            </el-select>
          </span>
        );
      },

      components: {
        ElSelect,
        ElOption
      },

      methods: {
        handleChange(val) {
          if (val !== this.$parent.bindPageSize) {
            this.$parent.bindPageSize = val;
            this.$parent.internalPageSize = val = isNaN(parseInt(val, 10)) ? val : parseInt(val, 10);
            this.$parent.userChangePageSize = true;
            this.$parent.$emit('update:pageSize', val);
            this.$parent.$emit('size-change', val);
          }
        }
      }
    },

    Jumper: {
      mixins: [Locale],

      components: { ElInput },

      data() {
        return {
          userInput: null
        };
      },

      watch: {
        '$parent.internalCurrentPage'() {
          this.userInput = null;
        }
      },

      methods: {
        handleKeyup({ keyCode, target }) {
          // Chrome, Safari, Firefox triggers change event on Enter
          // Hack for IE: https://github.com/ElemeFE/element/issues/11710
          // Drop this method when we no longer supports IE
          if (keyCode === 13) {
            this.handleChange(target.value);
          }
        },
        handleInput(value) {
          this.userInput = value;
        },
        handleChange(value) {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value);
          this.$parent.emitChange();
          this.userInput = null;
        }
      },

      render(h) {
        return (
          <span class="el-pagination__jump">
            { this.t('el.pagination.goto') }
            <el-input
              class="el-pagination__editor is-in-pagination"
              min={ 1 }
              max={ this.$parent.internalPageCount }
              value={ this.userInput !== null ? this.userInput : this.$parent.internalCurrentPage }
              type="number"
              disabled={ this.$parent.disabled }
              nativeOnKeyup={ this.handleKeyup }
              onInput={ this.handleInput }
              onChange={ this.handleChange }/>
            { this.t('el.pagination.pageClassifier') }
          </span>
        );
      }
    },

    Total: {
      mixins: [Locale],

      render(h) {
        return (
          typeof this.$parent.total === 'number'
            ? <span class="el-pagination__total">{ this.t('el.pagination.total', { total: this.$parent.total }) }</span>
            : ''
        );
      }
    },

    Pager
  },

  methods: {
    handleCurrentChange(val) {
      this.internalCurrentPage = this.getValidCurrentPage(val);
      this.userChangePageSize = true;
      this.emitChange();
    },

    prev() {
      if (this.disabled) return;
      const newVal = this.internalCurrentPage - 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit('prev-click', this.internalCurrentPage);
      this.emitChange();
    },

    next() {
      if (this.disabled) return;
      const newVal = this.internalCurrentPage + 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit('next-click', this.internalCurrentPage);
      this.emitChange();
    },

    getValidCurrentPage(value) {
      value = parseInt(value, 10);

      const havePageCount = typeof this.internalPageCount === 'number';

      let resetValue;
      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1;
      } else {
        if (value < 1) {
          resetValue = 1;
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount;
        }
      }

      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1;
      } else if (resetValue === 0) {
        resetValue = 1;
      }

      return resetValue === undefined ? value : resetValue;
    },

    emitChange() {
      this.$nextTick(() => {
        if (this.internalCurrentPage !== this.lastEmittedPage || this.userChangePageSize) {
          this.$emit('current-change', this.internalCurrentPage);
          this.lastEmittedPage = this.internalCurrentPage;
          this.userChangePageSize = false;
        }
      });
    }
  },

  computed: {
    internalPageCount() {
      if (typeof this.total === 'number') {
        return Math.max(1, Math.ceil(this.total / this.internalPageSize) || 0);
      } else if (typeof this.pageCount === 'number') {
        return Math.max(1, this.pageCount);
      }
      return null;
    },
    tips({ currentPage, pageSize, total }) {
      if (total === 0 || total == null || total === '') return '';
      return currentPage === 1 ? `第1-${Math.min(pageSize, total)}条`
        : `第${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, total)}条`;
    }
  },

  watch: {
    currentPage: {
      immediate: true,
      handler(val) {
        this.internalCurrentPage = this.getValidCurrentPage(val);
      }
    },

    pageSize: {
      immediate: true,
      handler(val) {
        this.bindPageSize = val === 'all' ? this.total + val : val;
        this.internalPageSize = val === 'all' ? this.total : (isNaN(parseInt(val, 10)) ? val : parseInt(val, 10));
      }
    },

    internalCurrentPage: {
      immediate: true,
      handler(newVal) {
        this.$emit('update:currentPage', newVal);
        this.lastEmittedPage = -1;
      }
    },

    internalPageCount(newVal) {
      /* istanbul ignore if */
      const oldPage = this.internalCurrentPage;
      if (newVal > 0 && oldPage === 0) {
        this.internalCurrentPage = 1;
      } else if (oldPage > newVal) {
        this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        this.userChangePageSize && this.emitChange();
      }
      this.userChangePageSize = false;
    }
  }
};
