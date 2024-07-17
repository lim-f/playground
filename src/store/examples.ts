export default [
    {
        "name": "Counter",
        "code": "<script setup lim>\nlet count = 0;\n</script>\n<template>\n  <button @click=\"count++\">count is {{ count }}</button>\n</template>",
        "title": "Vue Lim",
        "head": "Vue Lim"
    },
    {
        "name": "Computed",
        "code": "<script setup lim>\nlet count = 0;\nlet countAdd2 = count + 2;\nconst increase = ()=>{\n  count ++;\n}\n</script>\n<template>\n  <div>{{count}} + 2 = {{countAdd2}}</div>\n  <button @click=\"increase\">count is {{count}}</button>\n</template>",
        "title": "Vue Lim"
    },
    {
        "name": "Watch",
        "code": "<script setup lim>\nimport {watch} from 'vue';\nlet count = 3;\nwatch(count, (v1, v2)=>{\n  console.log('watch', v1, v2)\n})\n</script>\n<template>\n  <div>{{count2}}</div>\n  <button @click=\"count ++\">count is {{ count }}</button>\n</template>",
        "title": "Vue Lim"
    },
    {
        "name": "Binding",
        "code": "<script setup lim>\nlet value = 'Hello';\n</script>\n<template>\n  <input v-model=\"value\"/>\n  <div> Binding value is {{value}}</div>\n</template>",
        "title": "Vue Lim"
    },
    {
        "name": "Todo List",
        "code": "<script setup lim>\nlet current = '';\nlet hideDone = false;\nlet todo = [];\n\nconst addTodo = ()=>{\n  todo.push({\n    content: current,\n    done: false,\n  })\n}\n\nconst deleteItem = (index)=>{\n  todo.splice(index, 1);\n}\n\n</script>\n<template>\n  <input v-model=\"current\"/> \n  <button @click=\"addTodo\">Add Todo</button>\n  <button @click=\"hideDone = !hideDone\">{{hideDone ? 'Show' : 'Hide'}} Done Items</button>\n  <div v-for=\"(item, index) in todo\" v-show=\"!hideDone || !item.done\">\n    <span :style=\"{ 'text-decoration': item.done ? 'line-through': 'none' }\">\n      {{ index }}: {{ item.content }}\n    </span>\n    <button @click=\"item.done = !item.done\">{{ item.done ? 'Undo': 'Done' }}</button>\n    <button @click=\"deleteItem(index)\">Delete</button>\n  </div>\n</template>",
        "title": "Vue Lim"
    },
    {
        "name": "Static Data",
        "code": "<script setup lim>\nlet staticData = 'Hello World';\nlet tail = '';\n</script>\n<template>\n  <div>{{ staticData }}{{ tail }}</div>\n  <button @click=\"tail += '!'\">Add '!'</button>\n</template>",
        "title": "Vue Lim"
    },
    {
        "name": "Parameter",
        "code": "<script setup lim>\nconst person = {\n    name: 'Jack',\n    age: 18,\n};\nconst addAge = (data) => data.age += 1;\n</script>\n<template>\n    <div>\n        <div>age = {{person.age}}</div>\n        <button @click=\"addAge(person)\">Add Age</button>\n    </div>\n</template>",
        "title": "Vue Lim"
    },
    {
        "name": "List Paramete",
        "code": "<script setup lim>\nconst persons = [ {\n    name: 'Jack',\n    age: 18,\n}, {\n    name: 'Bob',\n    age: 19,\n} ];\nconst addAge = (data) => data.age += 1;\n</script>\n<template>\n    <div v-for=\"item, index in persons\">\n        <span>{{index}}: {{item.name}} age is {{item.age}}</span>\n        <button @click=\"addAge(item)\">Add Age</button>\n    </div>\n</template>",
        "title": "Vue Lim"
    },
    {
        "name": "Counter",
        "code": "function App () {\n    let count = 1;\n    const increase = () => count ++;\n    return <button onClick={increase}>\n        count is {count}\n    </button>;\n}",
        "title": "React Lim",
        "head": "React Lim"
    },
    {
        "name": "Binding",
        "code": "function App () {\n    let value = 'Hello';\n    return <>\n        <input onInput={e => value = e.target.value} value={value}/>\n        <div> Binding value is {value}</div>\n    </>;\n}",
        "title": "React Lim"
    },
    {
        "name": "Todo List",
        "code": "function App () {\n    let current = '';\n    let hideDone = false;\n    const todo = [];\n\n    const addTodo = () => {\n        todo.push({\n            content: current,\n            done: false,\n        });\n    };\n    const deleteItem = (index) => {\n        todo.splice(index, 1);\n    };\n    return <>\n        <input onInput={e => current = e.target.value}/>\n        <button onClick={addTodo}>Add Todo</button>\n        <button onClick={() => hideDone = !hideDone}>{hideDone ? 'Show' : 'Hide'} Done Items</button>\n        {\n            todo.map((item, index) => hideDone && item.done ? null : (<div>\n                <span style={{ 'textDecoration': item.done ? 'line-through' : 'none' }}>\n                    { index }: { item.content }\n                </span>\n                <button onClick={() => item.done = !item.done}>{ item.done ? 'Undo' : 'Done' }</button>\n                <button onClick={() => deleteItem(index)}>Delete</button>\n            </div>))\n        }\n    </>;\n}",
        "title": "React Lim"
    },
    {
        "name": "Static Data",
        "code": "function App () {\n    const staticData = 'Hello World';\n    let tail = '';\n    return <>\n        <div>{ staticData } { tail }</div>\n        <button onClick={() => tail += '!'}>Add '!'</button>\n    </>;\n}",
        "title": "React Lim"
    },
    {
        "name": "Parameter",
        "code": "function App () {\n    const person = {\n        name: 'Jack',\n        age: 18,\n    };\n    const addAge = (data) => data.age += 1;\n    return <>\n        <div>age = {person.age}</div>\n        <button onClick={() => addAge(person)}>Add Age</button>\n    </>;\n}",
        "title": "React Lim"
    },
    {
        "name": "List Paramete",
        "code": "function App () {\n    const persons = [ {\n        name: 'Jack',\n        age: 18,\n    }, {\n        name: 'Bob',\n        age: 19,\n    } ];\n    const addAge = (data) => data.age += 1;\n    return <>\n        {\n            persons.map((item, index) => (\n                <div>\n                    <span>{index}: {item.name} age is {item.age}</span>\n                    <button onClick={() => addAge(item)}>Add Age</button>\n                </div>\n            ))\n        }\n    </>;\n}",
        "title": "React Lim"
    }
];