function getIndexFile({ content, imports }) {
	return `import React from 'react';
import ReactDOM from 'react-dom';
${imports}

const App = () => (
    <React.Fragment>
        ${content}
    </React.Fragment>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);`;
}

export function getReactFiles({ content, imports, dependencies }) {
	const defaultDependencies = {
		react: 'latest',
		'react-dom': 'latest',
	};

	const allDependencies = dependencies.reduce(
		(agg, dep) => ({
			...agg,
			[dep]: 'latest',
		}),
		{ ...defaultDependencies },
	);

	return {
		'package.json': {
			content: {
				dependencies: allDependencies,
			},
		},
		'index.js': {
			content: getIndexFile({ content, imports }),
		},
		'index.html': {
			content: '<div id="root"></div>',
		},
	};
}
