import WpTable from './src/main';

/* istanbul ignore next */
WpTable.install = function(Vue) {
  Vue.component(WpTable.name, WpTable);
};

export default WpTable;
