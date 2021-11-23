<template>
  <button
    :disabled="disabled"
    class="normal-btn"
    :class="{'start-animation': !closeActiveAnimation}"
    :style="[buttonStyleStr, buttonStyle]">
    <svg v-show="loading" t="1623056251599" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3205" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16">
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3 0.1 19.9-16 36-35.9 36z" p-id="3206">
      </path>
    </svg>
    <i v-if="iconClass" class="icon-other" :style="iconStyleStr" :class="iconClass"></i>
    <slot></slot>
  </button>
</template>

<script>
import './index.less';

export default {
  props: {
    bgColor: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    fontWeight: {
      type: String,
      default: '',
    },
    iconClass: {
      type: String,
      default: '',
    },
    iconStyleStr: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    borderColor: {
      type: String,
      default: '',
    },
    buttonStyle: {
      type: [String, Object],
      default: () => '',
    },
    closeActiveAnimation: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonStyleStr() {
      let styleStr = '';
      if (this.bgColor) {
        styleStr += `background-color:${this.bgColor};`;
      }
      if (this.color) {
        styleStr += `color:${this.color};`;
      }
      if (this.width) {
        styleStr += `width:${this.width};`;
      }
      if (this.height) {
        styleStr += `height:${this.height};`;
      }
      if (this.fontWeight) {
        styleStr += `font-weight:${this.fontWeight};`;
      }
      if (this.borderColor) {
        styleStr += `border: 1px solid ${this.borderColor};`;
      }
      return styleStr;
    },
  },
};
</script>
