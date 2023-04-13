const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

type PromiseState = 'pending' | 'fulfilled' | 'rejected';

interface handlerType {
	executor: Function | undefined;
	state: Omit<PromiseState, 'pending'>;
	resolve: Function; // then 返回的promise 成功
	reject: Function; // then 返回的promise 失败
}

/**
 * 运行一个微队列任务
 * 把传递的函数放到微队列中
 * @param callBack
 */
const runMicroTask = (callBack?: Function) => {
	if (!callBack) {
		return;
	}
	// 判断node 环境
	if (process && process.nextTick) {
		process.nextTick(callBack);
	}
	// 浏览器环境
	else if (MutationObserver) {
		const p = document.createElement('p');
		const observer = new MutationObserver(callBack as any);
		observer.observe(p, {
			childList: true,
		});
		p.innerHTML = '1';
	} else {
		setTimeout(callBack, 0);
	}
};

/**
 * 判断一个数据是不是promise 对象
 * @param obj
 * @returns
 */
const isPromise = (obj: any) => {
	return !!(obj && typeof obj === 'object' && typeof obj.then === 'function');
};

class MyPromise {
	private _state: PromiseState;
	private _value?: any;
	private _handlers: handlerType[];
	/**
	 *
	 * @param executor 任务执行器， 立即执行
	 */
	constructor(executor: Function) {
		this._state = PENDING;
		this._value = undefined;
		this._handlers = []; //处理函数形成的队列

		try {
			executor(this._resolve.bind(this), this._reject.bind(this));
		} catch (error) {
			this._reject(error);
			console.error(error);
		}
	}

	private _changeState(newState: PromiseState, value: any) {
		if (this._state !== 'pending') {
			return;
		}
		this._state = newState;
		this._value = value;
		this._runHandler(); // 状态变化执行队列
	}

	/**
	 * 标记当前任务完成
	 * @param data 任务完成的相关数据
	 */
	private _resolve(data?: unknown) {
		this._changeState('fulfilled', data);
	}

	/**
	 * 标记当前任务失败
	 * @param reason 任务失败的相关数据
	 */
	private _reject(reason?: any) {
		this._changeState('rejected', reason);
	}

	private _pushHandler(
		executor: Function | undefined,
		state: Omit<PromiseState, 'pending'>,
		resolve: Function, // then 返回的promise 成功
		reject: Function // then 返回的promise 失败
	) {
		this._handlers.push({
			executor,
			state,
			resolve,
			reject,
		});
	}

	/**
	 * 根据实际情况，执行队列
	 */
	private _runHandler() {
		if (this._state === 'pending') {
			// 目前任务仍在挂起
			return;
		}
		while (this._handlers[0]) {
			const handler = this._handlers[0];
			this._runOneHandler(handler);
			this._handlers.shift();
		}
	}

	private _runOneHandler({ executor, state, resolve, reject }: handlerType) {
		runMicroTask(() => {
			if (this._state !== state) {
				// 状态不一致，不处理
				return;
			}

			if (typeof executor !== 'function') {
				// 传递的后续处理不是一个函数
				this._state === FULFILLED ? resolve(this._value) : reject(this._value);
			}

			try {
				const result = executor?.(this._value);
				if (isPromise(result)) {
					result.then(resolve, reject);
				} else {
					resolve(result);
				}
			} catch (error) {
				reject(error);
				console.error(error);
			}
		});
	}

	then(onFulfilled?: Function, onRejected?: Function) {
		return new MyPromise((resolve: Function, reject: Function) => {
			this._pushHandler(onFulfilled, FULFILLED, resolve, reject);
			this._pushHandler(onRejected, REJECTED, resolve, reject);
			this._runHandler(); // 当状态已经确定 执行队列
		});
	}

	catch(onRejected: any) {
		return this.then(undefined, onRejected);
	}

	finally(onSettled: any) {
		return this.then(
			(data: any) => {
				onSettled();
				return data;
			},
			(reason: any) => {
				onSettled();
				throw reason;
			}
		);
	}

	/**
	 * 返回一个已完成的promise
	 * 特殊情况
	 * 1. 传递的data本身就是ES6的Promise对象
	 * 2. 传递的data是PromiseLink 实现了PromiseA+规范的，返回一个新的Promise
	 * @param data
	 */
	static resolve(data: any) {
		if (data instanceof MyPromise) {
			return data;
		}
		return new MyPromise((resolve: any, reject: any) => {
			if (isPromise(data)) {
				data.then(resolve, reject);
			} else {
				resolve(data);
			}
		});
	}

	static reject(reason: any) {
		return new MyPromise((resolve: any, reject: any) => {
			reject(reason);
		});
	}

	static all(promises: any) {
		return new MyPromise((resolve: any, reject: any) => {
			try {
				const results: any[] = []; // 保证有序
				let count = 0,
					fulfilledCount = 0;
				for (const p of promises) {
					let i = count;
					count++;
					MyPromise.resolve(p).then((data: any) => {
						fulfilledCount++;
						results[i] = data;
						if (fulfilledCount === count) {
							// 当前是最后一个promise完成了
							resolve(results);
						}
					}, reject);
					if (count === 0) {
						resolve(results);
					}
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	static allSettled(promises: any) {
		const ps: any = [];
		for (const p of promises) {
			p.push(
				MyPromise.resolve(p).then(
					(value: any) => ({ status: FULFILLED, value }),
					(reason: any) => ({ status: REJECTED, reason })
				)
			);
		}
		return MyPromise.all(ps);
	}

	static race(promises: any) {
		return new MyPromise((resolev: any, reject: any) => {
			for (const p of promises) {
				MyPromise.resolve(p).then(resolev, reject);
			}
		});
	}
}

export default MyPromise

// const pro = new MyPromise((resolve: any, reject: any) => {
// 	setTimeout(() => {
// 		resolve(1);
// 	}, 0);
// });

// const p2 = pro.then((data: any) => {
// 	console.log(data);
// 	// throw 'test';
// 	// return 123;

// 	return new MyPromise((resolve: any, reject: any) => {
// 		reject('asdas');
// 	});
// });
// pro.then(
// 	function A2() {},
// 	function B2() {}
// );

// console.log(pro);
// export default MyPromise;

// setTimeout(() => {
// 	console.log(p2);
// }, 100);

// console.log(21);

// const myPro1 = new MyPromise((resolve: any, reject: any) => {
// 	resolve(1);
// });

// myPro1
// 	.then((data: any) => {
// 		console.log(data);
// 		return new Promise((resolve) => {
// 			resolve(234);
// 		});
// 	})
// 	.then((v: any) => console.log(v));

// Promise.prototype.catch = () => {
// 	return new Promise(() => {});
// };

const p = MyPromise.resolve(1);
const p3 = new MyPromise((resolve: any) => {
	setTimeout(() => {
		resolve(5);
	}, 10);
});
// const allp = MyPromise.all([
// 	MyPromise.resolve(1),
// 	p3,

// 	MyPromise.resolve(2),
// 	MyPromise.resolve(3),
// ]);

// setTimeout(() => {
// 	console.log(allp);
// }, 40);

const p1 = MyPromise.all(null);
setTimeout(() => {
	console.log(p1);
}, 0);
