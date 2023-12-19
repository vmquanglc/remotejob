import { Box, Container, Grid, Link, Paper, Typography } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { MuiTable } from "src/components/mui-table";
import { PAGINATION } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { AcademicPerformanceRankingReportSearch } from "./academic-performance-ranking-report-search";
import { useQuery } from "react-query";
import { getAssignManager } from "src/services/product-info/add.product.services";
import HoverText from "src/components/hover-text";

const DATA_PAGING_FAKE = (lengthData = null) => {

	const maxlength = lengthData || Math.floor(Math.random() * (2000 - 100) ) + 100;
	return Array(maxlength).fill(0).map((value, index) => {
		return {
			top_no: index + 1,
			user_name: `User name ${Math.floor(Math.random() * 101)}`,
			monthly_points: Math.floor(Math.random() * 101),
			ytd_points: Math.floor(Math.random() * 101),
			line_manager: `line_manager ${Math.floor(Math.random() * 101)}`
		}
	})
};
const DATA_FAKE = {
	data: DATA_PAGING_FAKE(10),
	total: 999
};

export const AcademicPerformanceRankingReport = () => {

	//#region define state
	const [params, setParams]: any = useState({
		itemsPerPage: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});

	const { data } = useQuery([`get-list-ranking-report`], () => DATA_FAKE, {
		keepPreviousData: true,
	});

	const { itemsPerPage, page, searchBy, searchByValue } = pick(params, [
		"itemsPerPage",
		"page",
		"searchBy",
		"searchByValue",
	]);

	const columns = useMemo(
		() => [
			{
				header: "Top no.",
				size: 50,
				accessorKey: "top_no",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "User Name",
				size: 600,
				accessorKey: "user_name",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Monthly (points)",
				size: 150,
				accessorKey: "monthly_points",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Year to date (points)",
				size: 150,
				accessorKey: "ytd_points",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Line Manager",
				size: 150,
				accessorKey: "line_manager",
				typeFilter: "includesMultipleFilter",
			}
		],
		[]
	);

	const [selectedRows, setSelectedRows] = useState<any>({});

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
				<Grid item sx={{display:'flex', justifyContent:'space-between'}}>
					<Typography variant="h6" color="primary">
						{"Academic Performance Ranking"}
					</Typography>
					<Link href="#" underline="always">Rules to gain points</Link>
				</Grid>
				<MuiTable
					columns={columns}
					data={data?.data || []}
					hasCheckbox = {false}
					loading={false}
					onRowSelectionChange={setSelectedRows}
					state={{ rowSelection: selectedRows }}
					pagination={{
						...getPagination({ rowsPerPage: itemsPerPage, page }),
						total: data?.total || 0,
						onPageChange: handleOnPageChange,
						onRowsPerPageChange: handleOnRowsPerPageChange,
					}}
					renderTopToolbarCustomActions={() => (
						<AcademicPerformanceRankingReportSearch
							selectedRows={selectedRows}
							onSearch={handleOnSearch}
							valuesSearch={{
								searchBy,
								searchByValue,
							}}
						/>
					)}
				/>
			</Paper>
		</Box>
	);
};
