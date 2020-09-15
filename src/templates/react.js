function getIndexFile({ content, imports, dependencies, hasExportStatement }) {
	/*
		Considering that selected text may render it to React DOM.
	*/
	if (dependencies.includes('react-dom')) {
		return `${imports}
${content}
		`;
	}

	let fileContent = `
${imports}
const App = () => (
    <React.Fragment>
        ${content}
    </React.Fragment>
);
	`;

	/*
		Considering that the selected text is exporting a component,
		so we import that component in index.js. And define the exported
		component in App.js
	*/
	if (hasExportStatement) {
		fileContent = `
import App from './App';
		`;
	}

	return `import React from 'react';
import ReactDOM from 'react-dom';

${fileContent}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);`;
}

function getAppFile({ content, imports, dependencies }) {
	/*
		If react is imported already we dont add it again.
	*/
	if (dependencies.includes('react')) {
		return `
${imports}
${content}
		`;
	}

	return `
import React from 'react';
${imports}
${content}
		`;
}

/**
 * Generates all files for React from the selected text.
 *
 * @param {*} { content, imports, dependencies, hasExportStatement }
 * @returns {Object}
 */
export function getReactFiles({ content, imports, dependencies, hasExportStatement }) {
	const defaultDependencies = {
		react: 'latest',
		'react-dom': 'latest',
	};

	/*
		Traverse all dependecies and add the version to `latest`.
	*/
	const allDependencies = dependencies.reduce(
		(agg, dep) => ({
			...agg,
			[dep]: 'latest',
		}),
		{ ...defaultDependencies },
	);

	const defaultFiles = {
		'package.json': {
			content: {
				dependencies: allDependencies,
			},
		},
		'index.js': {
			content: getIndexFile({ content, imports, dependencies, hasExportStatement }),
		},
		'index.html': {
			content: '<div id="root"></div>',
		},
	};

	/*
		If export statement is present, place the copied code in App.js
		and import it in index.js
	*/
	if (hasExportStatement) {
		return {
			...defaultFiles,
			'App.js': {
				content: getAppFile({ content, imports, dependencies }),
			},
		};
	}

	return defaultFiles;
}
