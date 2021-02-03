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
import { getTreeFromWitness } from "../index.mjs";
import {
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

describe("Witness tests", () => {
  it("Test", async () => {
    var dom = await load_dom("./test/pages/stub-1.html");
    var body = dom.window.document.body;
    var f = new UniversalQuantifier(
      "$x",
      new FindBySelector("#h2"),
      new ComposedFunction(
        new GreaterThan(),
        new ComposedFunction(new DimensionWidth(), "$x"),
        1350
      )
    );

    var cond = new TestCondition("h2's width > 350", f);
    var driver = new TestDriver(cond);
    driver.evaluateAll(body);
    var result = driver.getResult();
    expect(result).to.be.an.instanceof(TestResult);
    expect(result.getResult()).to.be.false;
    var verdicts = result.getVerdicts();
    expect(verdicts.length).to.equal(1);
    var verdict = verdicts[0];
    var witness = verdict.getWitness();
    expect(Array.isArray(witness)).to.be.true;
    expect(witness.length).to.equal(2);
    var dob1 = witness[0];
    //console.log(dob1);
    expect(dob1.getObject().constructor.name).to.equal("HTMLBodyElement");
    var dob1_d = dob1.getDesignator();
    //console.log(dob1_d);
    expect(dob1_d).to.be.an.instanceof(CompoundDesignator);
    var dob2 = witness[1];
    //console.log(dob2);
    expect(dob2.getObject()).to.equal(1350);

    // var dom = await load_dom("./test/pages/stub-1.html");
    // var body = dom.window.document.body;
    //var witness = ["foo", "bar"]; // Dummy condition
    const trees = getTreeFromWitness(body, witness);
    expect(trees).to.have.length(2);
    const tree = trees[0];
    console.log(tree);
    // const root = tree.rootNode();
    // expect(root).not.to.be.null;
    // expect(root.data().type).to.equal("AND");
  });
});
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
// :wrap=soft:tabSize=2:indentWidth=2:
