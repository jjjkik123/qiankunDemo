import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './public-path.js';

let root;
function render(props) {
	const { container } = props;
	const dom = container
		? container.querySelector('#root')
		: document.getElementById('root');
	root = ReactDOM.createRoot(dom);
	root.render(
		<BrowserRouter basename='/app2'>
			<App />
		</BrowserRouter>
	);
}

// 判断是否在qiankun环境下，非qiankun环境下独立运行
if (!(window).__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

// 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
export async function mount(props) {
  console.log(props)
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
    // 将这个state存储到我们子应用store
  });
  props.setGlobalState({ count: 2 });
  render(props);
}

// 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
export async function unmount(props) {
  root.unmount();
}



// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
// 	<BrowserRouter>
// 		<App />
// 	</BrowserRouter>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
