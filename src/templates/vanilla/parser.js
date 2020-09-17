import { parse } from 'recast';
import get from 'lodash.get';

import { getCodeInfo } from '../../utils/parser';
import { getAllImports, getFormattedCode, getSandboxDependencies } from '../../utils/code';

class VanillaParser {
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
		});
	}

	get astBody() {
		return get(this.codeAST, 'program.body', []);
	}

	get code() {
		return getFormattedCode(`
				${this.importStatements}

				${this.codeWithoutImports}
			`);
	}

	get importStatements() {
		return getAllImports({
			codeImports: this.imports,
			codeDeps: this.dependencies,
			importsMap: {},
		});
	}
}

export { VanillaParser };
