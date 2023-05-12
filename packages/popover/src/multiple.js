import {on, off} from 'element-ui/src/utils/dom';
import Vue from 'vue';
/** 给绑定元素注册mouseenter事件 */
function registEvent(el, binding, vnode) {
  const {arg} = binding;
  const _this = vnode.context;
  let popper = _this.$refs[arg];
  const componentOptions = popper ? popper.$vnode.componentOptions : null;
  const isPopConfirm = componentOptions ? componentOptions.tag === 'el-popconfirm' : false;
  if (isPopConfirm) {
    popper = popper.$children[0];
  }
  const reference = el;
  _this.$nextTick(() => {
    // 修改参照属性为当前悬浮元素
    popper.referenceElm = reference;
    // 同时设置实例对象中的私有参照属性
    // （不得不改私有属性，不改就没法重新计算，popperJS 目录 'element-ui/src/utils/popper.js'）
    popper.popperJS && (popper.popperJS._reference = reference);
    // 根据新参照重新计算位置
    popper.updatePopper();
    // 触发el-popover组件内部的handleMouseEnter事件
    if (el.__ElPopoverTrigger__ === 'hover') {
      popper.handleMouseEnter();
      el.__ElPopoverHandleKeydown__ = popper.handleKeydown;
      on(reference, 'keydown', el.__ElPopoverHandleKeydown__);
    } else if (el.__ElPopoverTrigger__ === 'click') {
      popper.handleClick();
      popper.doToggle();
      el.__ElPopoverHandleDocumentClick__ = popper.handleDocumentClick;
      el.__ElPopoverHandleKeydown__ = popper.handleKeydown;
      on(document, 'click', el.__ElPopoverHandleDocumentClick__);
      on(reference, 'keydown', el.__ElPopoverHandleKeydown__);
    } else if (el.__ElPopoverTrigger__ === 'focus') {
      popper.doShow();
      el.__ElPopoverHandleKeydown__ = popper.handleKeydown;
      on(reference, 'keydown', el.__ElPopoverHandleKeydown__);
    }
  });
}

/** 给绑定元素注册mouseleave事件 */
function registLeaveEvent(el, binding, vnode) {
  const {arg} = binding;
  const _this = vnode.context;
  let popper = _this.$refs[arg];
  const componentOptions = popper ? popper.$vnode.componentOptions : null;
  const isPopConfirm = componentOptions ? componentOptions.tag === 'el-popconfirm' : false;
  if (isPopConfirm) {
    popper = popper.$children[0];
  }
  if (el.__ElPopoverTrigger__ === 'hover') {
    popper.handleMouseLeave();
  } else if (el.__ElPopoverTrigger__ === 'focus') {
    popper.doClose();
  }
}

function bindEvent(el) {
  if (el.__ElPopoverTrigger__ === 'hover') {
    on(el, 'mouseenter', el.__ElPopoverMulEnterEvent__);
    on(el, 'mouseleave', el.__ElPopoverMulLeaveEvent__);
  } else if (el.__ElPopoverTrigger__ === 'click') {
    on(el, 'click', el.__ElPopoverMulEnterEvent__);
  } else if (el.__ElPopoverTrigger__ === 'focus') {
    if (el.querySelector('input, textarea')) {
      on(el, 'focusin', el.__ElPopoverMulEnterEvent__);
      on(el, 'focusout', el.__ElPopoverMulLeaveEvent__);
    } else {
      on(el, 'mousedown', el.__ElPopoverMulEnterEvent__);
      on(el, 'mouseup', el.__ElPopoverMulLeaveEvent__);
    }
  } else if (el.__ElPopoverTrigger__ === 'manual') {
    el.__ElPopoverMulEnterEvent__(el);
  }
}

function offEvent(el) {
  if (el.__ElPopoverTrigger__ === 'hover') {
    off(el, 'mouseenter', el.__ElPopoverMulEnterEvent__);
    off(el, 'mouseleave', el.__ElPopoverMulLeaveEvent__);
    off(el, 'keydown', el.__ElPopoverHandleKeydown__);
  } else if (el.__ElPopoverTrigger__ === 'click') {
    off(el, 'click', el.__ElPopoverMulEnterEvent__);
    off(el, 'keydown', el.__ElPopoverHandleKeydown__);
    off(document, 'click', el.__ElPopoverHandleDocumentClick__);
  } else if (el.__ElPopoverTrigger__ === 'focus') {
    off(el, 'keydown', el.__ElPopoverHandleKeydown__);
    if (el.querySelector('input, textarea')) {
      off(el, 'focusin', el.__ElPopoverMulEnterEvent__);
      off(el, 'focusout', el.__ElPopoverMulLeaveEvent__);
    } else {
      off(el, 'mousedown', el.__ElPopoverMulEnterEvent__);
      off(el, 'mouseup', el.__ElPopoverMulLeaveEvent__);
    }
  }
  if (el.__ElPopoverHandleDocumentClick__) {
    el.__ElPopoverHandleDocumentClick__ = null;
  }
  if (el.__ElPopoverHandleKeydown__) {
    el.__ElPopoverHandleKeydown__ = null;
  }
  if (el.__ElPopoverMulEnterEvent__) {
    el.__ElPopoverMulEnterEvent__ = null;
  }
  if (el.__ElPopoverMulLeaveEvent__) {
    el.__ElPopoverMulLeaveEvent__ = null;
  }
}

export default {
  bind(el, binding, vnode) {
    if (Vue.prototype.$isServer) return;
    const popper = vnode.context.$refs[binding.arg];
    const componentOptions = popper ? popper.$vnode.componentOptions : null;
    const isPopConfirm = componentOptions ? componentOptions.tag === 'el-popconfirm' : false;
    if (componentOptions) {
      el.__ElPopoverTrigger__ = isPopConfirm ? 'click' : componentOptions.propsData.trigger || 'click';
    }
    // 给el添加方法，方便销毁事件
    el.__ElPopoverMulEnterEvent__ = (e) => {
      registEvent(el, binding, vnode);
    };
    el.__ElPopoverMulLeaveEvent__ = (e) => {
      registLeaveEvent(el, binding, vnode);
    };
    bindEvent(el);
  },
  inserted(el) {
    bindEvent(el);
  },
  unbind(el) {
    offEvent(el);
  }
};
