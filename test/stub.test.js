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

//  Get tree from witness
import { getTreeFromWitness } from "../index.mjs";
import {
    ElementAttributeValue,
    ComposedFunction,
    CompoundDesignator,
    DimensionWidth,
    FindBySelector,
    GreaterThan,
    TestCondition,
    TestDriver,
    TestResult,
    UniversalQuantifier,
} from "../index.mjs";
import { ElementAttribute } from "../index.mjs";

describe("Stub tests", () => {
    it("Calling the plugin with a page should return a tree", async() => {
        var dom = await load_dom("./test/pages/stub-1.html");
        var body = dom.window.document.body;
        //var conditions = ['body[1]/section[2]/div[1]']; // Dummy condition
        var h2 = dom.window.document.querySelector("#h2");
        var f = new DimensionWidth();
        var v = f.evaluate(h2);
        expect(v).to.be.an.instanceof(ElementAttributeValue);
        var h = v.getValue();
        expect(h).to.equal(200);
        //const rootNode = ['OR']
        var conditions = [h]

        // const conditions = rootNode
        const trees = evaluateDom(body, conditions);
        //console.log(trees)
        // The tree is not empty, and its root is an "OR" node
        // expect(trees).to.have.length(1);
        // const tree = trees[0];
        // console.log(tree);
        // const root = tree.rootNode();
        // expect(root).not.to.be.null;
        // expect(root.data().type).to.equal("OR");
    });


    // it("True condition on a page element", async() => {
    //     var dom = await load_dom("./test/pages/stub-1.html");
    //     var body = dom.window.document.body;
    //     var f = new UniversalQuantifier(
    //         "$x",
    //         new FindBySelector("#h2"),
    //         new ComposedFunction(
    //             new GreaterThan(),
    //             new ComposedFunction(new DimensionWidth(), "$x"),
    //             50
    //         )
    //     );
    //     var cond = new TestCondition("h2's width > 50", f);
    //     var driver = new TestDriver(cond);
    //     driver.evaluateAll(body);
    //     var result = driver.getResult();
    //     expect(result).to.be.an.instanceof(TestResult);
    //     expect(result.getResult()).to.be.true;
    //     var verdicts = result.getVerdicts();
    //     expect(verdicts.length).to.equal(1);
    //     var verdict = verdicts[0];
    //     var witness = verdict.getWitness();
    //     //console.log(witness);
    //     expect(Array.isArray(witness)).to.be.true;
    //     expect(witness.length).to.equal(2);
    //     var dob1 = witness[0];
    //     expect(dob1.getObject().constructor.name).to.equal("HTMLBodyElement");
    //     var dob1_d = dob1.getDesignator();
    //     expect(dob1_d).to.be.an.instanceof(CompoundDesignator);
    //     var dob2 = witness[1];
    //     expect(dob2.getObject()).to.equal(50);
    //     var conditions = [dob2]
    //     const trees = evaluateDom(body, conditions);
    //     expect(trees).to.have.length(1);
    //     const tree = trees[0];
    //     console.log(tree);
    //     //var getTreeWit = getTreeFromWitness(witness);
    //     //console.log(getTreeWit)
    // });


    // it("Test", async() => {
    //     var dom = await load_dom("./test/pages/stub-1.html");
    //     var body = dom.window.document.body;
    //     var f = new UniversalQuantifier(
    //         "$x",
    //         new FindBySelector("#h2"),
    //         new ComposedFunction(
    //             new GreaterThan(),
    //             new ComposedFunction(new DimensionWidth(), "$x"),
    //             350
    //         )
    //     );

    //     var cond = new TestCondition("h2's width > 350", f);
    //     var driver = new TestDriver(cond);
    //     driver.evaluateAll(body);
    //     var result = driver.getResult();
    //     expect(result).to.be.an.instanceof(TestResult);
    //     expect(result.getResult()).to.be.false;
    //     var verdicts = result.getVerdicts();
    //     expect(verdicts.length).to.equal(1);
    //     var verdict = verdicts[0];
    //     var witness = verdict.getWitness();
    //     expect(Array.isArray(witness)).to.be.true;
    //     expect(witness.length).to.equal(2);
    //     //var conditions = ["Hi"]; // Dummy condition
    //     const trees = evaluateDom(body, verdicts);
    //     // The tree is not empty, and its root is an "OR" node
    //     expect(trees).to.have.length(1);
    //     const tree = trees[0];
    //     // console.log(tree);
    //     const root = tree.rootNode();
    //     expect(root).not.to.be.null;
    //     expect(root.data().type).to.equal("OR");
    //     console.log(trees);
    // });
});

//////////////////////////////////////////////////////////////// Find XPath //////////////////////////////////

function getXPathForElement(element) {
    const idx = (sib, name) =>
        sib ?
        idx(sib.previousElementSibling, name || sib.localName) +
        (sib.localName == name) :
        1;
    const segs = (elm) =>
        !elm || elm.nodeType !== 1 ? [""] :
        elm.id && document.getElementById(elm.id) === elm ? [`id("${elm.id}")`] : [
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


//////////////////////////////////////////////////////////////////////////////////

/**
 * Reads a DOM from a file. This function is only meant to avoid cluttering
 * the code with promises and anonymous functions in every test case.
 * @param {String} filename The name of the local file to read from
 * @param A promise which, when fulfilled, returns the DOM object.
 */
async function load_dom(filename) {
    return JSDOM.fromFile(filename).then((dom) => {
        return dom;
    });
}
// :wrap=soft:tabSize=2: