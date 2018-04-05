# unit-value

[![NPM](https://nodei.co/npm/unit-value.png?compact=true)](https://nodei.co/npm/unit-value/)

[![Build Status](https://travis-ci.org/beforan/unit-value.svg?branch=master)](https://travis-ci.org/beforan/unit-value)
[![Coverage Status](https://coveralls.io/repos/github/beforan/unit-value/badge.svg?branch=master)](https://coveralls.io/github/beforan/unit-value?branch=master)

A javascript library for easing working with numeric values that have units associated with them.

# Getting Started

## Use in node (or with browserify / webpack etc)

`npm install unit-value`

```js
const UnitValue = require("unit-value");
const uv = new UnitValue(10, "px");
console.log(uv.add(25).toString()); // prints "35px"
```

There is a small sample node script that can be run with `npm run sample`.

## Use in the browser

Currently there's no standalone build for browser use.

This will probably be added in future, but there may be some namespacing changes to make for that.
Also I feel the library is significantly more useful inside modules than in the browser.

## Examples

The API Reference Docs give a good sense of what is possible with the library, but here are some examples

### Perform math on CSS values without separating the units and adding them back after

```js
element1.style.width = "100px";
element2.style.width = UnitValue.parse(element1.style.width) // turn the existing css value string into a UnitValue
  .subtract(30) // make it slightly smaller
  .toString(); // returns "70px"
```

### Perform math using regular javascript operators, while using the friendly string for UI display

```js
const period = new UnitValue(10, "s"); // amount of time in seconds
myUI.timePeriod = period.toString(); // "10s"

// convert to milliseconds to have a repeating action every 10s
const periodMs = period * 1000; // the js * operator uses `valueOf()` for the UnitValue object, and works normally
setInterval(() => console.log("hello"), periodMs);
```

### Perform unit conversions, changing the units string at the same time as doing the calculation

```js
const length_us = "5 inches";
const length_international = UnitValue.parse(length_us) // create a UnitValue from the original value
  .multiply(2.54, "cm") // apply the conversion math and change the resulting units
  .toString(); // return a string again - "12.7cm"
```

# Build

`npm run lib` will run the source through Babel, producing a lib directory which can be consumed in a node.js environment (this is what the npm package is).

# Test

The library is fully test covered by `mocha`, with `chai` expect assertions. `nyc` assesses and reports on code coverage.

Tests can be run with `npm test` but the library will need to be built first.

# Documentation

The code is documented with jsdoc comments.

The documentation for the latest stable code (`master` branch) is always available online at [https://beforan.github.io/unit-value/](https://beforan.github.io/unit-value/).

The documentation relevant to the commit you are looking at can always be built by running `npm run docs`.

# Contributing

Contributions are welcome. Just raise a PR.

PR's are more likely to be considered in response to issues.

The repo (and npm scripts) uses `eslint` and `prettier`, as well as providing a basic `editorconfig`, so it's pretty hard to _not_ follow a consistent style (since prettier formats on commit).

`npm run lint` will run the linter, but it's recommended to use an editor that supports eslint, and preferably prettier too. I use [Visual Studio Code](https://code.visualstudio.com).

PRs should contain unit tests. Refer to the existing tests for style expectations. Preferably code coverage will be at 100% before a PR is accepted, unless there is a good reason for reduced coverage.

Travis builds must pass on PR's, and these run eslint and unit tests, so the linter will also keep code to the intended quality, and tests must pass.
