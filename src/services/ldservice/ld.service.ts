import { baseRequest } from "../baseService";
export const getTopicTree = async () => {
	const res = await baseRequest({
		url: `/api/v1/learing_development/topic/tree`,
		method: "GET",
	});
	return res;
};


export const deleteLdTopic = async (id) => {
	const res = await baseRequest({
		url: `/api/v1/learing_development/topic/${id}`,
		method: "DELETE",
	});
	return res;
};



export const creatRootTopicLd = async (data) => {
	const res = await baseRequest({
		url: `/api/v1/learing_development/topic/create_root`,
		method: "POST",
		data: data,
	});
	return res;
};

