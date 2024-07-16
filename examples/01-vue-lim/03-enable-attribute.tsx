let enable = false;

<button $mount='#App'
    msg={{value: 'Hello', enable}}
    onclick={e => {
        enable = !enable;
        console.log(e.target.outerHTML)
    }}
>toggle attr</button>