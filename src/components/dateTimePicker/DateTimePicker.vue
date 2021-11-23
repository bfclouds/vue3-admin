<template>
  <div class="date-time-wrapper no-scroll-bar" v-clickoutside-directive="closeDate">
    <div class="date-time-input-container">
      <input
        autocomplete="off"
        :value="sureDateRange[0]"
        placeholder="Start Date"
        @focus="dateVisible = true">
      <span>To</span>
      <input
        autocomplete="off"
        :value="sureDateRange[1]"
        placeholder="Eend Date"
        @focus="dateVisible = true">
    </div>
    <div class="date-picker" v-show="dateVisible">
      <div class="date-wrapper">
        <div>
          <div class="time-selector" v-clickoutside-directive="closeStartDateTime">
            <input
              :disabled="!dateRange[0]"
              type="text"
              @focus="date1Visible = true"
              :value="`${dateRange[0]?.format('HH:mm:ss') || '00:00:00'}`">
            <ScrollBarVue
              class="time-scroll-bar"
              v-show="date1Visible"
              @clickOk="hmsDate1ClickOk"
              @clickCancel="date1Visible = false">
              <ScrollBarItemVue class="scroll-bar_left" :data="24" :value="selectedStartDateH"></ScrollBarItemVue>
              <ScrollBarItemVue class="scroll-bar_center" :data="60" :value="selectedStartDateM"></ScrollBarItemVue>
              <ScrollBarItemVue class="scroll-bar_right" :data="60" :value="selectedStartDateS"></ScrollBarItemVue>
            </ScrollBarVue>
          </div>
          <Date
            v-model:copy-start-date-prop="copyStartDate"
            v-model:default-y-m="currentDate1"
            :min-date="dayjs().subtract(2, 'y').subtract(1, 'm')"
            :max-date="currentDate2.subtract(1, 'm')"
            :date-range="dateRange"></Date>
        </div>
        <div>
          <div class="time-selector" v-clickoutside-directive="closeEndDateTime">
            <input
              :disabled="!dateRange[1]"
              type="text"
              @focus="date2Visible = true"
              :value="`${dateRange[1]?.format('HH:mm:ss') || '00:00:00'}`">
            <ScrollBarVue
              class="time-scroll-bar"
              v-show="date2Visible"
              @clickOk="hmsDate2ClickOk"
              @clickCancel="date2Visible = false">
              <ScrollBarItemVue class="scroll-bar_left" :data="24" :value="selectedEndDateH"></ScrollBarItemVue>
              <ScrollBarItemVue class="scroll-bar_center" :data="60" :value="selectedEndDateM"></ScrollBarItemVue>
              <ScrollBarItemVue class="scroll-bar_right" :data="60" :value="selectedEndDateS"></ScrollBarItemVue>
            </ScrollBarVue>
          </div>
          <Date
            v-model:copy-start-date-prop="copyStartDate"
            v-model:default-y-m="currentDate2"
            :min-date="currentDate1.add(1, 'm')"
            :max-date="dayjs().add(1, 'm')"
            :date-range="dateRange"></Date>
        </div>
      </div>

      <ButtonVue class="ok-btn" @click="dateClickOk">ok</ButtonVue>
      <ButtonVue class="cancel-btn" @click="dateVisible = false">cancel</ButtonVue>
    </div>

  </div>
</template>

<script setup>
import './index.less';
import { reactive, provide, ref, computed, defineProps, defineEmits } from 'vue';
import dayjs from 'dayjs';
import ScrollBarVue from '../scrollBar/ScrollBar.vue';
import vClickoutsideDirective from '/@/directive/clickOutside';
import ScrollBarItemVue from '../scrollBar/ScrollBarItem.vue';
import Date from './Date.vue';
import ButtonVue from '../button/Button.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['update:modelValue']);

// date
const dateRange = reactive([]);
// const sureDateRange = reactive([]);
const copyStartDate = ref(null);
const currentDate1 = ref(dayjs().subtract(1, 'M'));
const currentDate2 = ref(dayjs());
const sureDateRange = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

function setStartDate(day) {
  dateRange[0] = day;
}
function setEndDate(day) {
  dateRange[1] = day;
}
function setMoseInDate(day = null) {
  dateRange[2] = day;
}
provide('setDate', {
  setStartDate,
  setEndDate,
  setMoseInDate,
});
// 显示
const dateVisible = ref(false);
function dateClickOk() {
  const dataValue = [];
  dateRange.forEach((val, index) => {
    if (val) {
      dataValue[index] = val?.format('YYYY-MM-DD HH:mm:ss');
    }
  });
  sureDateRange.value = dataValue;
  dateVisible.value = false;
}
function closeDate() {
  dateVisible.value = false;
}

// time
const date1Visible = ref(false);
const date2Visible = ref(false);
const selectedStartDateH = computed(() => dateRange[0]?.hour() || '00');
const selectedStartDateM = computed(() => dateRange[0]?.minute() || '00');
const selectedStartDateS = computed(() => dateRange[0]?.second() || '00');
const selectedEndDateH = computed(() => dateRange[1]?.hour() || '00');
const selectedEndDateM = computed(() => dateRange[1]?.minute() || '00');
const selectedEndDateS = computed(() => dateRange[1]?.second() || '00');

function closeStartDateTime() {
  date1Visible.value = false;
}
function closeEndDateTime() {
  date2Visible.value = false;
}
// 设置时分秒
function setHms(date, val) {
  date = date.hour(val[0] || 0);
  date = date.minute(val[1] || 0);
  date = date.second(val[2] || 0);
  return date;
}
function hmsDate1ClickOk(val) {
  dateRange[0] = setHms(dateRange[0], val);
  date1Visible.value = false;
}
function hmsDate2ClickOk(val) {
  dateRange[1] = setHms(dateRange[1], val);
  date2Visible.value = false;
}

</script>
