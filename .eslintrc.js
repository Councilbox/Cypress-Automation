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
        "extensions": [".js",".jsx"]
      }
    }
  },
  "parser": "babel-eslint",
  extends: [
    'airbnb-base',
    "plugin:cypress/recommended",
    "plugin:react/recommended"
  ],
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
    "indent": ["off", 4],
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
    "no-multiple-empty-lines": "off",
    "function-paren-newline": "warn",
    "newline-per-chained-call": "warn",
    "arrow-parens": "off",
    "no-extend-native": "off",
    "operator-linebreak": "off",
    "import/no-extraneous-dependencies": "warn",
    "react/display-name": "warn",
    "react/prop-types": "off",
    "no-underscore-dangle": "warn",
    "react/no-find-dom-node": "warn",
    "no-extra-boolean-cast": "warn",
    "linebreak-style": "off",
    "comma-dangle": "off",
    "max-len": "off",
    "semi": "off",
    "quotes": "off",
    "prefer-arrow-callback": "off",
    "prefer-template": "off",
    "spaced-comment": "off",
    "consistent-return": "off",
    "default-case": "off",
    "no-unused-vars": "error",
    "no-param-reassign": 'off',
    "import/prefer-default-export": "off",
    "no-nested-ternary": "off",
    "no-await-in-loop": "off",
    "eqeqeq": "off",
    "no-restricted-syntax": "off",
    "camelcase": "off",
    "prefer-promise-reject-errors": "off",
    "no-useless-catch": "off",
    "no-plusplus": 'off',
    "no-useless-escape": "off",
    "import/no-mutable-exports": "off",
    "no-bitwise": "off",
    "one-var": "warn",
    "keyword-spacing": 'off',
    "arrow-body-style": 'warn',
    "space-before-blocks": 'off',
    "import/no-cycle": "off",
    "no-mixed-spaces-and-tabs": 'error',
    "quote-props": "off",
    "object-curly-newline": "off",
    "no-return-await": "off",
	"no-use-before-define": 'warn',
    "prefer-destructuring": "off",
    "no-tabs": "off"
  },
};
