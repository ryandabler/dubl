"use strict";

////////////////////
// Initialize
////////////////////
const { typeOf } = require("tupos");
const { duplicate } = require("./dubl");

////////////////////
// Main
////////////////////
const copy = (param, shouldDup = () => true) => duplicate[typeOf(param)](param, shouldDup)

module.exports = { copy };