import get from 'lodash.get';
import { IMPORT, VARIABLE } from '../tokens';

export const hasDepsImported = ({ astBody, dependency }) => {
	const importStatementNode = astBody.find(
		(node) => node.type === IMPORT && get(node, 'source.value', '') === dependency,
	);

	if (importStatementNode) {
		return true;
	}

	const requireStatementNode = astBody.find(
		(node) =>
			node.type === VARIABLE &&
			get(node, 'declarations[0].init.callee.name', '') === 'require' &&
			get(node, 'declarations[0].init.arguments[0].value', '') === dependency,
	);

	return !!requireStatementNode;
};
