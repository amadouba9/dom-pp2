import { AbstractFunction } from "./function.mjs";
//import { UniversalQuantifier } from "./quantifier.mjs";
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
    ConstantFunction,
    DimensionHeight,
    Display,
    DimensionWidth,
    ElementAttributeValue,
    EnumeratedValue,
    FindBySelector,
    Float,
    FontFamily,
    FontSize,
    FontWeight,
    GreaterThan,
    GreaterOrEqual,
    MarginTop,
    MarginBottom,
    MarginRight,
    MarginLeft,
    ObjectNode,
    Opacity,
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
    Zindex,
} from "../index.mjs";
class Deserializer {
    constructor() {
        this.names = [];
    }


    /**
     * Build method deserialize(j) ,j is a JSON structure , this methode will produce a Function object
     */

    // deserialize(j) {
    //     //add the fisrt name in the array
    //     var names = [j.name]
    //         //add the name of all descendants in the array
    //     var classNames = this.getClassName(j, names)
    //         //console.log(classNames);
    //     var instances = []
    //     for (const className in classNames) {
    //         var functionClass = eval(classNames[className])
    //         instances.push(functionClass.deserialize(this, j))
    //     }
    //     return (instances);
    // }
    deserialize(j) {
        //add the fisrt name in the array
        var names = [j.name]
            //add the name of all descendants in the array
        var classNames = this.getClassName(j, names)
            //console.log(classNames);
        var instances = []
        for (const className in classNames) {
            //only letters are accepted
            const validation = /^[A-Za-z]+$/;
            if (classNames[className].match(validation)) {
                var functionClass = eval(classNames[className])
                instances.push(functionClass.deserialize(this, j))
            }
            // else{
            //     console.log("invalide input: " + classNames[className]);
            // }
            //console.log(functionClass);
            //console.log(functionClass.deserialize(this, j));
            //console.log(className)
            //functionClass.deserialize(this, j)
        }
        //return functionClass.deserialize(this, j) 
        //var className = j.name
        // determine  function class in the json object
        //const functionClass = eval(className)
        //console.log(functionClass);
        //return a Function object
        //return functionClass.deserialize(this, j)
        //return instances
        return instances;
    }


    getClassName(obj, names = []) {
            for (const i in obj) {
                if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
                    if (obj[i].name != undefined) {
                        names.push(obj[i].name)

                    }
                    this.getClassName(obj[i], names);
                }
            }
            return names;
        }
        // deserialize(j) {
        //     //return new function object
        //     const obj = new Function('x', 'return x')
        //     var objJson = obj(j)
        //         // determine  function class in the json object
        //     var className = objJson.name

    //     //return className.deserialize(this,j)
    //     //return Function object.
    //     return objJson
    // }
    // static deserialize(classObj, j) {
    //     //return an instance
    // }
    // deserialize(j) {
    //     //get the class name
    //     var className = j.name
    //         // determine  function class in the json object
    //     const functionClass = eval(className)
    //     console.log(functionClass);
    //     //return a Function object
    //     return functionClass.deserialize(this, j)
    // }
}

var j = {
    "name": "UniversalQuantifier",
    "contents": [
        "$x",
        {
            "name": "FindBySelector",
            "contents": [
                "#h2"
            ]
        },
        {
            "name": "ComposedFunction",
            "contents": [{
                    "name": "GreaterThan",
                    "contents": []
                },
                {
                    "name": "ComposedFunction",
                    "contents": [{
                            "name": "Opacity",
                            "contents": []
                        },
                        "$x"
                    ]
                },
                {
                    "name": "ConstantFunction",
                    "contents": [{
                            "name": "Opacity",
                            "contents": []
                        },
                        0.9
                    ]
                }
            ]
        }
    ]
};

var c = new Deserializer().deserialize(j)
console.log(c)
    //console.log(c.variable)
    // console.log(c.domain);
    //console.log('Contents of phi:', c.phi.contents);

//console.log(Object.values(c)[1]);
export { Deserializer };