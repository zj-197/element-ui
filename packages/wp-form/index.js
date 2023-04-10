import WpForm from './src/main';

/* istanbul ignore next */
WpForm.install = function(Vue) {
  Vue.component(WpForm.name, WpForm);
};

export default WpForm;
