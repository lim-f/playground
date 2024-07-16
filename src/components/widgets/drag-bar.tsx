/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-17 08:13:08
 * @Description: Coding something
 */
import { useStatus } from 'src/store/store';
import eveit from 'eveit';

export function DragBar ({ type = 'code' }: {type?: 'code'|'console'}) {
    const onDragSize = type === 'code' ? 'onDragSize' : 'onDragConsoleSize';

    // console.log(type, onDragSize);

    const status = useStatus();

    let dragActive = type === 'code' ? status.dragActive : status.console.dragActive;
    set: (b:boolean) => {
        if (type === 'code') {
            status.dragActive = b;
        } else {
            status.console.dragActive = b;
        }
    };

    let _isDown = false;

    function setDown (b: boolean) {
        _isDown = b;
        dragActive = b;
    }

    function mouseMove (e: MouseEvent) {
        if (_isDown) {
            status[onDragSize](e[(type === 'code') ? 'clientX' : 'clientY']);
        }
    }

    const mouseUp = () => {
        if (_isDown) {
            _isDown = false;
            setDown(false);
        }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
    eveit.on('mousemove', mouseMove);
    eveit.on('mouseup', mouseUp);

    return <div
        class={{
            'drag-bar': true,
            active: dragActive,
            horizen: type === 'console',
        }}
        onmousedown={() => {setDown(true);}}
        onmouseup={() => {setDown(false);}}
        onmousemove={mouseMove}
    ></div>;
}
