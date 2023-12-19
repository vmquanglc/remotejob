import { PATH } from "./paths";

export { PATH };

export const FORMAT_DATE = "MM/DD/YYYY";

export const FORMAT_DATE_FULL = "MM/DD/YYYY HH:mm:ss";

export const EMPTY_SYMBOL = "--";

export const LIST_STATUS = [
	{ label: "Active", value: "active", color: "success.main" },
	{ label: "Deactive", value: "deactive", color: "error.main" },
];

export const LIST_ROLE = {
	ADMIN: { value: "admin", label: "Admin" },
	SALE_ADMIN: { value: "saleAdmin", label: "Sale Admin" },
	USER: { value: "user", label: "User" },
};

export const SALE_ORDER_STATUS = {
	ACTIVE: 1,
	DOING: 2,
	DONE: 3,
};

export const PAGINATION = {
	PER_PAGE_OPTIONS: [10, 20, 50, 100],
	PAGE_SIZE: 10,
	PAGE: 0,
};

export const DEPARTMENT_YES4ALL = [
	{ label: "BOD", value: 1 },
	{ label: "INNONET", value: 2 },
	{ label: "SPD", value: 3 },
	{ label: "S&O", value: 4 },
	{ label: "Strategy", value: 5 },
	{ label: "Finance", value: 6 },
	{ label: "Legal", value: 7 },
	{ label: "IT", value: 8 },
	{ label: "HR", value: 9 },
];

export const CONDITIONS_LIST = [
	{ label: "CM (/unit) RAM-UP ($)", value: "cmRamUpPrice" },
	{ label: "CM (/unit) RAM-UP (%)", value: "cmRamUpPercent" },
	{ label: "CM (/unit) BAU ($)", value: "cmBauUpPrice" },
	{ label: "CM (/unit) BAU (%)", value: "cmBauUpPercent" },
	{ label: "Net Profit (/unit) RAM-UP ($)", value: "netProfitRamPrice" },
	{ label: "Net Profit (/unit) RAM-UP (%)", value: "netProfitRamPercent" },
	{ label: "Net Profit (/unit) BAU ($)", value: "netProfitBauPrice" },
	{ label: "Net Profit (/unit) BAU (%)", value: "netProfitBauPercent" },
	{ label: "Y4A BEP Price RAM-UP ($)", value: "Y4ABEPPriceRamPrice" },
	{ label: "Y4A BEP Price BAU ($)", value: "Y4ABEPPriceBauPrice" },
	{ label: "Competitor BEP Price RAM-UP ($)", value: "BEPPriceRamPrice" },
];

export const SEARCH_BY_DATES = {
	yesterday: -1,
	today: 0,
	tomorrow: 1,
	last7days: -7,
	last10days: -10,
	last15days: -15,
	last30days: -30,
	last60days: -60,
	last90days: -90,
};
