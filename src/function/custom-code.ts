/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-01 21:55:34
 * @Description: Coding something
 */
import { decompressCode, getUrlParam } from 'src/utils';
import Examples from '../store/examples';

function initCustomCode () {
    const code = getUrlParam('code');
    const type = getUrlParam('type');

    if (!code || !type) {
        return;
    }

    const name = getUrlParam('name', 'Custom Code');

    const title = `${type[0].toUpperCase()}${type.substring(1)} Custom`;

    Examples.unshift({
        name,
        'code': decompressCode(code),
        'title': title,
        'head': title,
    });
}

initCustomCode();
