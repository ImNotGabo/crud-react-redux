import {
	Card,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Title,
} from '@tremor/react';
import { useState } from 'react';
import { useAppSelector } from '../hooks/store';
import { useUserActions } from '../hooks/useUserActions';
import type { UserId } from '../store/users/slice';
import { DeleteIcon, EditIcon } from './Icons';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

export function ListOfUsers() {
	const users = useAppSelector((state) => state.users);
	const { removeUser, updateUser } = useUserActions();
	const [editingUser, setEditingUser] = useState<string | null>(null);
	const [editedUserData, setEditedUserData] = useState<{
		name: string;
		email: string;
		github: string;
	}>({ name: '', email: '', github: '' });

	const handleEditClick = (user: (typeof users)[0]) => {
		setEditingUser(user.id);
		setEditedUserData({
			name: user.name,
			email: user.email,
			github: user.github,
		});
	};

	const handleSaveEdit = (userId: UserId) => {
		updateUser({
			id: userId,
			...editedUserData,
		});
		setEditingUser(null);
	};

	const handleCancelEdit = () => {
		setEditingUser(null);
	};

	const handleInputChange = (
		field: keyof typeof editedUserData,
		value: string,
	) => {
		setEditedUserData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<Card className="text-white">
			<Title>
				Users
				<Badge variant="default" className="ml-2">
					{users.length}
				</Badge>
			</Title>
			<Table>
				<TableHead>
					<TableRow>
						<TableHeaderCell>Id</TableHeaderCell>
						<TableHeaderCell>Name</TableHeaderCell>
						<TableHeaderCell>Email</TableHeaderCell>
						<TableHeaderCell>GitHub</TableHeaderCell>
						<TableHeaderCell>Actions</TableHeaderCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{users.map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.id}</TableCell>
							<TableCell className="flex items-center gap-4">
								<img
									className="h-8 w-8 rounded-md"
									src={`https://unavatar.io/github/${item.github}`}
									alt={item.name}
								/>
								{editingUser === item.id ? (
									<Input
										value={editedUserData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										className="w-full"
									/>
								) : (
									item.name
								)}
							</TableCell>
							<TableCell>
								{editingUser === item.id ? (
									<Input
										value={editedUserData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										className="w-full"
									/>
								) : (
									item.email
								)}
							</TableCell>
							<TableCell>
								{editingUser === item.id ? (
									<Input
										value={editedUserData.github}
										onChange={(e) =>
											handleInputChange('github', e.target.value)
										}
										className="w-full"
									/>
								) : (
									item.github
								)}
							</TableCell>
							<TableCell>
								{editingUser === item.id ? (
									<div className="flex gap-2">
										<button onClick={() => handleSaveEdit(item.id)}>
											Save
										</button>
										<button onClick={handleCancelEdit}>Cancel</button>
									</div>
								) : (
									<div className="flex gap-2">
										<button onClick={() => handleEditClick(item)}>
											<EditIcon />
										</button>
										<button onClick={() => removeUser(item.id)}>
											<DeleteIcon />
										</button>
									</div>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
