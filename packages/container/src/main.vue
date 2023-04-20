
<script>
  export default {
    name: 'ElContainer',

    componentName: 'ElContainer',

    props: {
      direction: String,
      isAutoFlex: {
        type: Boolean,
        default: true
      },
      justify: {
        type: String,
        default: 'start'
      },
      align: {
        type: String,
        default: ''
      },
      // 横向的时候是否自动换行
      isWrap: Boolean,
      tag: {
        type: String,
        default: 'section'
      }
    },

    computed: {
      isVertical() {
        if (this.direction === 'vertical') {
          return true;
        } else if (this.direction === 'horizontal') {
          return false;
        }
        return this.$slots && this.$slots.default
          ? this.$slots.default.some(vnode => {
            const tag = vnode.componentOptions && vnode.componentOptions.tag;
            return tag === 'el-header' || tag === 'el-footer';
          })
          : false;
      }
    },
    render(h) {
      return h(this.tag, {
        class: [
          'el-container',
          { 'is-vertical': this.isVertical, 'is-auto-flex': this.isAutoFlex, 'is-wrap': this.isWrap },
          this.justify !== 'start' ? `is-justify-${this.justify}` : '',
          this.align ? `is-align-${this.align}` : ''
        ]
      }, this.$slots.default);
    }
  };
</script>
