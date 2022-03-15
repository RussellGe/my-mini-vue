import { h, ref } from "../../lib/guide-mini-vue.esm.js";
// 左侧
const nextChildren = [
    h("p", { key: "A" }, "A"),
    h("p", { key: "B" }, "B"),
    h("p", { key: "D" }, "D"),
    // h("p", { key: "E" }, "E"),
];

const prevChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
];

// //右侧
// const nextChildren = [
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

// const prevChildren = [h("p", { key: "B" }, "B"), h("p", { key: "C" }, "C")];
export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;
    return {
      isChange,
    };
  },
  render() {
    const self = this;
    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
