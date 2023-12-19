import { baseRequest } from "../baseService";

export const getRoleInActivities = async () => {
	const res = await baseRequest({
		url: `/api/v1/role/activity`,
		method: "GET",
	});
	return res;
};
