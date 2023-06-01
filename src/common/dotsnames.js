const U3 = require('uglify-js');

const classNames = new Map();

function getDotsNames(node) {
	const initial_node = node;
	var names = [];
	var id = false;
	while (node instanceof U3.AST_Dot) {
		if (node.expression instanceof U3.AST_SymbolRef) {
			const symbol_ref = node.expression;
			names.push(node.property);

			if (void 0 !== symbol_ref.thedef) {
				id = symbol_ref.thedef.id;
			}

			if (id && classNames[id]) {
				names.push(classNames[id]);
			} else {
				names.push(symbol_ref.name);
			}
			node = null;

			return { names: names, id: id }
		} else if (node.expression instanceof U3.AST_Dot) {
			names.push(node.property);
			node = node.expression;
		} else {
			return false;
		}
	}
	return false;
}

function getSubsNames(node) {
	if (node instanceof U3.AST_Sub == false) return false;
	if (node.property instanceof U3.AST_String == false) return false;
	if (node.expression instanceof U3.AST_Dot == false) return false;
	const dotnames = getDotsNames(node.expression);
	if (dotnames) {
		dotnames.names.unshift(node.property.value);
	}
	return dotnames;
}

function nodeFromDotsNames({ names, id }) {
	const root = new U3.AST_Dot({
		property: names[0],
	});
	
	var node = root;
	for (var i = 1; i < names.length; i++) {
		if (i+1 < names.length) {
			node.expression = new U3.AST_Dot({
				property: names[i],
			});
		} else {
			node.expression = new U3.AST_SymbolRef({
				name: names[i],
				thedef: {
					id,
				}
			});
		}
		node = node.expression;
	}
	return root
}

module.exports = {
	getDotsNames, 
	getSubsNames,
	nodeFromDotsNames,
	classNames,
}
