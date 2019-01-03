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
} = require("../src/dubl");

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

    describe("duplicateError()", function() {
        it('Should return a new Error', function() {
            const input = new Error('Test new error');
            const result = duplicateError(input);

            expect(result).to.not.equal(input);
            expect(result.name).to.equal(input.name);
            expect(result.message).to.equal(input.message);
        });
    });

    describe("duplicateRegExp()", function() {
        it('Should duplicate a RegExp object', function() {
            const inputs = [
                /abc/,
                /De[1-9]+/,
                /De[1-9]+/
            ];
            const results = inputs.map(duplicateRegExp);
            const testStrings = [
                'abcde',
                'abDe',
                'abDe1'
            ];
            results.forEach((result, idx) => {
                const testString = testStrings[idx];
                const input = inputs[idx];
                expect(result.test(testString)).to.equal(input.test(testString));
                expect(result).to.not.equal(input);
            });
        });

        it('Should copy over the correct RegExp flags', function() {
            const inputs = [
                /abc/i,
                /De[1-9]+/g,
                /De[1-9]+/
            ];
            const results = inputs.map(duplicateRegExp);
            const testStrings = [
                'ABcDEF',
                'De1De2',
                'de55'
            ];
            results.forEach((result, idx) => {
                const original = testStrings[idx];
                const input = inputs[idx];
                expect(original.replace(result, '')).to.equal(original.replace(input, ''));
            });
        });
    });

    describe("duplicateDate()", function() {
        it('Should duplicate a Date object', function() {
            const inputs = [
                new Date(),
                new Date('2017-01-15')
            ];
            const results = inputs.map(duplicateDate);
            results.forEach((result, idx) => {
                const input = inputs[idx];
                expect(result.valueOf()).to.equal(input.valueOf());
                expect(result.toString()).to.equal(input.toString());
                expect(result).to.not.equal(input);
            });
        });
    });

    describe("duplicateMap()", function() {
        const entries = [
            [ {}, 'a' ],
            [ () => {}, 'b' ],
            [ [1, 2, 3], 'c' ]
        ];

        it('Should duplicate a Map object', function() {
            const input = new Map(entries);
            const result = duplicateMap(input);
            
            expect(result).to.not.equal(input);
            entries.forEach(entry => {
                const [ key ] = entry;
                expect(result.get(key)).to.equal(input.get(key));
            });
        });
    });

    describe("duplicateSet()", function() {
        const entries = [
            {},
            () => {},
            [1, 2, 3],
            'a'
        ];

        it('Should duplicate a Set object', function() {
            const input = new Set(entries);
            const result = duplicateSet(input);
            
            expect(result).to.not.equal(input);
            entries.forEach(entry => {
                expect(result.has(entry)).to.equal(input.has(entry));
            });
        });
    });

    describe("duplicatePromise()", function() {
        const entry = new Promise(res  => new Date() % 2 ? res(true) : res(false));

        it('Should duplicate a Promise object', async function() {
            const result = duplicatePromise(entry);
            const entryResolvedValue = await entry;
            const resultResolvedValue = await result;

            expect(result).to.not.equal(entry);
            expect(resultResolvedValue).to.equal(entryResolvedValue);
        });
    });

    describe("duplicateTypedArray()", function() {
        const typedArrays = [
            Int8Array,
            Uint8Array,
            Uint8ClampedArray,
            Int16Array,
            Uint16Array,
            Int32Array,
            Uint32Array,
            Float32Array,
            Float64Array
        ].map(constructor => new constructor( Math.ceil(Math.random * 10) )
            .map(() => Math.random() * 10)
        );

        it('Should duplicate an Int8Array object', function() {
            const entry = typedArrays[0];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Int8Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate a Uint8Array object', function() {
            const entry = typedArrays[1];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Uint8Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate a Uint8ClampedArray object', function() {
            const entry = typedArrays[2];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Uint8ClampedArray)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate an Int16Array object', function() {
            const entry = typedArrays[3];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Int16Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate a Uint16Array object', function() {
            const entry = typedArrays[4];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Uint16Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate an Int32Array object', function() {
            const entry = typedArrays[5];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Int32Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate a Uint32Array object', function() {
            const entry = typedArrays[6];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Uint32Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate a Float32Array object', function() {
            const entry = typedArrays[7];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Float32Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });

        it('Should duplicate a Float64Array object', function() {
            const entry = typedArrays[8];
            entry[0] = Math.floor(Math.random() * 100);
            const result = duplicateTypedArray(Float64Array)(entry);
            
            expect(result).to.not.equal(entry);
            expect(result).to.deep.equal(entry);
            expect(result[0]).to.equal(entry[0]);
        });
    });

    describe("duplicateArrayBuffer()", function() {
        it('Should duplicate an ArrayBuffer', function() {
            const input = new ArrayBuffer(Math.ceil(Math.random() * 100));
            const result = duplicateArrayBuffer(input);

            expect(result).to.not.equal(input);
            expect(result.length).to.equal(input.length);
        });
    });

    describe("duplicateDataView()", function() {
        it('Should duplicate a DataView', function() {
            const bufferLength = Math.ceil(Math.random() * 100);
            const buffer = new ArrayBuffer(bufferLength);
            const input = new DataView(buffer);
            input.setInt8(bufferLength - 1, Math.ceil(Math.random() * 100));

            const result = duplicateDataView(input);
            
            expect(result).to.not.equal(input);
            expect(result.byteLength).to.equal(input.byteLength);
            expect(result.byteOffset).to.equal(input.byteOffset);
            expect(result.getInt8(bufferLength - 1)).to.equal(input.getInt8(bufferLength - 1));
        });
    });

    describe('duplicateTraversableObject()', function() {
        const duplicateObject = duplicateTraversableObject(Object);
        const duplicateArray = duplicateTraversableObject(Array);

        it('Should duplicate a flat object', function() {
            const input = {
                a: 1,
                b: 'c',
                c: true,
                d: Symbol('a'),
                e: null,
                f: undefined
            };
            const result = duplicateObject(input);
            expect(result).to.not.equal(input);
            Object.entries(result).forEach(([ key, value ]) => {
                if (typeOf(value) === types.SYMBOL) {
                    expect(areSameType(value, input[key])).to.be.true;
                    expect(value.toString()).to.equal(input[key].toString());
                } else {
                    expect(value).to.equal(input[key]);
                }
            });
        });

        it('Should duplicate an object of nested depth', function() {
            const input = {
                a: {
                    b: 1,
                    c: {
                        d: () => {},
                        e: [ 1, 2, 'b' ]
                    }
                },
                f: [ 4, true, { g: 'b', h: new Error('ddd') } ],
                i: new Date('2016-15-14'),
                j: {
                    k: {
                        l: {
                            m: {
                                n: /def/
                            }
                        }
                    }
                }
            };
            const result = duplicateObject(input);
            expect(result).to.not.equal(input);
            checkObjects(result, input);
        });

        it('Should duplicate a flat array', function() {
            const input = [ 1, 'c', true, Symbol('a'), null, undefined ];
            const result = duplicateArray(input);
            expect(result).to.not.equal(input);
            Object.entries(result).forEach(([ key, value ]) => {
                if (typeOf(value) === types.SYMBOL) {
                    expect(areSameType(value, input[key])).to.be.true;
                    expect(value.toString()).to.equal(input[key].toString());
                } else {
                    expect(value).to.equal(input[key]);
                }
            });
        });

        it('Should duplicate an array of nested depth', function() {
            const input = [
                { a: 1, b: { c: () => {}, d: true } },
                'abcdefg',
                /dle/,
                5550,
                [ 1, 2, 3, 4 ]
            ];
            
            const result = duplicateArray(input);
            expect(result).to.not.equal(input);
            checkObjects(result, input);
        });
    });
});

