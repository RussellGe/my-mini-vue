import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    user.age = 20;
    expect(nextAge).toBe(21);
  });
});

it('should return runner', () => {
    let foo = 10;
    const runner = effect(() => {
        foo++
        return 'foo'
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe("foo")
})

it("scheduler", () => {
    // 1. 通过effect第二个参数给定一个scheduler的fn
    // 2. 当effect第一次执行的时候，还会执行fn
    // 3. 当响应式对象set update 不会执行fn 而是执行scheduler
    // 如果说执行当前runner 会再次执行fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
        run = runner;
    })
    const obj = reactive({ foo : 1 });
    const runner = effect(
        () => {
            dummy = obj.foo
        },
        { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1)
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    expect(dummy).toBe(2)
})

it("stop", () => {
  let dummy;
  const obj = reactive({ props: 1 });
  const runner = effect(() => {
    dummy = obj.prop
  })
  obj.prop = 2
  expect(dummy).toBe(2)
  stop(runner);
  obj.prop = 3
  expect(dummy).toBe(2)

  // stoped effect should still be mannually callable
  runner()
  expect(dummy).toBe(3)
})

it("onStop", () => {
  const obj = reactive({
    foo: 1,
  })
  const onStop = jest.fn()
  let dummy;
  const runner = effect(() => {
    dummy = obj.foo
  },
  {
    onStop
  })
  stop(runner)
  expect(onStop).toBeCalledTimes(1)
})