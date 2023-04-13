import { defineConfig } from 'umi';

export default defineConfig({
	routes: [
		{ path: '/home', component: 'index' },
		{ path: '/docs', component: 'docs' },
		{ path: '/canvas', component: 'Canvas/MovePoint' },
		{ path: '/promise', component: 'Promise' },
	],
  plugins: ['@umijs/plugins/dist/qiankun'],
	qiankun: {
		slave: {},
	},
	npmClient: 'pnpm',
});
