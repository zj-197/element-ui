import Tooltip from './src/main';
import directive from './src/directive';
import Vue from 'vue';

Vue.directive('tooltip-mul', directive);
/* istanbul ignore next */
Tooltip.install = function(Vue) {
  Vue.component(Tooltip.name, Tooltip);
  Vue.directive('tooltip-mul', directive);
};

export default Tooltip;
