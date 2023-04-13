import React, { useLayoutEffect } from 'react';
import styles from './index.less';
import { Graph } from './canvasUtil';

const MovePoint = () => {
	const init = () => {
		const graph = new Graph();
		graph.init();
	};
	useLayoutEffect(() => {
		init();
	}, []);
	return (
		<>
			<canvas className={styles.canvasType}>MovePoint</canvas>
      <div style={{background:'red'}}>12asdda3</div>
      <div>12asdda3</div>
      <div>12asdda3</div>
      <div>12asdda3</div>
      <div>12asdda3</div>
      <div>12asdda3</div>
		</>
	);
};

export default MovePoint;
