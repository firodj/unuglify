const { getDotsNames, nodeFromDotsNames } = require('./dotsnames.js')

const U3 = require('uglify-js');

test('getDotsNames', () => {
    const toplevel =  U3.parse(`X.prototype.hasBrain`);
    const node = toplevel.body[0].body;
    const x = getDotsNames(node);
    expect(x.names).toEqual(["hasBrain", "prototype", "X"]);
})

test('nodeFromDotsNames', () => {
    const x = {names: ["hasBrain", "prototype", "X"]}
    const node = nodeFromDotsNames(x);
    expect(node).toBeInstanceOf(U3.AST_Dot);
    expect(node.property).toBe("hasBrain");
    expect(node.print_to_string()).toBe("X.prototype.hasBrain");
})