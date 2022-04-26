import { createVnodeCall, NodeTypes } from "../ast";
import { CREATE_ELEMENT_VNODE } from "../runtimeHelpers";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      // 中间处理层

      // tag
      const vnodeTag = `'${node.tag}'`;

      // props
      let vnodeProps;
      const { children } = node;
      let vnodeChildren = children[0];
      node.codegenNode = createVnodeCall(context, vnodeTag, vnodeProps, vnodeChildren);
    };
  }
}
