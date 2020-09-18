import { HTML_FILE } from './helper';
import { ReactParser } from './parser';

export const getReactFiles = (code) => {
	const instance = new ReactParser(code);

	return {
		'package.json': {
			content: {
				dependencies: instance.allDependenciesWithVersion,
			},
		},
		'index.js': {
			content: instance.code,
		},
		'index.html': {
			content: HTML_FILE,
		},
	};
};
