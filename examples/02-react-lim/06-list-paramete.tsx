function App () {
    const persons = [ {
        name: 'Jack',
        age: 18,
    }, {
        name: 'Bob',
        age: 19,
    } ];
    const addAge = (data) => data.age += 1;
    return <>
        {
            persons.map((item, index) => (
                <div>
                    <span>{index}: {item.name} age is {item.age}</span>
                    <button onClick={() => addAge(item)}>Add Age</button>
                </div>
            ))
        }
    </>;
}