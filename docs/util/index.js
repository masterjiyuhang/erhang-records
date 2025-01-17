
import fs from 'fs';
import path from 'path';

export const debounce = (fn, delay = 500) => {
  let timer = undefined
  let active = true

  const debounced = (...args) => {
    if (active) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        active && fn(...args)
        timer = undefined
      }, delay)
    } else {
      fn(...args)
    }
  }

  debounced.isPending = () => timer !== undefined

  debounced.cancel = () => active = false

  debounced.flush = (...args) => fn(...args)

  return debounced
}



export function getSidebarConfig(dir) {
  const files = fs.readdirSync(path.resolve(__dirname, '../../docs' + dir));
  const textName = dir.split('/')[2] ?? '默认名称'
  const res = files
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .map((file) => {
      const name = file.replace('.md', '');
      return { text: name, link: `${dir}/${name}` };
    });

  return {
    text: textName,
    items: res,
  }
}
