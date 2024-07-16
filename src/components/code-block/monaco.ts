/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-14 21:31:45
 * @Description: Coding something
 */

import { languages, editor } from 'monaco-editor';
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import typescriptReactTM from './TypeScriptReact.tmLanguage.json';
import onigasm from 'onigasm/lib/onigasm.wasm?url';
import { loadWASM } from 'onigasm';
import vsDark from './vs_dark_good.json';

// const modelUri = Uri.file('source.tsx');

// const codeModel = editor.createModel(
//     `
//     class Foo {
//         private value = 42;
//         render() {
//             return <div>
//                 <div>
//                     Hello World
//                 </div>
//                 <div>The value is {this.value}</div>
//             </div>
//         }
//     }
//     `,
//     'typescript',
//     modelUri // Pass the file name to the model here.
// );

const compilerOptions: languages.typescript.CompilerOptions = {
    jsx: languages.typescript.JsxEmit.React,
    jsxFactory: 'React.createElement',
    reactNamespace: 'React',
    allowNonTsExtensions: true,
    allowJs: true,
    target: languages.typescript.ScriptTarget.Latest,
};

languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
});

export type IEditor = editor.IStandaloneCodeEditor;

const registry = new Registry({
    async getGrammarDefinition () {
        return {
            format: 'json',
            content: typescriptReactTM,
        };
    },
});

// @ts-ignore
self.MonacoEnvironment = {
    getWorker (_, label) {
        // console.log(_, label);
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
    // @ts-ignore
    onigasm,
};
// editor.defineTheme('vsc-dark', {
//     base: 'vs-dark',
//     inherit: true,
//     rules: [
//         { token: 'keyword1', foreground: '569cd6' },
//         { token: 'keyword2', foreground: 'c586c0' },
//         { token: 'keyword3', foreground: '3ac9b0' },
//         { token: 'identifier', foreground: '9cdcfe' },
//         { token: 'function', foreground: 'dcdcaa' }
//     ],
//     colors: {}
// });
// editor.defineTheme('vsc-light', {
//     base: 'vs',
//     inherit: true,
//     rules: [
//         { token: 'keyword1', foreground: '0000ff' },
//         { token: 'keyword2', foreground: 'af00db' },
//         { token: 'keyword3', foreground: '267f99' },
//         { token: 'identifier', foreground: '001090' },
//         { token: 'function', foreground: 'b27878' }
//     ],
//     colors: {}
// });


const grammars = new Map();
grammars.set('typescript', 'source.tsx');
grammars.set('javascript', 'source.tsx');
grammars.set('css', 'source.css');

editor.defineTheme('vs-dark-plus', vsDark as editor.IStandaloneThemeData);

const hookLanguages = languages.setLanguageConfiguration;

languages.setLanguageConfiguration = (languageId: string, configuration: languages.LanguageConfiguration) => {
    // liftOff();
    return hookLanguages(languageId, configuration);
};

let loadingWasm: any;

export async function liftOff (): Promise<void> {
    // @ts-ignore
    if (!loadingWasm) loadingWasm = loadWASM(self.MonacoEnvironment.onigasm);
    await loadingWasm;

    // wireTmGrammars only cares about the language part, but asks for all of monaco
    // we fool it by just passing in an object with languages
    await wireTmGrammars({ languages } as any, registry, grammars);
}


export class Editor {
    dom: HTMLElement;

    editor: IEditor;

    constructor ({ dom, onchange, code = '' }: {
        dom: HTMLElement,
        code?: string,
        onchange?: (v: string)=>void,
    }) {
        this.dom = dom;
        this.editor = editor.create(dom, {
            automaticLayout: true,
            value: code,
            padding: { top: 5 },
            language: 'typescript',
            theme: 'vs-dark-plus',
            fontSize: 14,
            lineDecorationsWidth: 5,
            lineNumbersMinChars: 3,
            minimap: {
                enabled: false,
            }
        });

        // this.editor.setModel(codeModel);

        if (onchange) {
            this.editor.onDidChangeModelContent(() => {
                onchange(this.code());
            });
        }
    }
    code(): string;
    code(v: string): this;
    code (v?: string) {
        if (typeof v === 'string') {
            this.editor.setValue(v);
            return this;
        } else {
            return this.editor.getValue();
        }
    }
}
