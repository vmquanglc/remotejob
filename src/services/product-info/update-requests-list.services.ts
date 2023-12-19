import { baseRequest } from "../baseService";

export const getRequestApproval = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_update_request/pending`,
		method: "GET",
		params: data,
	});
	return res;
};

export const getApproved = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_update_request/processed`,
		method: "GET",
		params: data,
	});
	return res;
};

export const decidedRequest = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_update_request/approve`,
		method: "PUT",
		data: data,
	});
	return res;
};

export const getDetailRequest = async (id: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_update_request/${id}`,
		method: "GET",
	});
	return res;
};
