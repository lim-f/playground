export default [
    {
        "name": "Hello World",
        "code": "<script setup lim>\nlet count = 0;\nconst increase = ()=>{\n  count ++;\n}\n</script>\n<template>\n  <button @click=\"increase\">count is {{ count }}</button>\n</template>",
        "title": "Vue Lim",
        "iframe": false,
        "head": "Vue Lim"
    },
    {
        "name": "Dynamic Attribute",
        "code": "let src: string = '';\nconst altName: string = 'Alins';\n\n<div $mount='#App'>\n    <img src={src} alt={`${altName} logo`} title={altName}/>\n    <button onclick={src = 'https://shiyix.cn/images/alins.png'}>Add Src</button>\n</div>;",
        "title": "Vue Lim",
        "iframe": false
    },
    {
        "name": "Enable Attribute",
        "code": "let enable = false;\n\n<button $mount='#App'\n    msg={{value: 'Hello', enable}}\n    onclick={e => {\n        enable = !enable;\n        console.log(e.target.outerHTML)\n    }}\n>toggle attr</button>",
        "title": "Vue Lim",
        "iframe": false
    },
    {
        "name": "Html Tags",
        "code": "let html: string = `Here's some <strong>HTML!!!</strong>`;\n\n<div $mount='#App'>\n    <p $html={html}/>\n    <button onclick={\n        html = '<h1>H1 title</h1>'\n    }>Modify html</button>\n</div>",
        "title": "Vue Lim",
        "iframe": false
    },
    {
        "name": "Basic Use",
        "code": "import { useRenderer, CustomElement } from 'alins';\n\nconst root = useRenderer({\n    render (node: CustomElement) {\n        const prefix = new Array(node.deep).fill('  ').join('');\n        const text = `${node.innerText}`;\n        console.log(`${prefix}${node.tagName || 'text'}: ${text.trim()}`);\n    }\n});\n\nlet v = 0;\nconst v2 = v * 2;\n\n<div $mount={root}>\n    value = {v}\n    <div>value * 2 = {v2}</div>\n</div>;\n\nfunction loopRender () {\n    v ++;\n    console.clear();\n    root.render();\n    setTimeout(() => {requestAnimationFrame(loopRender);}, 1000);\n}\n\nloopRender();",
        "title": "React Lim",
        "iframe": true,
        "head": "React Lim"
    },
    {
        "name": "Canvas Renderer",
        "code": "import { useRenderer, CustomElement } from 'alins';\n\nlet msg = 'Hello World';\n\nconst canvas = initCanvas();\n\nconst ctx = initCanvasCtx(canvas);\n\nconst root = useRenderer({\n    render (element: CustomElement) {\n        const _parent = element.parentElement || { deep: 0 };\n        if (!_parent.textLeft) _parent.textLeft = 10;\n        ctx.fillText(element.textContent, _parent.textLeft, (_parent.deep - 1)  * 15 + 10);\n        _parent.textLeft += (ctx.measureText(element.textContent).width);\n        return el => {el.textLeft = 0;};\n    },\n});\n\nstartCanvasRender(canvas, root);\n\nfunction initCanvas () {\n    let canvas;\n    <div $mount='#App'>\n        <canvas $ref={canvas} style='border: 1px solid #666;'></canvas>\n        <div>msg = {msg}</div>\n        <button onclick={msg += '!'}>Click Me </button>\n    </div>;\n    return canvas;\n}\nfunction initCanvasCtx (canvas, size = 300) {\n    const scale = window.devicePixelRatio;\n    canvas.width = canvas.height = size * scale;\n    canvas.style.width = canvas.style.height = `${size}px`;\n    canvas.style.backgroundColor = '#333';\n    const ctx = canvas.getContext('2d');\n    ctx.font = `${15 * scale}px Microsoft Sans Serif`;\n    ctx.fillStyle = '#eee';\n    ctx.textBaseline = 'top';\n    return ctx;\n}\n\nfunction startCanvasRender (canvas, root) {\n    <div $mount={root}>\n        msg = {msg}\n    </div>;\n    function loopRender () {\n        ctx.clearRect(0, 0, canvas.width, canvas.height);\n        root.render();\n        requestAnimationFrame(loopRender);\n    }\n    loopRender();\n}\n",
        "title": "React Lim",
        "iframe": true
    },
    {
        "name": "Full Custom",
        "code": "import { IElement, defineRenderer, ILifeListener } from 'alins';\n\nconst ElementType = {\n    Element: 0,\n    Text: 1,\n    Empty: 2,\n    Frag: 3,\n};\n\ndefineRenderer({\n    querySelector (selector) {return selector === '#Root' ? LogElement.Root : null;},\n    createElement (tag = '') {\n        return new LogElement(ElementType.Element, '', tag);\n    },\n    createTextNode (text) {\n        return new LogElement(ElementType.Text, text);\n    },\n    createEmptyMountNode () {\n        return new LogElement(ElementType.Empty);\n    },\n    createFragment () {\n        return new LogElement(ElementType.Frag);\n    },\n    isFragment (node) {\n        return node.type === ElementType.Frag;\n    },\n    isElement (node) {\n        return node.type === ElementType.Element || node.type === ElementType.Text;\n    },\n    onMounted (parent: LogElement, node: LogElement, mounted: ILifeListener<void|ILifeListener>) {\n        node.mountCallList.push(mounted);\n    },\n    onRemoved (parent: LogElement, node: LogElement, removed: ILifeListener) {\n        node.removeCallList.push(removed);\n    },\n});\n\nclass LogElement implements IElement {\n    static Root: null|LogElement = null;\n    type = ElementType.Element;\n    style = {}; // mock\n    tagName = '';\n    className = '';\n    innerText = '';\n    get textContent () {return this.innerText;};\n    set textContent (v) {this.innerText = v;}\n    deep = 0;\n    get prefix () {\n        return new Array(this.deep).fill('--').join('');\n    }\n    addEventListener () {};\n    removeEventListener () {};\n    setAttribute () {};\n    removeAttribute () {};\n    getAttribute () {return '';};\n    classList = {\n        add () {},\n        remove () {}\n    };\n    constructor (type, text = '', tag = '') {\n        this.type = type;\n        this.tagName = tag;\n        this.innerText = text;\n        if (tag === 'Root') LogElement.Root = this;\n    }\n    parentElement: LogElement|null = null;\n    get parentNode () {return this.parentElement;};\n    removeCallList: any[] = [];\n    remove () {\n        const children = this.parentElement?.children;\n        if (children) {\n            children.splice(children.indexOf(this), 1);\n            this.removeCallList.forEach(call => call(this));\n        }\n    }\n    get innerHTML () {return this.innerText;}\n    get outerHTML () {return this.innerText;}\n    children: LogElement[] = [];\n    get childNodes () {\n        return this.childNodes;\n    }\n    mountCallList: any[] = [];\n    appendChild (child: LogElement) {\n        this.children.push(child);\n        child.mountCallList.forEach(call => call(child));\n    }\n    get nextSibling () {\n        return this.parentElement?.children[this.index + 1] || null;\n    }\n    insertBefore (node, child) {\n        if (child.parentElement !== this) {\n            throw new Error('insertBefore error');\n        }\n        this.parentElement?.children.splice(child.index - 1, 0, node);\n        child.mountCallList.forEach(call => call(child));\n        return node;\n    }\n    get index () {\n        const parent = this.parentElement;\n        return !parent ? -1 : parent.children.indexOf(this);\n    }\n    render () {\n        const text = `${this.innerText}`;\n        if (this.type === ElementType.Text) {\n            text && console.log(`${this.prefix}text: ${text.trim()}`);\n        } else if (this.type === ElementType.Element) {\n            console.log(`${this.prefix}${this.tagName}: ${text.trim()}`);\n            this.children.forEach(item => {\n                item.deep = this.deep + 1;\n                item.render();\n            });\n        }\n    }\n}\n\nconst Root = new LogElement(ElementType.Element, '', 'Root');\n\nlet v = 0;\nconst v2 = v * 2;\n\n<div $$Root>\n    value = {v}\n    <div>value * 2 = {v2}</div>\n</div>;\n\nfunction loopRender () {\n    v ++;\n    console.clear();\n    Root.render();\n    setTimeout(() => {requestAnimationFrame(loopRender);}, 1000);\n}\n\nloopRender();",
        "title": "React Lim",
        "iframe": true
    }
];