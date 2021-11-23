<script setup>
import { ref } from 'vue'
import DateTimePicker from './components/dateTimePicker/DateTimePicker.vue';
  const date = ref([])
</script>

<template>
  <div>
    <DateTimePicker v-model="date"></DateTimePicker>
  </div>
</template>

<style>
#app {
  text-align: center;
}
</style>
