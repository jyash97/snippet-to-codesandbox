module.exports = {
	watchman: true,
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
	globals: {
		PRETTIER_CONFIG: {
			tabWidth: 4,
			useTabs: true,
			semi: true,
			singleQuote: true,
			printWidth: 100,
		},
	},
};
