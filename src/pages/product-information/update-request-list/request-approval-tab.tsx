import { Box, Breadcrumbs, Button, Grid, Link, Typography, styled } from "@mui/material";
import React, {
	ChangeEvent,
	useMemo,
	MouseEvent,
	useState,
	useEffect,
	useLayoutEffect,
} from "react";
import { useMutation, useQuery } from "react-query";
import { MuiTable } from "src/components/mui-table";
import { BoxLoading } from "src/components/box-loading";
import { Skeleton } from "src/components/skeleton";
import {
	getDetailRequest,
	getRequestApproval,
} from "src/services/product-info/update-requests-list.services";
import { RequestApprovalTabSearch } from "./request-approval-search";
import { PAGINATION } from "src/constants";
import { clone, mergeWith, omit, pick } from "lodash";
import { getPagination } from "src/utils/pagination";
import { useFormik } from "formik";
import { SKUInfoChange } from "src/pages/product-information/sku-info-change";
import { useSelector } from "react-redux";
import { selectRoleAccount } from "src/store/auth/selectors";
import {
	getCategoryTree,
	getInputData,
	requestUpdateMarketPlace,
	requestUpdateRecord,
	requestUpdateSKUInfo,
} from "src/services/product-info/productInfo.services";
import { ERole } from "src/interface/groupPermission.interface";
import { convertTimeToGMT7 } from "src/utils/date";
import { DecideRequestPopup } from "./decide-request-popup";
import { MarketPlaceChange, mappingTitle } from "../market-place-change";
import { RecordChange } from "../record-change";
import { toastOptions } from "src/components/toast/toast.options";
import { MAP_LABEL_REQUEST } from "src/constants/productInfo.constant";
import { PrivateRouter } from "src/components/private-router";

const RequestApprovalTab = ({ id, setParamsUrls, activities }) => {
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
	const {
		data,
		isLoading: isLoading,
		isFetching: isFetching,
		refetch,
	} = useQuery(
		[`request-approval-listing-${JSON.stringify(mergeParams)}`],
		() =>
			getRequestApproval({
				page: mergeParams.page + 1,
				itemsPerPage: mergeParams.itemsPerPage,
				q: "''",
				filter: [],
				sortBy: JSON.stringify([{ field: "created_at", direction: "desc" }]),
				descending: [],
				...formatParams(mergeParams),
			}),
		{
			keepPreviousData: true,
			enabled: !!activities?.hasOwnProperty("pi_request_list_view"),
		}
	);

	enum ETypeRequest {
		sku = "sku",
		record = "record",
		market_place_id = "market_place_id",
	}
	interface IStateDetails {
		isView: boolean;
		isLoading: boolean;
		id: number | string;
		type: ETypeRequest | null;
	}
	const [stateDetails, setStateDetails] = useState<IStateDetails>({
		isView: id ? true : false,
		isLoading: id ? true : false,
		id: id || null,
		type: null,
	});

	const {
		data: categoryTree,
		isLoading: isLoadingCate,
		isFetching: isFetchingCate,
	} = useQuery(
		[`get-category-tree`],
		async () => {
			try {
				const response = await getCategoryTree();
				if (response.status === 200) {
					return formatCateTree(response.data);
				}
				return undefined;
			} catch (error) {
				return undefined;
			}
		},
		{
			keepPreviousData: true,
			enabled: !!stateDetails.type && stateDetails.type === ETypeRequest.sku,
		}
	);

	const { data: dataInput, isLoading: isLoadingInputData } = useQuery(
		[`get-input-data`],
		() => getInputData(),
		{
			keepPreviousData: true,
			enabled: !!stateDetails.type && stateDetails.type === ETypeRequest.sku,
		}
	);

	const formatCateTree = (arr) => {
		return arr.reduce((obj, item) => {
			obj[item.id] = {
				...item,
				children: item.children.length ? formatCateTree(item.children) : {},
			};
			return obj;
		}, {});
	};

	const columns = useMemo(() => {
		return [
			{
				header: "Request",
				size: 240,
				accessorKey: "name",
				enableEditing: false,
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell, row }) => (
					<>
						{activities?.hasOwnProperty("pi_a_request_view") ? (
							<Button
								variant="text"
								sx={{
									color: "info.main",
									textDecoration: "underline",
									textUnderlinePosition: "under",
									px: "5px",
								}}
								onClick={() => {
									setStateDetails({
										isView: true,
										id: row?.original?.id,
										type: null,
										isLoading: true,
									});
								}}
							>
								{cell.getValue()}
							</Button>
						) : (
							<>{cell.getValue()}</>
						)}
					</>
				),
			},
			{
				header: "Type",
				size: 160,
				accessorKey: "type",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ cell }) => <>{MAP_LABEL_REQUEST[cell.getValue()]}</>,
			},
			{
				header: "SKU",
				size: 140,
				accessorKey: "additional_data.sku",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			{
				header: "UPC",
				size: 140,
				accessorKey: "additional_data.upc",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			{
				header: "Market place ID",
				size: 180,
				accessorKey: "additional_data.market_place_id",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			{
				header: "Request time",
				size: 160,
				accessorKey: "created_at",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ cell }) => <>{convertTimeToGMT7(cell.getValue())}</>,
			},
			{
				header: "Sales",
				size: 140,
				accessorKey: "created_by.email",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
			{
				header: "Sales Manager",
				size: 180,
				accessorKey: "created_by.manager.email",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
			},
		];
	}, [activities]);

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

	//control state details'

	const formik = useFormik({
		initialValues: {
			id: "",
			type: "",
			product_name: "",
			details: {
				product_update_request: {
					type_market_place: {
						update_data: {
							rrp: "",
							product_type: "",
						},
					},
					type_sku: {
						update_data: {
							sku: {},
						},
					},
					type_record: {
						update_data: {
							cost_to_market_place: "",
						},
					},
				},
			},
			sku: {
				category: {
					relative_last_category: {
						id: "",
					},
				},
				sell_type: "",
				life_cycle: "",
				order_proccessing_lead_time: "",
				international_transportation_lead_time: "",
				domestic_lead_time: "",
			},
			rrp: "",
			product_type: "",
			cost_to_market_place: "",
		},
		onSubmit: (value) => {
			value.type === ETypeRequest.sku &&
				onRequestUpdateSKU({
					sku_id: value.id,
					category_id: value.sku.category?.relative_last_category?.id,
					sell_type: value.sku.sell_type,
					life_cycle: value.sku.life_cycle,
					order_proccessing_lead_time: Number(value.sku.order_proccessing_lead_time),
					international_transportation_lead_time: Number(
						value.sku.international_transportation_lead_time
					),
					domestic_lead_time: Number(value.sku.domestic_lead_time),
				});

			value.type === ETypeRequest.market_place_id &&
				onRequestUpdateMarketPlace({
					sku_id: value.id,
					product_type: value.product_type,
					rrp: value.rrp,
				});

			value.type === ETypeRequest.record &&
				onRequestUpdateRecord({
					sku_id: value.id,
					cost_to_market_place: value.cost_to_market_place,
				});
			setEdit(false);
		},
	});
	const [selectedRows, setSelectedRows] = useState<any>({});
	const [isEdit, setEdit] = useState<boolean>(false);

	const [stateDecide, setStateDecide] = useState<{
		isOpen: boolean;
		isApproved: boolean;
	}>({
		isOpen: false,
		isApproved: false,
	});
	const [dataDecide, setDataDecide] = useState<any>({});
	const [timestampSelected, setTimestampSelected] = useState<number>(0);
	useEffect(() => {
		if (timestampSelected > 0) {
			const IdsSelected = Object.keys(selectedRows);
			const IdsExisted = Object.keys(dataDecide);
			if (IdsSelected.length > IdsExisted.length) {
				const newIDs = IdsSelected.filter((el) => !IdsExisted.includes(el));
				const newItems = data?.data?.items.reduce((obj, item) => {
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
	}, [timestampSelected, data]);

	const getInfo = async (id) => {
		const res = await getDetailRequest(id);
		if (res.status === 200) {
			setStateDetails((state) => ({
				...state,
				isLoading: false,
				type: res?.data?.type,
			}));
			formik.setValues({
				id: res?.data?.additional_data?.product_id,
				type: res?.data?.type,
				product_name: res?.data?.name,
				details: {
					...res?.data?.additional_data,
					product_update_request: {
						type_record: res?.data?.type === ETypeRequest.record ? res?.data : {},
						type_market_place: res?.data?.type === ETypeRequest.market_place_id ? res?.data : {},
						type_sku: res?.data?.type === ETypeRequest.sku ? res?.data : {},
					},
					sku: res?.data?.type === ETypeRequest.sku ? res?.data?.original_data : {},
					rrp:
						res?.data?.type === ETypeRequest.market_place_id ? res?.data?.original_data?.rrp : {},
					product_type:
						res?.data?.type === ETypeRequest.market_place_id
							? res?.data?.original_data?.product_type
							: {},
					cost_to_market_place:
						res?.data?.type === ETypeRequest.record
							? res?.data?.original_data?.cost_to_market_place
							: {},
				},
				sku: res?.data?.type === ETypeRequest.sku ? res?.data?.update_data : {},
				rrp: res?.data?.type === ETypeRequest.market_place_id ? res?.data?.update_data?.rrp : {},
				product_type:
					res?.data?.type === ETypeRequest.market_place_id
						? res?.data?.update_data?.product_type
						: {},
				cost_to_market_place:
					res?.data?.type === ETypeRequest.record
						? res?.data?.update_data?.cost_to_market_place
						: {},
			});
			setDataDecide({
				[res?.data?.id]: {
					id: res?.data?.id,
					name: res?.data?.name,
					reason: "",
				},
			});
		} else {
			setStateDetails({
				isView: false,
				isLoading: false,
				id: null,
				type: null,
			});
			toastOptions("error", "Request not exist");
			setParamsUrls({ id: undefined });
		}
	};

	useLayoutEffect(() => {
		if (stateDetails.id) {
			getInfo(stateDetails.id);
		}
	}, [stateDetails.id]);

	const { mutate: onRequestUpdateSKU, isLoading: isLoadingRequest } = useMutation(
		async (data: any) => {
			try {
				const response: any = await requestUpdateSKUInfo(data);
				if (response?.status !== 200) {
					toastOptions("error", "Request update error");
					handleCancelChange();
					return false;
				} else {
					toastOptions("success", "Request update success");
					getInfo(stateDetails.id);
					refetch();
					return true;
				}
			} catch (error) {
				toastOptions("error", "Request update error");
				handleCancelChange();
				return false;
			}
		}
	);

	const { mutate: onRequestUpdateMarketPlace, isLoading: isLoadingMarketPlace } = useMutation(
		async (data: any) => {
			try {
				const response: any = await requestUpdateMarketPlace(data);
				if (response?.status !== 200) {
					toastOptions("error", "Request update error");
					handleCancelChange();
					return false;
				} else {
					toastOptions("success", "Request update success");
					getInfo(stateDetails.id);
					refetch();
					return true;
				}
			} catch (error) {
				toastOptions("error", "Request update error");
				handleCancelChange();
				return false;
			}
		}
	);

	const { mutate: onRequestUpdateRecord, isLoading: isLoadingRecord } = useMutation(
		async (data: any) => {
			try {
				const response: any = await requestUpdateRecord(data);
				if (response?.status !== 200) {
					toastOptions("error", "Request update error");
					handleCancelChange();
					return false;
				} else {
					toastOptions("success", "Request update success");
					getInfo(stateDetails.id);
					refetch();
					return true;
				}
			} catch (error) {
				toastOptions("error", "Request update error");
				handleCancelChange();
				return false;
			}
		}
	);

	const handleCancelChange = () => {
		formik.setFieldValue(
			"cost_to_market_place",
			formik.values.details?.product_update_request?.type_record?.update_data?.cost_to_market_place
		);
		formik.setFieldValue(
			"product_type",
			formik.values.details?.product_update_request?.type_market_place?.update_data?.product_type
		);
		formik.setFieldValue(
			"rrp",
			formik.values.details?.product_update_request?.type_market_place?.update_data?.rrp
		);
		formik.setFieldValue(
			"sku",
			formik.values.details?.product_update_request?.type_sku?.update_data
		);
	};

	if (stateDetails.isView && !!stateDetails.type && !!Object.keys(dataDecide).length) {
		return (
			<Skeleton isLoading={isLoadingInputData || isLoadingCate || stateDetails.isLoading}>
				<form onSubmit={formik.handleSubmit}>
					<BoxLoading loading={isLoadingRequest || isLoadingMarketPlace || isLoadingRecord}>
						<MuiBreadcrumbsRoot>
							<Breadcrumbs separator=">">
								<Link
									key={"request"}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setStateDetails({
											isView: false,
											isLoading: false,
											id: null,
											type: null,
										});
										setParamsUrls({ id: undefined });
									}}
									sx={{ textDecoration: "none" }}
								>
									<Typography variant="body1" color={(theme) => theme?.palette?.text?.secondary}>
										Request approval
									</Typography>
								</Link>
								<Typography variant="body1" color={(theme) => theme?.palette?.text?.primary}>
									{formik.values.product_name}
								</Typography>
							</Breadcrumbs>
						</MuiBreadcrumbsRoot>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12} sm={12}>
								{stateDetails.type === ETypeRequest.sku && (
									<>
										<Box
											sx={{
												padding: "8px 25px",
												color: "text.primary",
											}}
										>
											<Typography variant="body1" fontWeight="bold" sx={{ mb: "5px" }}>
												Updating will have an impact at the SKU level
											</Typography>
											<Typography variant="body1" fontSize={"12px"}>
												When{" "}
												<Box component="span" color="error.main">
													updating
												</Box>{" "}
												the{" "}
												<Box component="span" color="error.main">
													values
												</Box>{" "}
												of the fields{" "}
												<Box component="span" color="error.main">
													below, all other products
												</Box>{" "}
												with the{" "}
												<Box component="span" color="error.main">
													same SKU
												</Box>{" "}
												(regardless of their ASIN, Walmart ID, or Wayfair ID) will be affected
												accordingly.
												<br />
												Please consider carefully before proceeding with the updates!
											</Typography>
										</Box>
										<SKUInfoChange
											details={formik.values.details}
											formik={formik}
											isEditing={isEdit}
											role={role.code}
											isViewRequest={true}
											categoryTree={categoryTree}
											dataInput={dataInput}
										/>
									</>
								)}
								{stateDetails.type === ETypeRequest.market_place_id && (
									<>
										<Box
											sx={{
												padding: "8px 25px",
												color: "text.primary",
											}}
										>
											<Typography variant="body1" fontWeight="bold" sx={{ mb: "5px" }}>
												Updating will have an impact at the Market Place level
											</Typography>
											<Typography variant="body1" fontSize={"12px"}>
												When{" "}
												<Box component="span" color="error.main">
													updating
												</Box>{" "}
												the{" "}
												<Box component="span" color="error.main">
													values
												</Box>{" "}
												of the fields{" "}
												<Box component="span" color="error.main">
													below, all other products
												</Box>{" "}
												with the{" "}
												<Box component="span" color="error.main">
													same {mappingTitle(data?.data?.market_place)}
												</Box>{" "}
												(regardless of their Vendor Code){" "}
												<Box component="span" color="error.main">
													will be affected accordingly
												</Box>
												.
												<br />
												Please consider carefully before proceeding with the updates!
											</Typography>
										</Box>
										<MarketPlaceChange
											formik={formik}
											details={formik.values.details}
											isEditing={isEdit}
											role={role.code}
											isViewRequest={true}
										/>
									</>
								)}
								{stateDetails.type === ETypeRequest.record && (
									<>
										<Box
											sx={{
												padding: "8px 25px",
												color: "text.primary",
											}}
										>
											<Typography variant="body1" fontWeight="bold" sx={{ mb: "5px" }}>
												Updating will have an impact at the Record level
											</Typography>
											<Typography variant="body1" fontSize={"12px"}>
												When{" "}
												<Box component="span" color="error.main">
													updating
												</Box>{" "}
												the{" "}
												<Box component="span" color="error.main">
													values
												</Box>{" "}
												of the fields{" "}
												<Box component="span" color="error.main">
													below, one and only one
												</Box>{" "}
												ASIN{" "}
												<Box component="span" color="error.main">
													{data?.data?.market_place_id}
												</Box>{" "}
												and Vendor Code
												<Box component="span" color="error.main">
													Yes4A will be affected accordingly
												</Box>
												.
												<br />
												Please consider carefully before proceeding with the updates!
											</Typography>
										</Box>
										<RecordChange
											formik={formik}
											details={formik.values.details}
											isEditing={isEdit}
											role={role.code}
											isViewRequest={true}
										/>
									</>
								)}
							</Grid>
							<Grid item xs={12}>
								{role.code === ERole.sales ? (
									<>
										{isEdit ? (
											<>
												<Button variant="contained" type="submit" sx={{ mr: 1 }}>
													Request update
												</Button>
												<Button
													variant="outlined"
													onClick={() => {
														setEdit(false);
														handleCancelChange();
													}}
												>
													Cancel
												</Button>
											</>
										) : (
											<Button
												variant="contained"
												type="button"
												disabled={!activities?.hasOwnProperty("pi_a_request_edit")}
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
													activities?.hasOwnProperty("pi_a_request_edit") && setEdit(true);
												}}
											>
												Edit Request
											</Button>
										)}
									</>
								) : (
									<>
										<Button
											variant="contained"
											type="button"
											sx={{ mr: 1 }}
											color="success"
											disabled={!activities?.hasOwnProperty("pi_many_request_approve_decline")}
											onClick={() => {
												activities?.hasOwnProperty("pi_many_request_approve_decline") &&
													setStateDecide({
														isOpen: true,
														isApproved: true,
													});
											}}
										>
											Approve
										</Button>
										<Button
											variant="contained"
											type="button"
											color="error"
											disabled={!activities?.hasOwnProperty("pi_many_request_approve_decline")}
											onClick={() => {
												activities?.hasOwnProperty("pi_many_request_approve_decline") &&
													setStateDecide({
														isOpen: true,
														isApproved: false,
													});
											}}
										>
											Decline
										</Button>
									</>
								)}
							</Grid>
						</Grid>
						{stateDecide.isOpen && (
							<DecideRequestPopup
								open={stateDecide.isOpen}
								isApproved={stateDecide.isApproved}
								setSelectedRows={setSelectedRows}
								refetch={() => {
									refetch();
									setStateDetails({
										isLoading: false,
										isView: false,
										id: null,
										type: null,
									});
								}}
								setOpen={(value) => {
									setStateDecide((state) => ({
										...state,
										isOpen: value,
									}));
								}}
								dataDecide={dataDecide}
							/>
						)}
					</BoxLoading>
				</form>
			</Skeleton>
		);
	}

	return (
		<Skeleton isLoading={isLoading || isFetching}>
			<Grid container spacing={{ xs: 2, sm: 2 }}>
				<Grid item sm={12}>
					<BoxLoading loading={false}>
						<MuiTable
							columns={columns}
							data={data?.data?.items || []}
							hasCheckbox={activities?.hasOwnProperty("pi_many_request_approve_decline")}
							rowNumberMode="original"
							pagination={{
								...getPagination({ rowsPerPage: itemsPerPage, page }),
								total: data?.data?.total || 0,
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
								<RequestApprovalTabSearch
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
									activities={activities}
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
					</BoxLoading>
				</Grid>
				{stateDecide.isOpen && (
					<DecideRequestPopup
						open={stateDecide.isOpen}
						isApproved={stateDecide.isApproved}
						setSelectedRows={setSelectedRows}
						refetch={refetch}
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
	);
};

export default PrivateRouter(RequestApprovalTab, "pi_request_list_view");

const MuiBreadcrumbsRoot = styled(Box)(({ theme }) => {
	return {
		paddingTop: "0.5rem",
		paddingBottom: "0.5rem",

		"& .MuiBreadcrumbs-ol": {
			color: theme.palette.text.secondary,
		},
	};
});
