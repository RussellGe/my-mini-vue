import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParseContext(content);
  return createRoot(parseChildren(context, []));
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf("}}", openDelimiter.length);
  advanceBy(context, openDelimiter.length);
  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = parseTextData(context, rawContentLength);
  const content = rawContent.trim();
  advanceBy(context, closeDelimiter.length);
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function parseElement(context, ancestors) {
  const element: any = parseTag(context, TagType.Start);
  ancestors.push(element);
  const children = parseChildren(context, ancestors);
  element.children = children;
  ancestors.pop();
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  } else {
    throw new Error(`缺少结束标签${element.tag}`);
  }
  return element;
}
function parseTag(context, tagType: TagType) {
  // 1. 解析div
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);

  const tag = match[1];
  advanceBy(context, match[0].length + 1);
  // 2. 删除处理完成的代码
  if (tagType === TagType.End) return;
  return {
    type: NodeTypes.ELEMENT,
    tag: tag,
  };
}

function startsWithEndTagOpen(source, tag) {
  return (
    source.startsWith("<") &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  );
}

function parseText(context) {
  let stopIndex = context.source.length;
  const endToken = ["{{", "<"];
  for (const token of endToken) {
    if (
      context.source.indexOf(token) < stopIndex &&
      context.source.indexOf(token) !== -1
    ) {
      stopIndex = context.source.indexOf(token);
    }
  }

  const content = parseTextData(context, stopIndex);
  console.log("text", context.source);
  return {
    type: NodeTypes.TEXT,
    content: content,
  };
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function parseTextData(context, length: number) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}

function parseChildren(context, ancestors) {
  const nodes: any = [];
  while (!isEnd(context, ancestors)) {
    const s = context.source;
    let node;
    if (s.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      }
    } else {
      node = parseText(context);
    }
    console.log("new node", node);
    nodes.push(node);
  }

  return nodes;
}

function isEnd(context, ancestors) {
  const s = context.source;
  if (s.startsWith(`<`)) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag;
      if (startsWithEndTagOpen(s, tag)) {
        return true;
      }
    }
  }
  return !s;
}

function createRoot(children) {
  return {
    children,
    type: NodeTypes.ROOT,
  };
}
function createParseContext(content) {
  return {
    source: content,
  };
}
