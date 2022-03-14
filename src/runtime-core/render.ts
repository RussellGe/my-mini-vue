import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragmnet, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;
  function render(vnode, container) {
    // patch 方便递归的处理
    patch(null, vnode, container, null);
  }
  function patch(n1, n2, container, parentComponent) {
    // 处理组件
    // TODO 判断vnode是不是element

    // ShapeFlags
    // vnode -> flag
    // element
    const { type, ShapeFlag } = n2;
    // Fragment --> 只渲染所有的children
    console.log("type", type);
    switch (type) {
      case Fragmnet:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (ShapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        }
        if (ShapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processFragment(n1, n2, container, parentComponent) {
    // Implement
    mountChildren(n2, container, parentComponent);
  }
  function processText(n1, n2, container) {
    const { children } = n2;
    const textNode = document.createTextNode(children);
    container.append(textNode);
  }
  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }
  function mountElement(vnode, container, parentComponent) {
    // const el = document.createElement(vnode.type);
    const el = (vnode.el = createElement(vnode.type));
    // string
    const { children, ShapeFlag } = vnode;
    if (ShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    }
    if (ShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    // TODO array
    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      // const isOn = (key) => /^on[A-Z]/.test(key);
      //   if (isOn(key)) {
      //     const event = key.slice(2).toLowerCase();
      //     el.addEventListener(event, val);
      //   } else {
      //     el.setAttribute(key, val);
      //   }
      patchProp(el, key, null, val);
    }
    // container.append(el);
    insert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function processComponent(n1, n2, container, parentComponent) {
    if (!n1) {
      mountComponent(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    console.log("n1", n1);
    console.log("n2", n2);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    patchProps(el, oldProps, newProps);
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];

        if (prevProp !== nextProp) {
          patchProp(el, key, prevProp, nextProp);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            patchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }
  function setupRenderEffect(instance, initialVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subtree = instance.render.call(proxy));

        // vnode -> patch
        // vnode -> element -> mount
        patch(null, subTree, container, instance);

        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subtree = instance.render.call(proxy);
        const prevSubTree = instance.subtree;
        patch(prevSubTree, subtree, container, instance);
      }
    });
  }
  return {
    createApp: createAppAPI(render),
  };
}
