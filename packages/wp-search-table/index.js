import WpSearchTable from './src/main';
WpSearchTable.defineColumnsConfig = function(columns) {
  return columns;
};
/* istanbul ignore next */
WpSearchTable.install = function(Vue) {
  Vue.component(WpSearchTable.name, WpSearchTable);
};

export default WpSearchTable;
