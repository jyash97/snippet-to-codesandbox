import { parse } from 'recast';
import get from 'lodash.get';

import { COMPONENT_CODE, REACTDOM_IMPORT, REACT_IMPORT, RENDER_TO_DOM } from './constant';
import { ARROW_FUN, BLOCK, EXPORT, EXPR, JSX_ELEM, VARIABLE, RETURN } from '../../tokens';
import { getCodeInfo } from '../../utils/parser';
import { getAllImports, getFormattedCode, getSandboxDependencies } from '../../utils/code';

class ReactParser {
	constructor(code) {
		this.orignalCode = code;
		this.codeAST = parse(code);
		const { imports, dependencies, codeWithoutImports } = getCodeInfo({ ast: this.codeAST });
		this.imports = imports;
		this.dependencies = dependencies;
		this.codeWithoutImports = codeWithoutImports;
	}

	get allDependenciesWithVersion() {
		return getSandboxDependencies({
			deps: this.dependencies,
			required: ['react', 'react-dom'],
		});
	}

	get astBody() {
		return get(this.codeAST, 'program.body', []);
	}

	get code() {
		if (this.hasDOMRendering) {
			return getFormattedCode(`
				${this.importStatements}

				${this.codeWithoutImports}
			`);
		}

		if (this.hasDefaultJSXExport) {
			return getFormattedCode(`
				${this.importStatements}

				${this.codeWithoutImports.replace('export default', 'const App =')}

				${RENDER_TO_DOM()}
			`);
		}

		if (this.hasComponentDefined) {
			return getFormattedCode(`
				${this.importStatements}

				${this.codeWithoutImports}

				${RENDER_TO_DOM({ component: this.jsxComponentName })}
			`);
		}

		if (this.hasJSXExpression) {
			return getFormattedCode(`
				${this.importStatements}

				${COMPONENT_CODE({ code: this.codeWithoutImports })}

				${RENDER_TO_DOM()}
			`);
		}
		return '';
	}

	get hasComponentDefined() {
		return !!this.jsxComponent;
	}

	get hasDefaultJSXExport() {
		const exportStatementNode = this.astBody.find(
			(node) =>
				node.type === EXPORT &&
				get(node, 'declaration.type', '') === ARROW_FUN &&
				get(node, 'declaration.body.type', '') === JSX_ELEM,
		);

		return !!exportStatementNode;
	}

	get hasDOMRendering() {
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

	get hasJSXExpression() {
		const jsxExpressionNode = this.astBody.find(
			(node) => node.type === EXPR && get(node, 'expression.type') === JSX_ELEM,
		);

		return !!jsxExpressionNode;
	}

	get importStatements() {
		return getAllImports({
			codeImports: this.imports,
			codeDeps: this.dependencies,
			importsMap: {
				react: REACT_IMPORT,
				'react-dom': REACTDOM_IMPORT,
			},
		});
	}

	get jsxComponent() {
		const implicitReturnJSXNode = this.astBody.find(
			(node) =>
				node.type === VARIABLE &&
				get(node, 'declarations[0].init.type', '') === ARROW_FUN &&
				get(node, 'declarations[0].init.body.type', '') === JSX_ELEM,
		);
		if (implicitReturnJSXNode) {
			return implicitReturnJSXNode;
		}

		const explicitReturnJSXNode = this.astBody.find((node) => {
			return (
				node.type === VARIABLE &&
				get(node, 'declarations[0].init.type', '') === ARROW_FUN &&
				get(node, 'declarations[0].init.body.type', '') === BLOCK &&
				get(
					get(node, 'declarations[0].init.body.body', []).find(
						(insideNode) => insideNode.type === RETURN,
					),
					'argument.type',
					'',
				) === JSX_ELEM
			);
		});

		return explicitReturnJSXNode;
	}

	get jsxComponentName() {
		const jsxComponentNode = this.jsxComponent;
		if (jsxComponentNode) {
			return get(this.jsxComponent, 'declarations[0].id.name');
		}
		return null;
	}
}

export { ReactParser };
