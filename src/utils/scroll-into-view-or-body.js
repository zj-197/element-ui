import { getScrollContainer } from 'wp-element-ui/src/utils/dom';
import Vue from 'vue';
function getPosition(scrollDirection) {
  return Math.floor(document.documentElement[scrollDirection] || document.body.parentNode[scrollDirection] || document.body[scrollDirection] || 0);
}
function isDocument(container) {
  return [document.body, document, window, document.documentElement].indexOf(container) >= 0;
}
function move(amount, scrollDir) {
  document.documentElement[scrollDir] = amount;
  document.body.parentNode[scrollDir] = amount;
  document.body[scrollDir] = amount;
}
function requestAnimFrame(callback) {
  if (typeof window === 'undefined') {
    setTimeout(callback, 1000 / 60);
  } else {
    const fn = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    if (typeof fn === 'function') {
      fn(callback);
    } else {
      setTimeout(callback, 1000 / 60);
    }
  }
}
// 缓动函数
function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
}
/**
 * @description 跳转到指定位置
 * @param {HTMLElement}  [element]
 * @param {number}  [to]- 跳转位置
 * @param {number} [duration] - 动画持续时间
 * @param {'horizontal'|'vertical'} [direction] - 滚动方向 vertical or horizontal
 * @param {Function} [callback] - 滚动到指定selected结束后的回调
 * @return {undefined}
 */
export function scrollTo(element, to, duration, direction, callback) {
  to = to || 0;
  element = element || document.body;
  duration = duration || 500;
  const scrollDirection = direction === 'horizontal' ? 'scrollLeft' : 'scrollTop';
  const start = element[scrollDirection];
  const change = to - start;
  const increment = 20;
  let currentTime = 0;
  const animateScroll = function() {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const moveVal = easeInOutQuad(currentTime, start, change, duration);
    if (isDocument(element)) {
      move(moveVal, scrollDirection);
    } else {
      element[scrollDirection] = moveVal;
    }
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof callback === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };
  animateScroll();
}

/**
 * @description 跳转到指定位置
 * @param {Element} [container] - 容器元素
 * @param {Element} [scrollContainer] - 滚动容器元素
 * @param {Element} [selected] - 要跳转到element元素, 如果不传就回到顶部
 * @param {number} [duration] - 动画持续时间
 * @param {'horizontal'|'vertical'} [direction] - 滚动方向 vertical or horizontal
 * @param {Function} [callback] - 滚动到指定selected结束后的回调
 * @return {undefined}
 */
export function scrollIntoView(container, scrollContainer, selected, duration, direction, callback) {
  if (Vue.prototype.$isServer) return;
  container = scrollContainer ? container : getScrollContainer(container, direction !== 'horizontal');
  scrollContainer = scrollContainer || container;
  if (!container) return;
  const scrollDirection = direction === 'horizontal' ? 'scrollLeft' : 'scrollTop';
  const offsetDirection = direction === 'horizontal' ? 'offsetLeft' : 'offsetTop';
  const offsetReact = direction === 'horizontal' ? 'offsetWidth' : 'offsetHeight';
  const clientReact = direction === 'horizontal' ? 'clientWidth' : 'clientHeight';
  if (!selected) {
    scrollTo(scrollContainer, 0, duration, direction, callback);
    return;
  }
  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top = selected[offsetDirection] + offsetParents.reduce((prev, curr) => (prev + curr[offsetDirection]), 0);
  const bottom = top + selected[offsetReact];
  const viewRectTop = isDocument(scrollContainer) ? getPosition(scrollDirection) : Math.floor(scrollContainer[scrollDirection]);
  const viewRectBottom = viewRectTop + scrollContainer[clientReact];

  if (top < viewRectTop) {
    // container[scrollDirection] = top
    scrollTo(scrollContainer, top, duration, direction, callback);
  } else if (bottom > viewRectBottom) {
    // container[scrollDirection] = bottom - container[clientReact]
    scrollTo(scrollContainer, bottom - scrollContainer[clientReact], duration, direction, callback);
  }
}
