import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import nodePolyfills from 'rollup-plugin-node-polyfills';

import pkg from './package.json';

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.browser,
			format: 'iife',
			sourcemap: true,
		},
	],
	plugins: [
		external(),
		resolve({
			preferBuiltins: true,
		}),
		commonjs(),
		babel({
			exclude: 'node_modules/**',
		}),
	],
};
