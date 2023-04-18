<template>
  <li class="el-menu-item-group">
    <div class="el-menu-item-group__title" :style="groupStyle">
      <template v-if="!$slots.title">{{title}}</template>
      <slot v-else name="title"></slot>
    </div>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'ElMenuItemGroup',

    componentName: 'ElMenuItemGroup',

    inject: ['rootMenu'],
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        paddingLeft: this.rootMenu.paddingLrStep
      };
    },
    computed: {
      levelPadding() {
        let padding = this.rootMenu.paddingLrStep;
        let parent = this.$parent;
        if (this.rootMenu.collapse) return this.rootMenu.paddingLrStep;
        while (parent && parent.$options.componentName !== 'ElMenu') {
          if (parent.$options.componentName === 'ElSubmenu') {
            padding += this.rootMenu.paddingLrStep;
          }
          parent = parent.$parent;
        }
        return padding;
      },
      groupStyle() {
        const unit = this.rootMenu.paddingLrUnit;
        return {
          paddingLeft: this.levelPadding + unit,
          paddingRight: this.rootMenu.paddingLrStep + unit
        };
      }
    }
  };
</script>

