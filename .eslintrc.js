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
	"parser": "babel-eslint",
	extends: [
		'@councilbox/eslint-config-base',
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
	ignorePatterns: ['.github', '/cypress/*', 'public/*', 'build', '/src/displayComponents/ReactSignature/*'],
	rules: {
		"react/display-name": "off",
		"react/prop-types": "off",
		'no-use-before-define': 'warn',
		"react/no-find-dom-node": "warn",
		"object-curly-newline": 'warn',
		"import/no-cycle": 'warn',
		"no-bitwise": 'warn',
		'consistent-return': 'warn'
	},
};
