import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { clone, includes, isEmpty, map, mergeWith } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { getValidateFormik } from "src/utils/formik";
import { MenuItem } from "@mui/material";
import { DesktopDatePicker } from "src/components/desktop-date-picker";
import { formatDateToString } from "src/utils/date";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { PATH } from "src/constants";
import { capitalizeFirstLetter } from "src/utils/common";

interface SearchByDateValues {
	searchByValue?: string;
	fromValue?: string;
	toValue?: string;
	onSubmit?: (values: any) => void;
}
const SearchByDate = ({ onSubmit, searchByValue, fromValue, toValue }: SearchByDateValues) => {
	const valueOption = useMemo(() => {
		return {
			last7days: "last7days",
			last15days: "last15days",
			last30days: "last30days",
			last60days: "last60days",
			last90days: "last90days",
		};
	}, []);

	const [minDate, setMinDate] = useState(0);

	const formik = useFormik({
		initialValues: {
			searchByValue: searchByValue ?? valueOption?.last7days,
			fromValue: fromValue,
			toValue: toValue,
		},
		onSubmit,
	});

	const options = [
		{ label: "Last 07 days", value: valueOption?.last7days },
		{ label: "Last 15 days", value: valueOption?.last15days },
		{ label: "Last 30 days", value: valueOption?.last30days },
		{ label: "Last 60 days", value: valueOption?.last60days },
		{ label: "Last 90 days", value: valueOption?.last90days },
		{ label: "Custom Payment Date Range", value: "custom" },
	];

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
				<Grid item>
					<TextField
						fullWidth
						size="small"
						name="searchByValue"
						select
						sx={{ width: 200 }}
						{...getValidateFormik({
							formik,
							field: "searchByValue",
						})}
						onChange={(e) => {
							formik.setFieldValue("searchByValue", e.target.value);
							formik.setFieldValue("fromValue", null);
							formik.setFieldValue("toValue", null);
						}}
					>
						{map(options, ({ label, value }) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				{formik?.values?.searchByValue === "custom" && (
					<>
						<Grid item>
							<DesktopDatePicker
								size="small"
								disableFuture
								onChange={(value: string) => {
									setMinDate(Date.parse(value));
									formik.setFieldValue("fromValue", formatDateToString(value));
								}}
								value={formik.values.fromValue}
								renderInput={(params) => (
									<TextField
										{...params}
										sx={{ width: 200 }}
										name="fromValue"
										inputProps={{
											...params.inputProps,
											placeholder: "Start Date",
										}}
									/>
								)}
							/>
						</Grid>
						<Grid item>
							<DesktopDatePicker
								size="small"
								disableFuture
								onChange={(value: string) =>
									formik.setFieldValue("toValue", formatDateToString(value))
								}
								value={formik.values.toValue}
								minDate={new Date(minDate)}
								renderInput={(params) => {
									return (
										<TextField
											{...params}
											sx={{ width: 200 }}
											name="toValue"
											inputProps={{
												...params.inputProps,
												placeholder: "End Date",
											}}
										/>
									);
								}}
							/>
						</Grid>
					</>
				)}
				<Grid item>
					<Button type="submit" size="small" variant="contained">
						Search
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

const SearchName = ({ onSubmit, searchByValue }) => {
	const formik = useFormik({
		initialValues: {
			searchByValue: searchByValue,
		},
		onSubmit,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
				<Grid item>
					<TextField
						fullWidth
						size="medium"
						name="searchByValue"
						variant="standard"
						placeholder={"Enter data search"}
						sx={{ width: 180 }}
						{...getValidateFormik({
							formik,
							field: "searchByValue",
						})}
					/>
				</Grid>
				<Grid item>
					<Button
						type="submit"
						size="small"
						variant="text"
						sx={{
							minWidth: "40px",
							padding: "7px",
						}}
					>
						<SearchIcon fontSize="medium" />
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

const SearchBy = ({ searchType, onSubmit, searchByValue }) => {
	let component = <div></div>;
	let customProps = { onSubmit, searchByValue };
	switch (searchType) {
		case "name":
			component = <SearchName {...customProps} />;
			break;
	}
	return component;
};

export const GroupPermissionSearch = ({ onSearch, valuesSearch }) => {
	const [searchType, setSearchType] = useState<string>("name");
	const [valuesSearchState, setValuesSearchState] = useState(valuesSearch);
	const initialSearchParam = {
		searchBy: undefined,
		searchByValue: undefined,
	};

	const searchByOptions = [{ label: "Role", value: "name", status: false }];

	useEffect(() => {
		setValuesSearchState(valuesSearch);
	}, [JSON.stringify(valuesSearch)]);

	useEffect(() => {
		valuesSearch?.searchBy && setSearchType(valuesSearch?.searchBy);
	}, [valuesSearch?.searchBy]);

	const handleOnChangeSearchType = (event) => {
		setSearchType(event.target.value);
		setValuesSearchState((state) => ({
			...state,
			searchByValue: undefined,
		}));
	};

	const handleOnSubmit = (values: any) => {
		let cloneValues = clone(values);
		cloneValues.searchBy = searchType;
		if (["name"].includes(searchType) && isEmpty(values.searchByValue)) {
			delete cloneValues.searchByValue;
			delete cloneValues.searchBy;
		}

		onSearch && onSearch(mergeWith(initialSearchParam, cloneValues));
	};

	return (
		<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
			<Grid item>
				<TextField
					fullWidth
					select
					size="medium"
					name="searchBy"
					id="searchBy"
					variant="standard"
					SelectProps={{
						multiple: false,
						value: searchType,
						onChange: handleOnChangeSearchType,
					}}
					sx={{ width: 180 }}
				>
					{map(searchByOptions, ({ label, value, status }) => (
						<MenuItem key={value} value={value} disabled={status}>
							{label}
						</MenuItem>
					))}
				</TextField>
			</Grid>
			<Grid item>
				<SearchBy
					onSubmit={handleOnSubmit}
					searchType={searchType}
					searchByValue={valuesSearchState?.searchByValue}
				/>
			</Grid>
		</Grid>
	);
};
