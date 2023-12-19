import Cookies from "js-cookie";

export const getCookie = (name) => Cookies.get(name);

export const getToken = () => sessionStorage.getItem("token");
export const getRefreshToken = () => getCookie("refreshToken");

export const checkCookies = () => {
	return [getRefreshToken()];
};

const setCookie = (name, value) => {
	Cookies.set(name, value);
};

export const setRefreshToken = (refreshToken) => {
	setCookie("refreshToken", refreshToken);
};

export const setToken = (token) => {
	sessionStorage.setItem("token", token);
};

const removeCookie = (name) => {
	Cookies.remove(name);
};

export const removeToken = () => {
	sessionStorage.removeItem("token");
};

export const removeRefreshToken = () => {
	removeCookie("refreshToken");
};
