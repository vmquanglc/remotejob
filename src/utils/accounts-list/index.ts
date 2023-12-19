export const formatPayloadAccount = (data: any) => {
	return {
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		role_id: data.role.id,
		department_id: data.department.id,
		manager_id: data.manager.id,
		status: data.status,
	};
};
