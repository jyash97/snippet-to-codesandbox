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

export function getReactFiles({ content, imports }) {
	return {
		'package.json': {
			content: {
				dependencies: {
					react: 'latest',
					'react-dom': 'latest',
				},
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
