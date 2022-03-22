import { createRenderer } from "../runtime-core";
import { isOn } from "../shared";

function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, key, preVal, nextVal) {
  if (isOn(key)) {
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[key];
    if (nextVal && existingInvoker) {
      existingInvoker.value = nextVal;
    } else {
      const eventName = key.slice(2).toLowerCase();
      if (nextVal) {
        const invoker = (invokers[key] = nextVal);
        el.addEventListener(eventName, invoker);
      } else {
        el.removeEventListener(eventName, existingInvoker);
        invokers[key] = undefined;
      }
    }
  } else {
    if (nextVal === null || nextVal === "") {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}
function insert(child, parent, anchor) {
  parent.insertBefore(child, anchor || null);
}

function createText(text) {
  return document.createTextNode(text);
}

function setText(node, text) {
  node.nodeValue = text;
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(el, text) {
  el.textContent = text;
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
  createText,
  setText
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";
