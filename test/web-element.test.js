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
import { load_dom, load_file_in_puppeteer, terminate_puppeteer_browser } from "./test-util.mjs";

// Local imports
import {
    BackgroundColor,
    BackgroundImage,
    BorderColor,
    BorderRadius,
    BorderStyle,
    BorderWidth,
    CssPropertyFunction,
    Color,
    CompoundDesignator,
    ComposedFunction,
    ConstantDesignator,
    DimensionHeight,
    Display,
    DimensionWidth,
    ElementAttributeValue,
    EnumeratedValue,
    FindBySelector,
    Float,
    FontFamily,
    FontSize,
    GreaterOrEqual,
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
    Position,
    ReturnValue,
    TestCondition,
    Tracer,
    UniversalQuantifier,
    Visibility,
    Zindex
} from "../index.mjs";
import { Opacity } from "../modules/web-element.mjs";
import { getVerdict } from "../index.mjs";
let stub1Page, stub2Page, mb3dPage;
mb3dPage = await load_file_in_puppeteer("./test/pages/mb3d/index.html");

describe("Web element tests", () => {
    before(async function() {

        stub1Page = await load_file_in_puppeteer("./test/pages/stub-1.html");
        stub2Page = await load_file_in_puppeteer("./test/pages/stub-2.html");
    });

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
        it("With ID", async() => {
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
        it("Element with width defined in inlined-style", async() => {
            const h = await stub1Page.evaluate(function() {
                var h2 = document.querySelector("#h2");
                var f = new dompp.DimensionHeight();
                var v = f.evaluate(h2);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal(100);
        });

        it("Element with percentage-based width", async() => {
            // This is based on a 1920px wide resolution
            const h = await stub2Page.evaluate(function() {
                var nav = document.querySelector("nav");
                var f = new dompp.DimensionHeight();
                var v = f.evaluate(nav);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal(52);
        });
    });

    describe("DimensionWidth", () => {
        it("Element with width defined in inlined-style", async() => {
            const h = await stub1Page.evaluate(function() {
                var h2 = document.querySelector("#h2");
                var f = new dompp.DimensionWidth();
                var v = f.evaluate(h2);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal(200);
        });

        it("Element with percentage-based width", async() => {
            // This is based on a 1920px wide resolution
            const h = await stub2Page.evaluate(function() {
                var rightColumn = document.querySelector("#rightContent");
                var f = new dompp.DimensionWidth();
                var v = f.evaluate(rightColumn);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal(342);
        });
    });

    describe("Check formatting properties", () => {
        it("Check font-size", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var fontSize = dom.window.document.querySelector("#title")
            var f = new FontSize()
            var v = f.evaluate(fontSize)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("30px")
        });
        it("Check font-family", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var fontFamily = dom.window.document.querySelector("#title")
            var f = new FontFamily()
            var v = f.evaluate(fontFamily)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("cursive")
        });
    });

    describe("Check color and background properties", () => {
        it("Check color", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var h1col = dom.window.document.querySelector(".heading")
            var f = new Color()
            var v = f.evaluate(h1col)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("green")
                //expect(h).to.equal('rgb(' + 0 + ',' + 128 + ',' + 0 + ')')
        });
        it("Check background-color", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var bgColor = dom.window.document.querySelector(".testElem")
            var f = new BackgroundColor()
            var v = f.evaluate(bgColor)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("blue")
        });
        it("Check opacity", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var opacityElem = dom.window.document.querySelector("#titlePositionDisp")
            var f = new Opacity()
            var v = f.evaluate(opacityElem)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal(1)
        })
    });

    describe("Check margin-xx for DOM element", () => {
        it("Check margin-top", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var mgTop = dom.window.document.querySelector(".testElem")
            var f = new MarginTop()
            var v = f.evaluate(mgTop)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal(20)
        });

        it("Check margin-bottom", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var marginBottom = dom.window.document.querySelector(".testElem")
            var f = new MarginBottom()
            var v = f.evaluate(marginBottom)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("20px")
        });

        it("Check margin-left", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var marginLeft = dom.window.document.querySelector(".testElem")
            var f = new MarginLeft()
            var v = f.evaluate(marginLeft)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("40px")
        });

        it("Check margin-right", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var marginRight = dom.window.document.querySelector(".testElem")
            var f = new MarginRight()
            var v = f.evaluate(marginRight)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("40px")
        });
    });

    describe("Check padding-xx for DOM element", () => {
        it("check padding-top", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var paddingTop = dom.window.document.querySelector(".testElem")
            var f = new PaddingTop()
            var v = f.evaluate(paddingTop)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("30px")
        });

        it("Check padding-bottom", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var paddingBottom = dom.window.document.querySelector(".testElem")
            var f = new PaddingBottom()
            var v = f.evaluate(paddingBottom)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("30px")
        });

        it("Check padding-left", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var paddingLeft = dom.window.document.querySelector(".testElem")
            var f = new PaddingLeft()
            var v = f.evaluate(paddingLeft)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("50px")
        });

        it("Check padding-right", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var paddingRight = dom.window.document.querySelector(".testElem")
            var f = new PaddingRight()
            var v = f.evaluate(paddingRight)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("50px")
        });
    });
    describe("Check border for DOM element", () => {
        it("Check border-width", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var borderWidth = dom.window.document.querySelector(".testElem")
            var f = new BorderWidth()
            var v = f.evaluate(borderWidth)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("10px")
        })
        it("Check border-style", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var borderStyle = dom.window.document.querySelector(".testElem")
            var f = new BorderStyle()
            var v = f.evaluate(borderStyle)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("solid")
        })
        it("Check border-color", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var borderColor = dom.window.document.querySelector(".testElem")
            var f = new BorderColor()
            var v = f.evaluate(borderColor)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("red")
        })
        it("Check bordr-radius", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var borderRadius = dom.window.document.querySelector(".testElem")
            var f = new BorderRadius()
            var v = f.evaluate(borderRadius)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("10px")
        });
    })
    describe("Check position and display of DOM elements", () => {
        it("Check display", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var display = dom.window.document.querySelector(".displayElem")
            var f = new Display()
            var v = f.evaluate(display)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("inline-block")
        })
        it("Check visibility", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var visibility = dom.window.document.querySelector("#dispVisiblity")
            var f = new Visibility()
            var v = f.evaluate(visibility)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("hidden")
        })
        it("Check position", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var position = dom.window.document.querySelector("#titlePositionDisp")
            var f = new Position()
            var v = f.evaluate(position)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("relative")
        })
        it("Check float", async() => {
            var dom = await load_dom("./test/pages/stub-2.html")
            var float = dom.window.document.querySelector("#rightContent")
            var f = new Float()
            var v = f.evaluate(float)
            expect(v).to.be.an.instanceOf(ElementAttributeValue)
            var h = v.getValue()
            expect(h).to.equal("right")
        })
    })

    describe("Testing bugs on MB3D", () => {
        it("Check navbar Position is fixed", async() => {
            // This is based on a 1920px wide resolution
            const h = await mb3dPage.evaluate(function() {
                var positionNavbar = document.querySelector(".navbar-container");
                var f = new dompp.Position();
                var v = f.evaluate(positionNavbar);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal("fixed");
        });
        // it("Check navbar Position is fixed", async() => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html")
        //     var positionNavbar = document.querySelector(".navbar-container")
        //     var f = new Position()
        //     var v = f.evaluate(positionNavbar)
        //     expect(v).to.be.an.instanceOf(ElementAttributeValue)
        //     var h = v.getValue()
        //     expect(h).to.equal("fixed")
        // })
        it("Check background-color of footer", async() => {
            // This is based on a 1920px wide resolution
            const h = await mb3dPage.evaluate(function() {
                var footerBgColor = document.querySelector(".footer");
                var f = new dompp.BackgroundColor();
                var v = f.evaluate(footerBgColor);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal("rgb(255, 255, 255)");
        });
        // it("Check background-color of footer", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html")
        //     var footerBgColor = document.querySelector(".footer")
        //     var f = new BackgroundColor()
        //     var v = f.evaluate(footerBgColor)
        //     expect(v).to.be.an.instanceOf(ElementAttributeValue)
        //     var h = v.getValue()
        //     expect(h).to.equal("rgb(255, 255, 255)")
        // })
        it("Check color of body class", async() => {
            // This is based on a 1920px wide resolution
            const h = await mb3dPage.evaluate(function() {
                var bodyColor = document.querySelector(".body");
                var f = new dompp.Color();
                var v = f.evaluate(bodyColor);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal("rgb(29, 29, 27)");
        });
        // it("Check color of body class", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html")
        //     var bodyColor = document.querySelector(".body")
        //     var f = new Color()
        //     var v = f.evaluate(bodyColor)
        //     expect(v).to.be.an.instanceOf(ElementAttributeValue)
        //     var h = v.getValue()
        //     expect(h).to.equal("rgb(29, 29, 27)")
        // })

        it("Check if background-color and color of body as same", async() => {
            // This is based on a 1920px wide resolution
            const h1 = await mb3dPage.evaluate(function() {
                var bodyColor = document.querySelector(".body");
                var f = new dompp.Color();
                var v = f.evaluate(bodyColor);
                var h = v.getValue();
                return h
            });
            const h2 = await mb3dPage.evaluate(function() {
                var bgColor = document.querySelector(".body");
                var f = new dompp.BackgroundColor();
                var v = f.evaluate(bgColor);
                var h = v.getValue();
                return h
            });


            expect(h1).to.not.equal(h2);
        });
        // it("Check if background-color and color of body as same", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html")
        //     var bodyColor = document.querySelector("body")
        //         //instance of Color
        //     var f1 = new Color()
        //     var v1 = f1.evaluate(bodyColor)
        //     expect(v1).to.be.an.instanceOf(ElementAttributeValue)
        //     var h1 = v1.getValue()

        //     //instance of Background-Color
        //     var f2 = new BackgroundColor()
        //     var v2 = f2.evaluate(bodyColor)
        //     expect(v2).to.be.an.instanceOf(ElementAttributeValue)
        //     var h2 = v2.getValue()
        //         //get result
        //     expect(h1).to.not.equal(h2)
        // })

        it("Check alignement of Menu", async() => {
            // This is based on a 1920px wide resolution
            const h = await mb3dPage.evaluate(function() {
                var navbarDisplay = document.querySelector(".nav-menu");
                var f = new dompp.Display();
                var v = f.evaluate(navbarDisplay);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal("flex");
        });
        // it("Check alignement of Menu", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html")
        //     var navbarDisplay = document.querySelector(".nav-menu")
        //     var f = new Display()
        //     var v = f.evaluate(navbarDisplay)
        //     expect(v).to.be.an.instanceOf(ElementAttributeValue)
        //     var h = v.getValue()
        //     expect(h).to.equal("flex")

        // })

        ////////////////////////////////////////////////
        it("Implement bug z-index", async() => {
            // This is based on a 1920px wide resolution
            const h = await mb3dPage.evaluate(function() {
                var navbarZindex = document.querySelector(".navbar-container");
                var f = new dompp.Zindex();
                var v = f.evaluate(navbarZindex);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal(100);
        });
        // it("Implement bug z-index", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html")
        //     var navbarZindex = document.querySelector(".navbar-container")
        //     var f = new Zindex()
        //     var v = f.evaluate(navbarZindex)
        //     expect(v).to.be.an.instanceOf(ElementAttributeValue)
        //     var h = v.getValue()
        //     expect(h).to.equal(100)
        // })
        ////////////////////////////////////////////////////////////////
        // // it("Check if the text in a section is visible", async() => {
        // //     //var dom = await load_dom("./test/pages/mb3d/index.html")
        // //     var navbar = document.querySelector('container-plan')
        // //     var f1 = new BackgroundColor()
        // //     var v1 = f1.evaluate(navbar)
        // //     console.log(v1)
        // //     expect(v1).to.be.an.instanceOf(ElementAttributeValue)
        // //     var h1 = v1.getValue()
        // //         //console.log(h1)
        // //     var navbar2 = document.querySelector(".text-block")
        // //     console.log(navbar2)
        // //     var f2 = new Color()
        // //     var v2 = f2.evaluate(navbar2)
        // //     console.log(v2)
        // //     expect(v2).to.be.an.instanceOf(ElementAttributeValue)
        // //     var h2 = v2.getValue()
        // //     console.log(h2)
        // //     expect(h1).to.not.equal(h2)
        // //         // console.log("========================");
        // //         // console.log(h1);
        // //         // console.log(h2);
        // //         // expect(h1).to.equal(h2)
        // // })
        it("Implement bug z-index", async() => {
            // This is based on a 1920px wide resolution
            const h = await mb3dPage.evaluate(function() {
                var navbarZindex = document.querySelector(".navbar-container");
                var f = new dompp.Zindex();
                var v = f.evaluate(navbarZindex);
                var h = v.getValue();
                return h;
            });
            expect(h).to.equal(100);
        });

        it("False condition of Zindex on a page element", async() => {
            // const h = await mb3dPage.evaluate(function() {
            //     var navbarZindex = document.querySelector(".navbar-container");
            //     var f = new dompp.Zindex();
            //     var v = f.evaluate(navbarZindex);
            //     var h = v.getValue();
            //     return h;
            // });
            var body = mb3dPage.content
                //var body = await page.evaluate(() => { return (document.querySelectorAll(".navbar-container")) })
            console.log(body)
            var f = new UniversalQuantifier(
                "$x",
                new FindBySelector(".navbar-container"),
                new ComposedFunction(
                    new GreaterOrEqual(),
                    new ComposedFunction(new Zindex(), "$x"),
                    100
                )
            );
            var cond = new TestCondition("navbar container's z-index > 100", f);
            console.log(cond);
            var tree = getVerdict(body, cond);
            console.log(tree);
        });
        // it("False condition of Zindex on a page element", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html");
        //     var body = document.body;
        //     var f = new UniversalQuantifier(
        //         "$x",
        //         new FindBySelector(".navbar-container"),
        //         new ComposedFunction(
        //             new GreaterOrEqual(),
        //             new ComposedFunction(new Zindex(), "$x"),
        //             100
        //         )
        //     );
        //     var cond = new TestCondition("navbar container's z-index > 100", f);
        //     var tree = getVerdict(body, cond);
        //     //console.log(tree);
        // });
        // it("Condition of Font Weight on a page element", () => {
        //     //var dom = await load_dom("./test/pages/dev/about.html");
        //     var body = document.body;
        //     var f = new UniversalQuantifier(
        //         "$x",
        //         new FindBySelector(".main-nav"),
        //         new ComposedFunction(
        //             new IsEqualTo(),
        //             new ComposedFunction(new FontWeight(), "$x"),
        //             new ConstantFunction('lighter')
        //         )
        //     );

        //     var cond = new TestCondition("body's Font Weight != lighter", f);
        //     var tree = getVerdict(body, cond);
        //     //console.log(tree);
        // });
        // it("Condition of Display on a page element", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html");
        //     var body = document.body;
        //     var f = new UniversalQuantifier(
        //         "$x",
        //         new FindBySelector(".nav-menu"),
        //         new ComposedFunction(
        //             new IsEqualTo(),
        //             new ComposedFunction(new Display(), "$x"),
        //             new ConstantFunction('flex')
        //         )
        //     );
        //     var cond = new TestCondition("Nav menu's Display", f);
        //     var tree = getVerdict(body, cond);
        //     //console.log(tree);
        // });
        // it("Condition of footer Background color ", () => {
        //     //var dom = await load_dom("./test/pages/mb3d/index.html");
        //     var body = document.body;
        //     var f = new UniversalQuantifier(
        //         "$x",
        //         new FindBySelector(".footer"),
        //         new ComposedFunction(
        //             new IsEqualTo(),
        //             new ComposedFunction(new BackgroundColor(), "$x"),
        //             new ConstantFunction("rgb(255, 255, 255)")
        //         )
        //     );
        //     var cond = new TestCondition("Footer's Background Color", f);
        //     var tree = getVerdict(body, cond);
        //     //console.log(tree);
        // });

    });


    after(async function() {
        await terminate_puppeteer_browser();
    })
});

// :wrap=soft:tabSize=2:indentWidth=2: