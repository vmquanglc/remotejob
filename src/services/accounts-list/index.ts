import { baseRequest } from "../baseService";
import { omit } from "lodash";

export const getSignUpRequestList = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/user/sign_up_request`,
		method: "GET",

		params: params,
	});
	return res;
};

export const getListRoles = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/role/roles`,
		method: "GET",

		params: params,
	});
	return res;
};

export const getUserAccountsList = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/users`,
		method: "GET",
		params: params,
	});
	return res;
};

export const getUserProfile = async (id: any) => {
	const res = await baseRequest({
		url: `/api/v1/user/${id}`,
		method: "GET",
	});
	return res;
};

export const updateAccount = async (data: any) => {
	const result = await baseRequest({
		url: `/api/v1/user/${data.id}`,
		method: "PUT",

		data: omit(data, ["id"]),
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(result);
		}, 2000);
	});
};

export const getListActivities = async () => {
	const res = await baseRequest({
		url: `/api/v1/role/activity/node`,
		method: "GET",
	});
	return res;
};

export const actionSignUp = async (data: { id: string[] | number[]; status: boolean }) => {
	const res = await baseRequest({
		url: `/api/v1/user/sign_up_request`,
		method: "POST",
		data: {
			user_ids: data.id,
			status: data.status,
		},
	});
	return res;
};

export const adminCreateAccount = async (data: any): Promise<any> => {
	const response = await baseRequest({
		url: `/api/v1/user`,
		method: "POST",
		data,
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};
