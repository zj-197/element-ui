import WpDatePicker from './src/main';

/* istanbul ignore next */
WpDatePicker.install = function(Vue) {
  Vue.component(WpDatePicker.name, WpDatePicker);
};

export default WpDatePicker;
