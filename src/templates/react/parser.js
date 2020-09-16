import { parse } from 'recast';
import get from 'lodash.get';
import { IMPORT, VARIABLE, EXPR } from '../../tokens';
import { hasDepsImported } from '../../utils/parser_new';

class ReactParser {
	constructor(code) {
		this.orignalCode = code;
		this.codeAST = parse(code);
	}

	get astBody() {
		return get(this.codeAST, 'program.body', []);
	}

	get hasDOMRendering() {
		if (this.hasReactDOMImport) {
			// Short circuiting in order to avoid more calculations
			return true;
		}

		const propertyAccessExpr = this.astBody.find(
			(node) =>
				node.type === EXPR &&
				get(node, 'expression.callee.property.name') === 'render' &&
				get(node, 'expression.arguments', []).length === 2,
		);

		if (propertyAccessExpr) {
			return true;
		}

		const directAccessExpr = this.astBody.find(
			(node) =>
				node.type === EXPR &&
				get(node, 'expression.callee.name') === 'render' &&
				get(node, 'expression.arguments', []).length === 2,
		);

		return !!directAccessExpr;
	}

	get hasReactDOMImport() {
		// One more approach would be to get all deps in place and than search in it.
		return hasDepsImported({
			astBody: this.astBody,
			dependency: 'react-dom',
		});
	}

	get hasReactImport() {}
}

export { ReactParser };
