import { parse, prettyPrint } from 'recast';
import parser from 'recast/parsers/babylon';
import { getReactFiles } from '../templates/react';

const getCodeContent = (code) => {
	const ast = parse(code, {
		parser,
	});
	ast.program.body = ast.program.body.filter((item) => item.type !== 'ImportDeclaration');

	return prettyPrint(ast).code;
};

const getImportContent = (code) => {
	const ast = parse(code, {
		parser,
	});
	ast.program.body = ast.program.body.filter((item) => item.type === 'ImportDeclaration');
	const dependencies = ast.program.body.map((item) => item.source.value);
	return { imports: prettyPrint(ast).code, dependencies };
};

const getTemplateFiles = ({ template, code }) => {
	const content = getCodeContent(code);
	const { imports, dependencies } = getImportContent(code);
	switch (template) {
		case 'react': {
			return getReactFiles({ content, imports, dependencies });
		}
		default: {
			return {};
		}
	}
};

export const getSandboxURL = (params) => {
	return fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			files: getTemplateFiles(params),
		}),
	});
};
