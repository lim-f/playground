function App () {
    let current = '';
    let hideDone = false;
    const todo = [];

    const addTodo = () => {
        todo.push({
            content: current,
            done: false,
        });
    };
    const deleteItem = (index) => {
        todo.splice(index, 1);
    };
    return <>
        <input onInput={e => current = e.target.value}/>
        <button onClick={addTodo}>Add Todo</button>
        <button onClick={() => hideDone = !hideDone}>{hideDone ? 'Show' : 'Hide'} Done Items</button>
        {
            todo.map((item, index) => hideDone && item.done ? null : (<div>
                <span style={{ 'textDecoration': item.done ? 'line-through' : 'none' }}>
                    { index }: { item.content }
                </span>
                <button onClick={() => item.done = !item.done}>{ item.done ? 'Undo' : 'Done' }</button>
                <button onClick={() => deleteItem(index)}>Delete</button>
            </div>))
        }
    </>;
}