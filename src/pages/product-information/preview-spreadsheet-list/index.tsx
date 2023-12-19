import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material";
import { Skeleton } from "src/components/skeleton";
import { MuiTable } from "src/components/mui-table";
import { getPagination } from "src/utils/pagination";
import { FORMAT_DATE, PAGINATION, PATH } from "src/constants";
import { clone, mergeWith, pick } from "lodash";
import { getPreviewListing } from "src/services/profit-simulation/preview-spreadsheet-list.services";
import { useQuery } from "react-query";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import { PreviewSearch } from "./preview-search";
import { useNavigate } from "react-router";
import { formatDateToString } from "src/utils/date";
import { Error } from "@mui/icons-material";

export default function PreviewSpreadsheetList() {
	const navigate = useNavigate();
	const columns = useMemo(
		() => [
			{
				header: "Preview ticket",
				hidden: false,
				size: 180,
				accessorKey: "name",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "SKU",
				hidden: false,
				size: 90,
				accessorKey: "additional_data.sku_code",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Preview spreadsheet name",
				hidden: false,
				size: 180,
				accessorKey: "spreadsheet_name",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Created time",
				hidden: false,
				size: 105,
				accessorKey: "created_at",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
			},
			{
				header: "Status",
				hidden: false,
				size: 120,
				accessorKey: "status",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => {
					if (cell.getValue() === "preview_done") {
						return (
							<Typography sx={{ color: "success.main" }}>
								<Stack direction={"row"} alignItems={"flex-end"} gap={"5px"}>
									<CheckIcon />
									Done
								</Stack>
							</Typography>
						);
					}
					if (cell.getValue() === "preview_fail") {
						return (
							<Typography sx={{ color: "error.main" }}>
								<Stack direction={"row"} alignItems={"flex-end"} gap={"5px"}>
									<Error color="warning" />
									Failed
								</Stack>
							</Typography>
						);
					}
					return (
						<Typography>
							<Stack direction={"row"} alignItems={"flex-end"} gap={"5px"}>
								<AccessTimeIcon />
								In Progress
							</Stack>
						</Typography>
					);
				},
			},
			{
				header: "View",
				hidden: false,
				size: 120,
				accessorKey: "view",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell, row }) => {
					if (row?.original?.status === "preview_done") {
						return (
							<Button
								variant="text"
								sx={{
									color: "info.main",
									textDecoration: "underline",
									textUnderlinePosition: "under",
									px: "5px",
								}}
								onClick={() => {
									navigate(`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${row?.original?.id}`);
								}}
							>
								Preview ticket
							</Button>
						);
					}
					if (row?.original?.status === "preview_processing") {
						return <CircularProgress size={16} />;
					}
					return "";
				},
			},
		],
		[]
	);
	const [params, setParams]: any = useState({
		itemsPerPage: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});

	const mergeParams = mergeWith(
		{
			itemsPerPage: PAGINATION.PAGE_SIZE,
			page: PAGINATION.PAGE,
		},
		clone(params)
	);
	const {
		data,
		isLoading: isLoading,
		refetch,
	} = useQuery(
		[`get-preview-listing-${JSON.stringify(mergeParams)}`],
		() => {
			return getPreviewListing();
		},
		{
			keepPreviousData: true,
			refetchInterval: 15000,
		}
	);

	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams((params) => ({
			...params,
			page: newPage,
			itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE,
		}));
	};

	const handleOnRowsPerPageChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setParams((params) => ({
			...params,
			itemsPerPage: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		}));
	};

	const { itemsPerPage, page, searchBy, searchByValue } = pick(params, [
		"itemsPerPage",
		"page",
		"searchBy",
		"searchByValue",
	]);

	const handleOnSearch = (values) => {
		setParams({
			page: PAGINATION.PAGE,
			itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE,
			...values,
		});
	};

	return (
		<Container maxWidth={false}>
			<Skeleton isLoading={isLoading}>
				<Box mt={{ xs: 1 }}>
					<Grid container spacing={{ xs: 1, sm: 1 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Preview Spreadsheets List
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<MuiTable
								columns={columns}
								loading={false}
								hasCheckbox
								data={data?.data?.items || []}
								pagination={{
									...getPagination({
										rowsPerPage: itemsPerPage,
										page,
									}),
									total: data?.data?.total || 0,
									onPageChange: handleOnPageChange,
									onRowsPerPageChange: handleOnRowsPerPageChange,
								}}
								getRowId={(row: any) => row?.id}
								renderTopToolbarCustomActions={() => (
									<PreviewSearch
										onSearch={handleOnSearch}
										valuesSearch={{
											searchBy,
											searchByValue,
										}}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Box>
			</Skeleton>
		</Container>
	);
}
