/*
  A lineage library for DOM nodes
  MIT License
  
  Copyright (c) 2020-2021 Amadou Ba, Sylvain Hallé
  Eckinox Média and Université du Québec à Chicoutimi
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/**
 * Imports
 */

// Chai for assertions
import pkg_chai from "chai";
const { expect } = pkg_chai;

// Utilities
import { load_dom } from "./test-util.mjs";

// Local imports
import {
  BackgroundColor,
  CompoundDesignator,
  ConstantDesignator,
  DimensionHeight,
  DimensionWidth,
  ElementAttributeValue,
  EnumeratedValue,
  FindBySelector,
  MarginTop,
  MarginBottom,
  MarginRight,
  MarginLeft,
  ObjectNode,
  Path,
  PathValue,
  PaddingTop,
  PaddingBottom,
  PaddingRight,
  PaddingLeft,
  ReturnValue,
  Tracer,
  Color,
} from "../index.mjs";

describe("Web element tests", () => {
  describe("FindBySelector", () => {
    /**
     * Tests lineage for the FindBySelector function, giving the ID of an
     * element as the CSS selector. The lineage for this function
     * should produce a tree of the following form:
     * <pre>
     * ReturnValue
     *  |
     *  +-- EnumeratedValue
     *       |
     *       +-- First element
     *            |
     *            +-- id("h2") of Constant
     * </pre>
     */
    it("With ID", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var find = new FindBySelector("#h2");
      var v = find.evaluate(body);
      var elems = v.getValue();
      expect(Array.isArray(elems)).to.be.true;
      expect(elems.length).to.equal(1);
      var e1 = elems[0];
      expect(e1).to.be.an.instanceof(EnumeratedValue);
      var v1 = e1.getValue();
      expect(v1.tagName).to.equal("H2");
      var t = new Tracer();
      var root = t.getUnknownNode();
      var leaves = e1.query(null, ReturnValue.instance, root, t);
      expect(leaves.length).to.equal(1);
      var n = leaves[0];
      expect(n).to.be.an.instanceof(ObjectNode);
      var d = n.getDesignatedObject().getDesignator();
      expect(d).to.be.an.instanceof(CompoundDesignator);
      var tail = d.tail();
      expect(tail).to.be.an.instanceof(Path);
      expect(tail.toString()).to.equal('id("h2")');
      expect(d.head()).to.be.an.instanceof(ConstantDesignator);
    });
  });

  describe("DimensionHeight", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var h2 = dom.window.document.querySelector("#h2");
      var f = new DimensionHeight();
      var v = f.evaluate(h2);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(100);
    });
  });

  describe("DimensionWidth", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var h2 = dom.window.document.querySelector("#h2");
      var f = new DimensionWidth();
      var v = f.evaluate(h2);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(200);
    });
  });
  describe("BackgroundColor", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var backgrColor = dom.window.document.querySelector("body");
      var f = new BackgroundColor();
      var v = f.evaluate(backgrColor);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal("yellow");
    });
  });
  describe("Color", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var color = dom.window.document.querySelector("#p1");
      var f = new Color();
      var v = f.evaluate(color);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal("green");
    });
  });
  describe("Margin-top", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var marginTop = dom.window.document.querySelector("#h2");
      var f = new MarginTop();
      var v = f.evaluate(marginTop);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(20);
    });
  });
  describe("Margin-bottom", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var marginBottom = dom.window.document.querySelector("#div1");
      var f = new MarginBottom();
      var v = f.evaluate(marginBottom);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(50);
    });
  });
  describe("Margin-right", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var marginRight = dom.window.document.querySelector("#div1");
      var f = new MarginRight();
      var v = f.evaluate(marginRight);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(20);
    });
  });
  describe("Margin-left", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var marginLeft = dom.window.document.querySelector("#div1");
      var f = new MarginLeft();
      var v = f.evaluate(marginLeft);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(20);
    });
  });
  describe("Padding-top", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var paddingTop = dom.window.document.querySelector("#p1");
      var f = new PaddingTop();
      var v = f.evaluate(paddingTop);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(20);
    });
  });
  describe("Padding-bottom", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var paddingBottom = dom.window.document.querySelector("#p1");
      var f = new PaddingBottom();
      var v = f.evaluate(paddingBottom);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(20);
    });
  });
  describe("Padding-right", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var paddingRight = dom.window.document.querySelector("#p1");
      var f = new PaddingRight();
      var v = f.evaluate(paddingRight);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(20);
    });
  });
  describe("Padding-left", () => {
    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var paddingLeft = dom.window.document.querySelector("#p1");
      var f = new PaddingLeft();
      var v = f.evaluate(paddingLeft);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(20);
    });
  });
});

// :wrap=soft:tabSize=2:indentWidth=2:
