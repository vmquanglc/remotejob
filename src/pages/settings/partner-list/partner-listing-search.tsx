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

const SearchPartnerName = ({ onSubmit, searchByValue }) => {
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
		case "partner":
			component = <SearchPartnerName {...customProps} />;
			break;
	}
	return component;
};

export const PartnerSearch = ({ onSearch, valuesSearch, setOpen }) => {
	const [searchType, setSearchType] = useState<string>("partner");
	const [valuesSearchState, setValuesSearchState] = useState(valuesSearch);
	const initialSearchParam = {
		searchBy: undefined,
		searchByValue: undefined,
	};

	const searchByOptions = [{ label: "Partner", value: "partner", status: false }];

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
		if (["partner"].includes(searchType) && isEmpty(values.searchByValue)) {
			delete cloneValues.searchByValue;
			delete cloneValues.searchBy;
		}

		onSearch && onSearch(mergeWith(initialSearchParam, cloneValues));
	};

	return (
		<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
			<Grid item>
				<Button size="medium" variant="contained" sx={{ mr: 2 }} onClick={() => setOpen(true)}>
					Create
				</Button>
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
