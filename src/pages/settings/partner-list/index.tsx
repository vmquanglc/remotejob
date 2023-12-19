import React, { ChangeEvent, useMemo, MouseEvent, useState } from "react";
import {
	Container,
	Paper,
	Box,
	Grid,
	Tab,
	Button,
	Typography,
	Chip,
	Popover,
	List,
	MenuItem,
} from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import { MuiTable } from "src/components/mui-table";
import { useQuery } from "react-query";
import { useSearchParams } from "src/hooks/use-search-params";
import { PAGINATION, PATH } from "src/constants";
import { getPartnerListing } from "src/services/settings-page";
import { useFormik } from "formik";
import { getPagination } from "src/utils/pagination";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import { ToolTip } from "src/components/tooltip";
import { PartnerSearch } from "./partner-listing-search";
import { PartnerBreadcrumbs } from "./partner-breadcrums";
import { DotsVertical } from "src/components/icons/dots-vertical";
import BasicDialog from "src/components/modal";
import { AdjustAccountsInPartner } from "./adjust-account-in-partner";
import { AdjustPartner } from "./adjust-partner";
import { AddConditions } from "./add-conditions";

export const PartnerList = () => {
	const [params, setParams]: any = useSearchParams({
		size: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});

	const mergeParams = mergeWith(
		{
			size: PAGINATION.PAGE_SIZE,
			page: PAGINATION.PAGE,
		},
		clone(params)
	);

	const { searchBy, searchByValue } = pick(params, ["searchBy", "searchByValue"]);

	const { size, page } = pick(params, ["size", "page"]);

	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams({ page: newPage, size: params?.size || PAGINATION.PAGE_SIZE });
	};

	const handleOnSearch = (values) => {
		setParams({
			page: PAGINATION.PAGE,
			size: params?.size || PAGINATION.PAGE_SIZE,
			...values,
		});
	};

	const handleOnRowsPerPageChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setParams({
			size: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		});
	};

	const columns = useMemo(
		() => [
			{
				header: "Code",
				size: 140,
				accessorKey: "code",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Partner name",
				size: 200,
				accessorKey: "partnerName",
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
				accessorKey: "desc",
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
						<Link to={PATH.ACCOUNT_LIST} style={{ marginRight: "5px" }}>
							Assigned accounts
						</Link>
						<ToolTip title={"Click hyperlink to view Accounts list"} placement="top-start" />
					</Box>
				),
				header: "Assigned accounts",
				size: 240,
				accessorKey: "accounts",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell, row }) =>
					cell.getValue().length ? (
						<Chip
							label="View accounts list"
							variant="outlined"
							color="info"
							onClick={() => {
								setStatePopup({
									isOpen: true,
									type: "viewAccounts",
									data: row.original,
								});
							}}
						/>
					) : (
						<Chip label="Not yet" variant="outlined" disabled />
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
				Cell: ({ row }) => <ColumnAction setStatePopup={setStatePopup} row={row} />,
			},
		],
		[]
	);

	const formik = useFormik({
		initialValues: {
			details: [],
			totalItems: 0,
		},
		onSubmit: (values) => {
			console.log("values", values);
		},
	});

	const { isFetching: isLoading, refetch } = useQuery(
		[`partner-listing-${JSON.stringify(mergeParams)}`, mergeParams],
		() => getPartnerListing(mergeParams),
		{
			onSuccess: (data) => {
				formik.setValues((values) => ({
					...values,
					details: data.data,
					totalItems: data.totalItems,
				}));
			},
			keepPreviousData: true,
		}
	);

	interface IStatePopup {
		isOpen: boolean;
		type:
			| "createOrg"
			| "editOrg"
			| "viewAccounts"
			| "addAccounts"
			| "delete"
			| "addConditions"
			| "";
		data: any;
	}

	const [statePopup, setStatePopup] = useState<IStatePopup>({
		isOpen: false,
		type: "",
		data: {},
	});

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<PartnerBreadcrumbs id={"Organizations"} />
				<Paper sx={{ p: 2, mb: 2 }}>
					<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								{"Organizations"}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<MuiTable
								columns={columns}
								data={formik?.values?.details || []}
								enableRowNumbers={true}
								rowNumberMode="original"
								pagination={{
									...getPagination({ rowsPerPage: size, page }),
									total: formik.values.totalItems || 0,
									onPageChange: handleOnPageChange,
									onRowsPerPageChange: handleOnRowsPerPageChange,
								}}
								state={{
									columnPinning: {
										right: ["action"],
									},
								}}
								renderTopToolbarCustomActions={() => (
									<PartnerSearch
										onSearch={handleOnSearch}
										setOpen={() => {
											setStatePopup({
												isOpen: true,
												type: "createOrg",
												data: {},
											});
										}}
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
			{statePopup.isOpen &&
				(statePopup.type === "addAccounts" || statePopup.type === "viewAccounts") && (
					<BasicDialog
						disabledBackdropClick
						open={
							statePopup.isOpen &&
							(statePopup.type === "addAccounts" || statePopup.type === "viewAccounts")
						}
						handleClose={() =>
							setStatePopup({
								isOpen: false,
								type: "",
								data: {},
							})
						}
						PaperProps={{
							sx: {
								margin: "15px",
								width: "100%",
								minWidth: "850px",
							},
						}}
					>
						<AdjustAccountsInPartner
							onClose={() => {
								setStatePopup({
									isOpen: false,
									type: "",
									data: {},
								});
							}}
							partnerName={statePopup.data.partnerName}
							accountsList={statePopup.data.accounts}
							type={statePopup.type}
						/>
					</BasicDialog>
				)}
			{statePopup.isOpen && (statePopup.type === "createOrg" || statePopup.type === "editOrg") && (
				<BasicDialog
					disabledBackdropClick
					open={
						statePopup.isOpen && (statePopup.type === "createOrg" || statePopup.type === "editOrg")
					}
					handleClose={() =>
						setStatePopup({
							isOpen: false,
							type: "",
							data: {},
						})
					}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							background: "#F2F1FA",
						},
					}}
				>
					<AdjustPartner
						isCreate={statePopup.type === "createOrg"}
						data={statePopup.data}
						onClose={() => {
							setStatePopup({
								isOpen: false,
								type: "",
								data: {},
							});
						}}
					/>
				</BasicDialog>
			)}
			{statePopup.isOpen && statePopup.type === "delete" && (
				<BasicDialog
					disabledBackdropClick
					open={statePopup.isOpen && statePopup.type === "delete"}
					handleClose={() =>
						setStatePopup({
							isOpen: false,
							type: "",
							data: {},
						})
					}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							background: "#F2F1FA",
						},
					}}
				>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="h6">Delete account</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1"> This action cannot be reverted.</Typography>
						</Grid>
						<Grid item xs={12} sm={12} textAlign="right">
							<Button
								variant="contained"
								type="button"
								size="medium"
								sx={{
									mr: 1,
								}}
								onClick={() => console.log("account delete", statePopup.data.partnerName)}
							>
								Delete
							</Button>
							<Button
								variant="outlined"
								type="button"
								size="medium"
								onClick={() => {
									setStatePopup({
										isOpen: false,
										type: "",
										data: {},
									});
								}}
							>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</BasicDialog>
			)}
			{statePopup.isOpen && statePopup.type === "addConditions" && (
				<BasicDialog
					open={statePopup.isOpen && statePopup.type === "addConditions"}
					handleClose={() =>
						setStatePopup({
							isOpen: false,
							type: "",
							data: {},
						})
					}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							minWidth: "750px",
							minHeight: "250px",
						},
					}}
				>
					<AddConditions
						onClose={() => {
							setStatePopup({
								isOpen: false,
								type: "",
								data: {},
							});
						}}
						partnerName={statePopup.data.partnerName}
					/>
				</BasicDialog>
			)}
		</Container>
	);
};

const ColumnAction = ({ setStatePopup, row }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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
						onClick={() => {
							setStatePopup({
								isOpen: true,
								type: "editOrg",
								data: row.original,
							});
							handleClose();
						}}
					>
						Edit
					</MenuItem>
					<MenuItem
						key="add"
						onClick={() => {
							setStatePopup({
								isOpen: true,
								type: "addAccounts",
								data: row.original,
							});
							handleClose();
						}}
					>
						Add Account
					</MenuItem>
					<MenuItem
						key="setup"
						onClick={() => {
							setStatePopup({
								isOpen: true,
								type: "addConditions",
								data: row.original,
							});
							handleClose();
						}}
					>
						Setup Condition
					</MenuItem>
					<MenuItem
						key="delete"
						onClick={() => {
							setStatePopup({
								isOpen: true,
								type: "delete",
								data: row.original,
							});
							handleClose();
						}}
					>
						Delete
					</MenuItem>
				</List>
			</Popover>
		</>
	);
};
