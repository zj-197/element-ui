import WpTableColumn from '../wp-table/src/table-column.vue';

/* istanbul ignore next */
WpTableColumn.install = function(Vue) {
  Vue.component(WpTableColumn.name, WpTableColumn);
};

export default WpTableColumn;
