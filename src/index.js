const { ruleBooleanUgly, replaceBool } = require('./rules');
const U3 = require('uglify-js');

const doTransform = function(toplevel) {
    toplevel.transform(replaceBool);
    return toplevel;
}

module.exports = { doTransform }