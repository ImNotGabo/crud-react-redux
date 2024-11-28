import { Card, Title } from '@tremor/react';
import { useState } from 'react';
import { useUserActions } from '../hooks/useUserActions';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function CreateNewUser() {
	const [result, setResult] = useState<'ok' | 'ko' | null>(null);
	const { addUser } = useUserActions();
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setResult(null);

		const form = event.currentTarget;
		const formData = new FormData(form);

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const github = formData.get('github') as string;

		if (!name || !email || !github) {
			return setResult('ko');
		}

		addUser({ name, email, github });
		setResult('ok');
		form.reset();
	};

	return (
		<Card className="mt-4">
			<Title className="text-white flex justify-center mb-4">
				Create New User
			</Title>
			<form className="mx-auto max-w-xs grid gap-y-4" onSubmit={handleSubmit}>
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						required
						name="name"
						id="name"
						type="text"
						placeholder="Enter Name"
					/>
				</div>

				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						required
						placeholder="Enter email"
						id="email"
						name="email"
						type="email"
					/>
				</div>

				<div>
					<Label htmlFor="github">GitHub</Label>
					<Input
						required
						name="github"
						id="github"
						type="text"
						placeholder="GitHub's User"
					/>
				</div>

				<div>
					<Button className="mr-2" variant="primary" type="submit">
						Create user
					</Button>
					<span>
						{result === 'ok' && (
							<Badge variant="success">Saved correctly</Badge>
						)}
						{result === 'ko' && (
							<Badge variant="error">Error with the fields</Badge>
						)}
					</span>
				</div>
			</form>
		</Card>
	);
}
