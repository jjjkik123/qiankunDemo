import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  qiankun: {
    master: {
      apps: [
        {
          name: 'app1',
          entry: '//localhost:7001',
        },
        {
          name: 'app2',
          entry: '//localhost:3002',
        },
        {
          name: 'app3',
          entry: '//localhost:3003',
        },
      ],
    },
  },
  routes: [
    {
      path: '/',
      // redirect: '/app1/project',
    },
    {
      path: '/app1',
      name: 'umi',
      routes: [
        {
          name: 'umi11',
          path: '/app1/project/*',
          component: 'Home',
        },
      ],
    },
    {
      path: 'app2/*',
      name: 'react',
      microApp: 'app2',
    },
    {
      path: 'app3/*',
      name: 'vue',
      microApp: 'app3',
    },
  ],
  npmClient: 'pnpm',
});
