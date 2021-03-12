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
import { getVerdict } from "../index.mjs";
import {
    ComposedFunction,
    DimensionWidth,
    FindBySelector,
    GreaterThan,
    TestCondition,
    UniversalQuantifier,
} from "../index.mjs";

describe("Test getVerdict return", () => {
    it("True condition on a page element", async() => {
        var dom = await load_dom("./test/pages/stub-1.html");
        var body = dom.window.document.body;
        var f = new UniversalQuantifier(
            "$x",
            new FindBySelector("#h2"),
            new ComposedFunction(
                new GreaterThan(),
                new ComposedFunction(new DimensionWidth(), "$x"),
                50
            )
        );
        var cond = new TestCondition("h2's width > 50", f);
        var tree = getVerdict(body, cond);
        //console.log(tree);
    });
    it("False condition on a page element", async() => {
        var dom = await load_dom("./test/pages/stub-1.html");
        var body = dom.window.document.body;
        var f = new UniversalQuantifier(
            "$x",
            new FindBySelector("#h2"),
            new ComposedFunction(
                new GreaterThan(),
                new ComposedFunction(new DimensionWidth(), "$x"),
                350
            )
        );
        var cond = new TestCondition("h2's width > 350", f);
        var tree = getVerdict(body, cond);
        //console.log(tree)
    });
});



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