import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
  describe("interpolation", () => {
    test("simple interpolation", () => {
      const ast = baseParse("{{  message    }}");

      //root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });
  describe("element", () => {
    test("simple element div", () => {
      const ast = baseParse("<div>hello</div>");

      //root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hello",
          },
        ],
      });
    });
  });
  describe("element with interpolation", () => {
    test("simple element div", () => {
      const ast = baseParse("<div>{{hello}}</div>");

      //root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "hello",
            },
          },
        ],
      });
    });
  });

  describe("text", () => {
    it("simple text", () => {
      const ast = baseParse("some text");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some text",
      });
    });
  });

  describe("hello world", () => {
    it("simple text", () => {
      const ast = baseParse("<p>hi, {{ message }}</p>");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "p",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hi, ",
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });
  });
  describe("nest element", () => {
    it("simple case", () => {
      const ast = baseParse("<p><div>hi, {{ message }}</div></p>");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "p",
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: "div",
            children: [
              {
                type: NodeTypes.TEXT,
                content: "hi, ",
              },
              {
                type: NodeTypes.INTERPOLATION,
                content: {
                  type: NodeTypes.SIMPLE_EXPRESSION,
                  content: "message",
                },
              },
            ],
          },
        ],
      });
    });

    it("simple case2", () => {
      const ast = baseParse("<p><div>hi, </div>{{ message }}</p>");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "p",
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: "div",
            children: [
              {
                type: NodeTypes.TEXT,
                content: "hi, ",
              },
            ],
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });
  });
  test('should throw error when lack end tag', () => {
    expect(() => {
      baseParse("<div><span></div>")
    }).toThrow('缺少结束标签span')
  })
});
