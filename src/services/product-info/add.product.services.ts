import { baseRequest } from "../baseService";

export const getAssignManager = async () => {
	const res = {
		data: [
			{
				sku: "NXMN",
				upc: "810140951021",
				product_name: "Metal - Firewood Log Rack - Curved shape",
				category: "Sporting Goods - Indoor",
				moq: 359.0,
				fob: 39.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
			},
			{
				sku: "HDHJ",
				upc: "810140951038",
				product_name: "Metal - Firewood Log Rack - Round shape",
				category: "Gardening",
				moq: 200.0,
				fob: 35.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
			},
			{
				sku: "CBUR",
				upc: "810140952228",
				product_name: "Oval Jump Rope- jump rope Mat",
				category: "Gardening",
				moq: 100.0,
				fob: 39.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
			},
		],
		total: 3,
	};
	return res;
};

export const getAssignSales = async () => {
	const res = {
		data: [
			{
				sku: "NXMN",
				upc: "810140951021",
				product_name: "Metal - Firewood Log Rack - Curved shape",
				category: "Sporting Goods - Indoor",
				moq: 359.0,
				fob: 39.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
				sale_manager: "User",
			},
			{
				sku: "HDHJ",
				upc: "810140951038",
				product_name: "Metal - Firewood Log Rack - Round shape",
				category: "Gardening",
				moq: 200.0,
				fob: 35.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
				sale_manager: "User",
			},
			{
				sku: "CBUR",
				upc: "810140952228",
				product_name: "Oval Jump Rope- jump rope Mat",
				category: "Gardening",
				moq: 100.0,
				fob: 39.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
				sale_manager: "User",
			},
		],
		total: 3,
	};
	return res;
};

export const getAddProduct = async () => {
	const res = {
		data: [
			{
				sku: "NXMN",
				upc: "810140951021",
				product_name: "Metal - Firewood Log Rack - Curved shape",
				category: "Sporting Goods - Indoor",
				moq: 359.0,
				fob: 39.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
				sale_manager: "User",
				pic_sale: "User",
			},
			{
				sku: "HDHJ",
				upc: "810140951038",
				product_name: "Metal - Firewood Log Rack - Round shape",
				category: "Gardening",
				moq: 200.0,
				fob: 35.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
				sale_manager: "User",
				pic_sale: "User",
			},
			{
				sku: "CBUR",
				upc: "810140952228",
				product_name: "Oval Jump Rope- jump rope Mat",
				category: "Gardening",
				moq: 100.0,
				fob: 39.25,
				material: 39.25,
				product_length: 39.25,
				product_width: 39.25,
				product_height: 39.25,
				product_weight: 39.25,
				vendor: "LTN - Jiangsu Leeton Machinery Co.,Ltd",
				origin: "China",
				create_at: "dd/mm/yyyy",
				create_by: "Person 1",
				sale_manager: "User",
				pic_sale: "User",
			},
		],
		total: 3,
	};
	return res;
};

export const getSpreadsheetUploadStatus = async () => {
	const res = {
		data: [
			{
				file_name: "Bed_Frames_2023-06-28T08_16.xlsm",
				record: "2 / 2",
				status: 1,
				batch_id: 67785019537,
				request_type: "Add Vendor Code",
				uploaded_at: "dd/mm/yyyy hh:mm:ss",
				uploaded_by: "User name",
			},
			{
				file_name: "Target_Tossing_Games_2023-06-28T08_06.xlsm",
				record: "11 / 20",
				status: 2,
				batch_id: 67782019537,
				request_type: "Replace ASIN",
				uploaded_at: "dd/mm/yyyy hh:mm:ss",
				uploaded_by: "User name",
			},
			{
				file_name: "Balance_Boards_2023-06-28T03_56.xlsm",
				record: "N/A",
				status: -1,
				batch_id: 67751019536,
				request_type: "Add Products",
				uploaded_at: "dd/mm/yyyy hh:mm:ss",
				uploaded_by: "User name",
			},
			{
				file_name: "Exercise_Step_Platform_2023-06-28T03_23.xlsm",
				record: "3 / 3",
				status: 3,
				batch_id: 67720019536,
				request_type: "Add Products",
				uploaded_at: "dd/mm/yyyy hh:mm:ss",
				uploaded_by: "User name",
			},
		],
		total: 4,
	};
	return res;
};

export const getSpreadsheetDownloadHistory = async () => {
	const res = {
		data: [
			{
				file_name: "Bed_Frames_2023-06-28T08_16.xlsm",
				product_type: 1,
				generated_on: "dd/mm/yyyy hh:mm:ss",
				status: 1,
				uploaded_by: "User name",
			},
			{
				file_name: "Target_Tossing_Games_2023-06-28T08_06.xlsm",
				product_type: 2,
				generated_on: "dd/mm/yyyy hh:mm:ss",
				status: 3,
				uploaded_by: "User name",
			},
			{
				file_name: "Hammocks_2023-06-28T07_09.xlsm",
				product_type: 5,
				generated_on: "dd/mm/yyyy hh:mm:ss",
				status: -1,
				uploaded_by: "User name",
			},
		],
		total: 3,
	};
	return res;
};

export const uploadSpreadsheet = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/product_information/add_product/prevew`,
		method: "POST",
		data,
	});
	return res;
};
