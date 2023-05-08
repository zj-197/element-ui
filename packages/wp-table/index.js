import ElWpTable from './src/main';

/* istanbul ignore next */
ElWpTable.install = function(Vue) {
  Vue.component(ElWpTable.name, ElWpTable);
};

export default ElWpTable;
