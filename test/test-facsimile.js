////////////////////////////
// Initialize
////////////////////////////
const chai  = require("chai");
const {
    identity,
    duplicateFunction,
    duplicateError,
    duplicateRegExp,
    duplicateDate,
    duplicateObject,
    duplicateArray,
    duplicateMapType,
    duplicateSetType,
    duplicatePromise,
    duplicateTypedArray,
    duplicateArrayBuffer,
    duplicateDataView,
    duplicate
} = require("../src/facsimile");

const expect = chai.expect;

////////////////////////////
// Test
////////////////////////////
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