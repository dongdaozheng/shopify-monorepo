import js from '@eslint/js';
import globals from 'globals';

/**
 * ESLint 配置 - 根目录
 *
 * 此配置主要用于检查根目录的配置文件
 * 各个应用和包有自己的 ESLint 配置
 */
export default [
  {
    ignores: [
      '**/node_modules/',
      '**/build/',
      '**/dist/',
      '**/.turbo/',
      '**/.react-router/',
      '**/apps/**',
      '**/packages/**'
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn'
    }
  }
];
