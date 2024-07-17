function App () {
    let value = 'Hello';
    return <>
        <input onInput={e => value = e.target.value} value={value}/>
        <div> Binding value is {value}</div>
    </>;
}