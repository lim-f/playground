<script setup lim>
let staticData = 'Hello World';
let tail = '';
</script>
<template>
  <div>{{ staticData }}{{ tail }}</div>
  <button @click="tail += '!'">Add '!'</button>
</template>