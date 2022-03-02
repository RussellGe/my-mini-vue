import { camelize, capitalize } from "../shared/index";

export function emit (instance, event, ...args) {
    console.log('emit', event)

    const { props } = instance;

    // TPP
    // 先去写一个特定的行为，再重构成通用行为
    
    const toHandlerKey = (str: string) => {
        return str ? 'on' + capitalize(str) : ''
    }
    
    const handlerName = toHandlerKey(camelize(event))
    const handler = props[handlerName]
    
    handler && handler(...args)
}