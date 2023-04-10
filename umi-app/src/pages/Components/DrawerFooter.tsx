import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

interface DrawerFooterType {
	onSubmit: () => void;
	onClose: () => void;
}

const DrawerFooter: React.FC<DrawerFooterType> = (props) => {
	const { onClose, onSubmit } = props;
	return (
		<div className={styles.DrawerFooterStyle}>
			<Button onClick={onClose}>取消</Button>
			<Button onClick={onSubmit} type='primary'>
				新增
			</Button>
		</div>
	);
};

export default DrawerFooter;
