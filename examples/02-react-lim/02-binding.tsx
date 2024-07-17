function App () {
    let value = '';
    return <>
        <input onInput={e => value = e.target.value}/>
        <div> Binding value is {value}</div>
    </>;
}