import axios from "axios";

export const baseRequestNonToken = axios.create();

baseRequestNonToken.interceptors.request.use(
	({ headers, url, method = "GET", ...rest }: any) => {
		("");
		const config = {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=utf-8",
				"X-Requested-With": "XMLHttpRequest",
				"Access-Control-Allow-Origin": "*",
				...headers,
			},
			method,
			baseURL: process.env.REACT_APP_BASE_URL,
			url,
			...rest,
		};
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

baseRequestNonToken.interceptors.response.use(
	(response) => {
		return {
			data: response?.data?.data,
			status: response?.status,
			message: response?.statusText,
		} as any;
	},
	(error) => {
		return {
			data: null,
			errorCode: error?.response?.status,
			code: error?.response?.data?.code,
			message: error?.response?.data?.message || error?.message,
		} as any;
	}
);
