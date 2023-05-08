<script>
/**
 * @Author: 左建
 * @Date: 2023/4/4 8:46
 * @LastEditTime: 2023/4/4 8:46
 * @Description: 带搜索表单的表格,通过json对象配置生成
 */
import { isObject } from 'element-ui/src/utils/types';
import { isEmpty } from 'element-ui/src/utils/util';
import { assign } from 'element-ui/src/utils/lodash';
import ElWpTable from 'element-ui/packages/wp-table';
import ElWpTableColumn from 'element-ui/packages/wp-table-column';
import ElWpForm from 'element-ui/packages/wp-form';
import ElWpFormItem from 'element-ui/packages/wp-form-item';
import {scrollIntoView} from 'element-ui/src/utils/scroll-into-view-or-body';
export default {
  name: 'ElWpSearchTable',
  props: {
    // 列配置
    columns: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    // 返回一个promise
    loadData: {
      type: Function
    },
    // 搜索表单列数
    colCount: [String, Number],
    // 搜索表单间隔
    gutter: [String, Number],
    // 尺寸
    size: {
      type: String,
      default: 'medium'
    },
    // 每页条数
    pageSize: Number,
    isServer: Boolean,
    maxSelect: Number,
    rowKey: String,
    paginationKey: Object,
    tableProps: {
      type: Object,
      default() {
        return Object.create(null);
      }
    },
    formProps: {
      type: Object,
      default() {
        return Object.create(null);
      }
    },
    labelPosition: String,
    labelWidth: String,
    isInitCollapse: Boolean,
    autoScrollTop: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ElWpTable,
    ElWpTableColumn,
    ElWpForm,
    ElWpFormItem
  },
  computed: {
    formConfig() {
      return this.columns.filter(item => item.hiddenInForm !== true).map(item => {
        const {tag, label, prop, pattern, required, formItemProps, tagProps, tagInitValue} = item;
        return {
          formItemProps: assign({label, prop, pattern, required}, formItemProps || Object.create(null)),
          tagProps: assign({ label, prop }, tagProps || Object.create(null)),
          tag,
          tagInitValue
        };
      });
    },
    tableColumnsConfig() {
      return this.columns.filter(item => item.hiddenInTable !== true).map(item => {
        const { label, prop, width, align, minWidth, formatter, columnProps } = item;
        return assign({ label, prop, width, align: align || 'center', minWidth, formatter }, isObject(columnProps) ? columnProps : Object.create(null));
      });
    }
  },
  data() {
    return {
      model: null,
      list: []
    };
  },
  created() {
    this.model = this.getTagInitValues();
  },
  methods: {
    renderForm(h) {
      const formContent = this.formConfig.reduce((preVal, curVal) => {
        preVal.push(h('el-wp-form-item', {
          props: curVal.formItemProps
        }, [h(curVal.tag, {
          props: assign({
            value: this.model[curVal.formItemProps.prop]
          }, curVal.tagProps),
          on: {
            input: (val) => {
              this.model[curVal.formItemProps.prop] = val;
            }
          }
        })]));
        return preVal;
      }, []);
      const position = this.labelPosition || this.formProps.labelPosition;
      return h('el-wp-form', {
        props: assign({
          colCount: this.colCount,
          gutter: this.gutter,
          model: this.model,
          size: this.size,
          isShowCollapse: true,
          isInitCollapse: this.isInitCollapse,
          labelPosition: this.labelPosition,
          labelWidth: this.labelWidth,
          align: !position || position === 'top' ? 'middle' : 'top'
        }, this.formProps),
        on: {
          search: this.handleSearch,
          reset: this.handleReset
        },
        ref: 'wpForm'
      }, formContent);
    },
    renderTable(h) {
      const columns = this.tableColumnsConfig.reduce((preVal, curVal) => {
        let scopedSlot = null;
        if (typeof this.$scopedSlots[curVal.prop] === 'function') {
          scopedSlot = { default: this.$scopedSlots[curVal.prop] };
        }
        preVal.push(h('el-wp-table-column', {
          props: curVal,
          scopedSlots: scopedSlot
        }));
        return preVal;
      }, []);
      return h('el-wp-table', {
        props: assign({
          size: this.size,
          rowKey: this.rowKey,
          maxSelect: this.maxSelect,
          loadData: this.realLoadData,
          pageSize: this.pageSize,
          paginationKey: this.paginationKey,
          isServer: this.isServer,
          paginationProps: { align: 'center' }
        }, this.tableProps),
        style: { marginTop: '20px' },
        ref: 'wpTable',
        on: {
          pagination: () => {
            if (this.autoScrollTop) {
              scrollIntoView(this.$el, undefined, this.$el);
            }
          }
        }
      }, columns.concat([
        h('template', {slot: 'toolbar-prefix'}, this.$slots.toolbarPrefix || this.$slots['toolbar-prefix']),
        h('template', {slot: 'toolbar-suffix'}, this.$slots.toolbarSuffix || this.$slots['toolbar-suffix'])
      ]));
    },
    // 获取搜索表单的初始值
    getTagInitValues() {
      return this.formConfig.reduce((preVal, curVal) => {
        preVal[curVal.formItemProps.prop] = curVal.tagInitValue;
        return preVal;
      }, {});
    },
    realLoadData(pagination) {
      const params = assign(Object.create(null), pagination, this.model);
      const formatParams = this.formatParams(params);
      return this.loadData(params, formatParams);
    },
    formatParams(params) {
      return Object.keys(params).reduce((preVal, curVal) => {
        const value = params[curVal];
        // 去除所有为空得参数
        if (!(isEmpty(value) && value !== 0)) {
          preVal[curVal] = value;
        }
        return preVal;
      }, Object.create(null));
    },
    // 获取table实例
    getTableInstance() {
      return this.$refs.wpTable;
    },
    // 获取表单实例
    getFormInstance() {
      return this.$refs.wpForm;
    },
    // 搜索
    handleSearch(openSearching, closeSearching) {
      openSearching();
      this.refresh(true).then(closeSearching).catch(closeSearching);
    },
    handleReset(openResetting, closeResetting) {
      openResetting();
      this.model = this.getTagInitValues();
      this.refresh(true).then(closeResetting).catch(closeResetting);
    },
    // 刷新
    refresh(isForce) {
      return this.getTableInstance().refresh(isForce);
    },
    // 获取选择的
    getSelected() {
      return this.getTableInstance().getSelected();
    }
  },
  render(h) {
    return h('div', null, [this.renderForm(h), this.renderTable(h)]);
  }
};
</script>
