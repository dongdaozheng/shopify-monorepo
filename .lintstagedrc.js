/**
 * lint-staged 配置
 *
 * 在 git commit 之前，对暂存的文件执行检查
 * 只会检查 git add 的文件，不会检查整个项目
 */

export default {
  // 根目录配置文件（JS）
  '*.{js,cjs,mjs}': ['eslint --fix', 'prettier --write'],

  // JSON 文件
  '*.json': ['prettier --write'],

  // Markdown 文件
  '*.md': ['prettier --write'],

  // YAML 文件
  '*.{yml,yaml}': ['prettier --write']
};
