'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import {
	FormContainer,
	FormField,
	Input,
	TextArea,
	Select,
	DateInput,
	FormSection,
	FormActions,
	Grid,
} from './ui';
import {
	COMPANY_SIZE_OPTIONS,
	APPLICATION_STATUS_OPTIONS,
} from '@/lib/constants';

type ApplicationFormProps = {
	mode?: 'create' | 'edit';
	initialData?: {
		id: string;
		company: string;
		position: string;
		location?: string;
		notes?: string;
		status: string;
		salaryMin?: number;
		salaryMax?: number;
		applicationUrl?: string;
		contactName?: string;
		contactEmail?: string;
		contactPhone?: string;
		companySize?: string;
		industry?: string;
		applicationDeadline?: string;
	};
};

export default function ApplicationForm({
	mode = 'create',
	initialData,
}: Readonly<ApplicationFormProps>) {
	const router = useRouter();
	const [formData, setFormData] = useState({
		company: initialData?.company || '',
		position: initialData?.position || '',
		location: initialData?.location || '',
		notes: initialData?.notes || '',
		status: initialData?.status || 'WISHLIST',
		salaryMin: initialData?.salaryMin?.toString() || '',
		salaryMax: initialData?.salaryMax?.toString() || '',
		applicationUrl: initialData?.applicationUrl || '',
		contactName: initialData?.contactName || '',
		contactEmail: initialData?.contactEmail || '',
		contactPhone: initialData?.contactPhone || '',
		companySize: initialData?.companySize || '',
		industry: initialData?.industry || '',
		applicationDeadline: initialData?.applicationDeadline?.split('T')[0] || '',
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const formattedPhone = formatPhoneNumber(value);
		setFormData((prev) => ({ ...prev, contactPhone: formattedPhone }));
	};

	const formatPhoneNumber = (value: string) => {
		// Remove all non-digits
		const phoneNumber = value.replace(/\D/g, '');

		// Limit to 10 digits
		const limitedPhone = phoneNumber.substring(0, 10);

		// Format based on length
		if (limitedPhone.length <= 3) {
			return limitedPhone;
		} else if (limitedPhone.length <= 6) {
			return `(${limitedPhone.slice(0, 3)}) ${limitedPhone.slice(3)}`;
		} else {
			return `(${limitedPhone.slice(0, 3)}) ${limitedPhone.slice(
				3,
				6,
			)}-${limitedPhone.slice(6)}`;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const endpoint =
			mode === 'edit'
				? `/api/application/${initialData?.id}`
				: '/api/application';
		const method = mode === 'edit' ? 'PUT' : 'POST';

		// Prepare the data with proper types
		const submitData = {
			...formData,
			salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
			salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
			applicationDeadline: formData.applicationDeadline
				? new Date(formData.applicationDeadline).toISOString()
				: null,
			companySize: formData.companySize || null,
			applicationUrl: formData.applicationUrl || null,
			contactName: formData.contactName || null,
			contactEmail: formData.contactEmail || null,
			contactPhone: formData.contactPhone || null,
			industry: formData.industry || null,
		};

		const res = await fetch(endpoint, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(submitData),
		});

		setLoading(false);

		if (res.ok) {
			router.push('/');
		} else {
			alert('Something went wrong');
		}
	};

	return (
		<FormContainer
			title={mode === 'edit' ? 'Edit Application' : 'Add New Application'}
			description={
				mode === 'edit'
					? 'Update your application details'
					: 'Track a new application opportunity'
			}
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				<FormField label="Company" id="company" required>
					<Input
						id="company"
						name="company"
						placeholder="e.g. Google, Microsoft, Spotify"
						required
						value={formData.company}
						onChange={handleChange}
					/>
				</FormField>

				<FormField label="Position" id="position" required>
					<Input
						id="position"
						name="position"
						placeholder="e.g. Software Engineer, Product Manager"
						required
						value={formData.position}
						onChange={handleChange}
					/>
				</FormField>

				<FormField label="Location" id="location">
					<Input
						id="location"
						name="location"
						placeholder="e.g. San Francisco, CA (Remote)"
						value={formData.location}
						onChange={handleChange}
					/>
				</FormField>

				{/* Salary Range */}
				<Grid cols={2}>
					<FormField label="Min Salary" id="salaryMin">
						<Input
							id="salaryMin"
							type="number"
							name="salaryMin"
							placeholder="e.g. 80000"
							value={formData.salaryMin}
							onChange={handleChange}
						/>
					</FormField>
					<FormField label="Max Salary" id="salaryMax">
						<Input
							id="salaryMax"
							type="number"
							name="salaryMax"
							placeholder="e.g. 120000"
							value={formData.salaryMax}
							onChange={handleChange}
						/>
					</FormField>
				</Grid>

				{/* Company Details */}
				<Grid cols={2}>
					<FormField label="Company Size" id="companySize">
						<Select
							id="companySize"
							name="companySize"
							value={formData.companySize}
							onChange={handleChange}
						>
							{COMPANY_SIZE_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</FormField>
					<FormField label="Industry" id="industry">
						<Input
							id="industry"
							name="industry"
							placeholder="e.g. Technology, Finance, Healthcare"
							value={formData.industry}
							onChange={handleChange}
						/>
					</FormField>
				</Grid>

				{/* Application URL and Deadline */}
				<Grid cols={2}>
					<FormField label="Application Posting URL" id="applicationUrl">
						<Input
							id="applicationUrl"
							type="url"
							name="applicationUrl"
							placeholder="https://company.com/jobs/..."
							value={formData.applicationUrl}
							onChange={handleChange}
						/>
					</FormField>
					<FormField label="Application Deadline" id="applicationDeadline">
						<DateInput
							id="applicationDeadline"
							name="applicationDeadline"
							value={formData.applicationDeadline}
							onChange={handleChange}
							min="2023-01-01"
							max="2030-12-31"
							placeholder="Select deadline date..."
						/>
					</FormField>
				</Grid>

				{/* Contact Information */}
				<FormSection
					title="Contact Information"
					description="Optional contact details"
				>
					<Grid cols={3}>
						<FormField label="Contact Name" id="contactName">
							<Input
								id="contactName"
								name="contactName"
								placeholder="e.g. Jane Smith"
								value={formData.contactName}
								onChange={handleChange}
							/>
						</FormField>
						<FormField label="Contact Email" id="contactEmail">
							<Input
								id="contactEmail"
								type="email"
								name="contactEmail"
								placeholder="jane@company.com"
								value={formData.contactEmail}
								onChange={handleChange}
							/>
						</FormField>
						<FormField label="Contact Phone" id="contactPhone">
							<Input
								id="contactPhone"
								type="tel"
								name="contactPhone"
								placeholder="(555) 123-4567"
								value={formData.contactPhone}
								onChange={handlePhoneChange}
							/>
						</FormField>
					</Grid>
				</FormSection>

				<FormField label="Status" id="status">
					<Select
						id="status"
						name="status"
						value={formData.status}
						onChange={handleChange}
					>
						{APPLICATION_STATUS_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>
				</FormField>

				<FormField label="Notes" id="notes">
					<TextArea
						id="notes"
						name="notes"
						placeholder="Add any notes about the application, interview details, or next steps..."
						value={formData.notes}
						onChange={handleChange}
						rows={4}
					/>
				</FormField>

				<FormActions>
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.back()}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={loading} loading={loading}>
						{mode === 'edit' ? 'Update Application' : 'Create Application'}
					</Button>
				</FormActions>
			</form>
		</FormContainer>
	);
}
