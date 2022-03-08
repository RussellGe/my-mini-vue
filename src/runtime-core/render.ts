import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragmnet, Text } from "./vnode"

export function render(vnode, container) {
    // patch 方便递归的处理
    patch(vnode, container)
}
function patch(vnode, container) {
    // 处理组件
    // TODO 判断vnode是不是element

    // ShapeFlags
    // vnode -> flag
    // element
    const { type, ShapeFlag } = vnode
    // Fragment --> 只渲染所有的children
    switch(type) {
        case Fragmnet:
            processFragment(vnode, container)
            break;
        case Text:
            processText(vnode, container)
            break;
        default:
            if(ShapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container)
            }
            if(ShapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container)
            }
            break
    }


    
}

function processFragment(vnode, container) {
    // Implement
    mountChildren(vnode, container)
}
function processText(vnode, container) {
    const { children } = vnode
    const textNode = document.createTextNode(children)
    container.append(textNode)
}
function processElement(vnode, contaienr) {
    mountElement(vnode, contaienr)
} 
function mountElement(vnode, container) {
    const el = document.createElement(vnode.type)
    vnode.el = el
    // string 
    const { children, ShapeFlag } = vnode
    if(ShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    }
    if(ShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }

    // TODO array
    const {props} = vnode
    const isOn = (key) => /^on[A-Z]/.test(key)
    for(const key  in props) {
        const val = props[key]
        if(isOn(key)) {
            const event = key.slice(2).toLowerCase()
            el.addEventListener(event, val)
        } else {
            el.setAttribute(key, val)
        }
    }
    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container)
    }) 
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode)

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vnode -> patch
    // vnode -> element -> mount
    patch(subTree, container)

    initialVnode.el = subTree.el
}