import { Drawer, Input, InputNumber, message } from 'antd';
import React, { useEffect } from 'react';
import DrawerFooter from './DrawerFooter';
import { Form } from 'antd';
import { mockService } from '@/models/user';

const UserDrawer: React.FC<Utils.ModalConfig<User.UserRes>> = (props) => {
	const { visible, onClose, refresh, modalData } = props;
	const { userId } = modalData;

	const modalTitle = userId ? '编辑' : '新增';
	const [form] = Form.useForm<User.UserRes>();

	const onSubmit = async () => {
		const formValues = await form.validateFields();
		const serivce = userId ? 'editUser' : 'addUser';
		try {
			const { reqSuccess } = await mockService[serivce]({
				...formValues,
				userId,
			});
			if (reqSuccess) {
				message.success(`${modalTitle}成功`);
				onClose();
				refresh?.();
			}
		} catch (error: any) {
			message.error(error?.message || '系统错误');
		}
	};

	const afterOpenChange = (open: boolean) => {
		if (!open) {
			form.resetFields();
		}
	};

	useEffect(() => {
		if (userId && visible) {
			form.setFieldsValue(modalData);
		}
	}, [visible]);
	return (
		<Drawer
			afterOpenChange={afterOpenChange}
			title={`${modalTitle}用户`}
			open={visible}
			width={420}
			onClose={onClose}
			footer={<DrawerFooter onClose={onClose} onSubmit={onSubmit} />}>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='userName'
					label='用户名'
					rules={[
						{
							required: true,
							max: 32,
							pattern: /^[\w-]{4,16}$/,
							message: '请输入字母、数字、下划线的用户名至少4位并且不超过16位',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item name='age' label='年纪'>
					<InputNumber min={0} max={150} />
				</Form.Item>
				<Form.Item
					name='password'
					label='密码'
					hasFeedback
					rules={[
						{
							required: true,
							pattern:
								/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/,
							message: '任意包含大写字母，小写字母，数字，特殊符号',
						},
					]}>
					<Input.Password />
				</Form.Item>
				<Form.Item
					name='confirm'
					label='密码确认'
					dependencies={['password']}
					hasFeedback
					rules={[
						{
							required: true,
							message: '请确认你的密码!',
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('两次密码不一致'));
							},
						}),
					]}>
					<Input.Password />
				</Form.Item>
				<Form.Item
					name='phone'
					label='手机号'
					rules={[
						{
							required: true,
							message: '请输入正确的手机号',
							pattern:
								/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Drawer>
	);
};

export default UserDrawer;
