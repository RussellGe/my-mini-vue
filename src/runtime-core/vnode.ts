import { ShapeFlags } from "../shared/ShapeFlags";
export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')
export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    next: null,
    key: props && props.key,
    el: null,
    ShapeFlag: getShapeFlag(type),
    component: null
  };
  // children
  if( typeof children === 'string' ) {
      vnode.ShapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if(Array.isArray(children)) {
      vnode.ShapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }
  if(vnode.ShapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if(typeof children === 'object') {
      vnode.ShapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }
  return vnode;
}

function getShapeFlag(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

export function createTextVnode(text) {
  return createVnode(Text, {}, text)
}