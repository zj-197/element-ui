import WpFormItem from '../wp-form/src/form-item';

/* istanbul ignore next */
WpFormItem.install = function(Vue) {
  Vue.component(WpFormItem.name, WpFormItem);
};

export default WpFormItem;
