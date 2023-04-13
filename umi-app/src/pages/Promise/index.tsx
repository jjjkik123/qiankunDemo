import React from 'react';
import MyPromise from './MyPromise';

const MyPromiseTest = () => {
	const p = new MyPromise((resolve: any, reject: any) => {
		resolve(1);
		reject(2);
	});

	console.log('p', p);

	return <div>MyPromise</div>;
};

export default MyPromiseTest;
