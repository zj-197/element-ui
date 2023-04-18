<script>
import ElPagination from 'element-ui/packages/pagination';
import ElTable from 'element-ui/packages/table';
import ElEmpty from 'element-ui/packages/empty';
import ElButton from 'element-ui/packages/button';
import {isObject} from 'element-ui/src/utils/types';
import ToolBar from './ToolBar.vue';
import {findIndex, assign} from 'element-ui/src/utils/lodash';

export default {
  name: 'ElWpTable',
  props: {
    // 是否服务器渲染
    isServer: {
      type: Boolean,
      default: false
    },
    // 加载按钮的文字
    emptyBtnText: {
      type: String,
      default: '重新加载'
    },
    // 加载按钮点击事件的处理
    onEmptyBtnClick: {
      type: Function
    },
    // 当表格多选时rowKey为必填
    maxSelect: {
      type: Number,
      validator(val) {
        return val ? val > 0 : true;
      }
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
    // 分页布局方式
    paginationProps: {
      type: Object,
      default() {
        return Object.create(null);
      }
    },
    // 默认的pageSize
    pageSize: {
      type: Number,
      default: 10
    },
    // 加载数据
    loadData: {
      type: [Array, Function],
      required: true
    },

    size: {
      type: String,
      default: 'mini'
    },

    width: {
      type: [String, Number],
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
      required: true,
      default: 'id'
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
    }
  },
  data(vm) {
    const realPaginationKey = assign({
      page: 'page',
      pageSize: 'pageSize',
      total: 'total',
      tableList: 'list' // 列表记录字段key
    }, vm.paginationKey);
    return {
      tableList: [], // 列表数据
      pagination: {
        [realPaginationKey.page]: 1,
        [realPaginationKey.pageSize]: vm.pageSize,
        [realPaginationKey.total]: 0
      },
      isError: false, // 是否加载错误
      isLoading: false, // 是否加载中
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
    ElEmpty
  },
  computed: {
    // loadData是否是函数
    loadDataIsFn({loadData}) {
      return typeof loadData === 'function';
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
      return assign({
        page: 'page',
        pageSize: 'pageSize',
        total: 'total',
        tableList: 'list' // 列表记录字段key
      }, this.paginationKey);
    }
  },
  created() {
    if (this.loadDataIsFn && !this.$isServer && !this.isServer) {
      this.getTableList(this.pagination);
    }
    if (!this.$isServer) {
      // 监听来自tableColumn的变化
      this.$on('columnPropValueChange', this.onTableColumnPropChange);
    }
  },
  // 服务端渲染
  fetch() {
    if (this && this.loadDataIsFn && this.isServer) {
      return this.getTableList(this.pagination);
    }
    if (!this && process.env.NODE_ENV !== 'production') {
      console.error('fetch函数里面的逻辑不会被执行，请查看nuxt版本，建议使用2.15.8及以上的版本');
    }
  },
  mounted() {
    const children = this.$vnode.componentOptions ? this.$vnode.componentOptions.children : [];
    children.forEach((vnode, index) => {
      if (vnode.componentInstance) {
        vnode.componentInstance.originOrder = index;
      }
    });
    this.setControlTableColumns();
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
          this.tableList = res[this.realPaginationKey.tableList];
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
        this.$emit('loaded', this.isError, {
          ...this.pagination,
          [this.realPaginationKey.tableList]: this.tableList
        });
        this.isLoading = false;
        return {
          isError: this.isError
        };
      }).catch(e => {
        this.tableList = [];
        this.isError = true;
        this.$emit('loaded', this.isError, {
          ...this.pagination,
          [this.realPaginationKey.tableList]: this.tableList
        });
        this.isLoading = false;
        return e;
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
          const currentRow = this.tableList.find(row => {
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
          description={this.isError ? '加载失败' : this.emptyText} image-size={100} style="line-height: 16px">
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
            }}>{this.isError ? '重新加载' : this.emptyBtnText}</el-button>
        </el-empty>
      );
    },
    // 渲染分页
    renderPagination(h) {
      return h('el-pagination', {
        props: {
          ...this.paginationProps,
          total: this.pagination[this.realPaginationKey.total],
          pageSize: this.pagination[this.realPaginationKey.pageSize],
          currentPage: this.pagination[this.realPaginationKey.page]
        },
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
      return this.getElTableColumns().find(vnode => vnode.componentInstance.columnUUid === columnUUid);
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
      const selectItem = this.controlTableColumns.find(item => item.columnUUid === columnUUid);
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
          element-loading-text="加载中..."
          element-loading-background="rgba(255, 255, 255, 0.7)"
          v-loading={this.isLoading}
          on-selection-change={this.handleSelectionChange}
          {...{
            on: this.$listeners
          }}
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
            <el-table-column
              type="selection"
              width="50"
              fixed
              align="center"
              selectable={this.onSelectable}
              reserve-selection={this.reserveSelection}
              resizable={false}/>
          )}
          <template slot="append">{this.$slots.append}</template>
          <template slot="empty">{this.renderEmpty(h)}</template>
          <template slot="default">{this.renderDefault(h)}</template>
        </el-table>
        {this.renderPagination(h)}
      </div>
    );
  }
};
</script>
