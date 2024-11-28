import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export type UserId = string;
export interface User {
	name: string;
	email: string;
	github: string;
}
export interface UserWithId extends User {
	id: UserId;
}

const DEFAULT_STATE = [
	{
		id: 1,
		name: 'Linus Torvalds',
		email: 'linus.torvalds@example.com',
		github: 'torvalds',
	},
	{
		id: 2,
		name: 'Evan You',
		email: 'evan.you@example.com',
		github: 'yyx990803',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		email: 'dan.abramov@example.com',
		github: 'gaearon',
	},
	{
		id: 4,
		name: 'Sarah Drasner',
		email: 'sarah.drasner@example.com',
		github: 'sdras',
	},
	{
		id: 5,
		name: 'Guillermo Rauch',
		email: 'guillermo.rauch@example.com',
		github: 'rauchg',
	},
	{
		id: 6,
		name: 'Ryan Dahl',
		email: 'ryan.dahl@example.com',
		github: 'ry',
	},
	{
		id: 7,
		name: 'Rich Harris',
		email: 'rich.harris@example.com',
		github: 'Rich-Harris',
	},
	{
		id: 8,
		name: 'Brittany Chiang',
		email: 'brittany.chiang@example.com',
		github: 'bchiang7',
	},
];

const initialState: Array<UserWithId> = (() => {
	const persistedState = localStorage.getItem('__redux__state__');
	return persistedState ? JSON.parse(persistedState).users : DEFAULT_STATE;
})();

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		addNewUser: (state, action: PayloadAction<User>) => {
			const id = crypto.randomUUID();
			state.push({ id, ...action.payload });
			return state;
		},
		deleteUserById: (state, action: PayloadAction<UserId>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		editUser: (state, action: PayloadAction<UserWithId>) => {
			const { id, name, email, github } = action.payload;
			const foundUserIndex = state.findIndex((user) => user.id === id);
			if (foundUserIndex !== -1) {
				state[foundUserIndex] = {
					id,
					name,
					email,
					github,
				};
			}
		},
		rollbackDeleteUser: (state, action: PayloadAction<UserWithId>) => {
			const isUserAlreadyDefined = state.some(
				(user) => user.id === action.payload.id,
			);
			if (!isUserAlreadyDefined) {
				state.push(action.payload);
			}
			return state;
		},
		rollbackAddUser: (state, action: PayloadAction<UserWithId>) => {
			// Cambio clave: usar un método más estricto para evitar duplicados
			const isUserAlreadyDefined = state.some(
				(user) =>
					user.id === action.payload.id ||
					(user.email === action.payload.email &&
						user.github === action.payload.github),
			);

			// Si el usuario ya existe, no hacer nada
			if (!isUserAlreadyDefined) {
				return state.filter((user) => user.id !== action.payload.id);
			}

			return state;
		},
	},
});

export default usersSlice.reducer;
export const {
	addNewUser,
	deleteUserById,
	editUser,
	rollbackDeleteUser,
	rollbackAddUser,
} = usersSlice.actions;
