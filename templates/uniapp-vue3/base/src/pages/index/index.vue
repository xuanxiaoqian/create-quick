<template>
  <view class="content"> </view>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/store/modules/counter'

let useCounter = useCounterStore()

console.log(useCounter.counter)
</script>

<style></style>
