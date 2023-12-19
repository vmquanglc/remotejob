import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { MuiTable } from "src/components/mui-table";
import { PAGINATION } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { SpreadsheetUploadStatusSearch } from "./spreadsheet-upload-status-search";
import { useQuery } from "react-query";
import { getSpreadsheetUploadStatus } from "src/services/product-info/add.product.services";
import { AccessTime, Check, Warning, Error } from "@mui/icons-material";

export const SpreadsheetUploadStatus = () => {
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

	const { itemsPerPage, page, searchBy, searchByValue, status, date } = pick(params, [
		"itemsPerPage",
		"page",
		"searchBy",
		"searchByValue",
		"status",
		"date",
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
				header: "Records successful / submitted",
				size: 240,
				accessorKey: "record",
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
				header: "Batch ID",
				size: 160,
				accessorKey: "batch_id",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "view",
				Header: () => <></>,
				size: 240,
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
					if (row?.original?.status === 2) {
						return (
							<Button fullWidth variant="contained">
								Download Processing Summary
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
				header: "Request type",
				size: 160,
				accessorKey: "request_type",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Uploaded time",
				size: 160,
				accessorKey: "uploaded_at",
				typeFilter: "includesMultipleFilter",
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

	const { data } = useQuery([`get-list-assign-sales`], () => getSpreadsheetUploadStatus(), {
		keepPreviousData: true,
	});

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
					<SpreadsheetUploadStatusSearch
						onSearch={handleOnSearch}
						valuesSearch={{
							searchBy,
							searchByValue,
							status,
							date,
						}}
					/>
				)}
			/>
		</Box>
	);
};
