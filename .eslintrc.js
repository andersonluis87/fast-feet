module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off", // não obrigar a palavra THIS para classes
    "no-param-reassign": "off", // Perrmite alterar o valor de params passados em funções. No Sequelize é necessário para manipular alguns dados
    "camelcase": "off", // Não valida camelCase.
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }] // Não validar caso a variável chamada NEXT não for usada. 
}
};
