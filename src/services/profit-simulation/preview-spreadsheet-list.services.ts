import { baseRequest } from "../baseService";

const data = [
	{
		id: 1,
		name: "Preview 230510 add Vendor Code",
		sku: "AQLO",
		template: "Template-BED_FRAME",
		created_at: "dd/mm/yyyy hh:mm:ss",
		status: 0, // value 0 | 1 => 0: inprogress, 1: done
		view: false,
		type: "vendor_code",
		product_id: "180073389236",
		vendor_sku: "AQLO1",
	},
	{
		id: 4,
		name: "Preview 230510 add Vendor Code",
		sku: "AQLO",
		template: "Template-BED_FRAME",
		created_at: "dd/mm/yyyy hh:mm:ss",
		status: 1, // value 0 | 1 => 0: inprogress, 1: done
		view: true,
		type: "vendor_code",
		original_data: {
			vendor_code: "YES4A",
			list_price: 460.99,
			cost_price: 350,
		},
		update_data: [
			{
				vendor_code: "YES4B",
				list_price: 460.99,
				cost_price: 350,
			},
		],
	},
	{
		id: 2,
		name: "Preview 230522 Replace ASIN",
		sku: "AQLO",
		template: "Template-BED_FRAME",
		created_at: "dd/mm/yyyy hh:mm:ss",
		status: 1, // value 0 | 1 => 0: inprogress, 1: done
		view: true,
		type: "replace_asin",
		update_data: [
			{
				vendor_code: "YES4B",
				list_price: 460.99,
				cost_price: 350,
				product_id: "180073389236",
				vendor_sku: "AQLO1",
			},
		],
		product_id: "180073389236",
		vendor_sku: "AQLO1",
	},
	{
		id: 3,
		name: "Preview 230525 Replace ASIN",
		sku: "AQLO",
		template: "Template-CHAIR",
		created_at: "dd/mm/yyyy hh:mm:ss",
		status: 1, // value 0 | 1 => 0: inprogress, 1: done
		view: true,
		type: "replace_asin",
		product_id: "180073389236",
		vendor_sku: "AQLO1",
		update_data: [
			{
				vendor_code: "YES4B",
				list_price: 460.99,
				cost_price: 350,
				product_id: "180073389236",
				vendor_sku: "AQLO1",
			},
			{
				vendor_code: "YES4A",
				list_price: 460.99,
				cost_price: 350,
				product_id: "180073389236",
				vendor_sku: "AQLO1",
			},
		],
	},
];

export const getPreviewListing = async (): Promise<any> => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_preview`,
		method: "GET",
	});
	return res;
};

export const getDetailPreview = async (id): Promise<any> => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_preview/${id}`,
		method: "GET",
	});
	return res;
};

export const editPreview = async ({ data, id }): Promise<any> => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_preview/${id}`,
		method: "PUT",
		data,
	});
	return res;
};

export const deletePreview = async (id): Promise<any> => {
	const res = await baseRequest({
		url: `/api/v1/product_information/product_preview/${id}`,
		method: "DELETE",
	});
	return res;
};
