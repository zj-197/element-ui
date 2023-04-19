import WpSearchTable from './src/main';

/* istanbul ignore next */
WpSearchTable.install = function(Vue) {
  Vue.component(WpSearchTable.name, WpSearchTable);
};

export default WpSearchTable;
