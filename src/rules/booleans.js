const U3 = require('uglify-js');

function ruleBooleanUgly(node) {
    if (node instanceof U3.AST_UnaryPrefix === false) return;
    if (node.operator !== '!') return;
    if (node.expression instanceof U3.AST_Number === false) return;
    if (node.expression.value === 0) {
        return true;
    }
    if (node.expression.value === 1) {
        return false;
    }    
}

const replaceBool = new U3.TreeTransformer(null, function(node){
    const v = ruleBooleanUgly(node);
    if (v === undefined) return;
    if (v === true) {
        return new U3.AST_True({
            start : node.start,
            end   : node.end,
        });
    } else if (v === false) {
        return new U3.AST_False({
            start : node.start,
            end   : node.end,
        });
    }
})

module.exports = { ruleBooleanUgly, replaceBool }
