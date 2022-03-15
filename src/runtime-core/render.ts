import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragmnet, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,s
  } = options;
  function render(vnode, container) {
    // patch 方便递归的处理
    patch(null, vnode, container, null, null);
  }
  function patch(n1, n2, container, parentComponent, anchor) {
    // 处理组件
    // TODO 判断vnode是不是element

    // ShapeFlags
    // vnode -> flag
    // element
    const { type, ShapeFlag } = n2;
    // Fragment --> 只渲染所有的children
    switch (type) {
      case Fragmnet:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (ShapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        }
        if (ShapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor);
        }
        break;
    }
  }

  function processFragment(n1, n2, container, parentComponent, anchor) {
    // Implement
    mountChildren(n2.children, container, parentComponent, anchor);
  }
  function processText(n1, n2, container) {
    const { children } = n2;
    const textNode = document.createTextNode(children);
    container.append(textNode);
  }
  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }
  function mountElement(vnode, container, parentComponent, anchor) {
    // const el = document.createElement(vnode.type);
    const el = (vnode.el = hostCreateElement(vnode.type));
    // string
    const { children, ShapeFlag } = vnode;
    if (ShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    }
    if (ShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor);
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
      hostPatchProp(el, key, null, val);
    }
    // container.append(el);
    hostInsert(el, container, anchor);
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("n1", n1);
    console.log("n2", n2);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);

    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.ShapeFlag;
    const shapeFlag = n2.ShapeFlag;
    const c2 = n2.children;
    const c1 = n1.children;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }
  function patchKeyedChildren(c1, c2, container, parentComponent, anchor) {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    function isSameVnodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    // 筛选左侧一致元素
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVnodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }
      i++;
    }

    // 筛选右侧一致元素
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVnodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 新的比老的多 创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = i + 1;
        const anchor = nextPos > c2.length-1 ? null : c2[nextPos].el
        console.log(nextPos, anchor)
        patch(null, c2[i], container, parentComponent, anchor);
      }
    }
  }
  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function mountComponent(initialVnode, container, parentComponent, anchor) {
    const instance = createComponentInstance(initialVnode, parentComponent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container, anchor);
  }
  function setupRenderEffect(instance, initialVnode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subtree = instance.render.call(proxy));

        // vnode -> patch
        // vnode -> element -> mount
        patch(null, subTree, container, instance, anchor);

        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subtree = instance.render.call(proxy);
        const prevSubTree = instance.subtree;
        patch(prevSubTree, subtree, container, instance, anchor);
      }
    });
  }
  return {
    createApp: createAppAPI(render),
  };
}
