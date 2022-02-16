import { reactive, isReactive, isProxy } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const user = {
        age: 10,
    };
    const observed = reactive(user);
    expect(observed).not.toBe(user)
    expect(observed.age).toBe(10)
    expect(isReactive(observed)).toBe(true)
    expect(isProxy(observed)).toBe(true)
    expect(isReactive(user)).toBe(false)
  });
  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
});
