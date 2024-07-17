/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-18 08:48:10
 * @Description: Coding something
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { parseReact, parseVue } from './components/libs/compiler';
import examples from './store/examples';

export const IS_DEV = location.hostname === 'localhost';

export function debounce<T extends any[], Return> (fn: (...args: T)=>Return, time = 1000) {
    let t: any = null;
    return function (...args: T) {
        if (t != null) {
            clearTimeout(t);
        }
        t = setTimeout(() => {
            fn.apply(null, args);
        }, time);
    };
}

export function compressCode (code: string) {
    return compressToEncodedURIComponent(code);
}
export function decompressCode (code: string) {
    return decompressFromEncodedURIComponent(code);
}

export function copy (str: string) {
    let input = document.getElementById('_copy_input_') as any;
    if (!input) {
        input = document.createElement('textarea');
        input.setAttribute('type', 'text');
        input.setAttribute(
            'style',
            'height:10px;position:fixed;top:-100px;opacity:0;'
        );
        input.setAttribute('id', '_copy_input_');
        document.body.appendChild(input);
    }
    input.value = str;
    input.select();

    try {
        if (document.execCommand('Copy')) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};


export function getUrlParam (name: string, defVal?: string) {
    return parseUrlParam(window.location.search, name, defVal);
}

export function parseUrlParam (search: string, name: string, defVal?: string) {
    if (typeof name !== 'undefined') {
        if (search !== '') {
            const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            const r = search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
        }
        return (typeof defVal !== 'undefined') ? defVal : null;
    }
    if (search === '') { return {}; }
    const arr = search.substr(1).split('&');
    const param: any = {};
    arr.forEach(item => {
        const pArr = item.split('=');
        param[pArr[0]] = pArr[1];
    });
    return param;
}

export function countCodeSize (code: string) {
    const textEncoder = new TextEncoder();
    const size = textEncoder.encode(code).length;
    if (size > 1024) return (size / 1024).toFixed(2) + ' kb';
    return size + ' byte';
}

export function createDownloadHTML (name: string, code: string, isVue: boolean) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
</head>
<body>
    ${isVue ? createVueIframeHTML(code) : createReactIframeHTML(code)};
</body>
</html>`;
}

function createReactIframeHTML (code: string) {
    return `
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<div id="app"></div>
<script>
    ${parseReact(code)}
    ReactDOM.render(
        React.createElement(App, null),
        document.getElementById('app')
    );
</script>
    `;
}

function createVueIframeHTML (code: string) {

    const { template, importCode, setup } = parseVue(code);

    return `
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<div id="app">
${template}
</div>
<script>
    ${importCode}
    createApp({
        setup() {
            ${setup}
        }
    }).mount('#app')
</script>
    `;
}

export function isVueDemo () {
    if (examples[getHashIndex()].title.includes('React')) {
        return false;
    }
    return true;
}

export function getHashIndex () {
    const hash = location.hash;
    return hash ? parseInt(hash.substring(1)) : 0;
}


// <script src="https://cdn.jsdelivr.net/npm/alins-compiler-web"></script>
export function createIFrameSrc (code: string) {
    const isVue = isVueDemo();
    // const alinsSrc = `${location.origin}${location.pathname}/alins.iife.min.js`;
    // debugger;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iframe runner</title>
    <style>
    body{color: #fff;}
    button, input, select{
        margin: 5px;
        padding: 5px 8px;
        background-color: #eee;
        border: none;
        border-radius: 1px;
        outline: none;
    }
    button, select{
        cursor: pointer;
    }
    button:active{
        background-color: #ccc;
    }
    </style>
</head>
<body>
    <script>
        function postMsg(type, data=[]) {
            window.parent.postMessage({type, data});
        }
        console.log = (...args) => {
            postMsg('iframe_log', args);
        };
        console.clear = () => {
            postMsg('iframe_clear_log');
        };
        window.addEventListener('DOMContentLoaded', () => {
            postMsg('iframe_loaded');
        });
    </script>
    ${isVue ? createVueIframeHTML(code) : createReactIframeHTML(code)}
</body>
</html>`;
    const blob = new Blob([ html ], { type: 'text/html' });
    return URL.createObjectURL(blob);
}