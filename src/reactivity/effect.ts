import { extend } from "../shared";


let activeEffect;
let shouldTrack = false
class ReactiveEffect{
    private _fn: any;
    public scheduler: any;
    public deps = [];
    active = true;
    onStop?: () => void
    constructor(fn, scheduler?) {
        this._fn = fn
        this.scheduler = scheduler

    }
    run() {
        activeEffect = this
        // 1. 会收集依赖
        //     shouldTrack来作区分
        if(!this.active) {
            return this._fn();
        }
        shouldTrack = true
        activeEffect = this
        const res =  this._fn()
        shouldTrack = false
        return res
    }
    stop() {
        if(this.active) {
            cleanupEffect(this)
            if(this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
    effect.deps.length = 0
}
const targetMap = new WeakMap()

export function effect(fn, options: any  = {}) {
    const scheduler = options.scheduler
    // fn
    const _effect = new ReactiveEffect(fn, scheduler);
    extend(_effect, options)
    _effect.run();

    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}
export function track(target, key) {
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if(!dep) {
        dep = new Set();
        depsMap.set(key, dep)
    }
    if(!isTracking()) return

    if(dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)

}

function isTracking() {
    return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for(const effect of dep) {
        if(effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}
export function stop(runner) {
    runner.effect.stop()
}