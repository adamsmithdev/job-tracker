'use client';

import { useRouter } from 'next/navigation';
import Button from './Button';
import { Icon } from './ui';
import { faTrash } from '@/lib/fontawesome';

export function DeleteInterviewButton({
	interviewId,
}: {
	readonly interviewId: string;
}) {
	const router = useRouter();

	const handleDelete = async () => {
		const confirmDelete = confirm(
			'Are you sure you want to delete this interview?\n\nThis action cannot be undone.',
		);
		if (!confirmDelete) return;

		try {
			const res = await fetch(`/api/interview/${interviewId}`, {
				method: 'DELETE',
			});

			if (res.ok) {
				router.push('/interviews');
				router.refresh();
			} else {
				alert('Failed to delete interview. Please try again.');
			}
		} catch {
			alert('An error occurred while deleting the interview.');
		}
	};

	return (
		<Button onClick={handleDelete} variant="danger" fullWidth>
			<Icon icon={faTrash} className="mr-2" />
			<span>Delete Interview</span>
		</Button>
	);
}
