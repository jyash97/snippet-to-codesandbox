import { HTML_FILE } from './constant';
import { VanillaParser } from './parser';

export const getReactFiles = (code) => {
	const instance = new VanillaParser(code);

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
