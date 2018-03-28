# unit-value

A javascript library for easing working with numeric values that have units associated with them.

# Getting Started

## Use in node (or with browserify / webpack etc)

* `npm install unit-value`
* `import UnitValue from 'unit-value';`
* `const uv = new UnitValue(10, "px");`

## Use in the browser

Currently there's no standalone build for browser use.

This will probably be added in future, but there may be some namespacing changes to make for that.
Also I feel the library is significantly more useful inside modules than in the browser.

# Build

`npm run lib` will run the source through Babel, producing a lib directory which can be consumed in a node.js environment (this is what the npm package is).

# Documentation

The code is documented with jsdoc comments.

The documentation for the latest stable code (`master` branch) is available online at [https://beforan.github.io/unit-value/](https://beforan.github.io/unit-value/).

The documentation relevant to the commit you are looking at should always be present inside `/docs`, but you can always build the current docs for the code you're looking at by running `npm run docs`.

### A note on pre-commit hooks

Documentation is kept accurate and up-to-date through the use of a precommit hook. When you commit to git, the docs are automagically built and staged. Bear this in mind if commits appear to be taking longer than usual. If you encounter issues committing, ensure that all npm dev dependencies have been installed with `npm install`, and that you have `git` available in your `PATH`.

# Contributing

Contributions are welcome. Just raise a PR.

PR's are more likely to be considered in response to issues.

The repo (and npm scripts) uses `eslint` and `prettier`, as well as providing a basic `editorconfig`, so it's pretty hard to not follow a consistent style (since prettier formats on commit).
