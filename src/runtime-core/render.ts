import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragmnet, Text } from "./vnode"

export function render(vnode, container) {
    // patch 方便递归的处理
    patch(vnode, container, null)
}
function patch(vnode, container, parentComponent) {
    // 处理组件
    // TODO 判断vnode是不是element

    // ShapeFlags
    // vnode -> flag
    // element
    const { type, ShapeFlag } = vnode
    // Fragment --> 只渲染所有的children
    switch(type) {
        case Fragmnet:
            processFragment(vnode, container, parentComponent)
            break;
        case Text:
            processText(vnode, container)
            break;
        default:
            if(ShapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container, parentComponent)
            }
            if(ShapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container, parentComponent)
            }
            break
    }


    
}

function processFragment(vnode, container, parentComponent) {
    // Implement
    mountChildren(vnode, container, parentComponent)
}
function processText(vnode, container) {
    const { children } = vnode
    const textNode = document.createTextNode(children)
    container.append(textNode)
}
function processElement(vnode, contaienr, parentComponent) {
    mountElement(vnode, contaienr, parentComponent)
} 
function mountElement(vnode, container, parentComponent) {
    const el = document.createElement(vnode.type)
    vnode.el = el
    // string 
    const { children, ShapeFlag } = vnode
    if(ShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    }
    if(ShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el, parentComponent)
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

function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(v => {
        patch(v, container, parentComponent)
    }) 
}

function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
}

function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vnode -> patch
    // vnode -> element -> mount
    patch(subTree, container, instance)

    initialVnode.el = subTree.el
}