import { parse, prettyPrint } from 'recast';
import parser from 'recast/parsers/babel';

/**
 * Generates the code that will be added in the respective framework.
 * @param {string} code Selected text
 * @returns {Object} Content for the respective framework and whether it has export statement.
 */
const getCodeContent = (code) => {
	const ast = parse(code, {
		parser,
	});
	ast.program.body = ast.program.body.filter((item) => item.type !== 'ImportDeclaration');
	const hasExportStatement = ast.program.body.find(
		(item) => item.type === 'ExportDefaultDeclaration',
	);
	return { content: prettyPrint(ast).code, hasExportStatement };
};

/**
 * Returns dependencies and imports info
 * @param {string} code Selected text
 * @returns {Object} All imports statement and dependencies.
 */
const getImportContent = (code) => {
	const ast = parse(code, {
		parser,
	});
	ast.program.body = ast.program.body.filter((item) => item.type === 'ImportDeclaration');
	const dependencies = ast.program.body
		.map((item) => item.source.value)
		.filter((dep) => !dep.includes('.css'));
	return { imports: prettyPrint(ast).code, dependencies };
};

/**
 * Returns all the parsed info from the code like dependencies, import, content and export statement.
 * @param {string} code Selected Text
 * @returns {Object} Import statements, code for respective framework, dependencies and whether has export statement.
 */
export const getParsedCode = (code) => {
	const { content, hasExportStatement } = getCodeContent(code);
	const { imports, dependencies } = getImportContent(code);

	return {
		imports,
		dependencies,
		content,
		hasExportStatement,
	};
};
