declare namespace Utils {
	interface ModalStateConfig<T> {
		visible: boolean;
		modalData: T | Record<string, never>;
	}

	interface ModalConfig<T> extends ModalStateConfig<T> {
		onClose: () => void;
		refresh?: () => void;
	}

	type tableParams<T> = Partial<T> & { pageSize: number; current: number };
}
