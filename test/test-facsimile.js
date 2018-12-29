////////////////////////////
// Initialize
////////////////////////////
const chai  = require("chai");
const { isPrimitive, types, typeOf, areSameType, isOneOf } = require("tupos");
const {
    identity,
    duplicateFunction,
    duplicateError,
    duplicateRegExp,
    duplicateDate,
    duplicateTraversableObject,
    duplicateMap,
    duplicateSet,
    duplicatePromise,
    duplicateTypedArray,
    duplicateArrayBuffer,
    duplicateDataView
} = require("../src/facsimile");

const expect = chai.expect;
const isTraversable = isOneOf(types.ARRAY, types.OBJECT);

const checkObjects = (obj1, obj2) => {
    const obj1Entries = Object.entries(obj1);
    const obj2Keys = Object.keys(obj2);

    obj1Entries.forEach(([ key, value ]) => {
        expect(key in obj2).to.be.true;
        const obj2Value = obj2[key];
        if (isPrimitive(value)) {
            if (typeOf(value) === types.SYMBOL) {
                expect(typeOf(obj2Value)).to.equal(types.SYMBOL);
            } else {
                expect(value).to.equal(obj2Value);
            }
        } else if (isTraversable(value)) {
            checkObjects(value, obj2Value);
        } else {
            expect(typeOf(value)).to.equal(typeOf(obj2Value));
        }
    });

    obj2Keys.forEach(key => {
        expect(key in obj1).to.be.true;
    });
};

////////////////////////////
// Test
////////////////////////////
describe("facsimile.js", function() {
    describe("identity()", function() {
        it("Should return original parameter", function() {
            const inputs = [
                "abc",
                1,
                true,
                [ 1, 2, 3 ],
                { a: [1, 2], b: 3, c: "string" }
            ];
            const results = inputs.map(identity);

            results.forEach((result, idx) => {
                expect(result).to.equal(inputs[idx]);
            });
        });
    });

    describe("duplicateFunction()", function() {
        it("Should return a new function", function() {
            const compound = param => { return param.toString(); };
            compound.prop1 = "property";
            compound.prop2 = [ 1, 2, [ 3, 4 ] ];

            const inputs = [
                () => 2,
                function (a, b) { return a + b },
                compound
            ];
            const params = [
                [ undefined ],
                [ 1, 2 ],
                [ {a: 1} ]
            ];
            const results = inputs.map(duplicateFunction);
            
            results.forEach((result, idx) => {
                const input = inputs[idx];

                expect(result).to.not.equal(input);
                expect(result.toString()).to.equal(input.toString());
                expect(result(...params[idx])).to.equal(input(...params[idx]));

                for (const key in input) {
                    expect(key in result).to.be.true;

                    if (isPrimitive(input[key])) {
                        expect(input[key]).to.equal(result[key]);
                    } else {
                        expect(input[key]).to.not.equal(result[key]);
                        expect(input[key]).to.deep.equal(result[key]);
                    }
                }
            });
        });
    });
});

