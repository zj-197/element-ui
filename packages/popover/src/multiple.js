import {on, off} from 'element-ui/src/utils/dom';

function popoverDirective() {
  /** 给绑定元素注册mouseenter事件 */
  function registEvent(el, binding, vnode) {
    const {arg} = binding;
    const _this = vnode.context;
    const popper = _this.$refs[arg];
    const reference = el;
    _this.$nextTick(() => {
      // 修改参照属性为当前悬浮元素
      popper.referenceElm = reference;
      // 同时设置实例对象中的私有参照属性
      // （不得不改私有属性，不改就没法重新计算，popperJS 目录 'element-ui/src/utils/popper.js'）
      popper.popperJS && (popper.popperJS._reference = reference);
      // 根据新的参照重新计算位置
      popper.updatePopper();
      // 触发el-popover组件内部的handleMouseEnter事件
      if (binding.value === 'hover') {
        popper.handleMouseEnter();
        on(reference, 'keydown', popper.handleKeydown);
      } else if (binding.value === 'click') {
        popper.handleClick();
        popper.doToggle();
        on(document, 'click', popper.handleDocumentClick);
        on(reference, 'keydown', popper.handleKeydown);
      } else if (binding.value === 'focus') {
        popper.doShow();
        on(reference, 'keydown', popper.handleKeydown);
      }
    });
  }

  /** 给绑定元素注册mouseleave事件 */
  function registLeaveEvent(el, binding, vnode) {
    const {arg} = binding;
    const _this = vnode.context;
    const popper = _this.$refs[arg];
    if (binding.value === 'hover') {
      popper.handleMouseLeave();
    } else if (binding.value === 'focus') {
      popper.doClose();
    }
  }

  function bindEvent(el, binding) {
    if (binding.value === 'hover') {
      on(el, 'mouseenter', el.__EnterEvent__);
      on(el, 'mouseleave', el.__LeaveEvent__);
    } else if (binding.value === 'click') {
      on(el, 'click', el.__EnterEvent__);
    } else if (binding.value === 'focus') {
      if (el.querySelector('input, textarea')) {
        on(el, 'focusin', el.__EnterEvent__);
        on(el, 'focusout', el.__LeaveEvent__);
      } else {
        on(el, 'mousedown', el.__EnterEvent__);
        on(el, 'mouseup', el.__LeaveEvent__);
      }
    } else if (binding.value === 'manual') {
      el.__EnterEvent__(el);
    }
  }
  function offEvent(el, binding, vnode) {
    const popper = vnode.context.$refs[binding.arg];
    if (binding.value === 'hover') {
      off(el, 'mouseenter', el.__EnterEvent__);
      off(el, 'mouseleave', el.__LeaveEvent__);
      off(el, 'keydown', popper.handleKeydown);
    } else if (binding.value === 'click') {
      off(el, 'click', el.__EnterEvent__);
      off(el, 'keydown', popper.handleKeydown);
      off(document, 'click', popper.handleDocumentClick);
    } else if (binding.value === 'focus') {
      off(el, 'keydown', popper.handleKeydown);
      if (el.querySelector('input, textarea')) {
        off(el, 'focusin', el.__EnterEvent__);
        off(el, 'focusout', el.__LeaveEvent__);
      } else {
        off(el, 'mousedown', el.__EnterEvent__);
        off(el, 'mouseup', el.__LeaveEvent__);
      }
    }
  }

  return {
    bind(el, binding, vnode) {
      // 给el添加方法，方便销毁事件
      el.__EnterEvent__ = (e) => {
        registEvent(el, binding, vnode);
      };
      el.__LeaveEvent__ = (e) => {
        registLeaveEvent(el, binding, vnode);
      };
      bindEvent(el, binding);
    },
    inserted(el, binding) {
      bindEvent(el, binding);
    },
    unbind(el, binding, vnode) {
      offEvent(el, binding, vnode);
    }
  };
}

export default popoverDirective();
