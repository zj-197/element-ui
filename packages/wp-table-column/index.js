import ElWpTableColumn from '../wp-table/src/table-column';

/* istanbul ignore next */
ElWpTableColumn.install = function(Vue) {
  Vue.component(ElWpTableColumn.name, ElWpTableColumn);
};

export default ElWpTableColumn;
