import get from 'lodash.get';
import { print } from 'recast';
import { IMPORT, VARIABLE } from '../tokens';

const getCodeFromAST = ({ ast, astBody }) => {
	const duplicateAst = JSON.parse(JSON.stringify(ast));
	return print({
		...duplicateAst,
		program: {
			...duplicateAst.program,
			body: astBody,
		},
	}).code;
};

export const getCodeInfo = ({ ast }) => {
	const astBody = get(ast, 'program.body', []);
	const importStatementNodes = astBody.filter(
		(node) => node.type === IMPORT && get(node, 'source.value', ''),
	);

	const requireStatementNodes = astBody.filter(
		(node) =>
			node.type === VARIABLE &&
			get(node, 'declarations[0].init.callee.name', '') === 'require' &&
			get(node, 'declarations[0].init.arguments[0].value', ''),
	);

	const dependencies = [
		...importStatementNodes.map((node) => get(node, 'source.value', '')),
		...requireStatementNodes.map((node) =>
			get(node, 'declarations[0].init.arguments[0].value', ''),
		),
	];

	const codeContent = astBody.filter(
		(node) =>
			!(
				(node.type === VARIABLE &&
					get(node, 'declarations[0].init.callee.name', '') === 'require' &&
					get(node, 'declarations[0].init.arguments[0].value', '')) ||
				(node.type === IMPORT && get(node, 'source.value', ''))
			),
	);

	return {
		dependencies,
		imports: getCodeFromAST({
			ast,
			astBody: [...importStatementNodes, ...requireStatementNodes],
		}),
		codeWithoutImports: getCodeFromAST({
			ast,
			astBody: codeContent,
		}),
	};
};
