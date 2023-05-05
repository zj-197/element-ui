import LoadList from './src/main';

/* istanbul ignore next */
LoadList.install = function(Vue) {
  Vue.component(LoadList.name, LoadList);
};

export default LoadList;
