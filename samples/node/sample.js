const uv = require("../../lib");

console.log(
  uv
    .parse("10px")
    .add(5)
    .toString()
);
