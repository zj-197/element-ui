
<script>
import ElTableColumn from 'element-ui/packages/table-column';
/**
 * @Author: 左建
 * @Date: 2023/3/21 15:07
 * @LastEditTime: 2023/3/21 15:07
 * @Description: api跟el-table-column保持一致，额外增加了一个hidden属性 是否隐藏，使用该组件时请用hidden属性代替v-if
 */
export default {
  name: 'ElWpTableColumn',
  components: {
    ElTableColumn
  },
  props: {
    // 是否隐藏，使用该组件时请用hidden属性取代v-if
    hidden: {
      type: Boolean,
      default: false
    },
    // 是否加入工具栏
    isAddToolBar: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: {
      type: [Boolean, String],
      default: undefined
    },
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default: function _default() {
        return ['ascending', 'descending', null];
      },
      validator: function validator(val) {
        return val.every(function(order) {
          return ['ascending', 'descending', null].indexOf(order) > -1;
        });
      }
    }
  },
  data() {
    return {
      customFixed: this.fixed,
      columnUUid: Math.floor(Math.random() * 1000000),
      isShow: !this.hidden
    };
  },
  watch: {
    label(value) {
      this.setChangeEvent({
        prop: 'label',
        value
      });
    },
    fixed(val) {
      this.setChangeEvent({
        prop: 'fixed',
        value: val
      });
      this.customFixed = val;
    },
    hidden(val) {
      this.setChangeEvent({
        prop: 'isShow',
        value: !val
      });
      this.isShow = !val;
    }
  },
  render(h) {
    if (!this.isShow) return null;
    return h('el-table-column', {
      props: {
        ...this.$props,
        fixed: this.customFixed
      },
      scopedSlots: {
        default: this.$scopedSlots.default,
        header: this.$scopedSlots.header
      },
      key: this.columnUUid
    }, [h('template', { slot: 'append' }, this.$slots.append)]);
  },
  methods: {
    setFixed(value) {
      this.$emit('update:fixed', value);
      this.customFixed = value;
    },
    show() {
      this.$emit('update:hidden', false);
      this.isShow = true;
    },
    hide() {
      this.$emit('update:hidden', true);
      this.isShow = false;
    },
    setVisibleStatus(value) {
      this.$emit('update:hidden', !value);
      this.isShow = value;
    },
    getParentIsZjTable() {
      return this.$parent && this.$parent.$parent && (this.$parent.$parent.$options._componentTag === 'el-wp-table');
    },
    setChangeEvent(obj) {
      if (this.getParentIsZjTable()) {
        this.$parent.$parent.$emit('columnPropValueChange', this.columnUUid, obj);
      }
    }
  }
};
</script>
