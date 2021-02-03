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

// JSDOM for DOM trees
import pkg_jsdom from "jsdom";
const { JSDOM } = pkg_jsdom;
import "jsdom-global";

// DataTree for tree management
import pkg_datatree from "data-tree";
const { dataTree } = pkg_datatree;

// Local imports
import { evaluateDom } from "../index.mjs";

describe("Stub tests", () => {
  beforeEach((done) => {
    JSDOM.fromFile("./test/pages/stub-1.html")
      .then((dom) => {
        global.document = dom.window.document;
      })
      .then(done, done);
  });

  it("Calling the plugin with a null page should return no tree", () => {
    var conditions = ["foo"]; // Dummy condition
    const trees = evaluateDom(null, conditions);
    // The tree is not empty, and its root is an "OR" node
    expect(trees).to.have.length(0);
  });

  it("Calling the plugin with a page should return a tree", () => {
    var conditions = ["foo"]; // Dummy condition
    const trees = evaluateDom(document, conditions);
    // The tree is not empty, and its root is an "OR" node
    expect(trees).to.have.length(1);
    const tree = trees[0];
    //console.log(tree);
    const root = tree.rootNode();
    expect(root).not.to.be.null;
    expect(root.data().type).to.equal("OR");
  });

  it("Calling the plugin with two conditions produces two trees", () => {
    var conditions = ["foo", "bar"]; // Dummy condition
    const trees = evaluateDom(document, conditions);
    // The tree is not empty, and its root is an "OR" node
    expect(trees).to.have.length(2);
  });
});

//////////////////////////////////////////////////////////////// Find XPath //////////////////////////////////

function getXPathForElement(element) {
  const idx = (sib, name) =>
    sib
      ? idx(sib.previousElementSibling, name || sib.localName) +
        (sib.localName == name)
      : 1;
  const segs = (elm) =>
    !elm || elm.nodeType !== 1
      ? [""]
      : elm.id && document.getElementById(elm.id) === elm
      ? [`id("${elm.id}")`]
      : [
          ...segs(elm.parentNode),
          `${elm.localName.toLowerCase()}[${idx(elm)}]`,
        ];
  return segs(element).join("/");
}

function getElementByXPath(path) {
  return new XPathEvaluator().evaluate(
    path,
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE, //FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
//////////////////////////////////////////////////////////////////////////////

function getElementXPath(element) {
  if (!element) return null;

  if (element.id) {
    return `//*[@id=${element.id}]`;
  } else if (element.tagName === "BODY") {
    return "/html/body";
  } else {
    const sameTagSiblings = Array.from(element.parentNode.childNodes).filter(
      (e) => e.nodeName === element.nodeName
    );
    const idx = sameTagSiblings.indexOf(element);

    return (
      getElementXPath(element.parentNode) +
      "/" +
      element.tagName.toLowerCase() +
      (sameTagSiblings.length > 1 ? `[${idx + 1}]` : "")
    );
  }
}

// :wrap=soft:tabSize=2:
