<template>
  <li class="el-menu-item"
    role="menuitem"
    tabindex="-1"
    :style="[paddingStyle, menuItemStyle]"
    :class="{
      'is-active': active,
      'is-disabled': disabled,
      'is-hover-bg': realHoverBgIsActiveBg && active
    }"
    @click="handleClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <el-tooltip
      v-if="parentMenu.$options.componentName === 'ElMenu' && rootMenu.collapse && $slots.title"
      effect="dark"
      placement="right">
      <div slot="content"><slot name="title"></slot></div>
      <div style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 20px;">
        <slot></slot>
      </div>
    </el-tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>
<script>
  import Menu from './menu-mixin';
  import ElTooltip from 'element-ui/packages/tooltip';
  import Emitter from 'element-ui/src/mixins/emitter';
  import {assign} from 'element-ui/src/utils/lodash';
  import {isObject} from 'element-ui/src/utils/types';

  export default {
    name: 'ElMenuItem',

    componentName: 'ElMenuItem',

    mixins: [Menu, Emitter],

    components: { ElTooltip },

    props: {
      index: {
        default: null,
        validator: val => typeof val === 'string' || val === null
      },
      route: [String, Object],
      disabled: Boolean,
      itemStyle: Object,
      activeStyle: Object, // 激活时的样式
      hoverStyle: Object,
      hoverBgIsActiveBg: {
        type: Boolean,
        default: undefined
      }
    },
    data() {
      return {
        isHover: false
      };
    },
    computed: {
      active() {
        return this.index === this.rootMenu.activeIndex;
      },
      realHoverBgIsActiveBg() {
        if (typeof this.hoverBgIsActiveBg === 'boolean') return this.hoverBgIsActiveBg;
        return this.rootMenu.hoverBgIsActiveBg;
      },
      realHoverStyle() {
        const style = { background: this.rootMenu.hoverBackground };
        if (isObject(this.hoverStyle)) return assign({}, this.realItemStyle, style, this.hoverStyle);
        return assign({}, this.realItemStyle, style);
      },
      realItemStyle() {
        const style = {
          color: this.textColor,
          background: this.rootMenu.backgroundColor
        };
        if (isObject(this.itemStyle)) return assign(style, this.itemStyle);
        return style;
      },
      realActiveStyle() {
        const style = { color: this.activeTextColor };
        if (this.realHoverBgIsActiveBg && this.rootMenu.hoverBackground) {
          style.background = this.rootMenu.hoverBackground;
        }
        if (isObject(this.activeStyle)) return assign({}, this.realItemStyle, style, this.activeStyle);
        return assign({}, this.realItemStyle, style);
      },
      activeTextColor() {
        return this.rootMenu.activeTextColor || '';
      },
      textColor() {
        return this.rootMenu.textColor || '';
      },
      mode() {
        return this.rootMenu.mode;
      },
      menuItemStyle() {
        const style = this.active ? this.realActiveStyle : this.isHover ? this.realHoverStyle : this.realItemStyle;
        Object.keys(style).forEach(key => {
          if (!style[key]) {
            delete style[key];
          }
        });
        if (this.mode === 'horizontal' && !this.isNested) {
          style.borderBottomColor = this.active
            ? (this.rootMenu.activeTextColor ? this.activeTextColor : '')
            : 'transparent';
        }
        return style;
      },
      isNested() {
        return this.parentMenu !== this.rootMenu;
      }
    },
    methods: {
      onMouseEnter() {
        this.isHover = true;
      },
      onMouseLeave() {
        this.isHover = false;
      },
      handleClick() {
        if (!this.disabled) {
          this.dispatch('ElMenu', 'item-click', this);
          this.$emit('click', this);
        }
      }
    },
    mounted() {
      this.parentMenu.addItem(this);
      this.rootMenu.addItem(this);
    },
    beforeDestroy() {
      this.parentMenu.removeItem(this);
      this.rootMenu.removeItem(this);
    }
  };
</script>
