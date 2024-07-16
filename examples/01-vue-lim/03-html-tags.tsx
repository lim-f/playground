let html: string = `Here's some <strong>HTML!!!</strong>`;

<div $mount='#App'>
    <p $html={html}/>
    <button onclick={
        html = '<h1>H1 title</h1>'
    }>Modify html</button>
</div>