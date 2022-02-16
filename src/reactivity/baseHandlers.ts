import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = creatGetter()
const set = createSetter()
const readonlyGet = creatGetter(true)
const shallowReadonlyGet = creatGetter(true, true)

function creatGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if(key === ReactiveFlags.IS_REACTIVE) {
        return !isReadonly
    }
    if(key === ReactiveFlags.IS_READONLY) {
        return isReadonly
    }
    if(shallow) return res
    if(isObject(res)) {
        return isReadonly ? readonly(res) : reactive(res)
    }
    // 还没做依赖收集
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // 还没做依赖触发
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
      console.warn(`key:${key} set失败 因为target是readonly的`)
      return true;
    },
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})

