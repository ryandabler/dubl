# Dubl
[![Build Status](https://travis-ci.com/ryandabler/dubl.svg?branch=master)](https://travis-ci.com/ryandabler/dubl)
[![Coverage Status](https://coveralls.io/repos/github/ryandabler/dubl/badge.svg?branch=master)](https://coveralls.io/github/ryandabler/dubl?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/b28eb0e97fe56220237f/maintainability)](https://codeclimate.com/github/ryandabler/dubl/maintainability)
[![](https://img.shields.io/npm/v/dubl.svg)](https://www.npmjs.com/package/dubl)

Dubl is a copy library to copy most of the main types of JavaScript objects.

## Installation
To install the Dubl library run

```
npm install dubl
```

## API
### Functions
Dubl has only one function:
*`copy(obj, shouldDuplicate)`: `copy` takes a built-in JavaScript object to duplicate and creates a deep copy of it. In the case of potentially recursive objects, there is an optional `shouldDuplicate` function that can be passed in in case one wants to customize the deep copy logic. The parameter for `shouldDuplicate` is the current (sub-)object that is about to be deep copied. If `shouldDuplicate` returns `true`, that object will be deep copied; if `false`, it will be shallow copied.

### Non-copiable objects
Some objects for various reasons cannot be copied (either because it is impossible to get the keys for that object, there is not enough access to information to be able to reconstruct it, or it makes no sense to make a copy). In this case, `copy` will return the original object.

The following cannot be copied:
* Primitives (strings, numbers, booleans, null, undefined, symbols)
* WeakMaps and WeakSets
* The `Math`, `JSON`, and `WebAssembly` built-in objects
* Generators

## License
Dubl is licensed under the MIT license.