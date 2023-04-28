// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
import { toObject } from 'element-ui/src/utils/util';
import { isFirefox } from 'element-ui/src/utils/util';
import Bar from './bar';
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
/* istanbul ignore next */
export default {
  name: 'ElScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  render(h) {
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ this.handleScroll }
        class={ [this.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }>
        { [view] }
      </div>
    );
    let nodes;

    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          move={ this.moveX }
          size={ this.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }></Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 'el-scrollbar__wrap'] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    return h('div', { class: 'el-scrollbar' }, nodes);
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap;

      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    },
    updateBar() {
      this.$nextTick().then(() => {
        this.handleScroll(); // 更新thumb位置
        this.update(); // 更新thumb长度
      });
    },
    handleWheelScroll(e) {
      const wrapEL = this.wrap;
      if (!wrapEL) return;
      const { clientWidth, scrollWidth, clientHeight, scrollHeight } = wrapEL;
      // 当只能横向滚动时才进行处理
      if (scrollWidth > clientWidth && clientHeight === scrollHeight) {
        e.preventDefault();
        const eventDelta = -(e.wheelDelta || -e.deltaY * 40);
        const scrollLeft = wrapEL.scrollLeft + (eventDelta / 4);
        this.scrollTo(scrollLeft, 30, 'horizontal');
      }
    },
    /**
     * @description 跳转到指定位置
     * @param {Element} [selected] - 要跳转到element元素, 如果不传就回到顶部
     * @param {number} [duration] - 动画持续时间
     * @param {'horizontal'|'vertical'} [direction] - 滚动方向 vertical or horizontal
     * @param {Function} [callback] - 滚动到指定selected结束后的回调
     * @return {undefined}
     */
    scrollIntoView(selected, duration, direction, callback) {
      if (this.$isServer) return;
      const container = this.$el;
      if (!container) return;
      const scrollDirection = direction === 'horizontal' ? 'scrollLeft' : 'scrollTop';
      const offsetDirection = direction === 'horizontal' ? 'offsetLeft' : 'offsetTop';
      const offsetReact = direction === 'horizontal' ? 'offsetWidth' : 'offsetHeight';
      const clientReact = direction === 'horizontal' ? 'clientWidth' : 'clientHeight';
      if (!selected) {
        this.scrollTo(0, duration, direction, callback);
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
      const viewRectTop = container[scrollDirection];
      const viewRectBottom = viewRectTop + container[clientReact];

      if (top < viewRectTop) {
        // container[scrollDirection] = top
        this.scrollTo(top, duration, direction, callback);
      } else if (bottom > viewRectBottom) {
        // container[scrollDirection] = bottom - container[clientReact]
        this.scrollTo(bottom - container[clientReact], duration, direction, callback);
      }
    },
    /**
     * @description 跳转到指定位置
     * @param {number}  [to]- 跳转位置
     * @param {number} [duration] - 动画持续时间
     * @param {'horizontal'|'vertical'} [direction] - 滚动方向 vertical or horizontal
     * @param {Function} [callback] - 滚动到指定selected结束后的回调
     * @return {undefined}
     */
    scrollTo(to, duration = 250, direction, callback) {
      to = to || 0;
      const element = this.wrap;
      if (!element) return;
      const scrollDirection = direction === 'horizontal' ? 'scrollLeft' : 'scrollTop';
      const start = element[scrollDirection];
      const change = to - start;
      const increment = 20;
      let currentTime = 0;
      const animateScroll = function() {
        // increment the time
        currentTime += increment;
        // find the value with the quadratic in-out easing function
        element[scrollDirection] = easeInOutQuad(currentTime, start, change, duration);
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
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
    this.$el.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', this.handleWheelScroll);
  },

  beforeDestroy() {
    if (this.native) return;
    this.$el.removeEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', this.handleWheelScroll);
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
