A flexible assertion framework for web pages
============================================

![Build status](https://api.travis-ci.org/liflab/dom-pp.svg?branch=main)
[SonarCloud Dashboard](https://sonarcloud.io/dashboard?id=liflab_dom-pp)

DOM-PP is a library for writing assertions about elements in a web page.
It complements classical unit libraries such as
[Mocha](https://mochajs.org/) and [JSDOM](https://github.com/jsdom/jsdom)
in three ways:

1. Conditions can be written at a higher level of abstraction, using a
   range of predefined functions including quantifiers and path selectors
2. When a condition fails, DOM-PP returns a result that provides a
   detailed explanation of *what* elements of the page cause the error, and
   *why*.
3. Conditions are *objects* instead of code, which means they can manipulated
   and passed as arguments.

An example
----------

To illustrate the use of DOM-PP, suppose you want to check this simple
condition through a unit test:

> "All items of list `#mylist` must have a width of at least 100 pixels"

Doing so with DOM-PP, in conjunction with Mocha and JSDOM, goes as follows:

```javascript
var dom = ... // Load page
var cond = TestCondition.create(
  ForAll("$x", "#mylist>li", IsGreaterThan(Width("$x"), 100)));
expectVerdict(cond.evaluate(dom));
```

Without DOM-PP, the condition would need to be written as plain JS code:

```javascript
var dom = ... // Load page
var elements = dom.querySelectorAll("#mylist>li");
for (let i = 0; i < elements.length; i++) {
  var win = this.getOwnerWindow(elements[i]);
  expect(win.getComputedStyle(elements[i]).getPropertyValue("width")).to.be.above(100);
}
```

This does not represent much more code in this simple example, but the DOM-PP
condition arguably conveys the developer's intent at a higher level of
abstraction than the second option.

In both cases, the only result you get, in case of an error, is that there is
an error. It would be much more useful if the test could at least point to the
elements that cause the error --for example by providing their path in the
page. In DOM-PP, you do:

```javascript
var dom = ... // Load page
var cond = TestCondition.create(
  ForAll("$x", "#mylist>li", IsGreaterThan(Width("$x"), 100)));
expectVerdict(cond.evaluate(dom)).showWitnesses();
```

THe only addition is the call to `showWitnesses()` at the end of `expectVerdict`.
Suppose that the second and third element of the list violate the condition; this
would produce the following output:

```
Width of #mylist/li[2]
Width of #mylist/li[3]
```

How do you get this in plain Mocha? Since a test stops at the first error, one
must modify the code as follows:

```javascript
var dom = ... // Load page
var elements = dom.querySelectorAll("#mylist>li");
var errors = [];
for (let i = 0; i < elements.length; i++) {
  var win = this.getOwnerWindow(elements[i]);
  if (win.getComputedStyle(elements[i]).getPropertyValue("width")) {
    errors.push("Width of " + elements[i]);
  }
}
for (let i = 0; i < errors.length; i++) {
  console.log(errors[i]);
}
expect(errors.length).to.equal(0);
```

Things are getting slightly more involved --and note that this code snippet does
not even print the actual CSS selector corresponding to each faulty element, but
rather the element's *name*. Getting the element's path would require yet a few
more lines of code. Also note that the feedback hardcodes the "width of" string,
whereas DOM-PP's deduces that the width is involved directly from the condition
supplied by the user.

Let's take this one level further, and consider this other simple condition:

> "All items of list `#mylist` must be left-aligned."

With DOM-PP:

```javascript
var dom = ... // Load page
var cond = TestCondition.create("All items are left-aligned",
  ForAllPairs("$x", "$y", "#mylist>li", Equals(Left("$x"), Left("$y")));
expectVerdict(cond.evaluate(dom)).showWitnesses();
```

Suppose you have a list of three items, and that item 3 is not aligned with
items 1 and 2; you get:

```
Left of #mylist/li[1], Left of #mylist/li[3]
Left of #mylist/li[2], Left of #mylist/li[3]
```

This time, each cause of the error involves *two* elements at a time, since an
element is misaligned with respect to another element.

With plain Mocha/JSDOM, things start to get ugly:

```javascript
var dom = ... // Load page
var elements = dom.querySelectorAll("#mylist>li");
var errors = [];
for (let i = 0; i < elements.length; i++) {
  var win = this.getOwnerWindow(elements[i]);
  for (let j = 0; j < elements.length; j++) {
    if (win.getComputedStyle(elements[i]).getPropertyValue("left")) 
      != (win.getComputedStyle(elements[j]).getPropertyValue("left")) {
    errors.push([elements[i], elements[j]]);
    }
  }
}
for (let i = 0; i < errors.length; i++) {
  console.log("Left of " + errors[i][0] + ", Left of " + errors[i][1]);
}
expect(errors.length).to.equal(0);
```

This is why we say that DOM-PP allows the user to write *simpler* conditions,
while getting more detailed feedback about violations *for free*.

API reference
-------------

Below is a list of the functions provided by DOM-PP with examples of their
use.

(Under construction!)

Installing and building DOM-PP
------------------------------

## Git Clone

```bash
git clone https://github.com/liflab/dom-pp.git
```

## Install

```bash
npm install
```

## Testing

```bash
npm test
```

## Coverage

```bash
npm run coverage
```

## Code style

```bash
npm run lint
```

Will write a style report in `eslint.html` (not versioned).

## API Documentation

The following command will generate or update the API documentatation and store
it into a folder called `doc/jsdoc`.

```bash
npm run doc
```

## Compiling UMD builds for release

To generatte a browser friendly release build of the package, you can use the 
following commands:

**Development build:**
```js
npm run build:umd
```

**Production build (minified):**
```js
npm run build:umd.min
```

These will generate releaseable scripts in the `dist/` directory.  
It is important to note that the `dist/index.umd.js` is required to run the 
Puppeteer based tests. If the file does not exist when you attempt to run 
these tests, a verbose error message should be displayed, along with 
explanations on how to fix the issue.

Both of these commands should be ran before a new release of the package is
published, to ensure that the UMD builds correspond to the same version as
the ESM version of the package.



About the author
----------------

This library was written by [Sylvain Hallé](http://leduotang.ca/sylvain),
full professor at Université du Québec à Chicoutimi, Canada. Part of
this work has been funded by the Canada Research Chair in Software
Specification, Testing and Verification and the
[Natural Sciences and Engineering Research Council
of Canada](http://nserc-crsng.gc.ca), and by a MITACS Acceleration
Grant, in collaboration with [Eckinox Média](https://eckinox.ca).

The author would like to acknowledge the participation of
[Amadou Ba](https://github.com/amadouba9),
[Papa Alioune Fall](https://github.com/ppalioune) and
[Émile Perron](https://github.com/EmilePerron) to the development of this
library.
