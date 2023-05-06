import RenderEmptyCpn from './src/main';

/* istanbul ignore next */
RenderEmptyCpn.install = function(Vue) {
  Vue.component(RenderEmptyCpn.name, RenderEmptyCpn);
};

export default RenderEmptyCpn;
