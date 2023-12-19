import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { MuiTable } from "src/components/mui-table";
import { PAGINATION } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { SpreadsheetDownloadHistorySearch } from "./spreadsheet-download-history-search";
import { useQuery } from "react-query";
import { getSpreadsheetDownloadHistory } from "src/services/product-info/add.product.services";
import { AccessTime, Check, Warning, Error } from "@mui/icons-material";

export const SpreadsheetDownloadHistory = () => {
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

	const { data } = useQuery([`get-list-assign-manager`], () => getSpreadsheetDownloadHistory(), {
		keepPreviousData: true,
	});

	const { itemsPerPage, page, searchBy, searchByValue } = pick(params, [
		"itemsPerPage",
		"page",
		"searchBy",
		"searchByValue",
	]);

	const getStatus = (status: number) => {
		switch (status) {
			case 1:
				return (
					<Stack direction={"row"} alignItems={"flex-center"} gap={"5px"}>
						<AccessTime />
						<Typography sx={{ lineHeight: "26px" }}>In Progress</Typography>
					</Stack>
				);
			case 2:
				return (
					<>
						<Stack direction={"row"} alignItems={"flex-center"} gap={"5px"}>
							<Warning htmlColor="#FFC400" />
							<Typography sx={{ lineHeight: "26px" }}>Action required</Typography>
						</Stack>
					</>
				);
			case 3:
				return (
					<Stack direction={"row"} alignItems={"flex-center"} gap={"5px"}>
						<Check color="success" />
						<Typography sx={{ color: "success.main", lineHeight: "26px" }}>Done</Typography>
					</Stack>
				);
			default:
				return (
					<Stack direction={"row"} alignItems={"flex-center"} gap={"5px"}>
						<Error color="warning" />
						<Typography sx={{ color: "warning.main", lineHeight: "26px" }}>Failed</Typography>
					</Stack>
				);
		}
	};

	const columns = useMemo(
		() => [
			{
				header: "File name",
				size: 240,
				accessorKey: "file_name",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Product Types",
				size: 160,
				accessorKey: "product_type",
				typeFilter: "includesMultipleFilter",
			},

			{
				header: "Generated On",
				size: 160,
				accessorKey: "generated_on",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Status",
				size: 160,
				accessorKey: "status",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <>{getStatus(cell.getValue())}</>,
			},
			{
				header: "view",
				Header: () => <></>,
				size: 220,
				accessorKey: "view",
				typeFilter: "includesMultipleFilter",
				enableColumnDragging: false,
				enableColumnFilter: false,
				enableColumnOrdering: false,
				enableColumnActions: false,
				muiTableBodyCellProps: {
					sx: {
						textAlign: "center",
					},
				},
				Cell: ({ row }) => {
					if (row?.original?.status === 3) {
						return (
							<Button fullWidth variant="contained">
								Download
							</Button>
						);
					}
					if (row?.original?.status === 1) {
						return <CircularProgress size={16} />;
					}
					return "";
				},
			},
			{
				header: "By user",
				size: 160,
				accessorKey: "uploaded_by",
				typeFilter: "includesMultipleFilter",
			},
		],
		[]
	);

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

	const [selectedRows, setSelectedRows] = useState<any>({});

	return (
		<Box mt={{ xs: 1 }}>
			<MuiTable
				columns={columns}
				data={data?.data || []}
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
					<SpreadsheetDownloadHistorySearch
						selectedRows={selectedRows}
						onSearch={handleOnSearch}
						valuesSearch={{
							searchBy,
							searchByValue,
						}}
					/>
				)}
			/>
		</Box>
	);
};
