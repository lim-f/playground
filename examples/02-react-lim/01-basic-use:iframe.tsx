import { useRenderer, CustomElement } from 'alins';

const root = useRenderer({
    render (node: CustomElement) {
        const prefix = new Array(node.deep).fill('  ').join('');
        const text = `${node.innerText}`;
        console.log(`${prefix}${node.tagName || 'text'}: ${text.trim()}`);
    }
});

let v = 0;
const v2 = v * 2;

<div $mount={root}>
    value = {v}
    <div>value * 2 = {v2}</div>
</div>;

function loopRender () {
    v ++;
    console.clear();
    root.render();
    setTimeout(() => {requestAnimationFrame(loopRender);}, 1000);
}

loopRender();