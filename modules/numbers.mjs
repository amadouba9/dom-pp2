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

// Local imports
import { AtomicFunction } from "./atomic-function.mjs";

/**
 * Function that checks the equality between two objects. Two objects o1 and o2
 * are equal if one of these conditions hold:
 * <ul>
 * <li>they are both null</li>
 * <li>they are both non-null and:
 * <ol>
 *   <li>they represent the same numeric value, or</li>
 *   <li>they are the same string</li>
 * </ol></li>
 * </ul>
 * @extends AtomicFunction
 */
class IsEqualTo extends AtomicFunction {
    constructor() {
        super(2);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (o1 == null && o2 == null) {
            return true;
        }
        if ((o1 == null && o2 != null) || (o1 != null && o2 == null)) {
            return false;
        }
        if (typeof(o1) === "number" && typeof(o2) === "number") {
            return o1 === o2;
        }
        if (typeof(o1) === "string" && typeof(o2) === "string") {
            return o1 === o2;
        }
        return false;
    }
}

/**
 * Function that adds numbers.
 * @extends AtomicFunction
 */
class Addition extends AtomicFunction {
    constructor(arity = 2) {
        super(arity);
    }

    getValue() {
        var sum = 0;
        for (var i = 0; i < this.arity; i++) {
            var o = arguments[i];
            if (typeof(o) !== "number") {
                throw "Invalid argument type";
            }
            sum += o;
        }
        return sum;
    }

    toString() {
        return "Addition";
    }
}
/**
 * Function that substracts numbers.
 * @extends AtomicFunction
 */
class Substraction extends AtomicFunction {
    constructor(arity = 2) {
        super(arity);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (typeof(o1) !== "number" || typeof(o2) !== "number") {
            throw "Invalid argument type";
        }
        return o1 - o2;
    }

    toString() {
        return "Substraction";
    }
}
/**
 * Function that multiplies numbers.
 * @extends AtomicFunction
 */
class Multiplication extends AtomicFunction {
    constructor(arity = 2) {
        super(arity);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (typeof(o1) !== "number" || typeof(o2) !== "number") {
            throw "Invalid argument type";
        }
        return o1 * o2;
    }

    toString() {
        return "Multiplication";
    }
}
/**
 * Function that divides numbers.
 * @extends AtomicFunction
 */
class Division extends AtomicFunction {
    constructor(arity = 2) {
        super(arity);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (typeof(o1) !== "number" || typeof(o2) !== "number") {
            throw "Invalid argument type";
        }
        return o1 / o2;
    }

    toString() {
        return "Division";
    }
}

/**
 * Function that compares two numbers and returns true if the first
 * is greater than the second.
 * @extends AtomicFunction
 */
class GreaterThan extends AtomicFunction {
    /**
     * Creates a new instance of the function.
     */
    constructor() {
        super(2);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (typeof(o1) !== "number" || typeof(o2) !== "number") {
            throw "Invalid argument type";
        }
        return o1 > o2;
    }

    toString() {
        return "&gt;";
    }
}
/**
 * Function that compares two numbers and returns true if the first
 * is Lesser than the second.
 * @extends AtomicFunction
 */
class LesserThan extends AtomicFunction {
    /**
     * Creates a new instance of the function.
     */
    constructor() {
        super(2);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (typeof(o1) !== "number" || typeof(o2) !== "number") {
            throw "Invalid argument type";
        }
        return o1 < o2;
    }

    toString() {
        return "&lt;";
    }
}

/**
 * Function that compares two numbers and returns true if the first
 * is greater than or equal to the second.
 * @extends AtomicFunction
 */
class GreaterOrEqual extends AtomicFunction {
    /**
     * Creates a new instance of the function.
     */
    constructor() {
        super(2);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (typeof(o1) !== "number" || typeof(o2) !== "number") {
            throw "Invalid argument type";
        }
        return o1 >= o2;
    }

    toString() {
        return "&ge;";
    }
}
/**
 * Function that compares two numbers and returns true if the first
 * is Lesser than or equal to the second.
 * @extends AtomicFunction
 */
class LesserOrEqual extends AtomicFunction {
    /**
     * Creates a new instance of the function.
     */
    constructor() {
        super(2);
    }

    getValue() {
        var o1 = arguments[0];
        var o2 = arguments[1];
        if (typeof(o1) !== "number" || typeof(o2) !== "number") {
            throw "Invalid argument type";
        }
        return o1 <= o2;
    }

    toString() {
        return "&le;";
    }
}

/**
 * Package exports
 */
export { Addition, Substraction, Multiplication, Division, GreaterOrEqual, LesserOrEqual, GreaterThan, LesserThan, IsEqualTo };

// :wrap=soft:tabSize=2:indentWidth=2: