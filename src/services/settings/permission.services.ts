import { baseRequest } from "../baseService";

export const updateInfoRole = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/role/role/${params.id}/info`,
		method: "PUT",
		data: {
			name: params.name,
			description: params.description,
		},
	});
	return res;
};

export const updateActivitiesRole = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/role/role/${params.id}/activities`,
		method: "PUT",
		data: {
			activity_ids: params.activity_ids,
		},
	});
	return res;
};

export const updateAdditionalActivities = async (data: any) => {
	const result = await baseRequest({
		url: `/api/v1/role/user_activity`,
		method: "POST",
		data,
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(result);
		}, 2000);
	});
};

export const addUserIntoRole = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/role/role/${data.role_pk}/users`,
		method: "PUT",
		data,
	});
	return res;
};
