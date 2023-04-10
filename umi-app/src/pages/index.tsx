import React, { useRef, useState } from 'react';
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import UserDrawer from './Components/UserDrawer';
import { mockService } from '@/models/user';

const User = () => {
	const [userConfig, setUserConfig] = useState<
		Utils.ModalStateConfig<User.UserRes>
	>({
		visible: false,
		modalData: {},
	});

	const ref = useRef<ActionType>();

	const refresh = () => {
		ref.current?.reload();
	};

	const deleteUser = async (userId: number) => {
		const reqSuccess = await mockService.deleteUser(userId);
		if (reqSuccess) {
			message.success('删除成功');
			refresh();
		}
	};

	const columns: ProColumns<User.UserRes>[] = [
		{
			dataIndex: 'userName',
			key: 'userName',
			title: '用户姓名',
		},
		{
			dataIndex: 'age',
			key: 'age',
			title: '年龄',
		},
		{
			dataIndex: 'password',
			key: 'password',
			title: '密码',
		},
		{
			dataIndex: 'operation',
			valueType: 'option',
			title: '操作',
			fixed: 'right',
			render: (_, record) => {
				const { userId } = record;
				return [
					<a
						onClick={() => {
							setUserConfig({ visible: true, modalData: record });
						}}
						key='edit'>
						编辑
					</a>,
					<Popconfirm
						key='delete'
						title='是否确认删除'
						onConfirm={() => deleteUser(userId)}>
						<a>删除</a>
					</Popconfirm>,
				];
			},
		},
	];

	const getUserList = async (params: Utils.tableParams<User.UserRes>) => {
		const { current, pageSize } = params;
		const { reqSuccess, total, data } = await mockService.queryUserList({
			pageSize,
			current,
		});
		if (reqSuccess) {
			return {
				total,
				data,
			};
		}
		return {
			total: 0,
			data: [],
		};
	};
	return (
		<>
			<ProTable
				rowKey='userId'
				actionRef={ref}
				toolBarRender={() => [
					<Button
						onClick={() =>
							setUserConfig({
								visible: true,
								modalData: {},
							})
						}
						type='primary'>
						注册用户
					</Button>,
				]}
				columns={columns}
				headerTitle='用户信息列表'
				request={getUserList}
				pagination={{
					defaultPageSize: 10,
				}}
			/>
			<UserDrawer
				visible={userConfig.visible}
				onClose={() => setUserConfig({ visible: false, modalData: {} })}
				modalData={userConfig.modalData}
				refresh={() => ref.current?.reload()}
			/>
		</>
	);
};

export default User;
