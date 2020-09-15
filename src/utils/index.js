import { getReactFiles } from '../templates/react';
import { getParsedCode } from './parser';

/**
 * Generates CodeSandbox files required in POST API based on the template.
 * @param {string} template Specifies the framework or library id.
 * @param {string} code Selected text
 * @returns {Object} Generated files.
 */
const getTemplateFiles = ({ template, code }) => {
	const { imports, dependencies, content, hasExportStatement } = getParsedCode(code);
	switch (template) {
		case 'react': {
			return getReactFiles({ content, imports, dependencies, hasExportStatement });
		}
		default: {
			return {};
		}
	}
};

/**
 * Use it to get Sandbox-id and open it in new tab.
 * @param {Object} params
 * @param {string} employee.name - The name of the employee.
 * @param {string} employee.department - The employee's department.
 * @returns {Promise} Promise object of CSB POST API.
 */
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
