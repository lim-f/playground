<script setup lim>
const persons = [ {
    name: 'Jack',
    age: 18,
}, {
    name: 'Bob',
    age: 19,
} ];
const addAge = (data) => data.age += 1;
</script>
<template>
    <div v-for="item, index in persons">
        <span>{{index}}: {{item.name}} age is {{item.age}}</span>
        <button @click="addAge(item)">Add Age</button>
    </div>
</template>