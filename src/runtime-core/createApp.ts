import { render } from "./render"
import { createVnode } from "./vnode"

export function createApp (rootComponent) {
    return {
        mount(rootContainer) {
            // 把所有东西转换成虚拟节点
            // 先把组件转化成虚拟节点
            console.log('rootContainer', rootContainer)
            const vnode = createVnode(rootComponent)
            render(vnode, rootContainer)
        } 
    }
}
