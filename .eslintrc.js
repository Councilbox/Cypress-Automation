module.exports = {
	env: {
		browser: true,
		es6: true
	},
	settings: {
		react: {
			version: "detect"
		},
		"import/resolver": {
			"node": {
				"extensions": [".js", ".jsx"]
			}
		}
	},
	plugins: ['graphql'],
	"parser": "babel-eslint",
	extends: [
		'airbnb-base',
		"plugin:cypress/recommended",
		"plugin:react/recommended"
	],
	"overrides": [{
		"files": ["*.jsx", "*.js"]
	}],
	parserOptions: {
		ecmaVersion: 11,
		ecmaFeatures: {
			"jsx": true
		},
		sourceType: 'module',
	},
	ignorePatterns: ['.github', '/cypress/*', 'public/*', '/src/displayComponents/ReactSignature/*'],
	rules: {
		"import/no-named-as-default": "off",
		"indent": ["error", "tab"],
		"no-new": 'warn',
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				"js": "never",
				"jsx": "never",
				"ts": "never",
				"tsx": "never"
			}
		],
		'no-multiple-empty-lines': ['error', { max: 2 }],
		"function-paren-newline": "warn",
		"newline-per-chained-call": "warn",
		'arrow-parens': ['error', 'as-needed'],
		"no-extend-native": "warn",
		'operator-linebreak': "off",
		"react/display-name": "off",
		"react/prop-types": "off",
		"no-underscore-dangle": "warn",
		"react/no-find-dom-node": "warn",
		"no-extra-boolean-cast": "warn",
		"linebreak-style": "off",
		"comma-dangle": "off",
		"max-len": "off",
		"prefer-template": 'warn',
		"import/prefer-default-export": "off",
		"no-nested-ternary": "off",
		"no-await-in-loop": "warn",
		"no-restricted-syntax": 'warn',
		'no-param-reassign': 'warn',
		"consistent-return": 'off',
		"prefer-promise-reject-errors": "off",
		"no-plusplus": 'off',
		"no-useless-escape": "off",
		"import/no-mutable-exports": "off",
		"no-bitwise": "off",
		"one-var": "warn",
		"max-classes-per-file": 'warn',
		"arrow-body-style": 'warn',
		"import/no-cycle": "off",
		"object-curly-newline": "off",
		"no-use-before-define": 'warn',
		"no-tabs": "off"
	},
};
