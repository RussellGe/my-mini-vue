import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent: parent,
    isMounted: false,
    subTree: {},
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}
export function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;

  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);

  const { setup } = Component;
  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult) {
  // function Object
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  // Implement
  const Component = instance.type;
  if(compiler && !Component.render) {
    if(Component.template) {
      Component.render = compiler(Component.template)
    }
  }
  instance.render = Component.render;
}

let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}
export function setCurrentInstance(instance) {
  currentInstance = instance;
}

let compiler;

export function registerRuntimeCompiler(_compiler) {
  compiler = _compiler
}