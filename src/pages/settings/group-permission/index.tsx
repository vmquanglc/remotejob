import React, { ChangeEvent, useMemo, MouseEvent, useState, useCallback } from "react";
import {
	Container,
	Paper,
	Box,
	Grid,
	Tab,
	Typography,
	Chip,
	Popover,
	List,
	MenuItem,
	Button,
} from "@mui/material";
import { clone, delay, map, mergeWith, pick } from "lodash";
import { MuiTable } from "src/components/mui-table";
import { useQuery } from "react-query";
import { useSearchParams } from "src/hooks/use-search-params";
import { PAGINATION, PATH } from "src/constants";
import { useFormik } from "formik";
import { getPagination } from "src/utils/pagination";
import { Link } from "react-router-dom";
import { ToolTip } from "src/components/tooltip";
import { GroupPermissionSearch } from "./group-permission-search";
import BasicDialog from "src/components/modal";
import { AdjustRole } from "./adjust-role";
import { DotsVertical } from "src/components/icons/dots-vertical";
import { AdjustAccountsInRole } from "./adjust-account-in-role";
import { getListRoles } from "src/services/accounts-list";
import { formatFilter } from "src/utils/common";
import { PrivateRouter } from "src/components/private-router";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";

const GroupPermission = () => {
	const activities = useSelector(selectActivities);
	const [params, setParams]: any = useSearchParams({
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
		setParams({ page: newPage, itemsPerPage: params?.size || PAGINATION.PAGE_SIZE });
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

	const columns = useMemo(
		() => [
			{
				header: "Code",
				size: 200,
				accessorKey: "code",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Role",
				size: 200,
				accessorKey: "name",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => (
					<>
						<Chip label={cell.getValue()} variant="outlined" color="primary" />
					</>
				),
			},
			{
				header: "Description",
				size: 250,
				accessorKey: "description",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => (
					<Box
						sx={{
							cursor: "pointer",
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
							overflow: "hidden",
							transition: "all 1.5s ease",
							maxHeight: "20px",
							"&:hover": {
								whiteSpace: "normal",
								transition: "all 1.5s ease",
								maxHeight: "200px",
							},
						}}
					>
						{cell.getValue()}
					</Box>
				),
			},
			{
				Header: () => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Link to={PATH.ACTIVITIES_LIST} style={{ marginRight: "5px" }}>
							Permission Activity
						</Link>
						<ToolTip title={"Click hyperlink to view Activities list"} placement="top-start" />
					</Box>
				),
				header: "Permission Activity",
				size: 220,
				accessorKey: "permissionActivity",
				typeFilter: "includesMultipleFilter",
				Cell: ({ row }) => (
					<Chip
						label="Activities in detail"
						variant="outlined"
						color="info"
						sx={{ textDecoration: "underline" }}
						onClick={() => {
							setPermissionState({
								isOpen: true,
								isView: true,
								data: row.original,
							});
						}}
					/>
				),
			},
			{
				Header: () => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Link to={PATH.ACCOUNT_LIST} style={{ marginRight: "5px" }}>
							Accounts
						</Link>
						<ToolTip title={"Click hyperlink to view Accounts list"} placement="top-start" />
					</Box>
				),
				header: "Accounts",
				size: 180,
				accessorKey: "accounts",
				typeFilter: "includesMultipleFilter",
				Cell: ({ row }) => (
					<Chip
						label="Accounts list"
						variant="outlined"
						color="info"
						sx={{ textDecoration: "underline" }}
						onClick={() => {
							setAccountsState({
								isOpen: true,
								isView: true,
								data: row.original,
							});
						}}
					/>
				),
			},
			{
				header: "Action",
				size: 60,
				accessorKey: "action",
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
				Cell: ({ row }) => (
					<>
						<ColumnAction
							setPermissionState={setPermissionState}
							setAccountsState={setAccountsState}
							row={row}
						/>
					</>
				),
			},
		],
		[activities]
	);

	const formik = useFormik({
		initialValues: {
			items: [],
			total: 0,
		},
		onSubmit: () => {},
	});

	const {
		data,
		isFetching: isLoading,
		refetch,
	} = useQuery(
		[`sign-up-listing-${JSON.stringify(mergeParams)}`, mergeParams],
		() =>
			getListRoles({
				page: mergeParams.page + 1,
				itemsPerPage: mergeParams.itemsPerPage,
				q: "''",
				filter: formatFilter(mergeParams),
				sortBy: [],
				descending: [],
			}),
		{
			onSuccess: (data) => {
				formik.setValues({
					items: data?.data?.items,
					total: data?.data?.total,
				});
			},
			keepPreviousData: true,
		}
	);

	const onUpdateListing = (value) => {
		const idxItem = formik.values.items.findIndex((item) => item.id === value.id);
		formik.setFieldValue(`items[${idxItem}].name`, value.name);
		formik.setFieldValue(`items[${idxItem}].description`, value.description);
	};

	// control permission popup
	interface IPermissionState {
		isOpen: boolean;
		isView: boolean;
		data: any;
	}
	const [permissionState, setPermissionState] = useState<IPermissionState>({
		isOpen: false,
		isView: true,
		data: {},
	});

	//control accounts popup
	interface IAccountsState {
		isOpen: boolean;
		isView: boolean;
		data: any;
	}

	const [accountState, setAccountsState] = useState<IAccountsState>({
		isOpen: false,
		isView: false,
		data: {},
	});

	const [columnPinning, setColumnPinning] = useState<any>({
		left: [],
		right: ["action"],
	});

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<Paper sx={{ p: 2, mb: 2 }}>
					<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								{"Group Permission"}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<MuiTable
								columns={columns}
								data={formik.values.items || []}
								loading={isLoading}
								enableRowNumbers={true}
								rowNumberMode="original"
								pagination={{
									...getPagination({ rowsPerPage: itemsPerPage, page }),
									total: formik.values.total || 0,
									onPageChange: handleOnPageChange,
									onRowsPerPageChange: handleOnRowsPerPageChange,
								}}
								onColumnPinningChange={setColumnPinning}
								state={{
									columnPinning: columnPinning,
								}}
								renderTopToolbarCustomActions={() => (
									<GroupPermissionSearch
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
				</Paper>
			</Box>
			{permissionState.isOpen && (
				<BasicDialog
					disabledBackdropClick
					open={permissionState.isOpen}
					handleClose={() =>
						setPermissionState((per) => ({
							...per,
							isOpen: false,
						}))
					}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							background: "#F2F1FA",
						},
					}}
				>
					<AdjustRole
						onUpdateListing={onUpdateListing}
						refetchListing={refetch}
						onClose={() => {
							setPermissionState((per) => ({
								...per,
								isOpen: false,
							}));
						}}
						data={permissionState.data}
						isView={permissionState.isView}
					/>
				</BasicDialog>
			)}
			{accountState.isOpen && (
				<BasicDialog
					disabledBackdropClick
					open={accountState.isOpen}
					handleClose={() =>
						setAccountsState((acc) => ({
							...acc,
							isOpen: false,
						}))
					}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							minWidth: "900px",
						},
					}}
				>
					<AdjustAccountsInRole
						onClose={() => {
							setAccountsState((acc) => ({
								...acc,
								isOpen: false,
							}));
						}}
						refetchListing={refetch}
						role={accountState.data}
						isView={accountState.isView}
						activities={activities}
					/>
				</BasicDialog>
			)}
		</Container>
	);
};

export default PrivateRouter(GroupPermission, "role_list_view");

const ColumnAction = ({ setPermissionState, setAccountsState, row }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const activities = useSelector(selectActivities);
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	return (
		<>
			<span onClick={handleClick} style={{ cursor: "pointer" }}>
				<DotsVertical style={{ fontSize: 14 }} />
			</span>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				<List>
					<MenuItem
						key="edit"
						disabled={
							!(
								activities?.hasOwnProperty("info_edit_in_role") ||
								activities?.hasOwnProperty("permission_edit_in_role")
							) || row?.original?.code === "admin"
						}
						onClick={() => {
							(activities?.hasOwnProperty("info_edit_in_role") ||
								activities?.hasOwnProperty("permission_edit_in_role")) &&
								setPermissionState({
									isOpen: true,
									isView: false,
									data: row.original,
								});
							handleClose();
						}}
					>
						Edit
					</MenuItem>
					<MenuItem
						key="add"
						disabled={!activities?.hasOwnProperty("account_add_into_role")}
						onClick={() => {
							activities?.hasOwnProperty("account_add_into_role") &&
								setAccountsState({
									isOpen: true,
									isView: false,
									data: row.original,
								});
							handleClose();
						}}
					>
						Add account
					</MenuItem>
				</List>
			</Popover>
		</>
	);
};
