import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue;
  public dep;
  public __v_isRef = true;
  constructor(val) {
    this._rawValue = val
    this._value = convert(val);
    // value -> reactive
    // 1. 看value是不是对象
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this)
    return this._value;
  }
  set value(newValue) {

    //hadChanged
    if(hasChanged(newValue, this._rawValue)) {
        this._rawValue = newValue
        this._value = convert(newValue)
        triggerEffects(this.dep); 
    } 
  }
}

function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
      }
}

function convert (value) {
    return isObject(value) ?  reactive(value) : value 
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref.__v_isRef
}

export function unRef(ref) {
    if(isRef(ref)) {
        return ref.value
    }
    return ref
}
export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },

        set(target, key, value) {
            if(isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value)
            }else {
                return Reflect.set(target, key, value)
            }
        }
    })
}