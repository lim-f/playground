import Examples from 'src/store/examples';
import { useStatus } from 'src/store/store';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-15 07:42:32
 * @Description: Coding something
 *
 */


export function ExamplesList () {

    const status = useStatus();

    return <For data={Examples}>
        <div $show={$item.head} class='example-title'>
            {$item.head}
        </div>
        <div
            class={`example-item ${status.exampleIndex === $index ? 'active' : ''}`}
            onclick={status.switchExample($index)}
        >
            <img src={$item.title?.includes('Vue') ? '/vue.svg' : '/react.svg'}/>
            {$item.name}
        </div>
    </For>;
}