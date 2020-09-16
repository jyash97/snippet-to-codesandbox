import ReactParser from './parser';

export const getFiles = (code) => {
	const parserInstance = new ReactParser(code);

	return parserInstance.hasDOMRendering;
};
