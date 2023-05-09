import SugarButton from './src/main';

/* istanbul ignore next */
SugarButton.install = function(Vue) {
  Vue.component(SugarButton.name, SugarButton);
};

export default SugarButton;
