import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import usersReducers, {
	rollbackAddUser,
	rollbackDeleteUser,
	type UserWithId,
} from './users/slice';

const dataSyncWithDatabase = (
	payload: string,
	method: 'POST' | 'DELETE' = 'DELETE',
) => {
	return fetch(`https://jsonplaceholder.typicode.com/users/${payload}`, {
		method: method,
		...(method === 'POST' && {
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
			},
		}),
	})
		.then((res) => {
			if (res.ok) {
				method === 'DELETE'
					? toast.success(`User ${payload} deleted correctly`)
					: toast.success('User added correctly');
				return res;
			}
			throw new Error('Network response was not ok');
		})
		.catch((error) => {
			console.error('Error:', error);
			toast.error(`Failed to ${method === 'DELETE' ? 'delete' : 'add'} user`);
			throw error;
		});
};

const persistanceLocalStorageMiddleware: Middleware =
	(store) => (next) => (action) => {
		next(action);
		localStorage.setItem('__redux__state__', JSON.stringify(store.getState()));
	};

const syncWithDatabase: Middleware = (store) => (next) => (action) => {
	const { type, payload } = action as { type: string; payload: string };
	const previousState = store.getState();
	next(action);

	if (type === 'users/deleteUserById') {
		const userToRemove = previousState.users.find(
			(user: UserWithId) => user.id === payload,
		);

		dataSyncWithDatabase(payload).catch(() => {
			// Rollback: Restaurar el usuario eliminado
			store.dispatch(rollbackDeleteUser(userToRemove));
		});
	}

	if (type === 'users/addNewUser') {
		const newUser = previousState.users[previousState.users.length - 1];

		dataSyncWithDatabase(payload, 'POST').catch(() => {
			// Rollback: Eliminar el usuario que se intentó añadir
			store.dispatch(rollbackAddUser(newUser));
		});
	}
};

export const store = configureStore({
	reducer: { users: usersReducers },
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(
			persistanceLocalStorageMiddleware,
			syncWithDatabase,
		);
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
