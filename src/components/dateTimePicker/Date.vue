<template>
  <div class="date-calendar">
    <div class="date-calendar-header">
      <div class="left">
        <i
          :class="isDisableSubstractYear ? 'is-disable icon_double_left_grey' : 'icon_double_left_block'"
          @click="!isDisableSubstractYear && changeYM(-1, 'y')"></i>
        <i
          :class="isDisableSubstractMoth ? 'is-disable icon_left_grey' : 'icon_left_block'"
          @click="!isDisableSubstractMoth && changeYM(-1, 'M')"></i>
      </div>
      {{ ym }}
      <div class="right">
        <i
          class="transform-180"
          :class="isDisableAddMonth ? 'is-disable icon_left_grey' : 'icon_left_block'"
          @click="!isDisableAddMonth && changeYM(1, 'M')"></i>
        <i
          class="transform-180"
          :class="isDisableAddYear ? 'is-disable icon_double_left_grey' : 'icon_double_left_block'"
          @click="!isDisableAddYear && changeYM(1, 'y')"></i>
      </div>
    </div>
    <table class="date-table">
      <tbody>
        <tr class="">
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
        <tr class="date-table_row" v-for="(row, index) in rows" :key="`${ym}-${index}`">
          <td
            v-for="col in row"
            :key="col.text"
            class="date-table_col"
            :class="{
              'in-range': col.inRange,
              'start-date': col.start,
              'end-date': col.end,
              [col.type]: true,
              'today': today === `${ym}-${col.text}`
            }"
            @mouseenter="col.type === 'available' && onMouseEnter(col)"
            @click="col.type === 'available' && onClick(col)">
            <div class="date-table-cell">
              <span class="date-table-cell_text">{{ col.text }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { defineProps, ref, computed, inject, defineEmits } from 'vue';
import './date.less';
import dayjs from 'dayjs';

const props = defineProps({
  copyStartDateProp: {
    type: Object,
    default: () => null,
  },
  defaultYM: {
    type: Object,
    default: () => dayjs(),
  },
  maxDate: {
    type: Object,
    default: () => null,
  },
  minDate: {
    type: Object,
    default: () => null,
  },
  dateRange: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:copyStartDateProp', 'update:defaultYM']);
const date = computed({
  set(val) {
    emit('update:defaultYM', val);
  },
  get: () => props.defaultYM,
});

const isDisableSubstractYear = computed(() => !props.defaultYM.subtract(1, 'y').isAfter(props.minDate));
const isDisableSubstractMoth = computed(() => !props.defaultYM.subtract(1, 'M').isAfter(props.minDate));
const isDisableAddYear = computed(() => !props.defaultYM.add(1, 'y').isBefore(props.maxDate));
const isDisableAddMonth = computed(() => !props.defaultYM.add(1, 'M').isBefore(props.maxDate));

const ym = computed(() => `${date.value.year()}-${date.value.month() + 1}`);
const today = dayjs().format('YYYY-MM-D');
const dateRows = ref([[], [], [], [], [], []]);

const offsetDay = computed(() => (date.value.date(1).day() > 0 ? date.value.date(1).day() : 7)); // 当月月第一天是周几, 0 => 7
const rows = computed(() => {
  const lastMontDays = date.value.date(1).subtract(1, 'day').daysInMonth(); // 上月天数
  const currentMonthDays = date.value.daysInMonth(); // 当月天数
  const rows_ = dateRows.value;

  for (let r = 0; r < dateRows.value.length; r++) {
    const row = rows_[r];
    let lastDayCount = 1;
    for (let l = 0; l < 7; l++) {
      let type = 'normal';

      // 上个月时间段
      if (r === 0 && l < offsetDay.value) {
        row[l] = {
          text: lastMontDays - offsetDay.value + l + 1,
          row: r,
          column: l,
          type,
          inRange: false,
          start: false,
          end: false,
        };
        continue;
      }

      const theDay = r * 7 + l - offsetDay.value + 1;
      // 下个月时间段
      if (theDay > currentMonthDays) {
        row[l] = {
          text: lastDayCount++,
          row: r,
          column: l,
          type,
          inRange: false,
          start: false,
          end: false,
        };
        continue;
      }
      const d = dayjs(`${ym.value}-${theDay}`);
      let startData = false;
      let inRangeData = false;
      let endData = false;
      const dateR = props.dateRange;
      if (dateR.length > 0) {
        startData = d.isSame(props.dateRange[0], 'd');
      }

      const endDate = dateR[2] || dateR[1];
      if (endDate) {
        inRangeData = d.isBefore(endDate, 'd') && d.isAfter(dateR[0], 'd');
        endData = endDate.isSame(d, 'd');
      }
      if (d.isAfter(props.minDate) && d.isBefore(props.maxDate)) {
        type = 'available';
      }
      row[l] = {
        text: theDay,
        row: r,
        column: l,
        type,
        inRange: inRangeData,
        start: startData,
        end: endData,
      };
    }
  }

  return rows_;
});

const { setStartDate, setEndDate, setMoseInDate } = inject('setDate');
const copyStartDate = computed({
  set(val) {
    emit('update:copyStartDateProp', val);
  },
  get() {
    return props.copyStartDateProp;
  },
});

function onMouseEnter(col) {
  const dateR = props.dateRange;
  if (!dateR[2]) {
    return;
  }
  const day = dayjs(`${ym.value}-${col.text}`);
  if (copyStartDate.value.isBefore(day)) {
    setStartDate(copyStartDate.value);
    setMoseInDate(day);
  } else {
    setMoseInDate(copyStartDate.value);
    setStartDate(day);
  }
}
function onClick(col) {
  const dateR = props.dateRange;
  const day = dayjs(`${ym.value}-${col.text}`);
  if (!dateR[0] || !dateR[2]) {
    setStartDate(day);
    copyStartDate.value = day;
    setEndDate(day);
    setMoseInDate(day);
  } else {
    // 第二次点击
    if (dateR[0].isBefore(day)) {
      setEndDate(day);
    } else {
      setStartDate(day);
    }
    setMoseInDate();
  }
}

function checkDate(num, type) {
  let canChange = true;
  const newDate = date.value.add(num, type);
  if (props.minDate && newDate.isBefore(props.minDate)) {
    canChange = false;
  }
  if (props.maxDate && newDate.isAfter(props.maxDate)) {
    canChange = false;
  }
  return canChange && newDate;
}
function changeYM(num, type) {
  const newDate = checkDate(num, type);
  if (newDate) {
    date.value = newDate;
  }
}
</script>
