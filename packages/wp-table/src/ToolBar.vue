<template>
  <el-row type="flex" justify="start" align="middle" style="margin-bottom: 20px">
    <slot name="toolbar-prefix"/>
    <div :class="'el-table-tools-bar-' + justify" v-if="isShowRefreshTool || isShowSizeTool || isShowSettingTool">
      <i v-if="isShowRefreshTool"
         title="刷新"
         @click.stop="handleRefresh"
         class="el-icon-refresh el-table-tools-icon-item"/>
      <el-dropdown v-if="isShowSizeTool" placement="bottom" @command="onSizeToolCommand">
           <span title="表格密度" class="el-table-tools-icon-item-size">
                <svg viewBox="64 64 896 896" focusable="false"
                     data-icon="column-height" width="19px" height="19px"
                     fill="currentColor" aria-hidden="true">
                    <path d="M840 836H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm0-724H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM610.8 378c6 0 9.4-7 5.7-11.7L515.7 238.7a7.14 7.14 0 00-11.3 0L403.6 366.3a7.23 7.23 0 005.7 11.7H476v268h-62.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V378h62.8z"/>
                </svg>
              </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="medium"
                            :class="{'is-active': tableSize === 'medium'}"
                            class="el-table-tool-size-bar-dropdown">默认</el-dropdown-item>
          <el-dropdown-item command="small"
                            :class="{'is-active': tableSize === 'small'}"
                            class="el-table-tool-size-bar-dropdown">中等</el-dropdown-item>
          <el-dropdown-item command="mini"
                            :class="{'is-active': tableSize === 'mini'}"
                            class="el-table-tool-size-bar-dropdown">紧凑</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-if="isShowSettingTool" placement="bottom" :hide-on-click="false" trigger="hover">
        <i title="设置" class="el-icon-setting el-table-tools-icon-item" v-if="isShowSettingTool"/>
        <el-dropdown-menu slot="dropdown">
          <el-row type="flex" align="middle" style="padding: 0 20px">
            <el-checkbox :indeterminate="isIndeterminate"
                         :value="isCheckAll"
                         title="全选"
                         @change="onCheckAllChange"></el-checkbox>
            <h3 class="el-table-setting-menu-title">设 置</h3>
            <el-button type="text"
                       @click.stop="handleCancelFixed"
                     style="margin-left: auto" icon="el-icon-refresh-right">全部取消固定</el-button>
          </el-row>
          <el-scrollbar :view-style="[{maxHeight: '300px'}]">
            <transition-group name="drag" tag="div">
              <!-- 暂时取消拖拽排序功能-->
              <el-dropdown-item
                v-for="(item) in controlTableColumns"
                :key="'setting-bar-dropdown-item' + item.columnUUid"
                :command="item.columnUUid">
                <el-checkbox :value="item.isShow"
                             @input="onToolSettingCheckboxChange(item)">
                  {{item.label}}
                </el-checkbox>
                <el-button type="primary" size="mini"
                           @click.stop="handleFixed(item, 'left')"
                           style="margin-left: 10px; padding: 7px"
                           :plain="!(item.fixed === 'left' || item.fixed === true)">固定在左侧</el-button>
                <el-button type="primary" size="mini"
                           style="padding: 7px"
                           :plain="item.fixed !== 'right'"
                           @click.stop="handleFixed(item, 'right')">固定在右侧</el-button>
                <el-button type="primary" size="mini"
                           style="padding: 7px"
                           :plain="!!item.fixed"
                           @click.stop="handleFixed(item, undefined)">取消固定</el-button>
              </el-dropdown-item>
            </transition-group>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <slot name="toolbar-suffix"/>
  </el-row>
</template>

<script>
import ElButton from 'element-ui/packages/button';
import ElDropdownMenu from 'element-ui/packages/dropdown-menu';
import ElDropdown from 'element-ui/packages/dropdown';
import ElDropdownItem from 'element-ui/packages/dropdown-item';
import ElRow from 'element-ui/packages/row';
import ElCheckbox from 'element-ui/packages/checkbox';
import ElScrollbar from 'element-ui/packages/scrollbar';
export default {
  name: 'ToolBar',
  props: {
    isShowRefreshTool: Boolean,
    isShowSizeTool: Boolean,
    isShowSettingTool: Boolean,
    // 水平排列方式，默认居右
    justify: {
      type: String,
      default: 'right'
    },
    controlTableColumns: Array,
    tableSize: String
  },
  components: {
    ElButton,
    ElDropdownMenu,
    ElDropdown,
    ElDropdownItem,
    ElRow,
    ElCheckbox,
    ElScrollbar
  },
  computed: {
    isCheckAll() {
      return this.controlTableColumns.every(item => item.isShow);
    },
    isIndeterminate() {
      return !this.isCheckAll && this.controlTableColumns.some(item => item.isShow);
    }
  },
  methods: {
    onSizeToolCommand(command) {
      this.$emit('onTableSize', command);
    },
    onToolSettingCheckboxChange(item) {
      this.$emit('onToolSettingCheckboxChange', item);
    },
    handleFixed(item, fixed) {
      this.$emit('onToolSettingFixedChange', item, fixed);
    },
    onCheckAllChange(val) {
      this.$emit('onCheckAllChange', val);
    },
    handleRefresh() {
      this.$emit('refresh');
    },
    handleCancelFixed() {
      this.$emit('cancelAllFixed');
    }
  }
};
</script>
