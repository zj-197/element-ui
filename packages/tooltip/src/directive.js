/**
 * @Author: 左建
 * @Date: 2023/5/12 16:55
 * @LastEditTime: 2023/5/12 16:55
 * @Description: tool指令方式，通常在页面中有多个提示的地方用到
*/
import debounce from 'throttle-debounce/debounce';
import {on, off} from 'element-ui/src/utils/dom';
function resisterEvents(el, binding, vnode) {
  el.__ElementToolTipTriggerFn = debounce(50, tooltip => tooltip.handleShowPopper());
  const bindValue = el.__ElementToolTipBindingValue__;
  const tooltipContent = bindValue || (el.dataset ? el.dataset.tooltipContent : undefined) || ''; // 在元素上通过data-tooltip-content进行设置
  const tooltip = vnode.context.$refs[binding.arg];
  const isOverflow = binding.modifiers.overflow;
  el.__ElTooltipEnterEvent__ = () => {
    if (isOverflow && el.scrollWidth <= el.clientWidth) return;
    if (tooltip) {
      tooltip.referenceElm = el;
      tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
      tooltip.doDestroy();
      tooltip.setContent(tooltipContent);
      tooltip.setExpectedState(true);
      el.__ElementToolTipTriggerFn(tooltip);
    }
  };
  el.__ElTooltipLeaveEvent__ = () => {
    if (isOverflow && el.scrollWidth <= el.clientWidth) return;
    if (tooltip) {
      tooltip.setExpectedState(false);
      tooltip.handleClosePopper();
    }
  };
  on(el, 'mouseenter', el.__ElTooltipEnterEvent__);
  on(el, 'mouseleave', el.__ElTooltipLeaveEvent__);
}
export default {
  inserted(el, binding, vnode) {
    el.__ElementToolTipBindingValue__ = binding.value;
    resisterEvents(el, binding, vnode);
  },
  update(el, binding) {
    el.__ElementToolTipBindingValue__ = binding.value;
  },
  unbind(el) {
    off(el, 'mouseenter', el.__ElTooltipEnterEvent__);
    off(el, 'mouseleave', el.__ElTooltipLeaveEvent__);
    el.__ElTooltipEnterEvent__ = null;
    el.__ElTooltipLeaveEvent__ = null;
    el.__ElementToolTipTriggerFn = null;
    el.__ElementToolTipBindingValue__ = null;
  }
};
