import { omit } from "lodash";
import { baseRequest } from "../baseService";
import { downloadLink } from "src/utils/common";

export const getInfoAsin = async ({ asinId, params }) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/asin/${asinId}`,
		method: "GET",
		params,
	});
	return res;
};

export const getAssumption = async (organization_code: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/assumption/${organization_code}`,
		method: "GET",
	});
	return res;
};

export const getHistoriesAssumption = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/assumption/${params.organization_code}/list`,
		method: "GET",
		params: omit(params, ["organization_code"]),
	});
	return res;
};

export const updateAssumption = async ({ code, data }: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/assumption/${code}`,
		method: "PUT",
		data,
	});
	return res;
};

export const getSuggestDuty = async (organization_code: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/suggested_duty/${organization_code}`,
		method: "GET",
	});
	return res;
};

export const getPSGroupList = async (params: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group`,
		method: "GET",
		params: params,
	});
	return res;
};

export const getPSGroupDetail = async (id: number | string) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group/${id}`,
		method: "GET",
	});
	return res;
};

export const updateGroupDetail = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group/${data.id}`,
		method: "PUT",
		data: omit(data, "id"),
	});
	return res;
};

export const createGroupDetail = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group`,
		method: "POST",
		data,
	});
	return res;
};

export const deleteGroupDetail = async (id: string | number) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group/${id}`,
		method: "DELETE",
	});
	return res;
};

export const deletePS = async (ids: string[] | number[]) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation/delete`,
		method: "POST",
		data: {
			ids: ids,
		},
	});
	return res;
};
export const deletePSGroup = async (ids: string[] | number[]) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group/delete`,
		method: "POST",
		data: {
			ids: ids,
		},
	});
	return res;
};
export const sentMailGroupRecord = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group/send_email`,
		method: "POST",
		data,
	});
	return res;
};

export const sentMailPS = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation/send_email`,
		method: "POST",
		data,
	});
	return res;
};

export const exportExcelPSListGroup = async (data: any[]) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group/export`,
		method: "POST",
		data: {
			profit_simulation_group_ids: data,
		},
	});

	if (res.status === 200) {
		for (let index = 0; index < res?.data?.data?.length; index++) {
			await downloadLink(res?.data?.data?.[index]?.name, res?.data?.data?.[index]?.url);
		}
	}

	return res;
};

export const exportExcelPSInDetail = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation/export`,
		method: "POST",
		data: data,
	});

	if (res.status === 200) {
		await downloadLink(res?.data?.name, res?.data?.url);
	}

	return res;
};

export const exportCalculator = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/profit_simulation_group/calculating_export`,
		method: "POST",
		data: data,
	});

	if (res.status === 200) {
		await downloadLink(res?.data?.name, res?.data?.url);
	}

	return res;
};

export const getListEmail = async () => {
	const res = await baseRequest({
		url: `/api/v1/user/emails`,
		method: "GET",
	});
	return res;
};

export const getAssumptionDetail = async ({ assumption_id, organization_code }) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/assumption/${organization_code}/${assumption_id}`,
		method: "GET",
	});
	return res;
};

export const exportAssumptions = async (data: any) => {
	const res = await baseRequest({
		url: `/api/v1/profit_simulation/assumption/export`,
		method: "POST",
		data,
	});
	if (res.status === 200) {
		for (let index = 0; index < res?.data?.data?.length; index++) {
			await downloadLink(res?.data?.data?.[index]?.name, res?.data?.data?.[index]?.url);
		}
	}

	return res;
};
