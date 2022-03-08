import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => {},
        slots: {}
    }
    component.emit = emit.bind(null, component) as any
    return component
}
export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    setupStatefulComponent(instance)
}
function setupStatefulComponent(instance) {
    const Component = instance.type

    instance.proxy = new Proxy({ _: instance }, 
        publicInstanceProxyHandlers)

    const { setup } = Component
    if(setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        })
        handleSetupResult(instance, setupResult)
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object
    // TODO function
    if(typeof setupResult === "object") {
        instance.setupState = setupResult
    }
    finishComponentSetup(instance)
}
function finishComponentSetup(instance) {
    // Implement
    const Component = instance.type
    instance.render = Component.render
    
}