import { defineConfig } from 'umi';

export default defineConfig({
	routes: [
		{ path: '/home', component: 'index' },
		{ path: '/docs', component: 'docs' },
		{ path: '/canvas', component: 'Canvas/MovePoint' },
	],
  plugins: ['@umijs/plugins/dist/qiankun'],
	qiankun: {
		slave: {},
	},
	npmClient: 'pnpm',
});
