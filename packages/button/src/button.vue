<template>
  <button
      @click="handleClick"
      @mouseenter.stop="mouseenter"
      @mouseleave.stop="mouseleave"
      @mousedown.stop="mousedown"
      @mouseup.stop="mouseup"
      :disabled="buttonDisabled || loading"
      @blur="onBlur"
      :style="btnStyle"
      :autofocus="autofocus"
      :type="nativeType"
      :class="[
      this.theme ? 'el-button-custom' : 'el-button',
      (type && !this.theme) ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
import {hasClass} from 'element-ui/src/utils/dom';

export default {
  name: 'ElButton',

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  props: {
    type: {
      type: String,
      default: 'default'
    },
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
    circle: Boolean
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    buttonDisabled() {
      return this.$options.propsData.hasOwnProperty('disabled') ? this.disabled : (this.elForm || {}).disabled;
    },
    hoverColor() {
      return this.theme ? this.mixColor(this.theme, 0.2) : '';
    },
    shadeColor() {
      return this.theme ? this.mixColor(this.theme, 0.9) : '';
    },
    plainBorderColor() {
      return this.theme ? this.mixColor(this.theme, 0.6) : '';
    },
    btnStyle() {
      const style = Object.create(null);
      if (this.theme) {
        if (this.plain) {
          style.color = this.theme;
          style.backgroundColor = this.shadeColor;
          style.borderColor = this.plainBorderColor;
        } else {
          style.color = '#fff';
          style.backgroundColor = this.theme;
          style.borderColor = this.theme;
        }
      }
      return style;
    }
  },

  methods: {
    handleClick(evt) {
      if (this.theme) {
        this.isFocus = true;
      }
      this.$emit('click', evt);
    },
    mouseenter(evt) {
      if (!this.theme || this.isFocus) return;
      const target = evt.target;
      if (this.plain) {
        target.style.backgroundColor = this.theme;
        target.style.borderColor = this.theme;
        target.style.color = '#fff';
      } else {
        target.style.backgroundColor = this.hoverColor;
        target.style.borderColor = this.hoverColor;
      }
    },
    mouseleave(evt) {
      if (!this.theme || this.isFocus) return;
      const target = evt.target;
      if (this.plain) {
        target.style.backgroundColor = this.shadeColor;
        target.style.borderColor = this.plainBorderColor;
        target.style.color = this.theme;
      } else {
        target.style.backgroundColor = this.theme;
        target.style.borderColor = this.theme;
      }
    },
    mousedown(evt) {
      if (!this.theme) return;
      const customButton = this.getElCustomButton(evt.target);
      const deepTheme = this.deepColor(this.theme, 0.1);
      customButton.style.backgroundColor = deepTheme;
      customButton.style.borderColor = deepTheme;
    },
    mixColor(color, tint) {
      let { red, green, blue } = this.getColorChannels(color);
      if (tint === 0) { // when primary color is in its rgb space
        return [red, green, blue].join(',');
      } else {
        red += Math.round(tint * (255 - red));
        green += Math.round(tint * (255 - green));
        blue += Math.round(tint * (255 - blue));

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${red}${green}${blue}`;
      }
    },
    getColorChannels(color) {
      color = color.replace('#', '');
      if (/^[0-9a-fA-F]{3}$/.test(color)) {
        color = color.split('');
        for (let i = 2; i >= 0; i--) {
          color.splice(i, 0, color[i]);
        }
        color = color.join('');
      }
      if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return {
          red: parseInt(color.slice(0, 2), 16),
          green: parseInt(color.slice(2, 4), 16),
          blue: parseInt(color.slice(4, 6), 16)
        };
      } else {
        return {
          red: 255,
          green: 255,
          blue: 255
        };
      }
    },
    deepColor(color, percent) {
      let { red, green, blue } = this.getColorChannels(color);
      if (percent > 0) { // shade given color
        red *= 1 - percent;
        green *= 1 - percent;
        blue *= 1 - percent;
      } else { // tint given color
        red += (255 - red) * percent;
        green += (255 - green) * percent;
        blue += (255 - blue) * percent;
      }
      return `rgb(${ Math.round(red) }, ${ Math.round(green) }, ${ Math.round(blue) })`;
    },
    getElCustomButton(el) {
      if (this.$isServer) return;
      let parent = el;
      while (parent) {
        if ([window, document, document.documentElement].includes(parent)) {
          return window;
        }
        if (hasClass(parent, 'el-button-custom')) {
          return parent;
        }
        parent = parent.parentNode;
      }
      return parent;
    },
    mouseup(evt) {
      if (!this.theme) return;
      const customButton = this.getElCustomButton(evt.target);
      if (this.plain) {
        customButton.style.backgroundColor = this.theme;
        customButton.style.borderColor = this.theme;
      } else {
        customButton.style.backgroundColor = this.hoverColor;
        customButton.style.borderColor = this.hoverColor;
      }
    },
    onBlur(evt) {
      if (!this.theme) return;
      this.isFocus = false;
      const target = evt.target;
      if (this.plain) {
        target.style.backgroundColor = this.shadeColor;
        target.style.borderColor = this.plainBorderColor;
        target.style.color = this.theme;
      } else {
        target.style.backgroundColor = this.theme;
        target.style.borderColor = this.theme;
      }
    }
  }
};
</script>
