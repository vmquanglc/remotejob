import { baseRequest } from "./baseService";
import { baseRequestNonToken } from "./baseServiceNonToken";

export const requestLogin = async (data: any): Promise<any> => {
	// const response = await baseRequestNonToken({
	// 	url: `/api/v1/auth/login`,
	// 	method: "POST",
	// 	data: data,
	// });

	return await new Promise((res) => {
		setTimeout(() => {
			let resFake={data:{
				"id": 21,
				"first_name": "Admin",
				"last_name": "Admin",
				"full_name": "Admin Admin",
				"email": "admin@yes4all.com",
				"status": true,
				"activities": [
				  {
					"id": 21,
					"code": "ps_calculate_profit_simulation",
					"name": "Calculate Profit Simulation",
					"is_custom_activity": false
				  },
				  {
					"id": 61,
					"code": "pi_master_data_view",
					"name": "View Product Master Data",
					"is_custom_activity": false
				  },
				  {
					"id": 62,
					"code": "pi_request_list_view",
					"name": "View Update Requests List",
					"is_custom_activity": false
				  },
				  {
					"id": 63,
					"code": "pi_many_request_approve_decline",
					"name": "Approve or Decline many requests",
					"is_custom_activity": false
				  },
				  {
					"id": 64,
					"code": "pi_a_request_view",
					"name": "View detail a request",
					"is_custom_activity": false
				  },
				  {
					"id": 65,
					"code": "pi_a_request_approve_decline",
					"name": "Approve or Decline a requests",
					"is_custom_activity": false
				  },
				  {
					"id": 27,
					"code": "ps_record_save",
					"name": "Save profit simulation record with selected calculated row result",
					"is_custom_activity": false
				  },
				  {
					"id": 28,
					"code": "ps_saved_list_view",
					"name": "View saved list profit simulation record",
					"is_custom_activity": false
				  },
				  {
					"id": 66,
					"code": "pi_a_request_edit",
					"name": "Edit a request",
					"is_custom_activity": false
				  },
				  {
					"id": 67,
					"code": "pi_approval_list_view",
					"name": "View Approved Requests List",
					"is_custom_activity": false
				  },
				  {
					"id": 31,
					"code": "ps_saved_list_view_in_organization",
					"name": "View saved list profit simulation record of employee in the organization",
					"is_custom_activity": false
				  },
				  {
					"id": 68,
					"code": "pi_new_product_list_view",
					"name": "View new product list",
					"is_custom_activity": false
				  },
				  {
					"id": 69,
					"code": "pi_new_product_assign_sales",
					"name": "Assign new product to Sales",
					"is_custom_activity": false
				  },
				  {
					"id": 34,
					"code": "ps_record_view",
					"name": "View a profit simulation record",
					"is_custom_activity": false
				  },
				  {
					"id": 70,
					"code": "pi_assign_new_product_list_view",
					"name": "View assigned product list",
					"is_custom_activity": false
				  },
				  {
					"id": 71,
					"code": "pi_category_tree_view",
					"name": "View Category tree",
					"is_custom_activity": false
				  },
				  {
					"id": 37,
					"code": "ps_record_view_in_organization",
					"name": "View a profit simulation record of employee in the organization",
					"is_custom_activity": false
				  },
				  {
					"id": 72,
					"code": "pi_root_category_add",
					"name": "Add a Root Category",
					"is_custom_activity": false
				  },
				  {
					"id": 1,
					"code": "account_list_view",
					"name": "View listing accounts",
					"is_custom_activity": false
				  },
				  {
					"id": 2,
					"code": "account_list_edit",
					"name": "Edit Status, Role, Line Manager",
					"is_custom_activity": false
				  },
				  {
					"id": 3,
					"code": "account_create",
					"name": "Create account",
					"is_custom_activity": false
				  },
				  {
					"id": 4,
					"code": "account_view",
					"name": "View detail account",
					"is_custom_activity": false
				  },
				  {
					"id": 5,
					"code": "permission_add_in_account",
					"name": "Add permissions",
					"is_custom_activity": false
				  },
				  {
					"id": 6,
					"code": "account_edit",
					"name": "Edit account",
					"is_custom_activity": false
				  },
				  {
					"id": 7,
					"code": "signup_list_view",
					"name": "View listing sign-up requests",
					"is_custom_activity": false
				  },
				  {
					"id": 8,
					"code": "signup_approve",
					"name": "Approve sign-up request",
					"is_custom_activity": false
				  },
				  {
					"id": 9,
					"code": "activity_list_view",
					"name": "View listing permission activities",
					"is_custom_activity": false
				  },
				  {
					"id": 10,
					"code": "role_list_view",
					"name": "View listing roles",
					"is_custom_activity": false
				  },
				  {
					"id": 11,
					"code": "info_edit_in_role",
					"name": "Edit role info",
					"is_custom_activity": false
				  },
				  {
					"id": 12,
					"code": "permission_edit_in_role",
					"name": "Edit role permission",
					"is_custom_activity": false
				  },
				  {
					"id": 13,
					"code": "account_add_into_role",
					"name": "Add account into role",
					"is_custom_activity": false
				  },
				  {
					"id": 41,
					"code": "ps_assumption_view",
					"name": "View assumption",
					"is_custom_activity": false
				  },
				  {
					"id": 42,
					"code": "ps_assumption_manage_update",
					"name": "Manage assumption",
					"is_custom_activity": false
				  }
				],
				"role": {
				  "name": "Admin",
				  "code": "admin",
				  "description": "Admin description",
				  "id": 1
				},
				"department": {
				  "id": 1,
				  "name": "INNONET"
				},
				"organization": {
				  "id": 1,
				  "name": "Yes4All"
				},
				"manager": {
				  "id": 25,
				  "first_name": "Nguyễn Chính",
				  "last_name": "Lý",
				  "full_name": "Nguyễn Chính Lý",
				  "email": "lync@yes4all.com",
				  "status": true,
				  "department": {
					"id": 1,
					"name": "INNONET"
				  },
				  "organization": {
					"id": 1,
					"name": "Yes4All"
				  }
				},
				"created_by": {
				  "id": null,
				  "first_name": null,
				  "last_name": null,
				  "full_name": null,
				  "email": null,
				  "status": null,
				  "department": {
					"id": null,
					"name": null
				  },
				  "organization": {
					"id": null,
					"name": null
				  }
				},
				"approve_by": {
				  "id": null,
				  "first_name": null,
				  "last_name": null,
				  "full_name": null,
				  "email": null,
				  "status": null,
				  "department": {
					"id": null,
					"name": null
				  },
				  "organization": {
					"id": null,
					"name": null
				  }
				},
				"created_at": "2023-05-08T03:14:31",
				"updated_at": "2023-08-21T07:22:48",
				"director": null,
				"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIxLCJzZXNzaW9uIjoiYjcyNWYzNzAtOGUzNC00OTM0LWIwYTEtNTc3ZTA3MDQyNjMzIiwiaWF0IjoxNzAyMzkzMjg2LCJuYmYiOjE3MDIzOTMyODYsImp0aSI6ImVmYjcyZDM1LTM5YzItNDgwYi1iZjVlLTYyNzU1ZGE3OWU0YiIsImV4cCI6MTcwODQ0MTI4NiwidHlwZSI6ImFjY2VzcyIsImZyZXNoIjpmYWxzZX0.8hc-rRFb016sB-Z09P-pS45ScvUOI56EG_DEbL0r47A",
				"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIxLCJzZXNzaW9uIjoiMGI3OGU0MmEtOTYzYi00NDdlLWI3ZDgtZWU4YzMyOWU3MTJhIiwiaWF0IjoxNzAyMzkzMjg2LCJuYmYiOjE3MDIzOTMyODYsImp0aSI6Ijk0MmQ4ZjJlLTk4ZTgtNGRlNi1iZTY2LTQyMDkzZjE0OTFjYyIsImV4cCI6MTcwMjk5ODA4NiwidHlwZSI6InJlZnJlc2gifQ.Y3Lr42gDqq1UYaV6f6kqMpGP0C0goR-wvt_SGWg8xLA"
			  }};
			res(resFake)
			// res(response);
		}, 1000);
	});
};

export const requestLogout = async (): Promise<any> => {
	const response = await baseRequest({
		url: `/api/v1/auth/logout`,
		method: "POST",
	});

	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};

export const refreshToken = async (refreshToken): Promise<any> => {
	const res = await baseRequestNonToken({
		url: `/api/v1/auth/refresh`,
		method: "POST",
		headers: {
			Authorization: `Bearer ${refreshToken}`,
		},
	});
	return res;
};

export const registerAccount = async (data: any): Promise<any> => {
	const response = await baseRequestNonToken({
		url: `/api/v1/auth/register`,
		method: "POST",
		data,
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};

export const requestOTP = async (email: string): Promise<any> => {
	const response = await baseRequestNonToken({
		url: `/api/v1/auth/reset_password/create_otp`,
		method: "POST",
		data: { email },
	});

	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};

export const validOTP = async ({ email, otp }: { email: string; otp: string }): Promise<any> => {
	const response = await baseRequestNonToken({
		url: `/api/v1/auth/reset_password/check_otp`,
		method: "POST",
		data: { email, otp },
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};

export const resetPassword = async (data: any): Promise<any> => {
	const response = await baseRequestNonToken({
		url: `/api/v1/auth/reset_password`,
		method: "POST",
		data,
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};

export const changePassword = async (data: any): Promise<any> => {
	const response = await baseRequest({
		url: `/api/v1/auth/change_password`,
		method: "POST",
		data,
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};

export const getOrganizations = async (): Promise<any> => {
	const response = await baseRequestNonToken({
		url: `/api/v1/organization/yes4all`,
		method: "GET",
	});
	return await new Promise((res) => {
		setTimeout(() => {
			res(response);
		}, 1000);
	});
};
