<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div
      v-show="customVisible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick">
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        v-drag="isDrag"
        :aria-label="title || 'dialog'"
        :class="[custom ? 'el-dialog-custom' : 'el-dialog', { 'el-dialog--fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <template v-if="custom">
          <slot v-if="rendered"/>
        </template>
        <template v-else>
          <div class="el-dialog__header">
            <slot name="title">
              <span class="el-dialog__title">{{ title }}</span>
            </slot>
            <button
                type="button"
                class="el-dialog__headerbtn"
                aria-label="Close"
                v-if="showClose"
                @click="handleClose">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
          <div class="el-dialog__body" v-if="rendered"><slot :body-height="bodyHeight"></slot></div>
          <div class="el-dialog__footer" v-if="$slots.footer || isShowFooter">
            <slot name="footer">
              <el-row type="flex" tag="footer" :justify="footerJustify" align="middle">
                <el-button v-if="isShowCancelBtn"
                           size="medium"
                           type="default"
                           :disabled="isLoading"
                           @click.stop="handleClose">
                  {{ cancelBtnText }}
                </el-button>
                <el-button v-if="isShowConfirmBtn"
                           size="medium"
                           type="primary"
                           :loading="isLoading"
                           @click.stop="handleConfirm">
                  {{ confirmBtnText }}
                </el-button>
              </el-row>
            </slot>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from 'element-ui/src/utils/popup';
  import Migrating from 'element-ui/src/mixins/migrating';
  import emitter from 'element-ui/src/mixins/emitter';
  import ElRow from 'element-ui/packages/row';
  import ElButton from 'element-ui/packages/button';
  import { t } from 'element-ui/src/locale';
  import drag from './drag';
  const PopupMixins = {
    props: Popup.props,
    beforeMount: Popup.beforeMount,
    beforeDestroy: Popup.beforeDestroy,
    data: Popup.data,
    methods: Popup.methods,
    watch: {
      customVisible: Popup.watch.visible
    }
  };

  export default {
    name: 'ElDialog',

    mixins: [PopupMixins, emitter, Migrating],
    components: {
      ElRow,
      ElButton
    },
    directives: {
      drag
    },
    props: {
      // 是否可以进行拖拽
      isDrag: {
        type: Boolean,
        default: false
      },
      // 是否完全自定义
      custom: Boolean,
      cancelBtnText: {
        type: String,
        default: t('el.popconfirm.cancelButtonText')
      },
      confirmBtnText: {
        type: String,
        default: t('el.popconfirm.confirmButtonText')
      },
      // footer水平排列方式
      footerJustify: {
        type: String,
        default: 'end'
      },
      isShowFooter: {
        type: Boolean,
        default: true
      },
      isShowConfirmBtn: {
        type: Boolean,
        default: true
      },
      isShowCancelBtn: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      },

      modal: {
        type: Boolean,
        default: true
      },

      modalAppendToBody: {
        type: Boolean,
        default: true
      },

      appendToBody: {
        type: Boolean,
        default: false
      },

      lockScroll: {
        type: Boolean,
        default: true
      },

      closeOnClickModal: {
        type: Boolean,
        default: true
      },

      closeOnPressEscape: {
        type: Boolean,
        default: true
      },

      showClose: {
        type: Boolean,
        default: true
      },

      width: String,

      fullscreen: Boolean,

      customClass: {
        type: String,
        default: ''
      },

      top: {
        type: String,
        default: '15vh'
      },
      beforeClose: Function,
      center: {
        type: Boolean,
        default: false
      },

      destroyOnClose: Boolean
    },

    data() {
      return {
        closed: false,
        key: 0,
        isLoading: false,
        customVisible: this.visible
      };
    },

    watch: {
      customVisible(val) {
        if (val) {
          this.closed = false;
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
          });
          if (this.appendToBody) {
            document.body.appendChild(this.$el);
          }
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          if (!this.closed) this.$emit('close');
          if (this.destroyOnClose) {
            this.$nextTick(() => {
              this.key++;
            });
          }
        }
      },
      visible(val) {
        this.isLoading = false;
        this.customVisible = val;
      }
    },

    computed: {
      style() {
        let style = {};
        if (!this.fullscreen) {
          style.marginTop = this.top;
          if (this.width) {
            style.width = this.width;
          }
        }
        return style;
      },
      bodyHeight() {
        const footerHeight = this.isShowFooter && !this.$slots.footer ? '76px' : '0px';
        const titleHeight = '66px';
        const paddingTop = 0 + 'px'; // 上padding
        return `calc(100vh - ${this.top} - ${this.top} - ${footerHeight} - ${titleHeight} - ${paddingTop})`;
      }
    },

    methods: {
      getMigratingConfig() {
        return {
          props: {
            'size': 'size is removed.'
          }
        };
      },
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          if (!this.isLoading) {
            this.beforeClose(this.hide);
          }
        } else {
          this.hide(!this.isLoading);
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.customVisible = false;
          this.$emit('update:visible', false);
          this.$emit('close');
          this.closed = true;
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      },
      afterEnter() {
        this.$emit('opened');
      },
      afterLeave() {
        this.$emit('closed');
      },
      showDialog() {
        this.customVisible = true;
        if (this.isLoading) {
          this.isLoading = false;
        }
      },
      openLoading() {
        this.isLoading = true;
      },
      closeLoading() {
        this.isLoading = false;
      },
      closeDialog() {
        this.closeLoading();
        this.handleClose();
      },
      handleConfirm() {
        this.$emit('confirm', this.openLoading, this.closeDialog, this.closeLoading);
      }
    },

    mounted() {
      if (this.customVisible) {
        this.rendered = true;
        this.open();
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      }
    },

    destroyed() {
      // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  };
</script>
