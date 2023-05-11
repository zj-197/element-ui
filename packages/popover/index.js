import Popover from './src/main';
import directive from './src/directive';
import multiple from './src/multiple';
import Vue from 'vue';

Vue.directive('popover', directive);
Vue.directive('popover-mul', multiple);
/* istanbul ignore next */
Popover.install = function(Vue) {
  Vue.directive('popover', directive);
  Vue.directive('popover-mul', multiple);
  Vue.component(Popover.name, Popover);
};
Popover.directive = directive;

export default Popover;
