<template>
  <div class="el-tabs__active-bar" :class="`is-${ rootTabs.tabPosition }`" :style="barStyle"></div>
</template>
<script>
  import { arrayFind } from 'element-ui/src/utils/util';
  export default {
    name: 'TabBar',

    props: {
      tabs: Array
    },

    inject: ['rootTabs'],

    computed: {
      barStyle: {
        get() {
          let style = {};
          let offset = 0;
          let tabSize = 0;
          const sizeName = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
          const sizeDir = sizeName === 'width' ? 'x' : 'y';
          const firstUpperCase = str => {
            return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
          };
          this.tabs.every((tab, index) => {
            let $el = arrayFind(this.$parent.$refs.tabs || [], t => t.id.replace('tab-', '') === tab.paneName);
            if (!$el) { return false; }

            if (!tab.active) {
              offset += $el[`client${firstUpperCase(sizeName)}`];
              return true;
            } else {
              tabSize = $el[`client${firstUpperCase(sizeName)}`];
              const tabStyles = window.getComputedStyle($el);
              if (sizeName === 'width' && this.tabs.length > 1) {
                tabSize -= parseFloat(tabStyles.paddingLeft) + parseFloat(tabStyles.paddingRight);
              }
              if (sizeName === 'width') {
                offset += parseFloat(tabStyles.paddingLeft);
              }
              return false;
            }
          });

          const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`;
          const ratio = (this.rootTabs && this.rootTabs.activeBarRatio) || 0;
          const width = (this.rootTabs && this.rootTabs.activeBarWidth) || '';
          const height = (this.rootTabs && this.rootTabs.activeBarHeight) || '';
          const color = (this.rootTabs && this.rootTabs.activeBarColor) || (this.$ELEMENT ? this.$ELEMENT.tabsActiveBarBg : '');
          style[sizeName] = tabSize + 'px';
          if (ratio > 1) {
            style[sizeName] = Math.floor(tabSize / ratio) + 'px';
            const ratioSize = Math.floor((tabSize - parseInt(style[sizeName], 10)) / 2);
            if (sizeDir === 'x') {
              style.left = ratioSize + 'px';
            } else {
              style.top = ratioSize + 'px';
            }
          }
          if (width) {
            style.width = width;
          }
          if (height) {
            style.height = height;
          }
          if (color) {
            style.background = color;
          }
          if (width && sizeDir === 'x') {
            style.left = Math.floor((tabSize - parseInt(width, 10)) / 2) + 'px';
          }
          if (height && sizeDir === 'y') {
            style.top = Math.floor((tabSize - parseInt(height, 10)) / 2) + 'px';
          }
          style.transform = transform;
          style.msTransform = transform;
          style.webkitTransform = transform;

          return style;
        }
      }
    }
  };
</script>
