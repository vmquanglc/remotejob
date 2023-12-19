import toLower from "lodash/toLower";
import moment from "moment";
import { EMPTY_SYMBOL, FORMAT_DATE_FULL } from "src/constants";

export const formatDateToString = (date: Date | string, type?: string) => {
	let result = moment(new Date(date)).format(type ? type : FORMAT_DATE_FULL);

	if (toLower(result) === "invalid date") return EMPTY_SYMBOL;
	return result;
};
export const convertTimeToGMT7 = (date: Date | string, type?: string) => {
	// Convert to GMT+7
	let result = moment
		.utc(date)
		.utcOffset(7)
		.format(type ? type : FORMAT_DATE_FULL);
	if (toLower(result) === "invalid date") return EMPTY_SYMBOL;
	return result;
};

export const getDays = (number) => {
	const days = new Date(new Date().getTime());
	days.setDate(new Date().getDate() + number);
	return days;
};
