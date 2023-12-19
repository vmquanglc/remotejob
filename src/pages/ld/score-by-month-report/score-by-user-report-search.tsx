import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
export const ScoreByUserReportSearch = ({ onChangeDate }) => {
	//#region define state
	const [fromDate, setFromDate] = useState<Date | null>(VALUES_DEFAULT.FROM_DATE);
	const [toDate, setToDate] = useState<Date | null>(VALUES_DEFAULT.TO_DATE);
	//#endregion

	//#region define methods
	const buildFilterDate = () =>{
		return {}
	};
	const onChangeFromDate = (newValue) => {
		setFromDate(newValue);
		onChangeDate(buildFilterDate());
	}

	const onChangeToDate = (newValue) => {
		setToDate(newValue);
		onChangeDate(buildFilterDate());
	}
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
		</Grid>
	);
};
