新建一个React管理系统

## 1. 创建项目

~~~js
pnpm create vite@latest

~~~



## 2. 安装依赖

~~~shell
# redux 相关
pnpm i react-redux react-thunk redux 
pnpm i redux-persist redux-promise immer
pnpm i @reduxjs/toolkit

pnpm i @types/react-redux @types/redux-promise --save-dev

# react router相关
pnpm i react-router-dom
pnpm i @types/react-router-dom --save-dev

# react 样式 动画相关
pnpm i react-transition-group react-activation 

#react 国际化相关
pnpm i react-i18next i18next

# vite相关
pnpm i vite-plugin-compression vite-plugin-html rollup-plugin-visualizer --save-dev

# 其他功能
pnpm i axios intro.js js-md5 nprogress@^0.2.0 screenfull
pnpm i @types/intro.js @types/nprogress --save-dev

~~~



#### 配置vite.config.ts

~~~typescript
import { ConfigEnv, UserConfig, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import eslintPlugin from "vite-plugin-eslint";
import { wrapperEnv } from "./src/utils/getEnv";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	return {
		plugins: [
			react(),

			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOBAL_APP_TITLE
					}
				}
			}),

			// * EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),

			// * 是否生成包预览
			// @ts-ignore
			viteEnv.VITE_REPORT && visualizer(),

			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				})
		],
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		server: {
			host: "0.0.0.0",
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			proxy: {
				// 选项写法
				"/api": {
					target: "http://101.42.21.153:8033/mock/649982d61d5a0a36692f05dc",
					changeOrigin: true,
					rewrite: (path: string) => path.replace(/^\/api/, "")
				}
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/styles/var.scss";`
				}
			}
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src")
			}
		},
		build: {
			outDir: "dist",
			// esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
			minify: "esbuild",
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			rollupOptions: {
				output: {
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});

~~~



## 3. 初始化配置



### 3.1 增加husky校验

~~~bash
# Install Husky 
pnpm dlx husky-init && pnpm install

# 1. Add prepare script to package.json
# 2. Create a sample pre-commit hook that you can edit (by default, npm test will run when you commit)
# 3. Configure Git hooks path

or

# 1. Install Husky
pnpm install husky --save-dev
# 2. enable git hooks
npx husky install
# 3. To automatically have Git hooks enabled after install, edit package.json
pnpm pkg set scripts.prepare="husky install"
# Create a hooks
# To add a command to a hook or create a new one, use husky add <file> [cmd] (don't forget to run husky install before).
npx husky add .husky/pre-commit "npm run lint-staged"
git add .husky/pre-commit
# Try to make a commit
git commit -m "Keep calm and commit"

~~~



~~~shell
# uninstall 
pnpm uninstall husky && git config --unset core.hooksPath

# You can bypass pre-commit and commit-msg hooks using Git -n/--no-verify option:

git commit -m "yolo!" --no-verify

~~~



### 3.2 增加commit lint校验

~~~bash
# Install commitlint and a commitlint-config-* of your choice as devDependency and configure commitlint to use it.
pnpm install --save-dev commitizen @commitlint/config-conventional @commitlint/cli cz-git

pnpm install lint-staged --save-dev

# Configure commitlint to use conventional config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'


pnpm pkg set config.commitizen.path="node_modules/cz-git"
~~~



#### 创建lint-staged.config.js

~~~javascript
module.exports = {
	"*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
	"{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": ["prettier --write--parser json"],
	"package.json": ["prettier --write"],
	"*.{scss,less,styl,html}": ["stylelint --fix", "prettier --write"],
	"*.md": ["prettier --write"]
};

~~~



#### 创建commitlint.config.js

~~~javascript
// @see: https://cz-git.qbenben.com/zh/guide
/** @type {import('cz-git').UserConfig} */

module.exports = {
	ignores: [commit => commit.includes("init")],
	extends: ["@commitlint/config-conventional"],
	rules: {
		// @see: https://commitlint.js.org/#/reference-rules
		"body-leading-blank": [2, "always"],
		"footer-leading-blank": [1, "always"],
		"header-max-length": [2, "always", 108],
		"subject-empty": [2, "never"],
		"type-empty": [2, "never"],
		"subject-case": [0],
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"perf",
				"test",
				"build",
				"ci",
				"chore",
				"revert",
				"wip",
				"workflow",
				"types",
				"release"
			]
		]
	},
	prompt: {
		messages: {
			type: "Select the type of change that you're committing:",
			scope: "Denote the SCOPE of this change (optional):",
			customScope: "Denote the SCOPE of this change:",
			subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
			body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
			breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
			footerPrefixsSelect: "Select the ISSUES type of changeList by this change (optional):",
			customFooterPrefixs: "Input ISSUES prefix:",
			footer: "List any ISSUES by this change. E.g.: #31, #34:\n",
			confirmCommit: "Are you sure you want to proceed with the commit above?"
			// 中文版
			// type: "选择你要提交的类型 :",
			// scope: "选择一个提交范围（可选）:",
			// customScope: "请输入自定义的提交范围 :",
			// subject: "填写简短精炼的变更描述 :\n",
			// body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
			// breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
			// footerPrefixsSelect: "选择关联issue前缀（可选）:",
			// customFooterPrefixs: "输入自定义issue前缀 :",
			// footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
			// confirmCommit: "是否提交或修改commit ?"
		},
		types: [
			{
				value: "feat",
				name: "feat:     🚀  A new feature",
				emoji: "🚀"
			},
			{
				value: "fix",
				name: "fix:      🧩  A bug fix",
				emoji: "🧩"
			},
			{
				value: "docs",
				name: "docs:     📚  Documentation only changes",
				emoji: "📚"
			},
			{
				value: "style",
				name: "style:    🎨  Changes that do not affect the meaning of the code",
				emoji: "🎨"
			},
			{
				value: "refactor",
				name: "refactor: ♻️   A code change that neither fixes a bug nor adds a feature",
				emoji: "♻️"
			},
			{
				value: "perf",
				name: "perf:     ⚡️  A code change that improves performance",
				emoji: "⚡️"
			},
			{
				value: "test",
				name: "test:     ✅  Adding missing tests or correcting existing tests",
				emoji: "✅"
			},
			{
				value: "build",
				name: "build:    📦️   Changes that affect the build system or external dependencies",
				emoji: "📦️"
			},
			{
				value: "ci",
				name: "ci:       🎡  Changes to our CI configuration files and scripts",
				emoji: "🎡"
			},
			{
				value: "chore",
				name: "chore:    🔨  Other changes that don't modify src or test files",
				emoji: "🔨"
			},
			{
				value: "revert",
				name: "revert:   ⏪️  Reverts a previous commit",
				emoji: "⏪️"
			}
			// 中文版
			// { value: "特性", name: "特性:   🚀  新增功能", emoji: "🚀" },
			// { value: "修复", name: "修复:   🧩  修复缺陷", emoji: "🧩" },
			// { value: "文档", name: "文档:   📚  文档变更", emoji: "📚" },
			// { value: "格式", name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: "🎨" },
			// { value: "重构", name: "重构:   ♻️  代码重构（不包括 bug 修复、功能新增）", emoji: "♻️" },
			// { value: "性能", name: "性能:   ⚡️  性能优化", emoji: "⚡️" },
			// { value: "测试", name: "测试:   ✅  添加疏漏测试或已有测试改动", emoji: "✅" },
			// { value: "构建", name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）", emoji: "📦️" },
			// { value: "集成", name: "集成:   🎡  修改 CI 配置、脚本", emoji: "🎡" },
			// { value: "回退", name: "回退:   ⏪️  回滚 commit", emoji: "⏪️" },
			// { value: "其他", name: "其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）", emoji: "🔨" }
		],
		useEmoji: true,
		themeColorCode: "",
		scopes: [],
		allowCustomScopes: true,
		allowEmptyScopes: true,
		customScopesAlign: "bottom",
		customScopesAlias: "custom",
		emptyScopesAlias: "empty",
		upperCaseSubject: false,
		allowBreakingChanges: ["feat", "fix"],
		breaklineNumber: 100,
		breaklineChar: "|",
		skipQuestions: [],
		issuePrefixs: [{ value: "closed", name: "closed:   ISSUES has been processed" }],
		customIssuePrefixsAlign: "top",
		emptyIssuePrefixsAlias: "skip",
		customIssuePrefixsAlias: "custom",
		allowCustomIssuePrefixs: true,
		allowEmptyIssuePrefixs: true,
		confirmColorize: true,
		maxHeaderLength: Infinity,
		maxSubjectLength: Infinity,
		minSubjectLength: 0,
		scopeOverrides: undefined,
		defaultBody: "",
		defaultIssues: "",
		defaultScope: "",
		defaultSubject: ""
	}
};
~~~





### 3.3 增加 stylelint 配置

~~~shell
pnpm i postcss sass autoprefixer --save-dev
pnpm i stylelint stylelint-config-prettier stylelint-config-recess-order stylelint-config-standard stylelint-config-standard-scss stylelint-order --save-dev
~~~

#### 创建postcss.config.js

~~~javascript
module.exports = {
	plugins: {
		autoprefixer: {}
	}
};
~~~



#### 创建.stylelintigonre

~~~typescript
// 文件名称 .stylelintigonre
/dist/*
/public/*
public/*
~~~

#### 创建.stylelintrc.js

~~~javascript
// @see: https://stylelint.io

module.exports = {
	extends: [
		"stylelint-config-standard", // 配置stylelint拓展插件
		"stylelint-config-prettier", // 配置stylelint和prettier兼容
		"stylelint-config-recess-order", // 配置stylelint css属性书写顺序插件,
		"stylelint-config-standard-scss" // 配置stylelint scss插件
	],
	rules: {
		indentation: null, // 指定缩进空格
		"no-descending-specificity": null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
		"function-url-quotes": "always", // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
		"string-quotes": "double", // 指定字符串使用单引号或双引号
		"unit-case": null, // 指定单位的大小写 "lower(全小写)"|"upper(全大写)"
		"color-hex-case": "lower", // 指定 16 进制颜色的大小写 "lower(全小写)"|"upper(全大写)"
		"color-hex-length": "long", // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
		"rule-empty-line-before": "never", // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行。)"
		"font-family-no-missing-generic-family-keyword": null, // 禁止在字体族名称列表中缺少通用字体族关键字
		"block-opening-brace-space-before": "always", // 要求在块的开大括号之前必须有一个空格或不能有空白符 "always(大括号前必须始终有一个空格)"|"never(左大括号之前绝不能有空格)"|"always-single-line(在单行块中的左大括号之前必须始终有一个空格)"|"never-single-line(在单行块中的左大括号之前绝不能有空格)"|"always-multi-line(在多行块中，左大括号之前必须始终有一个空格)"|"never-multi-line(多行块中的左大括号之前绝不能有空格)"
		"property-no-unknown": null, // 禁止未知的属性(true 为不允许)
		"no-empty-source": null, // 禁止空源码
		"declaration-block-trailing-semicolon": null, // 要求或不允许在声明块中使用尾随分号 string："always(必须始终有一个尾随分号)"|"never(不得有尾随分号)"
		"selector-class-pattern": null, // 强制选择器类名的格式
		"value-no-vendor-prefix": null, // 关闭 vendor-prefix(为了解决多行省略 -webkit-box)
		"selector-pseudo-class-no-unknown": [
			true,
			{
				ignorePseudoClasses: ["global", "v-deep", "deep"]
			}
		]
	}
};

~~~



### 3.4 增加 eslint && prettier 配置



~~~shell
# install eslint
pnpm i eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks --save-dev
# install prettier
pnpm i prettier --save-dev

# 
pnpm i vite-plugin-eslit --save-dev
~~~



#### 创建.prettierignore

~~~javascript
/dist/*
.local
/node_modules/**

**/*.svg
**/*.sh

/public/*

~~~



#### 创建 .prettierrc.js

~~~javascript
// @see: https://www.prettier.cn

module.exports = {
	// 超过最大值换行
	printWidth: 130,
	// 缩进字节数
	tabWidth: 2,
	// 使用制表符而不是空格缩进行
	useTabs: true,
	// 结尾不用分号(true有，false没有)
	semi: true,
	// 使用单引号(true单双引号，false双引号)
	singleQuote: false,
	// 更改引用对象属性的时间 可选值"<as-needed|consistent|preserve>"
	quoteProps: "as-needed",
	// 在对象，数组括号与文字之间加空格 "{ foo: bar }"
	bracketSpacing: true,
	// 多行时尽可能打印尾随逗号。（例如，单行数组永远不会出现逗号结尾。） 可选值"<none|es5|all>"，默认none
	trailingComma: "none",
	// 在JSX中使用单引号而不是双引号
	jsxSingleQuote: false,
	//  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号 ,always：不省略括号
	arrowParens: "avoid",
	// 如果文件顶部已经有一个 doclock，这个选项将新建一行注释，并打上@format标记。
	insertPragma: false,
	// 指定要使用的解析器，不需要写文件开头的 @prettier
	requirePragma: false,
	// 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
	proseWrap: "preserve",
	// 在html中空格是否是敏感的 "css" - 遵守CSS显示属性的默认值， "strict" - 空格被认为是敏感的 ，"ignore" - 空格被认为是不敏感的
	htmlWhitespaceSensitivity: "css",
	// 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
	endOfLine: "auto",
	// 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
	rangeStart: 0,
	rangeEnd: Infinity,
	// Vue文件脚本和样式标签缩进
	vueIndentScriptAndStyle: false
};

~~~





#### 创建 .eslintignore

~~~bashc
*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
.eslintrc.js
.prettierrc.js
/src/mock/*


~~~



#### 创建 .eslintrc.js

~~~javascript
// @see: http://eslint.cn

module.exports = {
	settings: {
		react: {
			version: "detect"
		}
	},
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true
	},
	/* 指定如何解析语法 */
	parser: "@typescript-eslint/parser",
	/* 优先级低于 parse 的语法解析配置 */
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		jsxPragma: "React",
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: ["react", "@typescript-eslint", "react-hooks", "prettier"],
	/* 继承某些已有的规则 */
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"prettier",
		"plugin:prettier/recommended"
	],
	/*
	 * "off" 或 0    ==>  关闭规则
	 * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
	 * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
	 */
	rules: {
		// eslint (http://eslint.cn/docs/rules)
		"no-var": "error", // 要求使用 let 或 const 而不是 var
		"no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
		"no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
		"prefer-const": "off", // 此规则旨在标记使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
		"no-irregular-whitespace": "off", // 禁止不规则的空白

		// typeScript (https://typescript-eslint.io/rules)
		"@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
		"@typescript-eslint/no-inferrable-types": "off", // 可以轻松推断的显式类型可能会增加不必要的冗长
		"@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
		"@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
		"@typescript-eslint/ban-ts-ignore": "off", // 禁止使用 @ts-ignore
		"@typescript-eslint/ban-types": "off", // 禁止使用特定类型
		"@typescript-eslint/explicit-function-return-type": "off", // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
		"@typescript-eslint/no-var-requires": "off", // 不允许在 import 语句中使用 require 语句
		"@typescript-eslint/no-empty-function": "off", // 禁止空函数
		"@typescript-eslint/no-use-before-define": "off", // 禁止在变量定义之前使用它们
		"@typescript-eslint/ban-ts-comment": "off", // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
		"@typescript-eslint/no-non-null-assertion": "off", // 不允许使用后缀运算符的非空断言(!)
		"@typescript-eslint/explicit-module-boundary-types": "off", // 要求导出函数和类的公共类方法的显式返回和参数类型

		// react (https://github.com/jsx-eslint/eslint-plugin-react)
		"react-hooks/rules-of-hooks": "off",
		"react-hooks/exhaustive-deps": "off"
	}
};

~~~





### 3.5 编译器配置

#### 创建.editorconfig

~~~bash
# @see: http://editorconfig.org

root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
end_of_line = lf # 控制换行类型(lf | cr | crlf)
insert_final_newline = true # 始终在文件末尾插入一个新行
indent_style = tab # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
max_line_length = 130 # 最大行长度

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off # 关闭最大行长度限制
trim_trailing_whitespace = false # 关闭末尾空格修剪

~~~



### 3.6 创建package.json的script

~~~bash
# lint:eslint script
pnpm pkg set scripts.lint:eslint="eslint --fix --ext .js,.ts,.tsx ./src"

# lint:prettier script
pnpm pkg set scripts.lint:prettier="prettier --write --loglevel warn \"src/**/*.{js,ts,json,tsx,css,less,scss,html,md}\""

# lint:stylelint script
pnpm pkg set scripts.lint:stylelint="stylelint --cache --fix \"**/*.{less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/"

# lint-staged script
pnpm pkg set scripts.lint-staged="lint-staged"
npx husky add .husky/pre-commit "npm run lint-staged"

# commit script
pnpm pkg set scripts.commit="git pull && git add -A && git-cz && git push"

# build:dev
pnpm pkg set scripts.build:dev="tsc && vite build --mode development"

# build:test
pnpm pkg set scripts.build:test="tsc && vite build --mode test"

# build:prod
pnpm pkg set scripts.build:prod="tsc && vite build --mode production"
~~~





## 4. 初始化路由配置

~~~javascript
# 安装依赖
pnpm i react-router-dom


# src/router/index.tsx
import { RouteObject, Navigate, useRoutes } from "react-router-dom";
import Login from "@/views/login/index";
import Home from "@/views/home/index";

const rootRouter = [
  {
		path: "/",
		element: <Navigate to="/home" />
	},
	{
		path: "/login",
		element: <Login />,
		meta: {
			requiresAuth: false,
			title: "登录页",
			key: "login"
		}
	},
	{
		path: "/home",
		element: <Home />,
		meta: {
			requiresAuth: false,
			title: "登录页",
			key: "login"
		}
	}
]


const Router = () => {
	return useRoutes(rootRouter as any);
};

export default Router;
~~~



### 引用路由

~~~javascript
# src/app.tsx

import Router from './routers';
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
  	<BrowserRouter>
    	<Router />
    </BrowserRouter>
  )
}
~~~



## 5. 初始化layouts布局

- 使用react-router-dom中的 Outlet实现

- 创建 layouts/index.tsx文件

  - 里面引入Outlet占位

  - ~~~javascript
    import React from "react";
    import { Outlet } from "react-router-dom";
    const LayoutIndex = () => {
    	return (
    		<section>
    			<div>some in layout</div>
    			<div>
    				<Outlet />
    			</div>
    		</section>
    	);
    };
    
    export default LayoutIndex;
    
    ~~~

  - 

- 配置路由文件

  - ~~~javascript
    import LayoutIndex from "@/layouts";
    import Dashboard from "@/views/dashboard";
    
    export const rootRouter = [
      ...,
      {
    		path: "/dashboard",
    		element: <LayoutIndex />,
    		children: [
    			{
    				path: "/dashboard/index",
    				element: <Dashboard />
    			}
    		]
    	},
      ...
    ]
    
    const Router = () => {
    	return useRoutes(rootRouter as any);
    };
    
    export default Router;
    ~~~

  - 

## 6. 初始化tabs和menu联动

其实就是给layouts里面的tabs和menu 配置点击事件



## 7. 路由懒加载

~~~javascript
import { Spin } from "antd";
import React, { Suspense } from "react";

export default function lazyLoad(Comp: React.LazyExoticComponent<any>): React.ReactNode {
	return (
		<Suspense
			fallback={
				<Spin
					size="large"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "100%"
					}}
				></Spin>
			}
		>
			<Comp></Comp>
		</Suspense>
	);
}

// 使用
{
		path: "/login",
		// element: <Login />
		element: lazyLoad(React.lazy(() => import("@/views/login/index")))
	},
~~~





## 8. 新增错误请求页面

- 403

  - ~~~javascript
    import { Button, Result } from "antd";
    import { useNavigate } from "react-router-dom";
    import "./index.scss";
    import { HOME_URL } from "@/config/config";
    
    const NoAuth = () => {
    	const navigate = useNavigate();
    	const goHome = () => navigate(HOME_URL);
    	return (
    		<Result
    			status={"403"}
    			title="403"
    			subTitle={"Sorry, you are not authorized to access this page"}
    			extra={
    				<Button type="primary" onClick={goHome}>
    					{" "}
    					Back Home
    				</Button>
    			}
    		></Result>
    	);
    };
    
    export default NoAuth;
    
    ~~~

- 404

  - ~~~javascript
    import React from "react";
    import "./index.scss";
    import { useNavigate } from "react-router-dom";
    import { Button, Result } from "antd";
    import { HOME_URL } from "@/config/config";
    
    const NotFound: React.FC = () => {
    	const navigate = useNavigate();
    
    	const goHome = () => navigate(HOME_URL);
    
    	return (
    		<Result
    			status={"404"}
    			title={"404"}
    			subTitle="Sorry, the page you visited does not exist."
    			extra={
    				<Button type="primary" onClick={goHome}>
    					Back Home
    				</Button>
    			}
    		></Result>
    	);
    };
    
    export default NotFound;
    
    
    ~~~

- 500

  - ~~~javascript
    import { Button, Result } from "antd";
    import { useNavigate } from "react-router-dom";
    import "./index.scss";
    import { HOME_URL } from "@/config/config";
    
    const NotNetwork = () => {
    	const navigate = useNavigate();
    	const goHome = () => {
    		navigate(HOME_URL);
    	};
    	return (
    		<Result
    			status="500"
    			title="500"
    			subTitle="Sorry, something went wrong."
    			extra={
    				<Button type="primary" onClick={goHome}>
    					Back Home
    				</Button>
    			}
    		/>
    	);
    };
    
    export default NotNetwork;
    
    ~~~

- 

## 9. 新增http请求配置

### 基础请求

~~~javascript
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AxiosCanceler } from "./helper/axiosCancel";
import { useNavigate } from "react-router-dom";
import { ResultEnum } from "@/enums/httpEnum";
import { message } from "antd";
import { checkStatus } from "./helper/checkStatus";
import { ResultData } from "./interface";
import { store } from "@/redux";
import NProgress from "@/utils/nprogress";
import { setToken } from "@/redux/modules/global/action";

const axiosCanceler = new AxiosCanceler();

const navigateTo = (path: string) => {
	const navigate = useNavigate();
	navigate(path);
};

class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosRequestConfig) {
		// 实例化axios
		this.service = axios.create(config);

		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
		 */
		this.service.interceptors.request.use(
			(config: AxiosRequestConfig | any) => {
				NProgress.start();
				// * 将当前请求添加到 pending 中
				axiosCanceler.addPending(config);
				// * 如果当前请求不需要显示 loading,在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
				config.headers!.noLoading || showFullScreenLoading();
				const token: string = store.getState().globalReducer.token;
				// const token: string = "123456";
				// return { ...config, headers: { "x-access-token": token } };
				return { ...config, headers: { ...config.headers, "x-access-token": token } };
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */

		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data, config } = response;
				NProgress.done();
				// * 在请求结束后，移除本次请求(关闭loading)
				axiosCanceler.removePending(config);
				tryHideFullScreenLoading();
				// * 登录失效（code == 599）
				if (data.code == ResultEnum.OVERDUE) {
					store.dispatch(setToken(""));
					message.error(data.msg);
					navigateTo("/login");
					return Promise.reject(data);
				}
				// * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
				if (data.code && data.code !== ResultEnum.SUCCESS) {
					message.error(data.msg);
					return Promise.reject(data);
				}
				// * 成功请求
				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
				// const navigate = useNavigate();
				NProgress.done();
				tryHideFullScreenLoading();
				// 根据响应的错误状态码，做不同的处理
				if (response) checkStatus(response.status);
				// 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
				if (!window.navigator.onLine) navigateTo("/500");
				return Promise.reject(error);
			}
		);
	}

	// * 常用请求方法封装
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
}

const config = {
	// 默认地址
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（10s）
	timeout: 10000,
	// 跨域时候允许携带凭证
	withCredentials: true
};
export default new RequestHttp(config);

~~~



### 取消请求

~~~javascript
import axios, { AxiosRequestConfig, Canceler } from "axios";
import { isFunction } from "@/utils";
import qs from "qs";

// * 声明一个 Map 用于存储每个请求的标识 和 取消函数
let pendingMap = new Map<string, Canceler>();

// * 序列化参数
export const getPendingUrl = (config: AxiosRequestConfig) =>
	[config.method, config.url, qs.stringify(config.data), qs.stringify(config.params)].join("&");

export class AxiosCanceler {
	/**
	 * @description: 添加请求
	 * @param {Object} config
	 */
	addPending(config: AxiosRequestConfig) {
		// * 在请求开始前，对之前的请求做检查取消操作
		this.removePending(config);
		const url = getPendingUrl(config);
		config.cancelToken =
			config.cancelToken ||
			new axios.CancelToken(cancel => {
				if (!pendingMap.has(url)) {
					// 如果 pending 中不存在当前请求，则添加进去
					pendingMap.set(url, cancel);
				}
			});
	}

	/**
	 * @description: 移除请求
	 * @param {Object} config
	 */
	removePending(config: AxiosRequestConfig) {
		const url = getPendingUrl(config);

		if (pendingMap.has(url)) {
			// 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
			const cancel = pendingMap.get(url);
			cancel && cancel();
			pendingMap.delete(url);
		}
	}

	/**
	 * @description: 清空所有pending
	 */
	removeAllPending() {
		pendingMap.forEach(cancel => {
			cancel && isFunction(cancel) && cancel();
		});
		pendingMap.clear();
	}

	/**
	 * @description: 重置
	 */
	reset(): void {
		pendingMap = new Map<string, Canceler>();
	}
}

~~~



### 检查状态

~~~javascript
import { message } from "antd";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
	switch (status) {
		case 400:
			message.error("请求失败！请您稍后重试");
			break;
		case 401:
			message.error("登录失效！请您重新登录");
			break;
		case 403:
			message.error("当前账号无权限访问！");
			break;
		case 404:
			message.error("你所访问的资源不存在！");
			break;
		case 405:
			message.error("请求方式错误！请您稍后重试");
			break;
		case 408:
			message.error("请求超时！请您稍后重试");
			break;
		case 500:
			message.error("服务异常！");
			break;
		case 502:
			message.error("网关错误！");
			break;
		case 503:
			message.error("服务不可用！");
			break;
		case 504:
			message.error("网关超时！");
			break;
		default:
			message.error("请求失败！");
	}
};

~~~

### 类型定义

~~~javascript
// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T;
}

// * 分页响应参数
export interface ResPage<T> {
	datalist: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum: number;
	pageSize: number;
}

// * 登录
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
	}
	export interface ResLogin {
		access_token: string;
	}
	export interface ResAuthButtons {
		[propName: string]: any;
	}
}

// * 用户管理
export namespace User {
	export interface ReqGetUserParams extends ReqPage {
		username: string;
		gender: number;
		idCard: string;
		email: string;
		address: string;
		createTime: string[];
		status: number;
	}
	export interface ResUserList {
		id: string;
		username: string;
		gender: string;
		age: number;
		idCard: string;
		email: string;
		address: string;
		createTime: string;
		status: number;
	}
}

~~~



### 枚举类型

~~~javascript
// * 请求枚举配置
/**
 * @description：请求配置
 */
export enum ResultEnum {
	SUCCESS = 200,
	ERROR = 500,
	OVERDUE = 599,
	TIMEOUT = 10000,
	TYPE = "success"
}

/**
 * @description：请求方法
 */
export enum RequestEnum {
	GET = "GET",
	POST = "POST",
	PATCH = "PATCH",
	PUT = "PUT",
	DELETE = "DELETE"
}

/**
 * @description：常用的contentTyp类型
 */
export enum ContentTypeEnum {
	// json
	JSON = "application/json;charset=UTF-8",
	// text
	TEXT = "text/plain;charset=UTF-8",
	// form-data 一般配合qs
	FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
	// form-data 上传
	FORM_DATA = "multipart/form-data;charset=UTF-8"
}

~~~



### 进度条初始化

~~~javascript
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
	easing: "ease", // 动画方式
	speed: 500, // 递增进度条的速度
	showSpinner: true, // 是否显示加载ico
	trickleSpeed: 200, // 自动递增间隔
	minimum: 0.3 // 初始化时的最小百分比
});

export default NProgress;

~~~





## 10. 登陆页面逻辑

### 基础组件

~~~javascript
import "./index.scss";
import LoginForm from "./components/LoginForm";
import LoginLeft from "@/assets/images/login_left4.png";
import logo from "@/assets/images/logo.png";

const Login = () => {
	return (
		<div className="login-container">
			<div className="login-content">
				<div className="login-left">
					<img src={LoginLeft} alt="login" />
				</div>
				<div className="login-form">
					<div className="login-logo">
						<img src={logo} alt="" className="login-icon" />
						<span className="login-text">Cch-Admin</span>
					</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login;

~~~

### 页面样式

~~~scss
.login-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 550px;
	height: 100%;
	background-color: #eeeeee;
	background-image: url("@/assets/images/login_bg.svg");
	background-position: 50%;
	background-size: 100% 100%;
	background-size: cover;
	.login-content {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 90%;
		pad: 0 4% 0 20px;
		overflow: hidden;
		background-color: hsl(0deg 0 100% / 80%);
		border-radius: 10px;
		.login-left {
			width: 750px;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.login-form {
			padding: 40px;
			background-color: rgba($color: #ffffff, $alpha: 100%);
			border-radius: 10px;
			box-shadow: 2px 3px 7px rgb(0 0 0 / 20%);
			.login-logo {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 40px;
				.login-icon {
					width: 70px;
				}
				.login-text {
					padding-left: 25px;
					font-size: 48px;
					font-weight: bold;
					color: #475768;
					white-space: nowrap;
				}
			}
			.ant-form-item {
				height: 75px;
				margin-bottom: 0;
				.ant-input-prefix {
					margin-right: 10px;
				}
				.ant-input-affix-wrapper {
					font-size: 14px;
					color: #b3b6bc;
				}
				.ant-input-lg {
					font-size: 14px;
				}
			}
			.login-btn {
				width: 100%;
				margin-top: 10px;
				white-space: nowrap;
				.ant-form-item-control-input-content {
					display: flex;
					justify-content: space-between;
					.ant-btn {
						width: 180px;
						span {
							font-size: 14px;
						}
					}
					.ant-btn-default {
						color: #606260;
					}
				}
			}
		}
	}
}

~~~


### 登录表单

~~~javascript
// 登录表单 LoginForm.tsx
import { Login } from "@/api/interface";
import { CloseCircleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import md5 from "js-md5";
import { loginApi } from "@/api/modules/login";

const LoginForm = () => {
	const Item = Form.Item;
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [messageApi, contextHolder] = message.useMessage();
	const navigate = useNavigate();

	const onFinish = async (values: Login.ReqLoginForm) => {
		try {
			setLoading(true);
			values.password = md5(values.password);
			await loginApi(values);
			messageApi.success("login successfully");
			navigate("/home");
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const onFinishFailed = (errorInfo: any) => {
		console.log(errorInfo);
		messageApi.error("login failed", 2);
	};

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{ span: 5 }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			size="large"
			autoComplete="off"
		>
			<Item name="username" rules={[{ required: true, message: "please input your user name!" }]}>
				<Input placeholder="user name : admin / user" prefix={<UserOutlined />}></Input>
			</Item>
			<Item name="password" rules={[{ required: true, message: "please input your password!" }]} initialValue={"12345678"}>
				<Input.Password autoComplete="new-password" placeholder="password: 12345678" prefix={<LockOutlined />} />
			</Item>
			<Item className="login-btn">
				<Button icon={<CloseCircleOutlined />} onClick={() => form.resetFields()}>
					重置 {contextHolder}
				</Button>
				<Button type="primary" icon={<UserOutlined />} htmlType="submit" loading={loading}>
					登录
				</Button>
			</Item>
		</Form>
	);
};

export default LoginForm;

~~~



## 11. 新增全局loading

### loading组件

~~~javascript
// @/components/Loading
import { Spin } from "antd";
import "./index.scss";

const Loading = ({ tip = "Loading…" }: { tip?: string }) => {
	return <Spin tip={tip} size="large" className="request-loading"></Spin>;
};

export default Loading;

// * 请求 Loading 样式
.request-loading {
	.ant-spin-text {
		margin-top: 5px;
		font-size: 18px;
		color: #509ff1;
	}
	.ant-spin-dot-item {
		background-color: #509ff1;
	}
}

// * Loading
#loading {
	position: fixed;
	inset: 0;
	z-index: 9998;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	background: rgb(0 0 0 / 70%);
}

~~~



### serviceLoading组件

~~~javascript
import Loading from "@/components/Loading";
import ReactDOM from "react-dom";

let needLoadingRequestCount = 0;

// * 显示loading
export const showFullScreenLoading = () => {
	if (needLoadingRequestCount === 0) {
		let dom = document.createElement("div");
		dom.setAttribute("id", "loading");
		document.body.appendChild(dom);
		ReactDOM.createPortal(<Loading />, dom);
	}
	needLoadingRequestCount++;
};

// * 隐藏loading
export const tryHideFullScreenLoading = () => {
	if (needLoadingRequestCount <= 0) return;
	needLoadingRequestCount--;
	if (needLoadingRequestCount === 0) {
		document.body.removeChild(document.getElementById("loading") as HTMLElement);
	}
};

~~~





## 12. 拆分路由，修改路由配置

### 新增模块

~~~javascript
import { RouteObject } from "@/routers/interface";

type MetaRouters = {
	[key: string]: RouteObject[];
};

// * 导入所有router
const metaRouters: MetaRouters = import.meta.glob("./modules/*.tsx", {
	eager: true
});

// * 处理路由
export const routerArray: RouteObject[] = [];

Object.keys(metaRouters).forEach(item => {
	Object.keys(metaRouters[item]).forEach((key: any) => {
		// @ts-ignore
		routerArray.push(...metaRouters[item][key]);
	});
});

const rootRouter: RouteObject[] = [
  ...routerArray
]

~~~





### 类型文件

~~~javascript
// 类型文件
export interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
}

export interface RouteObject {
	caseSensitive?: boolean;
	children?: RouteObject[];
	element?: React.ReactNode;
	index?: boolean;
	path?: string;
	meta?: MetaProps;
	isLink?: string;
}
~~~



## 13. 初始化redux



### 安装依赖

~~~javascript
pnpm i redux react-redux redux-persist redux-promise redux-thunk
pnpm i @types/react-redux @types/redux-promise --save-dev
~~~



### 初始化文件

~~~javascript
import { legacy_createStore as createStore, combineReducers, Store, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { applyMiddleware } from "redux"; // 应用中间件方法
import reduxThunk from "redux-thunk";
import reduxPromise from "redux-promise";

import menu from "./modules/menu/reducer";
import countReducer from "./modules/count/reducer";

// 创建reducer(拆分reducer)
const reducer = combineReducers({
	menu,
	countReducer
});

// redux 持久化配置
const persistConfig = {
	key: "redux-state",
	storage: storage,
	blacklist: ["countReducer"]
};
const persistReducerConfig = persistReducer(persistConfig, reducer);

// 开启 redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 使用 redux 中间件
const middleWares = applyMiddleware(reduxThunk, reduxPromise);

// 创建 store
const store: Store = createStore(persistReducerConfig, composeEnhancers(middleWares));

// 创建持久化 store
const persistor = persistStore(store);

export { store, persistor };

~~~



### redux持久化

~~~javascript
// src/main.tsx
// import React from "react";
import ReactDOM from "react-dom/client";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux";

import App from "@/App";
import "antd/dist/reset.css";
import "@/styles/reset.scss";
import "@/styles/common.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Provider store={store}>
  	// * 持久化配置
		<PersistGate persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
);

~~~



### 操作类型

~~~javascript
// 更新 menu 折叠状态
export const UPDATE_COLLAPSE = "UPDATE_ASIDE_COLLAPSE";
// 设置 menuList
export const SET_MENU_LIST = "SET_MENU_LIST";
// 设置 tabsList
export const SET_TABS_LIST = "SET_TABS_LIST";
// 设置 tabsActive
export const SET_TABS_ACTIVE = "SET_TABS_ACTIVE";
// 设置 breadcrumb
export const SET_BREADCRUMB_LIST = "SET_BREADCRUMB_LIST";
// 设置 authButtons
export const SET_AUTH_BUTTONS = "SET_AUTH_BUTTONS";
// 设置 authRouter
export const SET_AUTH_ROUTER = "SET_AUTH_ROUTER";
// 设置 token
export const SET_TOKEN = "SET_TOKEN";
// 设置 assemblySize
export const SET_ASSEMBLY_SIZE = "SET_ASSEMBLY_SIZE";
// 设置 setLanguage
export const SET_LANGUAGE = "SET_LANGUAGE";
// 设置 setThemeConfig
export const SET_THEME_CONFIG = "SET_THEME_CONFIG";

export const INCREMENT = "INCREMENT";

export const DECREMENT = "DECREMENT";

~~~



### 模块文件

~~~javascript
// ./moudles/reducer.ts
import { DECREMENT, INCREMENT } from "@/redux/mutation-types";
import produce from "immer";
import type { AnyAction } from "redux";

const initState = {
	count: 1
};

const countReducer = (state = initState, action: AnyAction) => {
	return produce(state, draftState => {
		const { type, payload } = action;
		switch (type) {
			case INCREMENT:
				return { count: draftState.count + 1 };
			case DECREMENT:
				return { count: draftState.count - 1 };
			case "ADD_SOME_NUMBER":
				return { count: draftState.count + payload };
			default:
				return state;
		}
	});
};

export default countReducer;

// ./moudles/action.ts
import * as types from "@/redux/mutation-types";
import { getMenuList } from "@/api/modules/login";
import type { Dispatch } from "react";

interface MenuProps {
	type: string;
	menuList: Menu.MenuOptions[];
}

// * updateCollapse
export const updateCollapse = () => ({
	type: types.UPDATE_COLLAPSE
});

// * redux-thunk
export const getMenuListActionThunk = () => {
	return async (dispatch: Dispatch<MenuProps>) => {
		const res = await getMenuList();
		dispatch({
			type: types.SET_MENU_LIST,
			menuList: (res.data as Menu.MenuOptions[]) ?? []
		});
	};
};

// * redux-promise《async/await》
export const getMenuListAction = async (): Promise<MenuProps> => {
	const res = await getMenuList();
	return {
		type: types.SET_MENU_LIST,
		menuList: res.data ? res.data : []
	};
};

// * redux-promise《.then/.catch》
export const getMenuListActionPromise = async (): Promise<MenuProps> => {
	const res = await getMenuList();
	return {
		type: types.SET_MENU_LIST,
		menuList: res.data ? res.data : []
	};
};

~~~



### 具体使用

~~~javascript
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { updateCollapse } from "@/redux/modules/menu/action";

const CollapseIcon = (props: any) => {
	return (
		<div
			className="collapsed"
			onClick={() => {
				props.updateCollapse();
			}}
		>
			{props.isCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
		</div>
	);
};

const mapDispatchToProps = { updateCollapse };
const mapStateToProps = (state: any) => state.menu;
export default connect(mapStateToProps, mapDispatchToProps)(CollapseIcon);

~~~



## 14. 添加路由守卫

### 初始化文件

~~~javascript
import { Navigate, useLocation } from "react-router-dom";
import { rootRouter } from "@/routers/index";
import { searchRoute } from "@/utils/util";
import { store } from "@/redux";
import { HOME_URL } from "@/config/config";
import { AxiosCanceler } from "@/api/helper/axiosCancel";

const axiosCanceler = new AxiosCanceler();
/**
 * @description 路由守卫组件
 */
const AuthRouter = (props: { children: JSX.Element }) => {
	const { pathname } = useLocation();
	const route = searchRoute(pathname, rootRouter);

	// * 在跳转路由之前，清除所有的请求
	axiosCanceler.removeAllPending();

	// * 判断当前路由是否需要访问权限(不需要权限直接放行)
	if (!route?.meta?.requiresAuth) return props.children;

	// * 判断是否有Token
	const token = store.getState().globalReducer.token;
	if (!token) return <Navigate to="/login" replace />;

	// * Dynamic Router(动态路由，根据后端返回的菜单数据生成的一维数组)
	const dynamicRouter = store.getState().authReducer.authRouter;

	// * Static Router(静态路由，必须配置首页地址，否则不能进首页获取菜单、按钮权限等数据)，获取数据的时候会loading，所有配置首页地址也没问题
	const staticRouter = [HOME_URL, "/403"];
	const routerList = dynamicRouter.concat(staticRouter);

	// * 如果访问的地址没有在路由表中重定向到403页面
	if (routerList.indexOf(pathname) == -1) return <Navigate to="/403" />;

	// * 当前账号有权限返回 Router，正常访问页面
	return props.children;
};

export default AuthRouter;

~~~



### 具体使用

~~~javascript
// App.tsx

import Router from "@/routers/index";
import { ConfigProvider } from "antd";
import { connect } from "react-redux";
import { HashRouter } from "react-router-dom";
// import RouterGuard from "@/routers/routerGuard";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";
import { useEffect, useState } from "react";
import { getBrowserLang } from "@/utils/util";
import AuthRouter from "@/routers/utils/authRouter";
import useTheme from "@/hooks/useTheme";
import i18n from "i18next";
import { setLanguage } from "@/redux/modules/global/action";

const App = (props: any) => {
	const [i18nLocale, setI18nLocale] = useState(zhCN);

	const { language, assemblySize, themeConfig, setLanguage } = props;

	useTheme(themeConfig);

	const setAntdLanguage = () => {
		// 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
		if (props.language && props.language == "zh") return setI18nLocale(zhCN);
		if (props.language && props.language == "en") return setI18nLocale(enUS);
		if (getBrowserLang() == "zh") return setI18nLocale(zhCN);
		if (getBrowserLang() == "en") return setI18nLocale(enUS);
	};
	useEffect(() => {
		// 全局使用国际化
		i18n.changeLanguage(language || getBrowserLang());
		setLanguage(language || getBrowserLang());
		setAntdLanguage();
	}, [language]);
	return (
		<HashRouter>
			<ConfigProvider locale={i18nLocale} componentSize={assemblySize}>
				<AuthRouter>
					<Router />
				</AuthRouter>
			</ConfigProvider>
		</HashRouter>
	);
};

const mapStateToProps = (state: any) => state.globalReducer;
const mapDispatchToProps = { setLanguage };
export default connect(mapStateToProps, mapDispatchToProps)(App);

~~~





## 15. 国际化处理 i18n

### 初始化语言文件

~~~javascript
import i18n from "i18next";
import enUsTrans from "./modules/en";
import zhCnTrans from "./modules/zh";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: enUsTrans
		},
		zh: {
			translation: zhCnTrans
		}
	},
	// 选择默认语言，选择内容为上述配置中的 key，即 en/zh
	fallbackLng: "zh",
	debug: false,
	interpolation: {
		escapeValue: false // not needed for react as it escapes by default
	}
});

export default i18n;

~~~



### 具体使用

~~~javascript
// main.tsx中引入
import "@/language/index";

// MoreButton.tsx 组件中使用
import { HOME_URL } from "@/config/config";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
const MoreButton = (props: any) => {
	const { tabsList, delTabs } = props;
	let { t } = useTranslation();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const items: MenuProps["items"] = [
		{
			label: <span>{t("tabs.closeCurrent")}</span>,
			key: "closeCurrent"
		},
		{
			label: <span>{t("tabs.closeOther")}</span>,
			key: "closeOthers"
		},
		{
			label: <span>{t("tabs.closeAll")}</span>,
			key: "closeAll"
		}
	];

	// close multipleTab
	const closeMultipleTab = (tabPath?: string) => {
		const handleTabsList = tabsList.filter((item: Menu.MenuOptions) => {
			return item.path === tabPath || item.path === HOME_URL;
		});
		props.setTabsList(handleTabsList);
		tabPath ?? navigate(HOME_URL);
	};

	const dropdownItemClick: MenuProps["onClick"] = ({ key }) => {
		switch (key) {
			case "closeCurrent":
				delTabs();
				break;
			case "closeOthers":
				closeMultipleTab(pathname);
				break;
			default:
				closeMultipleTab();
				break;
		}
	};
	return (
		<Dropdown menu={{ items, onClick: dropdownItemClick }} placement="bottom" arrow={{ pointAtCenter: true }} trigger={["click"]}>
			<Button className="more-button" type="primary" size="small">
				{t("tabs.more")}
				<DownOutlined />
			</Button>
		</Dropdown>
	);
};

export default MoreButton;


~~~



### 动态设置

~~~javascript
import i18n from "@/language";
import { setLanguage } from "@/redux/modules/global/action";
import { getBrowserLang } from "@/utils/util";
import { TranslationOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const Language = (props: any) => {
	const [language, setLanguage] = useState(props.language);
	useEffect(() => {
		setLanguage(props.language || getBrowserLang());
    // 主要这里设置后修改i18n默认语言
		i18n.changeLanguage(props.language || getBrowserLang());
	}, [props.language]);

	const changeLanguage: MenuProps["onClick"] = e => {
		props.setLanguage(e.key);
	};

	const items: MenuProps["items"] = [
		{
			key: "zh",
			disabled: language === "zh",
			label: <span>简体中文</span>
		},
		{
			key: "en",
			disabled: language === "en",
			label: <span>英文</span>
		}
	];

	return (
		<Dropdown menu={{ items, onClick: changeLanguage }}>
			<TranslationOutlined className="icon-style" />
		</Dropdown>
	);
};

// export default Language;

const mapStateToProps = (state: any) => state.globalReducer;
const mapDispatchToProps = { setLanguage };
export default connect(mapStateToProps, mapDispatchToProps)(Language);


// 方法

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
	let defaultBrowserLang = "";
	if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
		defaultBrowserLang = "zh";
	} else {
		defaultBrowserLang = "en";
	}
	return defaultBrowserLang;
};

~~~





通过redux串联起来全局的变化。

## antd组件大小全局处理

### 具体设置

~~~javascript
import Router from "@/routers/index";
import { ConfigProvider } from "antd";
import { connect } from "react-redux";
import { HashRouter } from "react-router-dom";
// import RouterGuard from "@/routers/routerGuard";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";
import { useEffect, useState } from "react";
import { getBrowserLang } from "./utils/util";

const App = (props: any) => {
	const [i18nLocale, setI18nLocale] = useState(zhCN);

	const setLanguage = () => {
		// 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
		if (props.language && props.language == "zh") return setI18nLocale(zhCN);
		if (props.language && props.language == "en") return setI18nLocale(enUS);
		if (getBrowserLang() == "zh") return setI18nLocale(zhCN);
		if (getBrowserLang() == "en") return setI18nLocale(enUS);
	};
	useEffect(() => {
		console.log(props.language, "语言发生变化了");
		setLanguage();
	}, [props.language]);
	return (
		<HashRouter>
			<ConfigProvider locale={i18nLocale} componentSize={props.assemblySize}>
				<Router />
			</ConfigProvider>
			{/* 添加路由守卫 */}
			{/* <RouterGuard routes={Router} /> */}
		</HashRouter>
	);
};

const mapStateToProps = (state: any) => state.globalReducer;
export default connect(mapStateToProps)(App);

~~~





