import { clone } from "lodash";
import map from "lodash/map";
import * as XLSX from "xlsx";

export const capitalizeFirstLetter = (string: string) => {
	if (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	return "";
};

export const randomString = (len: number, type?: "alpha" | "numeric") => {
	var str = "",
		i = 0,
		min = type === "alpha" ? 10 : 0,
		max = type === "numeric" ? 10 : 62;
	for (; i++ < len; ) {
		var r = (Math.random() * (max - min) + min) << 0;
		str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
	}
	return str;
};

export const exportToCSV = (
	csvData: any[],
	csvDataHeader: any[],
	csvDataField: any[],
	fileName: string = "file"
) => {
	const getSheetData = ({ csvData, csvDataField, csvDataHeader }) => {
		var sheetData = map(csvData, (row) => map(csvDataField, (fieldName) => row[fieldName] ?? ""));
		sheetData.unshift(csvDataHeader);
		return sheetData;
	};
	const sheetData = getSheetData({ csvData, csvDataField, csvDataHeader });
	const wb = XLSX.utils.book_new();
	const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
	XLSX.utils.sheet_add_json(ws, sheetData, { origin: "A1", skipHeader: true });
	XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
	XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToMultiSheet = (
	csvData: object,
	csvDataHeader: any[],
	csvDataField: any[],
	fileName: string = "file"
) => {
	const getSheetData = ({ csvData, csvDataField, csvDataHeader }) => {
		var sheetData = map(csvData, (row) => map(csvDataField, (fieldName) => row[fieldName] ?? ""));
		sheetData.unshift(csvDataHeader);
		return sheetData;
	};
	const wb = XLSX.utils.book_new();
	for (let index = 0; index < Object.keys(csvData).length; index++) {
		const sheetData = getSheetData({
			csvData: csvData?.[Object.keys(csvData)[index]],
			csvDataField,
			csvDataHeader,
		});
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
		XLSX.utils.sheet_add_json(ws, sheetData, { origin: "A1", skipHeader: true });
		XLSX.utils.book_append_sheet(wb, ws, `${Object.keys(csvData)[index]}`);
	}
	XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const formatFilter = (params: any) => {
	if (params.searchBy && params.searchByValue) {
		return JSON.stringify([
			{ field: params.searchBy, op: "ilike", value: `%${params.searchByValue}%` },
		]);
	}
	return [];
};

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const downloadLink = (name, url) => {
	return sleep(300).then((v) => {
		const link = document.createElement("a");
		link.href = `${process.env.REACT_APP_BASE_URL}${url}`;
		link.setAttribute("download", `${name}.xlsx`);
		document.body.appendChild(link);
		link.click();
		link.remove();
	});
};

export const delKeysNonExist = (obj: any) => {
	const newObj = clone(obj);
	for (const key in newObj) {
		if (newObj[key] === undefined || newObj[key] === null) {
			delete newObj[key];
		}
	}
	return newObj;
};
