/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-15 07:43:05
 * @Description: Coding something
 */
import { useStatus } from 'src/store/store';
// import { debounce } from 'src/utils';
import { Editor } from './monaco';

export function EditorBox () {
    return <div
        style={{
            width: '100%',
            height: '100%',
        }}
        $mounted={(dom) => {
            const status = useStatus();
            const parseCode = (v: string) => {
                status.setCode(v);
            };
            const _editor = new Editor({
                dom,
                code: status.example.code,
                onchange: parseCode,
            });
            // status.$watch('example.code', (code) => {
            //     // console.log('examplecode');
            //     _editor.code(code);
            // });
            status.$watch('example.code', (code) => {
                _editor.editor.setScrollTop(0);
                _editor.code(code);
            });
            parseCode(_editor.code());
        }}
    ></div>;
}