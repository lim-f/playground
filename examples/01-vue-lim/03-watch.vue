<script setup lim>
import {watch} from 'vue';
let count = 3;
watch(count, (v1, v2)=>{
  console.log('watch', v1, v2)
})
</script>
<template>
  <div>{{count2}}</div>
  <button @click="count ++">count is {{ count }}</button>
</template>