/**
 * Commitlint 配置 - 企业级 Commit 规范
 *
 * 基于 Conventional Commits 规范
 * 参考：https://www.conventionalcommits.org/
 */

export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // Bug 修复
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新功能，也不是修复 bug）
        'perf', // 性能优化
        'test', // 增加测试
        'build', // 构建系统或外部依赖变动
        'ci', // CI 配置文件和脚本的变动
        'chore', // 其他不修改 src 或 test 文件的变动
        'revert' // 回滚 commit
      ]
    ],

    // 类型必须小写
    'type-case': [2, 'always', 'lower-case'],

    // 类型不能为空
    'type-empty': [2, 'never'],

    // 描述不能为空
    'subject-empty': [2, 'never'],

    // 描述首字母小写
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],

    // 描述不以句号结尾
    'subject-full-stop': [2, 'never', '.'],

    // 标题最大长度 100 字符
    'header-max-length': [2, 'always', 100],

    // Body 每行最大长度 100 字符
    'body-max-line-length': [2, 'always', 100],

    // Footer 每行最大长度 100 字符
    'footer-max-line-length': [2, 'always', 100]
  },

  // cz-git 自定义提示信息（中文）
  prompt: {
    // 自定义提示消息
    messages: {
      type: '选择你要提交的类型:',
      scope: '选择一个影响范围（可选）:',
      customScope: '请输入自定义的影响范围:',
      subject: '填写简短精炼的变更描述:\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行:\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行:\n',
      footerPrefixesSelect: '选择关联 issue 前缀（可选）:',
      customFooterPrefix: '输入自定义 issue 前缀:',
      footer: '列举关联 issue (可选) 例如: #31, #I3244:\n',
      confirmCommit: '是否提交或修改 commit?'
    },

    // 类型定义 - 中文描述
    types: [
      { value: 'feat', name: 'feat:     ✨ 新增功能 | A new feature', emoji: ':sparkles:' },
      { value: 'fix', name: 'fix:      🐛 修复缺陷 | A bug fix', emoji: ':bug:' },
      { value: 'docs', name: 'docs:     📝 文档更新 | Documentation only changes', emoji: ':memo:' },
      {
        value: 'style',
        name: 'style:    💄 代码格式 | Changes that do not affect the meaning of the code',
        emoji: ':lipstick:'
      },
      {
        value: 'refactor',
        name: 'refactor: ♻️  代码重构 | A code change that neither fixes a bug nor adds a feature',
        emoji: ':recycle:'
      },
      {
        value: 'perf',
        name: 'perf:     ⚡️ 性能提升 | A code change that improves performance',
        emoji: ':zap:'
      },
      {
        value: 'test',
        name: 'test:     ✅ 测试相关 | Adding missing tests or correcting existing tests',
        emoji: ':white_check_mark:'
      },
      {
        value: 'build',
        name: 'build:    📦️ 构建相关 | Changes that affect the build system or external dependencies',
        emoji: ':package:'
      },
      {
        value: 'ci',
        name: 'ci:       🎡 持续集成 | Changes to our CI configuration files and scripts',
        emoji: ':ferris_wheel:'
      },
      {
        value: 'chore',
        name: 'chore:    🔨 其他修改 | Other changes that do not modify src or test files',
        emoji: ':hammer:'
      },
      { value: 'revert', name: 'revert:   ⏪️ 回退代码 | Reverts a previous commit', emoji: ':rewind:' }
    ],

    // 使用 emoji
    useEmoji: false,

    // 范围定义（可以根据项目自定义）
    scopes: [
      { value: 'app', name: 'app:       应用主体' },
      { value: 'components', name: 'components:组件相关' },
      { value: 'hooks', name: 'hooks:     钩子相关' },
      { value: 'utils', name: 'utils:     工具相关' },
      { value: 'styles', name: 'styles:    样式相关' },
      { value: 'deps', name: 'deps:      依赖相关' },
      { value: 'config', name: 'config:    配置相关' },
      { value: 'types', name: 'types:     类型相关' },
      { value: 'graphql', name: 'graphql:   GraphQL 相关' },
      { value: 'i18n', name: 'i18n:      国际化相关' },
      { value: 'workflow', name: 'workflow:  工作流相关' },
      { value: 'other', name: 'other:     其他修改' }
    ],

    // 允许自定义 scope
    allowCustomScopes: true,

    // 允许空 scope
    allowEmptyScopes: true,

    // 自定义 scope 的位置
    customScopesAlign: 'bottom',

    // 自定义 scope 的别名
    customScopesAlias: '以上都不是？我要自定义',

    // 空 scope 的别名
    emptyScopesAlias: '跳过',

    // subject 不自动大写首字母
    upperCaseSubject: false,

    // 允许在哪些类型中使用 breaking change
    allowBreakingChanges: ['feat', 'fix'],

    // breaking change 的前缀
    breaklineChar: '|',

    // 每行最大字符数
    breaklineNumber: 100,

    // 跳过的问题（不想回答的可以跳过）
    skipQuestions: [],

    // issue 前缀
    issuePrefixes: [
      { value: 'closed', name: 'closed:   关闭 | ISSUES has been processed' },
      { value: 'fixes', name: 'fixes:    修复 | ISSUES has been fixed' },
      { value: 'ref', name: 'ref:      引用 | Referenced ISSUES' },
      { value: 'refs', name: 'refs:     引用 | Referenced ISSUES' }
    ],

    // 自定义 issue 前缀的位置
    customIssuePrefixAlign: 'top',

    // 空 issue 前缀的别名
    emptyIssuePrefixAlias: '跳过',

    // 自定义 issue 前缀的别名
    customIssuePrefixAlias: '自定义前缀',

    // 允许自定义 issue 前缀
    allowCustomIssuePrefix: true,

    // 允许空 issue 前缀
    allowEmptyIssuePrefix: true,

    // 确认提交时使用彩色输出
    confirmColorize: true,

    // 最大 header 长度
    maxHeaderLength: 100,

    // 最大 subject 长度
    maxSubjectLength: 100,

    // 最小 subject 长度
    minSubjectLength: 0,

    // 默认值
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: ''
  }
};
