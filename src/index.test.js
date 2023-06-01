const U3 = require('uglify-js');

const fs = require('fs');
const path = require("path");

const { doTransform } = require('.');

const testCases = []

const parseTests = new U3.TreeWalker(function(node, descend) {
    if (node instanceof U3.AST_LabeledStatement === false) return;
    if (!node.label.name.match(/^test_.+/)) return;
    const testCase = {
        name: node.label.name
    }
    if (node.body instanceof U3.AST_BlockStatement === false) return;
    let nodes = node.body.body;
    if (!Array.isArray(nodes)) return;
   
    for (node of nodes) {
        if (node instanceof U3.AST_LabeledStatement === false) {
            console.log(node)
            continue;
        }
        testCase[node.label.name] = node.body;
    }
    
    testCases.push([ testCase.name, testCase.input, testCase.want ])
    return true;
});

function parseTestFile(filename) {
    const fixture = path.resolve(__dirname, filename);
    const contents = fs.readFileSync(fixture, 'utf8');
    const toplevel = U3.parse(contents);
    toplevel.walk(parseTests);
}

describe('replaceBool', () => {
    parseTestFile('./rules/booleans.testing.js');
    it.each(testCases)('%s', (name, input, want) => {
        const got =  doTransform(input);
        expect(got.print_to_string()).toBe(want.print_to_string());
    })
});
