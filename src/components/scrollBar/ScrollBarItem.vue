<template>
  <ul class="scroll-bar-list" ref="scrollBarRef" @scroll="onScroll">
    <li
      v-for="item in list"
      :key="item"
      class="scroll-bar_text">
        <span>{{ item }}</span>
      </li>
  </ul>
</template>
<script setup>
import { defineProps, computed, onMounted, ref, getCurrentInstance } from 'vue';

const props = defineProps({
  data: {
    type: [Array, Number],
    default: () => [],
  },
  value: {
    type: [String, Number],
    default: '',
  },
});

const list = computed(() => {
  let dataList = [];
  if (Array.isArray(props.data)) {
    dataList = props.data;
  } else {
    for (let i = 0; i < props.data; i++) {
      if (i < 10) {
        dataList.push(`0${i}`);
      } else {
        dataList.push(i);
      }
    }
  }
  return dataList;
});

const positionListComputed = computed(() => {
  const positionList = [];
  for (let i = 0; i < list.value.length; i++) {
    positionList.push(i * 20);
  }
  return positionList;
});

function getOffsetInfo(scrollTop) {
  const positionList = positionListComputed.value;
  const betweenArr = [];
  for (let i = 0; i < positionList.length; i++) {
    if (scrollTop >= positionList[i]) {
      betweenArr[0] = [positionList[i], list.value[i]];
      continue;
    }
    if (scrollTop < positionList[i]) {
      betweenArr[1] = [positionList[i], list.value[i]];
      break;
    }
  }
  if (!betweenArr[1]) {
    return betweenArr[0];
  }
  if (Math.abs(scrollTop - betweenArr[0][0]) >= Math.abs(scrollTop - betweenArr[1][0])) {
    return betweenArr[1];
  }
  return betweenArr[0];
}

let timer;
let currentData;
function onScroll(e) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const { scrollTop } = e.target;
    const offsetInfo = getOffsetInfo(scrollTop);
    const position = offsetInfo[0];
    currentData = offsetInfo?.[1];
    e.target.scrollTop = position;
  }, 120);
}

// 默认值
const scrollBarRef = ref(null);
onMounted(() => {
  if (props.value) {
    const index = list.value.findIndex(item => item === props.value);
    scrollBarRef.value.scrollTop = positionListComputed.value[index];
  }
});

// 确认
function onSubmit() {
  return currentData || list.value[0];
}
onMounted(() => {
  const _this = getCurrentInstance();
  _this.parent.exposed.setFnList(onSubmit);
});
</script>
