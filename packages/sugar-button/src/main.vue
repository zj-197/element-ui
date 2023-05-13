<template>
  <el-popconfirm v-if="popconfirmTitle && tooltip" :title="popconfirmTitle" @confirm="onConfirm">
    <el-tooltip :content="tooltip" :placement="tooltipPlacement" slot="reference">
      <el-button v-bind="btnProps" @click.stop="handleClick">
        <slot v-if="$slots.default"/>
      </el-button>
    </el-tooltip>
  </el-popconfirm>
  <el-tooltip v-else-if="tooltip" :content="tooltip" :placement="tooltipPlacement">
    <el-button v-bind="btnProps" @click.stop="handleClick">
      <slot v-if="$slots.default"/>
    </el-button>
  </el-tooltip>
  <el-popconfirm v-else-if="popconfirmTitle" :title="popconfirmTitle" @confirm="onConfirm">
    <el-button v-bind="btnProps" @click.stop="handleClick" slot="reference">
      <slot v-if="$slots.default"/>
    </el-button>
  </el-popconfirm>
  <el-button v-else v-bind="btnProps" @click.stop="handleClick"><slot v-if="$slots.default"/></el-button>
</template>
<script>
import ElTooltip from 'element-ui/packages/tooltip';
import ElPopconfirm from 'element-ui/packages/popconfirm';
import ElButton from 'element-ui/packages/button';
export default {
  name: 'ElSugarButton',
  components: {
    ElTooltip,
    ElPopconfirm,
    ElButton
  },
  data() {
    return {
      customLoading: this.loading
    };
  },
  watch: {
    loading(val) {
      this.customLoading = val;
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    autoLoading: Boolean,
    theme: {
      type: String,
      default: ''
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    tooltip: String,
    tooltipPlacement: {
      type: String,
      default: 'top'
    },
    popconfirmTitle: String,
    iconLoadingClass: {},
    iconLoadingStyle: {}
  },
  computed: {
    btnProps() {
      return {
        type: this.type,
        theme: this.theme,
        size: this.size,
        icon: this.icon,
        nativeType: this.nativeType,
        loading: this.customLoading,
        disabled: this.disabled,
        plain: this.plain,
        autofocus: this.autofocus,
        round: this.round,
        circle: this.circle,
        iconLoadingClass: this.iconLoadingClass,
        iconLoadingStyle: this.iconLoadingStyle
      };
    }
  },

  methods: {
    handleClick(evt) {
      if (this.theme) {
        this.isFocus = true;
      }
      if (!this.popconfirmTitle) {
        if (this.autoLoading) {
          this.$emit('click', this.openLoading, this.closeLoading, evt);
        } else {
          this.$emit('click', evt);
        }
      }
    },
    onConfirm() {
      if (this.autoLoading) {
        this.$emit('click', this.openLoading, this.closeLoading);
      } else {
        this.$emit('click');
      }
    },
    openLoading() {
      this.customLoading = true;
    },
    closeLoading() {
      this.customLoading = false;
    }
  }
};
</script>
