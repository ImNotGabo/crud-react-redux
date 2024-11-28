import {
	type User,
	type UserId,
	type UserWithId,
	addNewUser,
	deleteUserById,
	editUser,
	rollbackAddUser,
	rollbackDeleteUser,
} from '../store/users/slice';
import { useAppDispatch } from './store';

export const useUserActions = () => {
	const dispatch = useAppDispatch();

	const removeUser = (id: UserId) => {
		dispatch(deleteUserById(id));
	};

	const addUser = ({ name, email, github }: User) => {
		dispatch(addNewUser({ name, email, github }));
	};

	const updateUser = (user: UserWithId) => {
		dispatch(editUser(user));
	};

	const roballbackDelete = (id: UserWithId) => {
		dispatch(rollbackDeleteUser(id));
	};

	const roballAdd = (id: UserWithId) => {
		dispatch(rollbackAddUser(id));
	};

	return { addUser, removeUser, updateUser, roballbackDelete, roballAdd };
};
