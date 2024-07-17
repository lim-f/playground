/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-16 15:02:45
 * @Description: Coding something
 */
import { transformVue } from './vue-lim/index.min';
import { transformReact } from './react-lim/index.min';

import Babel from './babel/babel.min';

export function compileLim (code: string, isVue: boolean) {
    return isVue ? transformVue(code) : transformReact(code);
}

export function parseReact (code: string): string {
    const options = {
        sourceMaps: false,
        presets: [ 'react', 'typescript' ],
        filename: 'demo.tsx',
    };
    const output = Babel.transform(code, options);

    let result = output.code || '';

    if (result) {
        result = result.replace('export function ', 'function ');

        result = result.replace(/import *({.*?}) *from ['"]react['"]/g, (v, a1, a2) => {
            return `const ${a1} = React`;
        });
    }

    //     return `
    //     const { useState } = React;
    // var __clone = v => v && typeof v === 'object' ? Array.isArray(v) ? [...v] : {
    // ...v
    // } : v;
    // function App() {
    // let current = '';
    // const [todo, __$todo] = useState([]),
    //     _$todo = v => (__$todo(__clone(todo)), v);
    // const addTodo = () => {
    //     _$todo(todo.push({
    //     content: current,
    //     done: false
    //     }));
    // };
    // const deleteItem = index => {
    //     _$todo(todo.splice(index, 1));
    // };
    //   return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    //     onInput: e => current = e.target.value
    //   }), " ", /*#__PURE__*/React.createElement("button", {
    //     onClick: addTodo
    //   }, "Add Todo"), todo.map((item, index) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    //     style: {
    //       'textDecoration': item.done ? 'line-through' : 'none'
    //     }
    //   }, index, ": ", item.content), /*#__PURE__*/React.createElement("button", {
    //     onClick: () => {
    //         item.done = !item.done;
    //     }
    //   }, item.done ? 'Undo' : 'Done'), /*#__PURE__*/React.createElement("button", {
    //     onClick: () => deleteItem(index)
    //   }, "Delete"))));
    // }
    // `;

    return result;
}

export function parseVue (code: string) {
    if (!code)
        return {
            template: '',
            importCode: '',
            setup: '',
        };

    const result = code.match(/<template>([\s\S]*)<\/template>/);

    if (!result) {
        throw new Error('Template is Required');
    }

    const template = result[1];

    const jsResult = code.match(/<script.*?>([\s\S]*)<\/script>/);

    const importList: string[] = [ 'const {createApp} = Vue;' ];
    let js = '';
    if (jsResult) {
        js = jsResult[1];

        const importRes = js.matchAll(/import *({.*?}) *from ['"]vue['"];?/g);
        for (const item of importRes) {
            js = js.replace(item[0], '');
            importList.push(`const ${item[1]} = Vue;`);
        }

        const options = {
            sourceMaps: false,
            presets: [ 'typescript' ],
            filename: 'demo.vue.ts',
            ast: true,
        };
        const output = Babel.transform(js, options);

        const returnValues: string[] = [];
        // @ts-ignore
        const nodes: any[] = output.ast.program.body;
        for (const node of nodes) {
            if (node.type === 'VariableDeclaration') {
                for (const dec of node.declarations) {
                    returnValues.push(dec.id.name);
                }
            } else if (node.type === 'FunctionDeclaration') {
                returnValues.push(node.id.name);
            }
        }
        js += `\nreturn {${returnValues.join(', ')}}`;
    }


    return {
        template,
        importCode: importList.join('\n'),
        setup: js,
    };
}

window.parseReact = parseReact;