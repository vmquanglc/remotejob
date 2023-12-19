import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { clone, isEmpty, map, mergeWith } from "lodash";
import { useEffect, useState } from "react";
import { MenuItem} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchUserName from "./ComponentSearch/SearchUserName";
import SearchLineManager from "./ComponentSearch/SearchLineManager";
/**
 * COntroller return search by component type
 * */
const SearchBy = ({ searchType, onSubmit, searchByValue }) => {
	const customProps = { onSubmit, searchByValue };
	const mappingComponentSearch = {
		user_name: (customProps) => <SearchUserName {...customProps} />,
		line_manager: (customProps) => <SearchLineManager {...customProps} />
	}
	return mappingComponentSearch[searchType] ? mappingComponentSearch[searchType](customProps) : <div></div>;
};
/**
 * CONSTAINT DEFAULT
 */
const VALUES_DEFAULT = {
	SEARCH_TYPE: 'user_name',
	FROM_DATE : new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
	TO_DATE : new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0),
	SEARCH_BY: 'user_name',
	SEARCH_BY_VALUE: null
}
/**
 * header grid side
 * Fromdate + to date + type search + value search
 */
export const AcademicPerformanceRankingReportSearch = ({ onSearch, valuesSearch, selectedRows }) => {

	//#region define state
	const [searchType, setSearchType] = useState<string>(VALUES_DEFAULT.SEARCH_TYPE);
	const [valuesSearchState, setValuesSearchState] = useState(valuesSearch);
	const initialSearchParam = {
		searchBy: VALUES_DEFAULT.SEARCH_BY,
		searchByValue: VALUES_DEFAULT.SEARCH_BY_VALUE,
	};
	const searchByOptions = [{ label: "User Name", value: "user_name", status: false },{ label: "Line manager", value: "line_manager", status: false }];

	const [fromDate, setFromDate] = useState<Date | null>(VALUES_DEFAULT.FROM_DATE);
	const [toDate, setToDate] = useState<Date | null>(VALUES_DEFAULT.TO_DATE);
	//#endregion

	//#region define methods
	const onChangeFromDate = (newValue) => {
		setFromDate(newValue);
	}

	const onChangeToDate = (newValue) => {
		setToDate(newValue);
	}

	const handleOnChangeSearchType = (event) => {
		setSearchType(event.target.value);
		setValuesSearchState((state) => ({
			...state,
			searchByValue: VALUES_DEFAULT.SEARCH_BY_VALUE,
		}));
	};

	const handleOnSubmitSearchInput = (values: any) => {
		let cloneValues = clone(values);
		cloneValues.searchBy = searchType;
		if (searchByOptions.map(_ => _.value).includes(searchType) && isEmpty(values.searchByValue)) {
			delete cloneValues.searchByValue;
			delete cloneValues.searchBy;
		}

		onSearch && onSearch(mergeWith(initialSearchParam, cloneValues));
	};
	//#endregion

	//#region api hook
	useEffect(() => {
		setValuesSearchState(valuesSearch);
	}, [JSON.stringify(valuesSearch)]);

	useEffect(() => {
		valuesSearch?.searchBy && setSearchType(valuesSearch?.searchBy);
	}, [valuesSearch?.searchBy]);
	//#endregion
	
	return (
		<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
			<Grid item sx={{ width: 170 }}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						value={fromDate}
						onChange={(newValue) => {
							onChangeFromDate(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</Grid>
			<Grid item sx={{ width: 170 }}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						value={toDate}
						onChange={(newValue) => {
							onChangeToDate(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</Grid>
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
					onSubmit={handleOnSubmitSearchInput}
					searchType={searchType}
					searchByValue={valuesSearchState?.searchByValue}
				/>
			</Grid>
		</Grid>
	);
};
