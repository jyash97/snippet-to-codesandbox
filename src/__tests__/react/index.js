const { ReactParser } = require('../../templates/react/parser');

describe('React has DOM Rendering', () => {
	test('Basic Test', () => {
		const code = `
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<div>Cool</div>, document.getElementById("root"))
		`;

		const instance = new ReactParser(code);

		return expect(instance.hasReactDOMImport).toBeTruthy();
	});
});
