import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParseContext(content);
  return createRoot({
    children: parseChildren(context),
  });
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf("}}", openDelimiter.length);
  advanceBy(context, openDelimiter.length);
  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();
  advanceBy(context, rawContentLength + closeDelimiter.length);
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function parseElement(context) {
  const element = parseTag(context, TagType.Start);

  parseTag(context, TagType.End);
  console.log("------", context.source);
  return element;
}

function parseTag(context, tagType: TagType) {
  // 1. 解析div
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  console.log(match);

  const tag = match[1];
  advanceBy(context, match[0].length + 1);
  // 2. 删除处理完成的代码
  if (tagType === TagType.End) return;
  return {
    type: NodeTypes.ELEMENT,
    tags: tag,
  };
}
function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function parseChildren(context) {
  const nodes: any = [];
  const s = context.source;
  let node;
  if (s.startsWith("{{")) {
    node = parseInterpolation(context);
  } else if (s[0] === "<") {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  }
  nodes.push(node);

  return nodes;
}

function createRoot(children) {
  return children;
}
function createParseContext(content) {
  return {
    source: content,
  };
}
