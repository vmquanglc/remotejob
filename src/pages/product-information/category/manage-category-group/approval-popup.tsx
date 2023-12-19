import { Box, Grid, ListItem, ListItemText, Stack, Typography, styled } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { useState, MouseEvent, ChangeEvent, useMemo } from "react";
import { useQuery } from "react-query";
import { BoxLoading } from "src/components/box-loading";
import { MuiTable } from "src/components/mui-table";
import { Skeleton } from "src/components/skeleton";
import { ToolTip } from "src/components/tooltip";
import { PAGINATION } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { ApprovedPopupSearch } from "./approved-popup-search";
import { useSelector } from "react-redux";
import { selectRoleAccount } from "src/store/auth/selectors";
import BasicDialog from "src/components/modal";

const ApprovalPopup = ({ open, setOpen }) => {
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

	const formatParams = (params: any) => {
		if (params.searchBy && params.searchByValue) {
			if (params.searchBy === "email") {
				return {
					filter: [],
					sales_name: params.searchByValue,
				};
			}
			if (params.searchBy === "email_manager") {
				return {
					filter: [],
					manager_name: params.searchByValue,
				};
			}
			return {
				filter: JSON.stringify([
					{ field: params.searchBy, op: "ilike", value: `%${params.searchByValue}%` },
				]),
			};
		}
		return {};
	};

	const columns = useMemo(() => {
		return [
			{
				header: "Type",
				size: 160,
				accessorKey: "type",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Request content",
				size: 140,
				accessorKey: "aaa",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Decision",
				size: 160,
				accessorKey: "is_approved",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ row, cell }) => (
					<Stack direction={"row"} alignItems={"center"} gap={"5px"}>
						<Typography color={!cell.getValue() ? "error.main" : "primary.main"}>
							{cell.getValue() ? "Approved" : "Declined"}
						</Typography>
						{!cell.getValue() && (
							<ToolTip title={row?.original?.reason} placement="top-start" fontSize="small" />
						)}
					</Stack>
				),
			},
			{
				header: "Request time",
				size: 140,
				accessorKey: "bbb",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Approved time",
				size: 140,
				accessorKey: "bbb",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Sales Manager",
				size: 180,
				accessorKey: "ccc",
				typeFilter: "includesMultipleFilter",
			},
		];
	}, []);

	const { itemsPerPage, page } = pick(params, ["itemsPerPage", "page"]);
	const { searchBy, searchByValue } = pick(params, ["searchBy", "searchByValue"]);

	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams({ page: newPage, itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE });
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
		setParams({
			itemsPerPage: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		});
	};
	const role = useSelector(selectRoleAccount);

	return (
		<BasicDialog
			open={open}
			disabledBackdropClick
			handleClose={() => setOpen(false)}
			PaperProps={{
				sx: {
					margin: "15px",
					width: "100%",
					maxWidth: "calc(100% - 30px)",
				},
			}}
		>
			<Skeleton isLoading={false}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={12}>
						<Typography variant="h6" fontWeight={"bold"}>
							Approval category updated request
						</Typography>
					</Grid>
					<Grid item sm={12}>
						<BoxLoading loading={false}>
							<MuiTable
								columns={columns}
								data={[]}
								rowNumberMode="original"
								pagination={{
									...getPagination({ rowsPerPage: itemsPerPage, page }),
									total: 0,
									onPageChange: handleOnPageChange,
									onRowsPerPageChange: handleOnRowsPerPageChange,
								}}
								renderTopToolbarCustomActions={() => (
									<ApprovedPopupSearch
										onSearch={handleOnSearch}
										valuesSearch={{
											searchBy,
											searchByValue,
										}}
									/>
								)}
							/>
						</BoxLoading>
					</Grid>
				</Grid>
			</Skeleton>
		</BasicDialog>
	);
};

export default ApprovalPopup;
