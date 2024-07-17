function App () {
    let count = 1;
    const increase = () => count ++;
    return <button onClick={increase}>
        count is {count}
    </button>;
}