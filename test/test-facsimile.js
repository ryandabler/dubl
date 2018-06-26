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
describe("duplicate()", function() {
    it("Should duplicate a string", function() {
        const inputs = [
            "abc",
            new String("def"),
            String("ghi")
        ];
        const results = inputs.map(duplicate);
        
        results.forEach((result, idx) => {
            expect(result).to.equal(inputs[idx]);
        });
    });
});