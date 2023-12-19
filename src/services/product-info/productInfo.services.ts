import { omit } from "lodash";
import { baseRequest } from "../baseService";

export const getProductInfoListing = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product`,
		method: "GET",
		params,
	});
	return res;
};

export const getProductDetail = async (product_id: number | string) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${product_id}`,
		method: "GET",
	});
	return res;
};

export const getCategoryTree = async () => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_category`,
		method: "GET",
	});
	return res;
};

export const getInputData = async () => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/input_data`,
		method: "GET",
	});
	return res;
};

export const requestUpdateSKUInfo = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${data.sku_id}/sku`,
		method: "PUT",
		data: omit(data, ["sku_id"]),
	});
	return res;
};

export const requestUpdateMarketPlace = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${data.sku_id}/market_place_id`,
		method: "PUT",
		data: omit(data, ["sku_id"]),
	});
	return res;
};

export const requestUpdateRecord = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${data.sku_id}/record`,
		method: "PUT",
		data: omit(data, ["sku_id"]),
	});
	return res;
};

export const getRequestApproval = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_update_request/pending`,
		method: "GET",
		params: data,
	});
	return res;
};
export const getStatusAddVendor = async (product_id: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${product_id}/add_vendor_code`,
		method: "GET",
	});
	return res;
};

export const getStatusReplaceAsin = async (product_id: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${product_id}/replace_asin`,
		method: "GET",
	});
	return res;
};

export const submitPreviewAddVendor = async (data: { product_id: number; data: any }) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${data.product_id}/add_vendor_code`,
		method: "POST",
		data: data.data,
	});
	return res;
};

export const submitPreviewReplaceAsin = async (data: { product_id: number; data: any }) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/${data.product_id}/replace_asin`,
		method: "POST",
		data: data.data,
	});
	return res;
};

export const getOptionsCate = async ({
	manager_ids,
	sales_ids,
}: {
	manager_ids: string;
	sales_ids: string;
}) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product/input_data/category_name?manager_ids=${manager_ids}&sales_ids=${sales_ids}`,
		method: "GET",
	});
	return res;
};
