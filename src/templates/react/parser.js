import { parse } from 'recast';
import get from 'lodash.get';

import { generateBasicCode, REACTDOM_IMPORT, REACT_IMPORT } from './helper';
import {
	ARROW_FUN,
	BLOCK,
	EXPORT,
	EXPR,
	JSX_ELEM,
	VARIABLE,
	RETURN,
	JSX_FRAG,
	FUNCTION,
	CLASS,
	IDENTIFIER,
	MEMBER_EXPR,
} from '../../tokens';
import { getCodeInfo } from '../../utils/parser';
import { getAllImports, getSandboxDependencies } from '../../utils/code';

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
		const basicCodeInfo = {
			imports: this.importStatements,
			code: this.codeWithoutImports,
			hasRender: false,
		};

		if (this.hasDOMRendering) {
			return generateBasicCode({
				...basicCodeInfo,
				hasRender: true,
			});
		}

		if (this.hasDefaultJSXExport) {
			return generateBasicCode({
				...basicCodeInfo,
				code: this.codeWithoutImports.replace('export default', 'const App ='),
			});
		}

		if (this.hasClassComponent) {
			return generateBasicCode({
				...basicCodeInfo,
				componentToRender: this.classComponentName,
			});
		}

		if (this.hasFunctionalComponent) {
			return generateBasicCode({
				...basicCodeInfo,
				componentToRender: this.functionalComponentName,
			});
		}

		if (this.hasComponentDefined) {
			return generateBasicCode({
				...basicCodeInfo,
				componentToRender: this.jsxComponentName,
			});
		}

		if (this.hasJSXExpression) {
			return generateBasicCode({ ...basicCodeInfo, isJSXExpression: true });
		}

		return '';
	}

	get classComponent() {
		return this.astBody.find(
			(node) =>
				(node.type === CLASS &&
					get(node, 'superClass.type', '') === IDENTIFIER &&
					get(node, 'superClass.name', '') === 'Component') ||
				(get(node, 'superClass.type', '') === MEMBER_EXPR &&
					get(node, 'superClass.property.name', '') === 'Component'),
		);
	}

	get classComponentName() {
		return get(this.classComponent, 'id.name', null);
	}

	get functionalComponent() {
		const functionalComponentNode = this.astBody.find(
			(node) =>
				node.type === FUNCTION &&
				get(node, 'body.type', '') === BLOCK &&
				get(
					get(node, 'body.body', []).find((insideNode) => insideNode.type === RETURN),
					'argument.type',
					'',
				) === JSX_ELEM,
		);

		return functionalComponentNode;
	}

	get functionalComponentName() {
		return get(this.functionalComponent, 'id.name', null);
	}

	get hasComponentDefined() {
		return !!this.jsxComponent;
	}

	get hasClassComponent() {
		return !!this.classComponent;
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

	get hasFunctionalComponent() {
		return !!this.functionalComponent;
	}

	get hasJSXExpression() {
		const jsxExpressionNode = this.astBody.find(
			(node) =>
				node.type === EXPR &&
				(get(node, 'expression.type') === JSX_ELEM ||
					get(node, 'expression.type') === JSX_FRAG),
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
				(get(node, 'declarations[0].init.body.type', '') === JSX_ELEM ||
					get(node, 'declarations[0].init.body.type', '') === JSX_FRAG),
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
