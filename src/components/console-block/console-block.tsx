/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-15 21:22:40
 * @Description: Coding something
 */

import { useStatus } from 'src/store/store';

export function ConsoleBlock () {

    const status = useStatus();

    let dom: HTMLElement;

    const origin = console.log;

    let _inLog = false;
    console.log = (...args) => {
        if (_inLog) {
            origin.apply(console, args);
            return;
        }
        _inLog = true;
        status.log(args);
        origin.apply(console, args);
        // console.log(dom.scrollHeight);

        dom.scrollTop = dom.scrollHeight;

        _inLog = false;
    };
    const clearOrigin = console.clear;
    console.clear = () => {
        clearOrigin.apply(console);
        status.clearConsole();
    };

    return <div class='console-block'
        $ref:dom
        style={{ height: status.consoleHeightPX }}>
        <If data={status.console.list.length === 0}>
            <div style:padding='3px 5px'>Console is empty.</div>
        </If>
        <Else>
            <For data={status.console.list}>
                <div class='console-item'>{$item}</div>
            </For>
        </Else>
    </div>;
}