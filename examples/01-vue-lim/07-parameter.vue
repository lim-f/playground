<script setup lim>
const person = {
    name: 'Jack',
    age: 18,
};
const addAge = (data) => data.age += 1;
</script>
<template>
    <div>
        <div>age = {{person.age}}</div>
        <button @click="addAge(person)">Add Age</button>
    </div>
</template>