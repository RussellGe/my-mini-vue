import { reactive, isReactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const user = {
        age: 10,
    };
    const observed = reactive(user);
    expect(observed).not.toBe(user)
    expect(observed.age).toBe(10)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(user)).toBe(false)
  });
});
