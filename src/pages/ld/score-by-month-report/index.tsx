import { Box, Container, Grid, Link, Paper, Typography } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { MuiTable } from "src/components/mui-table";
import { PAGINATION } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { ScoreByMonthReportSearch } from "./score-by-month-report-search";
import { useQuery } from "react-query";
import { getAssignManager } from "src/services/product-info/add.product.services";
import HoverText from "src/components/hover-text";
import { ScoreByUserReportSearch } from "./score-by-user-report-search";

const getTitle = (userNameSelected) => {
	let title = 'Score By Month';
	userNameSelected && (title = `${userNameSelected}'s score`)
	return title;
};
const DATA_PAGING_FAKE = (lengthData) => {

	const maxlength = lengthData || Math.floor(Math.random() * (2000 - 100) ) + 100;
	return Array(maxlength).fill(0).map( _=> {
		return {
			user_name: `User name ${Math.floor(Math.random() * 101)}`,
			total: Math.floor(Math.random() * 101),
			jan: Math.floor(Math.random() * 101),
			feb: Math.floor(Math.random() * 101),
			mar: Math.floor(Math.random() * 101),
			apr: Math.floor(Math.random() * 101),
			may: Math.floor(Math.random() * 101),
			jun: Math.floor(Math.random() * 101),
			jul: Math.floor(Math.random() * 101),
			aug: Math.floor(Math.random() * 101),
			sep: Math.floor(Math.random() * 101),
			oct: Math.floor(Math.random() * 101),
			nov: Math.floor(Math.random() * 101),
			dec: Math.floor(Math.random() * 101)
		}
	})
};
const DATA_FAKE = {
	data: DATA_PAGING_FAKE(10),
	total: 9999999
};

const DATA_PAGING_FAKE_USER = (lengthData) => {

	const maxlength = lengthData || Math.floor(Math.random() * (2000 - 100) ) + 100;
	return Array(maxlength).fill(0).map( _=> {
		return {
			event: `event ${Math.floor(Math.random() * 101)}`,
			gained: Math.floor(Math.random() * 101),
			time: (new Date()).toLocaleDateString()
		}
	})
};
const DATA_FAKE_USER = {
	data: DATA_PAGING_FAKE_USER(10),
	total: 9999999
};


export const ScoreByUserReport = ({userSelected}) => {
	//#region define state By User
	const columnsDetail = useMemo(
		() => [
			{
				header: "Event",
				size: 700,
				accessorKey: "event",
				typeFilter: "includesMultipleFilter"
			},
			{
				header: "Gained 110 points",
				size: 150,
				accessorKey: "gained",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Time",
				size: 100,
				accessorKey: "time",
				typeFilter: "includesMultipleFilter",
			}
		],
		[]
	);
	//#endregion

	//#region define methods By User
	const handleOnPageChangeByUser = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams((prev) => ({
			...prev,
			page: newPage,
			itemsPerPage: params?.size || PAGINATION.PAGE_SIZE,
		}));
	};

	const handleOnChangeDate = (values) => {
		setParams({
			page: PAGINATION.PAGE,
			itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE,
			...values,
		});
	};

	const handleOnRowsPerPageChangeByUser = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setParams((prev) => ({
			...prev,
			itemsPerPage: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		}));
	};
	//#endregion

	//#region define state
	const [params, setParams]: any = useState({
		itemsPerPage: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});

	const { data } = useQuery([`get-list-score-by-user`], () => DATA_FAKE_USER, {
		keepPreviousData: true,
	});
	const { itemsPerPage, page} = pick(params, [
		"itemsPerPage",
		"page"
	]);
	//#endregion
	return (
		<MuiTable
			columns={columnsDetail}
			data={data?.data || []}
			hasCheckbox = {false}
			loading={false}
			pagination={{
				...getPagination({ rowsPerPage: itemsPerPage, page }),
				total: data?.total || 0,
				onPageChange: handleOnPageChangeByUser,
				onRowsPerPageChange: handleOnRowsPerPageChangeByUser,
			}}
			renderTopToolbarCustomActions={() => (
				<ScoreByUserReportSearch
					onChangeDate={handleOnChangeDate}
				/>
			)}
		/>
	);
};

export const ScoreByMonthReport = () => {
	//#region define state
	const [params, setParams]: any = useState({
		itemsPerPage: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});
	const [userSelected, setUserSelected] = useState(null);

	const { data } = useQuery([`get-list-score-by-month`], () => DATA_FAKE, {
		keepPreviousData: true,
	});

	const [selectedRows, setSelectedRows] = useState<any>({});


	const [title, setTitle] = useState<string>(getTitle(null));

	const [isMaster, setIsMaster] = useState<boolean>(true);

	const { itemsPerPage, page, searchBy, searchByValue } = pick(params, [
		"itemsPerPage",
		"page",
		"searchBy",
		"searchByValue",
	]);

	const columns = useMemo(
		() => [
			{
				header: "User Name",
				size: 200,
				accessorKey: "user_name",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <><Link href="#" underline="always" onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setIsMaster(false);
					setTitle(getTitle(cell?.getValue()))
				}}><a>{cell.getValue()}</a></Link></>
			},
			{
				header: "Total(points)",
				size: 150,
				accessorKey: "total",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Jan",
				size: 100,
				accessorKey: "jan",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Feb",
				size: 100,
				accessorKey: "feb",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Mar",
				size: 100,
				accessorKey: "mar",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Apr",
				size: 100,
				accessorKey: "apr",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "May",
				size: 100,
				accessorKey: "may",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Jun",
				size: 100,
				accessorKey: "jun",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Jul",
				size: 100,
				accessorKey: "jul",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Aug",
				size: 100,
				accessorKey: "aug",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Sep",
				size: 100,
				accessorKey: "sep",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Oct",
				size: 100,
				accessorKey: "oct",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Nov",
				size: 100,
				accessorKey: "nov",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Dec",
				size: 100,
				accessorKey: "dec",
				typeFilter: "includesMultipleFilter",
			}
		],
		[]
	);

	
	//#endregion


	//#region define methods
	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams((prev) => ({
			...prev,
			page: newPage,
			itemsPerPage: params?.size || PAGINATION.PAGE_SIZE,
		}));
	};

	const handleOnSearch = (values) => {
		setParams({
			page: PAGINATION.PAGE,
			itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE,
			...values,
		});
	};

	const handleOnRowsPerPageChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setParams((prev) => ({
			...prev,
			itemsPerPage: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		}));
	};
	//#endregion
	
	return (
		<Box mt={{ xs: 1 }}>
			<Paper sx={{ p: 2, mb: 2 }}>
				<Grid item>
					<Typography variant="h6" color="primary">
						{title}
					</Typography>
				</Grid>
				{
					isMaster ?
					<MuiTable
						columns={columns}
						data={data?.data || []}
						hasCheckbox = {false}
						loading={false}
						pagination={{
							...getPagination({ rowsPerPage: itemsPerPage, page }),
							total: data?.total || 0,
							onPageChange: handleOnPageChange,
							onRowsPerPageChange: handleOnRowsPerPageChange,
						}}
						renderTopToolbarCustomActions={() => (
							<ScoreByMonthReportSearch
								selectedRows={selectedRows}
								onSearch={handleOnSearch}
								valuesSearch={{
									searchBy,
									searchByValue,
								}}
							/>
						)}
					/>
					:
					<ScoreByUserReport userSelected = {userSelected}/>
				}
			</Paper>
		</Box>
	);
};
