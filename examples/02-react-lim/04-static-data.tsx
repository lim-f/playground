function App () {
    const staticData = 'Hello World';
    let tail = '';
    return <>
        <div>{ staticData } { tail }</div>
        <button onClick={() => tail += '!'}>Add '!'</button>
    </>;
}