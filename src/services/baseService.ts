import axios from "axios";
import {
	checkCookies,
	getToken,
	removeRefreshToken,
	removeToken,
	setRefreshToken,
	setToken,
} from "src/utils/auth";
import { refreshToken, requestLogout } from "./auth";
import { setAuth } from "src/store/auth/actions";
import store from "src/store/store";
import { PATH } from "src/constants";
import { toastOptions } from "src/components/toast/toast.options";
const { dispatch } = store;

export const baseRequest = axios.create();

baseRequest.interceptors.request.use(
	({ headers, url, method = "GET", ...rest }: any) => {
		const token = getToken();
		const config = {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=utf-8",
				Authorization: `Bearer ${token}`,
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

baseRequest.interceptors.response.use(
	(response) => {
		return {
			data: response?.data?.data,
			status: response?.status,
			message: response?.statusText,
		} as any;
	},
	async (error) => {
		if (error?.response.status === 401) {
			const [refreshCookie] = checkCookies();
			if (refreshCookie) {
				return refreshToken(refreshCookie)
					.then((auth) => {
						if (!auth) {
							return;
						}
						setRefreshToken(auth.data.refresh_token);
						setToken(auth.data.access_token);
						dispatch(setAuth(auth.data));
						const config = error?.response.config;
						config.headers.Authorization = `Bearer ${auth.data.access_token}`;
						return baseRequest(config);
					})
					.catch(async (error) => {
						dispatch(setAuth(false));
						removeToken();
						removeRefreshToken();
						return;
					});
			}
			dispatch(setAuth(false));
			removeToken();
			removeRefreshToken();
			return {
				data: null,
				errorCode: error?.response?.status,
				code: error?.response?.data?.code,
				message: error?.response?.data?.message || error?.message,
			} as any;
		}
		return {
			data: null,
			errorCode: error?.response?.status,
			code: error?.response?.data?.code,
			message: error?.response?.data?.message || error?.message,
		} as any;
	}
);
