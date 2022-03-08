import { ShapeFlags } from "../shared/ShapeFlags";
export const Text = Symbol('Text')
export const Fragmnet = Symbol('Fragment')
export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    ShapeFlag: getShapeFlag(type),
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