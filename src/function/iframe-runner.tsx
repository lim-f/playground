/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-10 17:40:38
 * @Description: Coding something
 */

import { useStatus } from 'src/store/store';
import eveit from 'eveit';

export function IFrameRunner () {
    const status = useStatus();
    let iframe: HTMLIFrameElement;
    let loading = false;

    eveit.on('refresh-iframe', () => {
        iframe.contentWindow?.location.reload();
        loading = true;
    });

    window.addEventListener('message', (e)=>{
        const data = e.data;
        if(data.type === 'iframe_log'){
            console.log(...data.data);
        }else if(data.type === 'iframe_clear_log'){
            console.clear();
        }else if(data.type === 'iframe_loaded'){
            loading = false;
        }
    });

    const mouseMove = (e: any)=>{
        const rect = iframe.getBoundingClientRect()
        eveit.emit('mousemove', {
            clientX: e.clientX + rect.left,
            clientY: e.clientY + rect.top,
        });
    };
    const mouseUp = ()=>{
        eveit.emit('mouseup');
    }   

    function initDragEvent(){
        const _window = iframe.contentWindow;
        _window?.removeEventListener('mousemove', mouseMove);
        _window?.removeEventListener('mouseup', mouseUp);
        _window?.addEventListener('mousemove', mouseMove);
        _window?.addEventListener('mouseup', mouseUp);
    }

    status.$watch('iframeSrc', ()=>{
        loading = true;
    });
    watch: loading, ()=>{
        initDragEvent();
    }

    return <div style={{
        position:'relative',
        width: '100%',
        height: status.resultPanelHeightCss,
        fontSize: 30,
    }}>
        <i $show={loading} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }} class="ei-spinner-snake ei-spin"></i>
        <iframe
            id='iframe'
            $ref:iframe
            $mounted={initDragEvent}
            src={status.iframeSrc}
            style={{
                height: '100%',
                width: '100%',
                border: 'none',
            }}>
        </iframe>
    </div>;
}