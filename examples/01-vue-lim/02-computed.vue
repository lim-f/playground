<script setup lim>
let count = 0;
let countAdd2 = count + 2;
const increase = ()=>{
  count ++;
}
</script>
<template>
  <div>{{count}} + 2 = {{countAdd2}}</div>
  <button @click="increase">count is {{count}}</button>
</template>