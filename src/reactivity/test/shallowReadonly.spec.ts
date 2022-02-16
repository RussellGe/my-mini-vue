import { isReadonly, shallowReadonly } from "../reactive"

describe("shallowReadonly", () => {
    it("shold not make non-reactive properties reactive", () => {
        const prop = shallowReadonly({
            n: { foo: 1 }
        })
        expect(isReadonly(prop)).toBe(true)
        expect(isReadonly(prop.n)).toBe(false)
    })
    it('warn then call set', () => {
        // console.warn()
        // mock

        console.warn = jest.fn()
        const user = shallowReadonly({
            age: 10
        })
        user.age = 11
        expect(console.warn).toBeCalledTimes(1)
    })
})