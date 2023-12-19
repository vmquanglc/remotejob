import { formatDateToString } from "./date";

import {
	get,
	filter,
	includes,
	toLower,
	toNumber,
	cloneDeep,
	isEmpty,
	forEach,
	trim,
	toString,
} from "lodash";
import { FORMAT_DATE } from "src/constants";
import moment from "moment";

export const eachFilter = ({ filters, data }) => {
	let cloneDeepData = cloneDeep(data);

	for (let item of filters) {
		cloneDeepData = isEmpty(item.value)
			? cloneDeepData
			: item.filter({
					data: cloneDeepData,
					field: item.field,
					value: item.value,
			  });
	}

	return cloneDeepData;
};

export const equalStringFilter = ({ data, field, value }) => {
	return filter(
		data,
		(item) => toLower(toString(get(item, `${field}`))) === toLower(toString(value))
	);
};

export const includesMultipleFilter = ({ data, field, value }) => {
	const splitValue = value?.split(",");

	return filter(data, (item) => {
		let isExist = false;

		forEach(splitValue, (split) => {
			if (!isEmpty(split) && includes(trim(toLower(get(item, `${field}`))), trim(toLower(split)))) {
				isExist = true;
				return;
			}
		});

		return isExist;
	});
};

export const includesFilter = ({ data, field, value }) =>
	filter(data, (item) => includes(toLower(get(item, `${field}`)), toLower(value)));

export const equalNumberFilter = ({ data, field, value }) =>
	filter(data, (item) => get(item, `${field}`) === toNumber(value));

export const rangeNumberFilter = ({ data, field, value }) => {
	const splitValue = value?.split("-");

	if (splitValue?.length > 2 || isEmpty(splitValue)) return data;

	if (splitValue?.length === 1) return equalNumberFilter({ data, field, value: splitValue[0] });

	return filter(
		data,
		(item) =>
			get(item, `${field}`) >= toNumber(splitValue[0] || 0) &&
			get(item, `${field}`) <= toNumber(splitValue[1] || 999999999999999)
	);
};

export const equalDateFilter = ({ data, field, value, formatType = FORMAT_DATE }) =>
	filter(data, (item) => {
		console.log(get(item, `${field}`), value, moment(value, formatType).valueOf());
		return (
			moment(formatDateToString(get(item, `${field}`), formatType), formatType).valueOf() ===
			moment(value, formatType).valueOf()
		);
	});

export const rangeDateFilter = ({ data, field, value, formatType = FORMAT_DATE }) => {
	const splitValue = value?.split("-");

	if (splitValue?.length > 2 || isEmpty(splitValue)) return data;

	if (splitValue?.length === 1)
		return equalDateFilter({ data, field, value: splitValue[0], formatType });

	return filter(data, (item) => {
		const formatValue = moment(
			formatDateToString(get(item, `${field}`), formatType),
			formatType
		).valueOf();
		return (
			formatValue >= moment(splitValue[0] || "01/01/1970", formatType).valueOf() &&
			formatValue <= moment(splitValue[1] || "12/12/2500", formatType).valueOf()
		);
	});
};
