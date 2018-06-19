"use strict";

////////////////////
// Initialize
////////////////////
const { typeOf } = require("tupos");
const { duplicate } = require("./facsimile");

////////////////////
// Main
////////////////////
const copy = param => duplicate[typeOf(param)](param)

module.exports = { copy };