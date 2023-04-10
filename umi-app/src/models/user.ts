class User {
	userList: User.UserRes[];
	constructor(userList = []) {
		this.userList = userList;
	}

	queryUserList(params: Utils.tableParams<User.UserRes>) {
		const { current, pageSize } = params;
		const start = (current - 1) * pageSize;
		const dataPageSize = this.userList.slice(start, start + pageSize);
		return Promise.resolve({
			reqSuccess: true,
			total: this.userList.length,
			data: dataPageSize,
		});
	}

	checkDuplication(key: keyof User.UserRes, record: User.UserRes) {
		const v = record[key];
		const findIndex = this.userList.findIndex((item) => item[key] === v);
		if (findIndex > -1) {
			return true;
		}
		return false;
	}

	findUserItem(userId: number) {
		return {
			item: this.userList.find((item) => item.userId === userId),
			index: this.userList.findIndex((item) => item.userId === userId),
		};
	}

	addUser(record: User.UserRes) {
		if (this.checkDuplication('userName', record)) {
			return Promise.reject({ reqSuccess: false, message: '重复名称' });
		}
		if (record.userName)
			this.userList.unshift({ ...record, userId: this.userList.length + 1 });
		return Promise.resolve({ reqSuccess: true });
	}

	editUser(record: User.UserRes) {
		if (this.checkDuplication('userName', record)) {
			return Promise.reject({ reqSuccess: false, message: '重复名称' });
		}
		const { item, index } = this.findUserItem(record.userId);

		if (item) {
			this.userList.splice(index, 1, record);
			return Promise.resolve({ reqSuccess: true });
		}
		return Promise.reject({ reqSuccess: false, message: '找不到用户' });
	}

	deleteUser(userId: number) {
		const spliceIndex = this.userList.findIndex(
			(item) => item?.userId === userId
		);
		if (spliceIndex > -1) {
			this.userList.splice(spliceIndex, 1);
			return Promise.resolve({ reqSuccess: true });
		} else {
			return Promise.reject({ reqSuccess: false });
		}
	}
}

export const mockService = new User();
