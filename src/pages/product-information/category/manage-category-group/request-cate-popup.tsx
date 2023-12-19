import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { MRT_RowSelectionState } from "material-react-table";
import React, { ChangeEvent, FC, MouseEvent, useEffect, useMemo, useState } from "react";
import { ButtonLoading } from "src/components/button-loading";
import BasicDialog from "src/components/modal";
import { MuiTable } from "src/components/mui-table";
import { Skeleton } from "src/components/skeleton";
import { TextRequired } from "src/components/text-required";

import { getValidateFormik } from "src/utils/formik";
import * as Yup from "yup";
import { RequestCateSearch } from "./request-cate-search";
import { useSelector } from "react-redux";
import { selectRoleAccount } from "src/store/auth/selectors";
import { PAGINATION } from "src/constants";
import { clone, mergeWith, omit, pick } from "lodash";
import { DecideRequestPopup } from "../../update-request-list/decide-request-popup";
import { getPagination } from "src/utils/pagination";
const mappingTextCate = [
	"Master Category",
	"Super Category",
	"Main Category",
	"Category",
	"Product Line",
	"Product Variant",
];

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
}

export const RequestPopup: FC<IProps> = ({ open, setOpen }) => {
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
				header: "Request time",
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

	const [selectedRows, setSelectedRows] = useState<MRT_RowSelectionState>({});
	const [stateDecide, setStateDecide] = useState<{
		isOpen: boolean;
		isApproved: boolean;
	}>({
		isOpen: false,
		isApproved: false,
	});

	const role = useSelector(selectRoleAccount);
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

	const { searchBy, searchByValue } = pick(params, ["searchBy", "searchByValue"]);

	const { itemsPerPage, page } = pick(params, ["itemsPerPage", "page"]);

	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams((state) => ({
			...state,
			page: newPage,
			itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE,
		}));
	};

	const handleOnSearch = (values) => {
		setParams((state) => ({
			...state,
			page: PAGINATION.PAGE,
			itemsPerPage: params?.size || PAGINATION.PAGE_SIZE,
			...values,
		}));
	};

	const handleOnRowsPerPageChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setParams((state) => ({
			...state,
			itemsPerPage: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		}));
	};

	const [dataDecide, setDataDecide] = useState<any>({});
	const [timestampSelected, setTimestampSelected] = useState<number>(0);
	useEffect(() => {
		if (timestampSelected > 0) {
			const IdsSelected = Object.keys(selectedRows);
			const IdsExisted = Object.keys(dataDecide);
			if (IdsSelected.length > IdsExisted.length) {
				const newIDs = IdsSelected.filter((el) => !IdsExisted.includes(el));
				const newItems = [].reduce((obj, item) => {
					if (newIDs.includes(item.id.toString())) {
						obj[item.id] = { id: item.id, name: item.name, reason: "" };
					}
					return obj;
				}, {});
				setDataDecide((state) => ({
					...state,
					...newItems,
				}));
			} else {
				const removeIds = IdsExisted.filter((el) => !IdsSelected.includes(el));
				setDataDecide((state) => {
					return {
						...omit(state, removeIds),
					};
				});
			}
		}
	}, [timestampSelected]);

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
							Request to update category
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<MuiTable
							columns={columns}
							data={[]}
							hasCheckbox
							rowNumberMode="original"
							pagination={{
								...getPagination({ rowsPerPage: itemsPerPage, page }),
								total: 0,
								onPageChange: handleOnPageChange,
								onRowsPerPageChange: handleOnRowsPerPageChange,
							}}
							getRowId={(row: any) => row?.id}
							onRowSelectionChange={(e) => {
								setSelectedRows(e);
								setTimestampSelected(new Date().getTime());
							}}
							state={{ rowSelection: selectedRows }}
							renderTopToolbarCustomActions={() => (
								<RequestCateSearch
									onApproved={() => {
										setStateDecide({
											isOpen: true,
											isApproved: true,
										});
									}}
									onDecline={() =>
										setStateDecide({
											isOpen: true,
											isApproved: false,
										})
									}
									// activities={activities}
									role={role}
									onSearch={handleOnSearch}
									selectedRows={selectedRows}
									valuesSearch={{
										searchBy,
										searchByValue,
									}}
								/>
							)}
						/>
					</Grid>
					{stateDecide.isOpen && (
						<DecideRequestPopup
							open={stateDecide.isOpen}
							isApproved={stateDecide.isApproved}
							setSelectedRows={setSelectedRows}
							refetch={() => console.log("")}
							setOpen={(value) => {
								setStateDecide((state) => ({
									...state,
									isOpen: value,
								}));
							}}
							dataDecide={dataDecide}
						/>
					)}
				</Grid>
			</Skeleton>
		</BasicDialog>
	);
};
