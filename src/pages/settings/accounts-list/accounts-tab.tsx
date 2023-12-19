import { Grid, MenuItem, TextField, Typography, Box, Button, Popover } from "@mui/material";
import { useFormik } from "formik";
import { capitalize, clone, delay, isEmpty, keyBy, map, mergeWith, pick } from "lodash";
import React, { ChangeEvent, FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { LIST_STATUS, PAGINATION, PATH } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { AccountsTabSearch } from "./accounts-tab-search";

import { Link } from "react-router-dom";
import { ToolTip } from "src/components/tooltip";
import { equalStringFilter } from "src/utils/filter";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import List from "@mui/material/List";
import {
	adminCreateAccount,
	getListRoles,
	getUserAccountsList,
	updateAccount,
} from "src/services/accounts-list";
import { BoxLoading } from "src/components/box-loading";
import { formatPayloadAccount } from "src/utils/accounts-list";
import { Skeleton } from "src/components/skeleton";
import { MuiTable } from "src/components/mui-table";
import BasicDialog from "src/components/modal";
import { PopupAccount } from "./popup-account";
import { toastOptions } from "src/components/toast/toast.options";
import { formatDateToString } from "src/utils/date";
import { addUserIntoRole } from "src/services/settings/permission.services";
import { getOrganizations } from "src/services/auth";
import { FORMAT_DATE } from "src/constants";
interface IProps {
	activities: any;
	email: string;
}

export const AccountsTab: FC<IProps> = ({ activities, email }) => {
	console.log('nbt reload account tab')

	const [isFirst, setFirst] = useState<boolean>(true);
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
		setParams({ page: newPage, itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE });
	};

	const handleOnSearch = (values) => {
		setParams({
			page: PAGINATION.PAGE,
			itemsPerPage: params?.size || PAGINATION.PAGE_SIZE,
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

	const { data: dataRoles, isFetching: isLoadingRoles } = useQuery(
		[`list-full-role`],
		() =>
			getListRoles({
				page: 1,
				itemsPerPage: 20,
				q: "''",
				filter: [],
				sortBy: [],
				descending: [],
			}),
		{
			enabled:
				activities.hasOwnProperty("account_create") || activities.hasOwnProperty("account_edit"),
			keepPreviousData: true,
		}
	);

	const { mutate: onAddUserToRole } = useMutation(async (data: any) => {
		setLoading(true);
		try {
			const response: any = await addUserIntoRole(data);
			if (response?.status !== 200) {
				toastOptions("error", "Add user to role error");
				setLoading(false);
				return false;
			} else {
				toastOptions("success", "Add user to success!");
				setLoading(false);
				refetch();
				return true;
			}
		} catch (error) {
			setLoading(false);
			toastOptions("error", "Add user to error");
			return false;
		}
	});

	const { data: dataDepartment, isFetching: isLoadingDepartment } = useQuery(
		[`get-organizations`],
		() => getOrganizations(),
		{
			onSuccess: (data) => {},
			enabled:
				activities.hasOwnProperty("account_create") || activities.hasOwnProperty("account_edit"),
			keepPreviousData: true,
		}
	);

	const columns = useMemo(
		() => [
			{
				header: "Full name",
				size: 200,
				accessorKey: "full_name",
				enableEditing: false,
				typeFilter: "includesMultipleFilter",
				Cell: ({ row, cell }) => {
					if (activities.hasOwnProperty("account_view")) {
						return (
							<Link to={`${PATH.ACCOUNT_LIST}${PATH.DETAIL}/${row?.original?.id}`}>
								{row.original.full_name}
							</Link>
						);
					}
					return <>{cell.getValue()}</>;
				},
			},
			{
				header: "Email",
				size: 200,
				accessorKey: "email",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			// {
			// 	header: "Organization",
			// 	size: 200,
			// 	accessorKey: "organization.name",
			// 	typeFilter: "includesMultipleFilter",
			// 	enableEditing: false,
			// },
			{
				header: "Department",
				size: 180,
				accessorKey: "department.name",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			{
				header: "Status",
				size: 160,
				accessorKey: "status",
				typeFilter: "includesMultipleFilter",
				enableEditing: activities.hasOwnProperty("account_list_edit"),
				muiTableBodyCellProps: {
					sx: {
						padding: ".25rem .5rem .4rem .5rem !important",
					},
				},
				Filter: ({ header }) => {
					return (
						<TextField
							fullWidth
							size="small"
							name="status"
							select
							variant="outlined"
							value={header.column.getFilterValue()}
							onChange={(e) => {
								header.column.setFilterValue(e.target.value);
							}}
						>
							<MenuItem value={""}>All</MenuItem>
							{map(LIST_STATUS, ({ label, value, color }) => (
								<MenuItem key={value} value={value}>
									<Typography color={color} variant="inherit">
										{label}
									</Typography>
								</MenuItem>
							))}
						</TextField>
					);
				},
				filterFn: (row, _columnIds, filterValue) =>
					isEmpty(filterValue)
						? true
						: !isEmpty(
								equalStringFilter({
									data: [row?.original],
									field: _columnIds,
									value: filterValue === "active" ? true : false,
								})
						  ),
				Cell: ({ cell }) => (
					<>
						{cell.getValue() ? (
							<Typography color={"success.main"} variant="inherit">
								Active
							</Typography>
						) : (
							<Typography color={"error.main"} variant="inherit">
								Deactive
							</Typography>
						)}
					</>
				),
				Edit: ({ cell, row }) => {
					return (
						<TextField
							fullWidth
							size="medium"
							name="status"
							select
							variant="standard"
							value={cell.getValue() ? "active" : "deactive"}
							onChange={(e) => {
								activities.hasOwnProperty("account_list_edit") &&
									onUpdateAccount({
										data: { ...row?.original, status: e.target.value === "active" ? true : false },
										rowID: row.id,
										field: "status",
										value: e.target.value === "active" ? true : false,
									});
							}}
						>
							{map(LIST_STATUS, ({ label, value, color }) => (
								<MenuItem key={value} value={value}>
									<Typography color={color} variant="inherit">
										{label}
									</Typography>
								</MenuItem>
							))}
						</TextField>
					);
				},
			},
			{
				Header: () => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Link to={PATH.GROUP_PERMISSION} style={{ marginRight: "5px" }}>
							Role
						</Link>
						<ToolTip title="Click hyperlink to view Group Permission" placement="top-start" />
					</Box>
				),
				header: "Role",
				size: 160,
				accessorKey: "role.code",
				typeFilter: "includesMultipleFilter",
				enableEditing: activities.hasOwnProperty("account_list_edit"),
				Cell: ({ row }) => <>{row?.original?.role?.name}</>,
				Edit: ({ row }) => {
					return (
						<TextField
							fullWidth
							size="medium"
							name="status"
							select
							variant="standard"
							value={row?.original?.role?.id}
							onChange={(e) => {
								onAddUserToRole({
									role_pk: e.target.value,
									user_ids: [row?.original?.id],
								});
							}}
						>
							{map(dataRoles?.data?.items, ({ name, id }) => (
								<MenuItem key={id} value={id}>
									<Typography variant="inherit">{name}</Typography>
								</MenuItem>
							))}
						</TextField>
					);
				},
			},
			{
				header: "Line Manager",
				size: 200,
				accessorKey: "manager.full_name",
				typeFilter: "includesMultipleFilter",
				enableEditing: activities.hasOwnProperty("account_list_edit"),
				Cell: ({ cell }) => <>{cell.getValue()}</>,
				Edit: ({ cell, row }) => {
					return (
						<TextField
							fullWidth
							size="medium"
							name="status"
							select
							variant="standard"
							value={row?.original?.manager?.id}
							onChange={(e) => {
								const managerDraft = keyBy(dataDepartment?.data?.departments, "id")[
									row?.original?.department?.id
								]?.managers.find((item) => item.id === e.target.value);
								activities.hasOwnProperty("account_list_edit") &&
									onUpdateAccount({
										data: {
											...row?.original,
											manager: managerDraft,
										},
										rowID: row.id,
										field: "manager",
										value: managerDraft,
									});
							}}
						>
							{map(
								keyBy(dataDepartment?.data?.departments, "id")[row?.original?.department?.id]
									?.managers,
								({ id, first_name, last_name }) => (
									<MenuItem key={id} value={id}>
										<Typography variant="inherit">{`${last_name} ${first_name}`}</Typography>
									</MenuItem>
								)
							)}
						</TextField>
					);
				},
			},
			{
				header: "Created time",
				size: 200,
				accessorKey: "created_at",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ cell }) => (
					<>{cell.getValue() ? formatDateToString(cell.getValue(), FORMAT_DATE) : "-"}</>
				),
			},
			{
				header: "Created by",
				size: 200,
				accessorKey: "created_by.full_name",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			{
				header: "Approved time",
				size: 200,
				accessorKey: "updated_at",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ cell }) => (
					<>{cell.getValue() ? formatDateToString(cell.getValue(), FORMAT_DATE) : "-"}</>
				),
			},
			{
				header: "Approved by",
				size: 200,
				accessorKey: "approve_by.full_name",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			{
				header: "Action",
				size: 60,
				accessorKey: "action",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				enableColumnDragging: false,
				enableColumnFilter: false,
				enableColumnOrdering: false,
				enableColumnActions: false,
				muiTableBodyCellProps: {
					sx: {
						textAlign: "center",
					},
				},
				Cell: ({ row }) => (
					<Button
						variant="text"
						sx={{
							padding: 0,
							minWidth: "40px",
						}}
						disabled={!activities.hasOwnProperty("account_edit")}
						onClick={() => {
							activities.hasOwnProperty("account_edit") && setDataAccount(row.original);
							activities.hasOwnProperty("account_edit") && setOpen(true);
							activities.hasOwnProperty("account_edit") && setEdit(true);
						}}
					>
						<CreateOutlinedIcon
							sx={{
								cursor: "pointer",
							}}
						/>
					</Button>
				),
			},
		],
		[activities, dataRoles, dataDepartment]
	);

	const formik = useFormik({
		initialValues: {
			items: [],
			total: 0,
		},
		onSubmit: (values) => {
			console.log("values", values);
		},
	});

	const formatFilter = useCallback(
		(params, mail) => {
			if (mail && isFirst) {
				return JSON.stringify([{ field: "email", op: "==", value: email }]);
			}
			if (params.searchBy && params.searchByValue) {
				return JSON.stringify([
					{ field: params.searchBy, op: "ilike", value: `%${params.searchByValue}%` },
				]);
			}
			return [];
		},
		[isFirst]
	);

	const { isFetching: isLoading, refetch } = useQuery(
		[`user-accounts-listing-${JSON.stringify(mergeParams)}`, mergeParams],
		() =>
			getUserAccountsList({
				...mergeParams,
				page: mergeParams.page + 1,
				q: "''",
				filter: formatFilter(mergeParams, email),
				sortBy: [],
				descending: [],
			}),
		{
			onSuccess: (data) => {
				isFirst && setFirst(false);
				formik.setValues((values) => ({
					...values,
					...data.data,
				}));
			},
			keepPreviousData: true,
		}
	);

	const [open, setOpen] = useState<boolean>(false);
	const [isEdit, setEdit] = useState<boolean>(false);
	const [dataAccount, setDataAccount] = useState<any>({});
	const [loading, setLoading] = useState<boolean>(false);

	const { mutate: onUpdateAccount } = useMutation(
		async ({
			data,
			rowID = "",
			field = "",
			value = "",
		}: {
			data: any;
			rowID?: string;
			field?: string;
			value?: any;
		}) => {
			setLoading(true);
			try {
				const response: any = await updateAccount({
					...formatPayloadAccount(data),
					id: data.id,
				});
				if (response?.status !== 200) {
					toastOptions("error", `Update ${field ? field : "account"} error`);
					setLoading(false);
					return false;
				} else {
					toastOptions("success", `Update ${field ? field : "account"} success!`);
					setLoading(false);
					if (rowID && field && value) {
						formik.setFieldValue(`items[${rowID}].${field}`, value);
					} else {
						const itemUpdate = formik.values.items.findIndex((item) => item.id === data.id);
						formik.setFieldValue(`items[${itemUpdate}]`, data);
						setOpen(false);
						setDataAccount({});
					}
					return true;
				}
			} catch (error) {
				toastOptions("error", `Update ${field ? field : "account"} error`);
				setLoading(false);
				return false;
			}
		}
	);

	const { mutate: register } = useMutation(async (data: any) => {
		setLoading(true);
		try {
			const response: any = await adminCreateAccount({
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				department_id: data.department.id,
				role_id: data.role.id,
				manager_id: data.manager.id,
			});
			console.log('nbt register api done')

			if (response?.status !== 200) {
				toastOptions("error", "Create account successfully");
				setLoading(false);
				return false;
			} else {
				toastOptions("success", response?.message || "Create account error");
				setLoading(false);
				setOpen(false);
				refetch();
				return true;
			}
		} catch (error) {
			toastOptions("error", error?.message || "Create account error");
			setLoading(false);
			return false;
		}
	});
	const [columnPinning, setColumnPinning] = useState<any>({
		left: [],
		right: ["action"],
	});

	return (
		<>
			<Skeleton isLoading={isLoading || isLoadingRoles || isLoadingDepartment}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item sm={12}>
						<BoxLoading loading={loading}>
							<MuiTable
								columns={columns}
								data={formik.values?.items || []}
								enableRowNumbers={true}
								rowNumberMode="original"
								pagination={{
									...getPagination({ rowsPerPage: itemsPerPage, page }),
									total: formik.values?.total || 0,
									onPageChange: handleOnPageChange,
									onRowsPerPageChange: handleOnRowsPerPageChange,
								}}
								editingMode="table"
								enableEditing
								state={{
									columnPinning: columnPinning,
								}}
								onColumnPinningChange={setColumnPinning}
								renderTopToolbarCustomActions={() => (
									<AccountsTabSearch
										onSearch={handleOnSearch}
										setOpen={setOpen}
										activities={activities}
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
			{open && (
				<BasicDialog
					open={open}
					disabledBackdropClick
					handleClose={() => {
						setDataAccount({});
						setOpen(false);
						setEdit(false);
					}}
					onClose={false}
					PaperProps={{
						sx: {
							maxWidth: "400px",
							margin: "15px",
							width: "100%",
							// background: "#F2F1FA",
						},
					}}
				>
					<PopupAccount
						onClose={() => {
							setOpen(false);
							setEdit(false);
							setDataAccount({});
						}}
						loading={loading}
						title={isEdit ? "Edit" : "Create"}
						onSubmit={(value) => (isEdit ? onUpdateAccount({ data: value }) : register(value))}
						isEdit={isEdit}
						data={dataAccount}
						dataRoles={dataRoles?.data?.items || []}
						dataDepartment={dataDepartment?.data?.departments || []}
					/>
				</BasicDialog>
			)}
		</>
	);
};
