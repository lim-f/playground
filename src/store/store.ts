/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-16 16:24:25
 * @Description: Coding something
 */
import { createStore } from 'alins';

// // @ts-ignore
// import { createStore } from '../dist/alins/alins.esm.min';
// import { parseWebAlins } from '../dist/compiler-web/alins-compiler-web.esm.min';

// // @ts-ignore
// import { createStore } from '../dist/alins/alins.esm.min';
// import { parseWebAlins } from '../dist/compiler-web/alins-compiler-web.esm.min';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';// Then register the languages you need
import html from 'highlight.js/lib/languages/xml';// Then register the languages you need

import 'highlight.js/styles/vs2015.css';
import { compressCode, copy, countCodeSize, createDownloadHTML, createIFrameSrc, getHashIndex, getUrlParam } from 'src/utils';
import Examples from './examples';
import eveit from 'eveit';
import { compileLim } from 'src/components/libs/compiler';
import 'src/function/custom-code';
let downloadLink: any;

function resultError (e: any, stack = true) {
    console.warn(e);
    const app = document.getElementById('App');
    if (!app) return;
    const str = stack ? e.stack : e.toString();
    app.innerHTML = `<pre style='color:#f44;font-family: var(--font);'>${str.replace(/</g, '&lt;')}</pre>`;
};

function loadingResult () {
    const app = document.getElementById('App');
    if (!app) return;
    app.innerHTML = `<div class='code-loading'>
        <i class=" ei-spinner-snake ei-spin"></i>
    </div>`;
}

export const useStatus = createStore({
    state: () => {

        const sidebarWidth = getUrlParam('side') === '0' ? 0 : 200;

        const codeEditorWidth = (window.innerWidth - sidebarWidth) * 0.5;
        hljs.registerLanguage('javascript', javascript);
        hljs.registerLanguage('html', html);

        const exampleIndex = getHashIndex();
        const example = Examples[exampleIndex];

        return {
            // 编辑器拖拽条
            codeEditorWidth,
            codeEditorLeft: 0,
            // codeEditorLeft: 200,
            dragActive: false,

            syntaxError: false,
            editorCode: example.code,
            outputCode: '',
            runCode: '',
            iframeCode: '',
            resultNaviIndex: 0,
            exampleIndex,
            example: { ...example },
            codeChange: false,
            info: '',
            timer: null as any,

            console: {
                list: [] as string[],
                // console 拖拽条
                height: window.innerHeight * 0.3,
                prevHeight: 0,
                dragActive: false,
            },

            sidebarWidth,
        };
    },
    actions: {

        toggleConsole () {
            const cs = this.console;
            if (cs.prevHeight) {
                cs.height = cs.prevHeight;
                cs.prevHeight = 0;
            } else {
                cs.prevHeight = cs.height;
                cs.height = 0;
            }
        },

        clearConsole () {
            this.console.list = [];
            // console.clear();
        },

        log (args: any[]) {
            this.console.list.push(args.map(arg => arg.toString()).join(' '));
        },

        showInfo (info: string, time = 2000) {
            clearTimeout(this.timer);
            this.info = info;
            this.timer = setTimeout(() => {
                this.info = '';
            }, time);
        },
        switchExample (index: number) {
            if (index === this.exampleIndex) return;
            this.clearConsole();
            this.resultNaviIndex = 0;
            loadingResult();
            this.exampleIndex = index;
            this.example = { ...Examples[index] };
            // this.example = Examples[index];
            location.hash = `${index}`;
        },
        setCode (v: string) {
            let result = '';
            const isVue = this.isVueDemo();
            try {
                this.editorCode = v;
                result = compileLim(v, isVue);
            } catch (e: any) {
                this.outputCode = e.toString().replace(/</g, '&lt;');
                this.syntaxError = true;
                resultError(e);
                return;
            }

            console.warn('setCode', isVue);
            const highlightedCode = hljs.highlight(
                result,
                { language: isVue ? 'html' : 'javascript' }
            );
            this.outputCode = highlightedCode.value;

            // this.runCode = `console.log(${Math.random()})`;

            this.runCode = result;

            console.warn(this.runCode);
            // this.runCode = result.replace(/import *\{(.*?)\} *from *['"]alins['"]/g, 'const {$1} = window.Alins');

            this.syntaxError = false;

            this.codeChange = true;

            if (this.resultNaviIndex === 0) {
                this.runCodeResult(false);
            }
        },
        isVueDemo () {
            return this.example.title.includes('Vue');
        },
        onDragSize (x: number) {
            // console.warn(x, this.codeEditorLeft);
            this.codeEditorWidth = x - this.codeEditorLeft;
        },
        onDragConsoleSize (y: number) {
            this.console.height = window.innerHeight - y;
        },
        runCodeResult (force = false) {
            if (!this.codeChange && !force) return;
            if (force) this.resultNaviIndex = 0;

            try {
                this.clearConsole();
                this.iframeCode = this.runCode;
                if (force) {
                    eveit.emit('refresh-iframe');
                }
            } catch (e) {
                console.error(e);
                resultError(e);
                return false;
            }
            this.codeChange = false;
            return true;
        },
        download () {
            // store
            if (!downloadLink) {
                downloadLink = document.createElement('a');
                downloadLink.setAttribute('style', 'position: fixed;top: -100px');
                document.body.appendChild(downloadLink);
            }
            downloadLink.setAttribute('download', `${this.example.name.replace(/ /g, '-')}.lim.html`.toLowerCase());
            const blob = new Blob([
                createDownloadHTML(this.example.name, this.runCode, this.isVueDemo)
            ], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.click();
            this.showInfo(`Example "${this.example.name}" Downloaded!`);
        },
        copyLink () {
            copy(`${location.origin}${location.pathname}?name=${this.example.name}&iframe=${this.example.name ? 1 : 0}&code=${compressCode(this.editorCode)}`);
        }
    },
    getters: {
        iframeSrc () {
            return createIFrameSrc(this.runCode);
        },
        codeWidthPx () {
            return `${this.codeEditorWidth}px`;
        },
        consoleHeightPX () {
            return `${this.console.height}px`;
        },
        resultPanelHeightCss () {
            return `${window.innerHeight - 83 - this.console.height}px`;
        },
        codeSize () {
            return countCodeSize(this.editorCode);
        },
        outputSize () {
            return countCodeSize(this.runCode);
        },
    }
});

// const status = useStatus();
// status.download();

// useStatus().download;
// useStatus().codeWidthPx;
