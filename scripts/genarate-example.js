/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-21 14:21:06
 * @Description: Coding something
 */
const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync(path.resolve(__dirname, '../examples'));

const list = [];

dirs.forEach(dirName => {
    if (dirName === '.DS_Store') return;
    const subDirs = fs.readdirSync(path.resolve(__dirname, `../examples/${dirName}`));
    const title = formatName(dirName);
    let titleName = title;
    subDirs.forEach(fileName => {
        const iframe = fileName.includes(':iframe');
        const fileTrueName = !iframe ? fileName : fileName.replace(':iframe', '');
        const itemName = formatName(fileTrueName, fileTrueName.indexOf('.'));
        const item = {
            name: itemName,
            code: fs.readFileSync(path.resolve(__dirname, `../examples/${dirName}/${fileName}`), 'utf8'),
            title,
            iframe,
        };
        if (titleName) {
            item.head = titleName;
            titleName = '';
        }
        list.push(item);
    });
});

fs.writeFileSync(path.resolve(__dirname, '../src/store/examples.ts'), `export default ${JSON.stringify(list, null, 4)};`, 'utf8');

function formatName (fileName, end) {
    const name = fileName.substring(fileName.indexOf('-') + 1, end);
    return name.split('-').map(item => item[0].toUpperCase() + item.substring(1)).join(' ');
}