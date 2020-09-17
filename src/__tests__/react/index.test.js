import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babel';
const { ReactParser } = require('../../templates/react/parser');

// TODO: Add tests use prettier to test formatting of the code.
describe('React has DOM Rendering', () => {
	test('Basic Test', () => {
		console.log(global.PRETTIER_CONFIG);
		return expect(true).toBeTruthy();
	});
});
