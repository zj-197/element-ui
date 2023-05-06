
<script>
export default {
  name: 'ElRenderEmptyCpn',
  functional: true,
  props: {
    renderFn: {
      type: Function,
      required: true
    }
  },
  render(createElement, context) {
    const res = context.props.renderFn(createElement);
    return typeof res === 'string' ? <span class="el-render-empty-cpn">{res}</span> : res;
  }
};
</script>
