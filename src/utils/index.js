import { parse, print } from 'recast';
import parser from 'recast/parsers/babylon';
import { getReactFiles } from '../templates/react';

const getTemplateFiles = ({ template, content: code }) => {
	const ast = parse(code, {
		parser,
	});
	ast.program.body = ast.program.body.filter((item) => item.type !== 'ImportDeclaration');

	const content = print(ast).code;
	switch (template) {
		case 'react': {
			return getReactFiles({ content: code, import: '' });
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
