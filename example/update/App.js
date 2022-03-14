import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0);
    const props = ref({
        foo: 'foo',
        bar: 'bar'
    })
    const onChangePropsDemo1 = () => {
        props.value.foo = "new-foo"
    }
    const onChangePropsDemo2 = () => {
        props.value.foo = undefined
    }
    const onChangePropsDemo3 = () => {
        props.value = {
            foo: 'foo'
        }
    }
    const onClick = () => {
      count.value++;
    };
    return {
      count,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
      props
    };
  },
  render() {
    return h("div", { id: "root", ...this.props }, [
      h("div", {}, "count" + this.count), //依赖收集
      h("button", { onClick: this.onClick }, "click"),
      h("button", { onClick: this.onChangePropsDemo1 }, "changeProps - 值改变 - 修改"),
      h("button", { onClick: this.onChangePropsDemo2 }, "changeProps - undefined - 删除"),
      h("button", { onClick: this.onChangePropsDemo3 }, "changeProps - 删除属性 - 删除"),
    ]);
  },
};
