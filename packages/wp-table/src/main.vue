<script>
import ElPagination from 'element-ui/packages/pagination';
import ElTable from 'element-ui/packages/table';
import ElEmpty from 'element-ui/packages/empty';
import ElButton from 'element-ui/packages/button';
import {isObject} from 'element-ui/src/utils/types';
import ToolBar from './ToolBar.vue';
import {findIndex, assign, find} from 'element-ui/src/utils/lodash';
import { noop } from 'element-ui/src/utils/util';
import Locale from 'element-ui/src/mixins/locale';
import { t } from 'element-ui/src/locale';
import ElWpTableColumn from 'element-ui/packages/wp-table-column';
export default {
  name: 'ElWpTable',
  props: {
    // 加载按钮的文字
    emptyBtnText: {
      type: String,
      default: t('el.wpCommon.reload')
    },
    // 为空时的图片
    emptyImage: {
      type: String
    },
    errorImage: String, // 错误时的图片
    // 加载按钮点击事件的处理
    onEmptyBtnClick: {
      type: Function
    },
    // 当表格多选时rowKey为必填
    maxSelect: {
      type: Number
    },
    // 多选表格时是否保存之前选中的
    reserveSelection: {
      type: Boolean,
      default: true
    },
    // 分页相关key
    paginationKey: {
      type: Object,
      default() {
        return Object.create(null);
      }
    },
    // 分页组件的props
    paginationProps: {
      type: Object,
      default() {
        return Object.create(null);
      }
    },
    // 默认的pageSize
    pageSize: {
      type: Number,
      default: 20
    },
    // 加载数据
    loadData: {
      type: Function,
      required: true
    },

    size: {
      type: String,
      default: 'mini'
    },

    width: {
      type: String,
      default: '100%'
    },

    height: [String, Number],

    maxHeight: [String, Number],

    fit: {
      type: Boolean,
      default: true
    },

    stripe: {
      type: Boolean,
      default: true
    },

    border: {
      type: Boolean,
      default: true
    },

    rowKey: {
      type: String,
      default: 'id',
      required: true
    },

    context: {},

    showHeader: {
      type: Boolean,
      default: true
    },

    showSummary: Boolean,

    sumText: String,

    summaryMethod: Function,

    rowClassName: [String, Function],

    rowStyle: [Object, Function],

    cellClassName: [String, Function],

    cellStyle: [Object, Function],

    headerRowClassName: [String, Function],

    headerRowStyle: [Object, Function],

    headerCellClassName: [String, Function],

    headerCellStyle: [Object, Function],

    highlightCurrentRow: {
      type: Boolean,
      default: true
    },

    currentRowKey: [String, Number],

    emptyText: String,

    expandRowKeys: Array,

    defaultExpandAll: Boolean,

    defaultSort: Object,

    tooltipEffect: String,

    spanMethod: Function,

    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },

    indent: {
      type: Number,
      default: 16
    },

    lazy: Boolean,

    load: Function,

    treeProps: {
      type: Object,
      default() {
        return {
          hasChildren: 'hasChildren',
          children: 'children'
        };
      }
    },
    // 是否显示刷新选项
    isShowRefreshTool: {
      type: Boolean,
      default: true
    },
    // 是否显示设置选项
    isShowSettingTool: {
      type: Boolean,
      default: true
    },
    // 是否显示大小
    isShowSizeTool: {
      type: Boolean,
      default: true
    },
    toolAlign: {
      type: String,
      validator(val) {
        return [undefined, '', 'left', 'right'].indexOf(val) > -1;
      }
    },
    loadingText: String
  },
  mixins: [Locale],
  data(vm) {
    const rootPagination = vm.$ELEMENT ? vm.$ELEMENT.paginationKey || Object.create(null) : Object.create(null);
    const realPaginationKey = assign({
      page: 'page',
      pageSize: 'pageSize',
      total: 'total',
      list: 'list' // 列表记录字段key
    }, rootPagination, vm.paginationKey);
    return {
      tableList: [], // 列表数据
      pagination: {
        [realPaginationKey.page]: 1,
        [realPaginationKey.pageSize]: vm.pageSize,
        [realPaginationKey.total]: 0
      },
      isError: false, // 是否加载错误
      isLoading: true, // 是否加载中
      selected: [], // 默认选中的selected
      tableSize: this.size,
      controlTableColumns: [] // 受控制的el-tableColumns
    };
  },
  watch: {
    size(val) {
      this.tableSize = val;
    }
  },
  components: {
    ElPagination,
    ToolBar,
    ElTable,
    ElButton,
    ElEmpty,
    ElWpTableColumn
  },
  computed: {
    // loadData是否是函数
    loadDataIsFn({loadData}) {
      return typeof loadData === 'function';
    },
    realEmptyImage() {
      return this.emptyImage || (this.$ELEMENT ? this.$ELEMENT.emptyImage : undefined);
    },
    realErrorImage() {
      return this.errorImage || (this.$ELEMENT ? this.$ELEMENT.errorImage : undefined) || this.realEmptyImage;
    },
    // 表格列表数据
    listData({loadDataIsFn}) {
      return loadDataIsFn ? this.tableList : this.loadData;
    },
    columnUUidMapValue() {
      return this.controlTableColumns.reduce((preVal, curVal) => {
        preVal[curVal.columnUUid] = curVal;
        return preVal;
      }, Object.create(null));
    },
    realPaginationKey() {
      const rootPagination = this.$ELEMENT ? this.$ELEMENT.paginationKey || Object.create(null) : Object.create(null);
      return assign({
        page: 'page',
        pageSize: 'pageSize',
        total: 'total',
        list: 'list' // 列表记录字段key
      }, rootPagination, this.paginationKey);
    }
  },
  created() {
    if (!this.$isServer && this.loadDataIsFn) {
      this.getTableList(this.pagination);
    }
    if (!this.$isServer) {
      // 监听来自tableColumn的变化
      this.$on('columnPropValueChange', this.onTableColumnPropChange);
    }
  },
  mounted() {
    const children = this.$vnode.componentOptions ? this.$vnode.componentOptions.children : [];
    if (Array.isArray(children) && children.length > 0) {
      children.forEach((vnode, index) => {
        if (vnode.componentInstance) {
          vnode.componentInstance.originOrder = index;
        }
      });
      this.setControlTableColumns();
    }
  },
  methods: {
    // 这点需要根据实际开发进行修改
    getTableList(pagination) {
      const {
        [this.realPaginationKey.page]: page,
        [this.realPaginationKey.pageSize]: pageSize
      } = pagination;
      this.isLoading = true;
      return this.loadData({
        [this.realPaginationKey.page]: page,
        [this.realPaginationKey.pageSize]: pageSize
      }).then(res => {
        if (res && isObject(res) && Object.keys(res).length > 0) {
          this.tableList = res[this.realPaginationKey.list] || [];
          Object.keys(this.pagination).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(res, key)) {
              this.setPagination(key, res[key]);
            }
          });
        } else {
          this.tableList = [];
        }
        if (this.isError) {
          this.isError = false;
        }
        this.$emit('loaded', this.isError, assign({
          [this.realPaginationKey.list]: this.tableList
        }, this.pagination));
        this.isLoading = false;
        return {
          isError: this.isError
        };
      }).catch(e => {
        this.tableList = [];
        this.isError = true;
        this.$emit('loaded', this.isError, assign({
          [this.realPaginationKey.list]: this.tableList
        }, this.pagination));
        this.isLoading = false;
        throw e;
      });
    },
    // 强制刷新表格数据
    refresh(isForce) {
      const page = this.pagination[this.realPaginationKey.page];
      const pageSize = this.pagination[this.realPaginationKey.pageSize];
      // 是否强制刷新回到第一页
      if (isForce) {
        return this.getTableList({
          [this.realPaginationKey.page]: 1,
          [this.realPaginationKey.pageSize]: pageSize
        }).then(res => {
          this.clearSelection();
          return res;
        });
      } else {
        return this.getTableList({
          [this.realPaginationKey.page]: page,
          [this.realPaginationKey.pageSize]: pageSize
        });
      }
    },
    // 处理分页
    handlePagination(pagination) {
      if (this.loadDataIsFn) {
        this.getTableList({
          [this.realPaginationKey.page]: pagination.page,
          [this.realPaginationKey.pageSize]: pagination.pageSize
        });
      }
      this.$emit('pagination', pagination);
    },
    // 获取表格实例
    getTableVm() {
      return this.$refs.wpTable;
    },
    // 设置pagination数据
    setPagination(key, value) {
      this.$set(this.pagination, key, value);
    },
    clearSelection() {
      const tableVm = this.getTableVm();
      tableVm && tableVm.clearSelection();
    },
    onSelectable(row) {
      const selected = this.selected;
      if (!this.maxSelect || !(Array.isArray(selected) && selected.length > 0)) return true;
      const rowKey = this.rowKey;
      const index = findIndex(selected, item => {
        const value = isObject(item) ? item[rowKey] : item;
        return value + '' === row[rowKey] + '';
      });
      return selected.length >= this.maxSelect ? index !== -1 : true;
    },
    setSelected(list) {
      if (Array.isArray(list)) {
        const tableVm = this.getTableVm();
        tableVm.clearSelection();
        list.forEach(item => {
          const currentRow = find(this.tableList, row => {
            const value = isObject(item) ? item[this.rowKey] : item;
            return value + '' === row[this.rowKey] + '';
          });
          tableVm.toggleRowSelection(currentRow);
        });
      }
    },
    getSelected() {
      return this.selected || [];
    },
    // 获取受控制的列
    getElTableColumns() {
      // 所有写在wp-table里面的vnode节点都在这
      const children = this.$vnode.componentOptions ? this.$vnode.componentOptions.children : null;
      return Array.isArray(children) ? children.filter(this.checkIsElTableColumn) : [];
    },
    handleSelectionChange(list) {
      if (this.maxSelect && list.length > this.maxSelect) {
        const tableVm = this.getTableVm();
        tableVm.clearSelection(); // 用于多选表格，清空用户的选择
        for (let i = 0; i < this.maxSelect; i++) {
          // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
          tableVm.toggleRowSelection(list[i]);
        }
        return;
      }
      const listClone = list.map(item => item[this.rowKey]);
      this.selected = listClone;
      this.$emit('selection-change', listClone, list);
    },
    // 渲染slot为空的插槽
    renderEmpty(h) {
      const scoped = typeof this.$scopedSlots.empty === 'function' ? this.$scopedSlots.empty({
        isError: this.isError,
        isLoading: this.isLoading
      }) : null;
      if (scoped) return scoped;
      if (this.$slots.empty) return this.$slots.empty;
      return (
        <el-empty class={{'el-wp-table-empty-is-loading': this.isLoading}}
          image={this.isError ? this.realErrorImage : this.realEmptyImage}
          description={this.isError ? this.t('el.image.error') : this.emptyText} image-size={100} style="line-height: 16px">
          <el-button type="primary" size="mini"
            on-click={() => {
              if (this.isError) {
                this.refresh(false);
              } else {
                if (typeof this.onEmptyBtnClick === 'function') {
                  this.onEmptyBtnClick();
                } else {
                  this.refresh(false);
                }
              }
            }}>{this.isError ? this.t('el.wpCommon.reload') : this.emptyBtnText}</el-button>
        </el-empty>
      );
    },
    // 渲染分页
    renderPagination(h) {
      return h('el-pagination', {
        props: assign({
          total: this.pagination[this.realPaginationKey.total],
          pageSize: this.pagination[this.realPaginationKey.pageSize],
          currentPage: this.pagination[this.realPaginationKey.page]
        }, this.paginationProps),
        on: {
          'size-change': val => this.handlePagination({
            page: this.pagination[this.realPaginationKey.page],
            pageSize: val
          }),
          'current-change': val => this.handlePagination({
            page: val,
            pageSize: this.pagination[this.realPaginationKey.pageSize]
          }),
          'update:pageSize': val => {
            this.pagination[this.realPaginationKey.pageSize] = val;
          },
          'update:currentPage': val => {
            this.pagination[this.realPaginationKey.page] = val;
          }
        }
      });
    },
    // 手动设置受控制的列
    setControlTableColumns() {
      const getValue = (vnode, key) => {
        if (vnode.componentInstance) {
          return vnode.componentInstance[key];
        }
        return vnode.componentOptions.propsData[key];
      };
      this.controlTableColumns = this.getElTableColumns().map(vNode => {
        const isShow = getValue(vNode, 'isShow');
        const order = getValue(vNode, 'order');
        return {
          label: getValue(vNode, 'label'),
          fixed: getValue(vNode, 'customFixed'),
          isShow: typeof isShow === 'boolean' ? isShow : true, // 是否显示
          originOrder: getValue(vNode, 'originOrder'), // 原始排序order
          order: typeof order === 'undefined' ? getValue(vNode, 'originOrder') : order, // 排序order
          columnUUid: getValue(vNode, 'columnUUid')
        };
      });
    },
    renderDefault(h) {
      // TODO 排序功能待思考怎么做
      return this.$slots.default;
    },
    getTableColumnVmByUUid(columnUUid) {
      return find(this.getElTableColumns(), vnode => vnode.componentInstance.columnUUid === columnUUid);
    },
    // 渲染工具栏
    renderToolBar(h) {
      return h('ToolBar', {
        props: {
          isShowSizeTool: this.isShowSizeTool,
          isShowSettingTool: this.isShowSettingTool,
          isShowRefreshTool: this.isShowRefreshTool,
          controlTableColumns: this.controlTableColumns,
          tableSize: this.tableSize,
          justify: this.toolAlign
        },
        on: {
          onTableSize: (val) => {
            this.tableSize = val;
          },
          onToolSettingFixedChange: (item, fixed) => {
            const currentColumn = this.getTableColumnVmByUUid(item.columnUUid);
            if (currentColumn) {
              currentColumn.componentInstance.setFixed(fixed);
              item.fixed = fixed;
            }
          },
          onToolSettingCheckboxChange: (item) => {
            const isShowValue = !item.isShow;
            const currentColumn = this.getTableColumnVmByUUid(item.columnUUid);
            if (currentColumn) {
              currentColumn.componentInstance.setVisibleStatus(isShowValue);
              item.isShow = isShowValue;
            }
          },
          refresh: this.refresh,
          onCheckAllChange: (val) => {
            if (val) {
              this.getElTableColumns().forEach(vnode => {
                vnode.componentInstance.show();
              });
              this.controlTableColumns.forEach(item => {
                item.isShow = true;
              });
            } else {
              this.getElTableColumns().forEach(vnode => {
                vnode.componentInstance.hide();
              });
              this.controlTableColumns.forEach(item => {
                item.isShow = false;
              });
            }
          },
          cancelAllFixed: () => {
            this.getElTableColumns().forEach(vnode => {
              vnode.componentInstance.setFixed(undefined);
            });
            this.controlTableColumns.forEach(item => {
              item.fixed = undefined;
            });
          }
        }
      }, [
        h('template', {slot: 'toolbar-prefix'}, this.$slots.toolbarPrefix || this.$slots['toolbar-prefix']),
        h('template', {slot: 'toolbar-suffix'}, this.$slots.toolbarSuffix || this.$slots['toolbar-suffix'])
      ]);
    },
    checkIsElTableColumn(vnode) {
      return /ElWpTableColumn$/g.test(vnode.tag) && (vnode.componentInstance ? !!vnode.componentInstance.label && vnode.componentInstance.isAddToolBar : false);
    },
    onTableColumnPropChange(columnUUid, {prop, value}) {
      const selectItem = find(this.controlTableColumns, item => item.columnUUid === columnUUid);
      if (selectItem) {
        selectItem[prop] = value;
      }
    }
  },
  render(h) {
    return (
      <div style={{width: this.width}}>
        {this.renderToolBar(h)}
        <el-table
          ref="wpTable"
          class="el-wp-table"
          element-loading-text={this.loadingText || this.t('el.select.loading')}
          element-loading-background="rgba(255, 255, 255, 0.7)"
          v-loading={this.isLoading}
          on-selection-change={this.handleSelectionChange}
          on-select={this.$listeners.select || noop }
          on-select-all={this.$listeners['select-all'] || this.$listeners.selectAll || noop}
          on-cell-mouse-enter={this.$listeners['cell-mouse-enter'] || this.$listeners.cellMouseEnter || noop}
          on-cell-mouse-leave={this.$listeners['cell-mouse-leave'] || this.$listeners.cellMouseLeave || noop}
          on-cell-click={this.$listeners['cell-click'] || this.$listeners.cellClick || noop}
          on-cell-dblclick={this.$listeners['cell-dblclick'] || this.$listeners.cellDblclick || noop}
          on-row-click={this.$listeners['row-click'] || this.$listeners.rowClick || noop}
          on-row-contextmenu={this.$listeners['row-contextmenu'] || this.$listeners.rowContextmenu || noop}
          on-row-dblclick={this.$listeners['row-dblclick'] || this.$listeners.rowDblclick || noop}
          on-header-click={this.$listeners['header-click'] || this.$listeners.headerClick || noop}
          on-header-contextmenu={this.$listeners['header-contextmenu'] || this.$listeners.headerContextmenu || noop}
          on-sort-change={this.$listeners['sort-change'] || this.$listeners.sortChange || noop}
          on-filter-change={this.$listeners['filter-change'] || this.$listeners.filterChange || noop}
          on-current-change={this.$listeners['current-change'] || this.$listeners.currentChange || noop}
          on-header-dragend={this.$listeners['header-dragend'] || this.$listeners.headerDragend || noop}
          on-expand-change={this.$listeners['expand-change'] || this.$listeners.expandChange || noop}
          data={this.listData}
          size={this.tableSize}
          height={this.height}
          max-height={this.maxHeight}
          fit={this.fit}
          stripe={this.stripe}
          row-key={this.rowKey}
          border={this.border}
          context={this.context}
          show-header={this.showHeader}
          show-summary={this.showSummary}
          sum-text={this.sumText}
          summary-method={this.summaryMethod}
          row-class-name={this.rowClassName}
          row-style={this.rowStyle}
          cell-class-name={this.cellClassName}
          cell-style={this.cellStyle}
          header-cell-class-name={this.headerCellClassName}
          header-cell-style={this.headerCellStyle}
          header-row-class-name={this.headerRowClassName}
          header-row-style={this.headerRowStyle}
          highlight-current-row={this.highlightCurrentRow}
          current-row-key={this.currentRowKey}
          expand-row-keys={this.expandRowKeys}
          default-expand-all={this.defaultExpandAll}
          default-sort={this.defaultSort}
          tooltip-effect={this.tooltipEffect}
          span-method={this.spanMethod}
          select-on-indeterminate={this.selectOnIndeterminate}
          indent={this.indent}
          lazy={this.lazy}
          load={this.load}
          tree-props={this.treeProps}>
          {this.maxSelect && (
            <el-wp-table-column
              type="selection"
              width="50"
              fixed
              align="center"
              is-add-tool-bar={false}
              selectable={this.onSelectable}
              reserve-selection={this.reserveSelection}
              resizable={false}/>
          )}
          {this.renderDefault(h)}
          <template slot="append">{this.$slots.append}</template>
          <template slot="empty">{this.renderEmpty(h)}</template>
        </el-table>
        {this.renderPagination(h)}
      </div>
    );
  }
};
</script>
