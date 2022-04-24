import { NodeTypes } from "./ast";
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING,
} from "./runtimeHelpers";

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;

  genFunctionPreamble(ast, context);

  const functionName = "render";
  const args = ["_ctx", "_cache"];
  const signature = args.join(", ");
  push(`function ${functionName}(${signature}) {`);
  push(`return `);
  genNode(ast.codegenNode, context);
  push("}");
  return {
    code: context.code,
  };
}
function genFunctionPreamble(ast, context) {
  const { push, helper } = context;
  const VueBinging = "Vue";
  const alisaHelpers = (s) => `${helper(s)}:_${helper(s)}`;
  if (ast.helpers.length > 0) {
    push(`const { ${ast.helpers.map(alisaHelpers)} } = ${VueBinging}`);
  }
  push("\n");
  push("return ");
}

function genNode(node, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeTypes.ELEMENT:
      genElement(node, context);
      break;
    default:
      break;
  }
}

function genElement(node, context) {
  const { push, helper } = context;
  const { tag, children } = node;
  push(
    `${helper(
      CREATE_ELEMENT_VNODE
    )}("${tag}"), null '`
  );
  console.log(children)
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    genNode(child, context);
  }
  push(')')
}
function genInterpolation(node, context) {
  const { push, helper } = context;
  console.log("node", node);
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(")");
}

function genExpression(node, context) {
  const { push } = context;
  push(`${node.content}`);
}

function genText(node, context) {
  const { push } = context;
  push(`'${node.content}'`);
}

function createCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`;
    },
  };
  return context;
}
