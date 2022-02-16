import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue;
  public dep;
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
