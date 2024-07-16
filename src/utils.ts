/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-18 08:48:10
 * @Description: Coding something
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

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

export function createAlinsHTML (name: string, code: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <script src="https://cdn.jsdelivr.net/npm/alins-compiler-web"></script>
</head>
<body>
    <!--
        This demo is only used for development and debugging. 
        For official use, please refer to https://alinsjs.github.io/docs/
    -->
    <div id="App"></div>
    <script type="text/alins" ts>
${code}
    </script>
</body>
</html>`;
}

// <script src="https://cdn.jsdelivr.net/npm/alins-compiler-web"></script>
export function createIFrameSrc (code: string) {
    // const alinsSrc = `${location.origin}${location.pathname}/alins.iife.min.js`;
    // debugger;
    const alinsSrc = __DEV__ ? 'http://localhost:5173/alins.iife.min.js' : 'https://cdn.jsdelivr.net/npm/alins';
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iframe runner</title>
    <script src="${alinsSrc}"></script>
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
    <div id="App"></div>
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
    <script>
${code}
    </script>
</body>
</html>`;
    const blob = new Blob([ html ], { type: 'text/html' });
    return URL.createObjectURL(blob);
}