// TODO: Update formatting the code.
export const getFormattedCode = (code) => {
	return `
${code}
	`;
};

const BUILD_FOLDERS = ['/lib', '/dist', '/build', '/assets', '/locale'];

export const getAllImports = ({ codeImports, codeDeps, importsMap }) => {
	return Object.keys(importsMap).reduce((agg, dep) => {
		if (codeDeps.includes(dep)) {
			return agg;
		}

		return getFormattedCode(`${importsMap[dep]}${agg}`);
	}, codeImports);
};

export const getSandboxDependencies = ({ deps, required = [] }) => {
	const allDeps = [...required, ...deps]
		.filter((dep) => !dep.includes('.css'))
		.filter((dep) => !BUILD_FOLDERS.find((folder) => dep.includes(folder)));

	return allDeps.reduce(
		(agg, dep) => ({
			...agg,
			[dep]: 'latest',
		}),
		[],
	);
};
