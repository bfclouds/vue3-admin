<template>
  <div class="scroll-bar-wrapper">
    <div class="scroll-bar" ref="scrollBarRef">
      <slot></slot>
    </div>
    <div class="hander-wrapper">
      <span class="cancel" @click="$emit('clickCancel')">Cancel</span>
      <span class="ok" @click="onClick">Ok</span>
    </div>
  </div>
</template>
<script setup>
import { defineEmits, ref, defineExpose } from 'vue';
import './index.less';

const emit = defineEmits(['clickCancel', 'clickOk']);
const fnList = [];

const scrollBarRef = ref(null);
function onClick() {
  const val = [];
  fnList.forEach(fn => {
    val.push(fn());
  });
  emit('clickOk', val);
}
function setFnList(fn) {
  fnList.push(fn);
}

defineExpose({
  setFnList,
});
</script>
