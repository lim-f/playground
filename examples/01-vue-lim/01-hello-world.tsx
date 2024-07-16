<script setup lim>
let count = 0;
const increase = ()=>{
  count ++;
}
</script>
<template>
  <button @click="increase">count is {{ count }}</button>
</template>