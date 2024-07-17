function App () {
    const person = {
        name: 'Jack',
        age: 18,
    };
    const addAge = (data) => data.age += 1;
    return <>
        <div>age = {person.age}</div>
        <button onClick={() => addAge(person)}>Add Age</button>
    </>;
}