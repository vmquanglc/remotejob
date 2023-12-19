import {
	Box,
	Breadcrumbs,
	Button,
	Divider,
	Grid,
	Link,
	List,
	ListItem,
	ListItemText,
	Paper,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import { useFormik } from "formik";
import { clone, mergeWith, pick } from "lodash";
import React, { useState, MouseEvent, ChangeEvent, useMemo, useLayoutEffect } from "react";
import { useQuery } from "react-query";
import { BoxLoading } from "src/components/box-loading";
import { MuiTable } from "src/components/mui-table";
import { Skeleton } from "src/components/skeleton";
import { ToolTip } from "src/components/tooltip";
import { PAGINATION } from "src/constants";
import {
	getApproved,
	getDetailRequest,
} from "src/services/product-info/update-requests-list.services";
import { getPagination } from "src/utils/pagination";
import { ApprovedTabSearch } from "./approved-search";
import { SKUInfoChange } from "../sku-info-change";
import { useSelector } from "react-redux";
import { selectRoleAccount } from "src/store/auth/selectors";
import { formatFilter } from "src/utils/common";
import { convertTimeToGMT7 } from "src/utils/date";
import { MarketPlaceChange } from "../market-place-change";
import { RecordChange } from "../record-change";
import { toastOptions } from "src/components/toast/toast.options";
import { ETypeRequest } from "src/interface/productInfo.interface";
import { MAP_LABEL_REQUEST } from "src/constants/productInfo.constant";
import { PrivateRouter } from "src/components/private-router";

const ApprovalTab = ({ activities }) => {
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
		[`get-approved-${JSON.stringify(mergeParams)}`],
		() =>
			getApproved({
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
			enabled: !!activities?.hasOwnProperty("pi_approval_list_view"),
		}
	);
	interface IStateDetails {
		isView: boolean;
		isLoading: boolean;
		id: number | string;
		type: ETypeRequest | null;
	}
	const [stateDetails, setStateDetails] = useState<IStateDetails>({
		isView: false,
		isLoading: false,
		id: "",
		type: null,
	});

	const formik = useFormik({
		initialValues: {
			product_name: "",
			details: {},
			sku: {
				category: {},
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
		onSubmit: () => {},
	});

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
				header: "Approved time",
				size: 160,
				accessorKey: "approved_at",
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

	useLayoutEffect(() => {
		if (stateDetails.id) {
			(async () => {
				const res = await getDetailRequest(stateDetails.id);
				if (res.status === 200) {
					setStateDetails((state) => ({
						...state,
						isLoading: false,
						type: res?.data?.type,
					}));
					formik.setValues({
						product_name: res?.data?.name,
						details: {
							...res?.data?.additional_data,
							product_update_request: {
								type_record: res?.data?.type === ETypeRequest.record ? res?.data : {},
								type_market_place:
									res?.data?.type === ETypeRequest.market_place_id ? res?.data : {},
								type_sku: res?.data?.type === ETypeRequest.sku ? res?.data : {},
							},
							sku: res?.data?.type === ETypeRequest.sku ? res?.data?.original_data : {},
							rrp:
								res?.data?.type === ETypeRequest.market_place_id
									? res?.data?.original_data?.rrp
									: {},
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
						rrp:
							res?.data?.type === ETypeRequest.market_place_id ? res?.data?.update_data?.rrp : {},
						product_type:
							res?.data?.type === ETypeRequest.market_place_id
								? res?.data?.update_data?.product_type
								: {},
						cost_to_market_place:
							res?.data?.type === ETypeRequest.record
								? res?.data?.update_data?.cost_to_market_place
								: {},
					});
				} else {
					setStateDetails({
						isView: false,
						isLoading: false,
						id: null,
						type: null,
					});
					toastOptions("error", "Request not exist");
				}
			})();
		}
	}, [stateDetails.id]);

	if (stateDetails.isView && !!stateDetails.type) {
		return (
			<>
				<MuiBreadcrumbsRoot>
					<Breadcrumbs separator=">">
						<Link
							key={"history"}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setStateDetails({
									isView: false,
									isLoading: false,
									id: null,
									type: null,
								});
							}}
							sx={{ textDecoration: "none" }}
						>
							<Typography variant="body1" color={(theme) => theme?.palette?.text?.secondary}>
								Approval
							</Typography>
						</Link>
						<Typography variant="body1" color={(theme) => theme?.palette?.text?.primary}>
							{formik.values.product_name}
						</Typography>
					</Breadcrumbs>
				</MuiBreadcrumbsRoot>
				<Grid item xs={12} sm={12}>
					{stateDetails.type === ETypeRequest.sku && (
						<SKUInfoChange
							details={formik.values.details}
							formik={formik}
							isEditing={false}
							role={role.code}
							isViewRequest={true}
							isViewApproved={true}
							categoryTree={{}}
							dataInput={{}}
						/>
					)}
					{stateDetails.type === ETypeRequest.market_place_id && (
						<MarketPlaceChange
							formik={formik}
							details={formik.values.details}
							isEditing={false}
							role={role.code}
							isViewRequest={true}
							isViewApproved={true}
						/>
					)}
					{stateDetails.type === ETypeRequest.record && (
						<RecordChange
							formik={formik}
							details={formik.values.details}
							isEditing={false}
							role={role.code}
							isViewRequest={true}
							isViewApproved={true}
						/>
					)}
				</Grid>
			</>
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
							rowNumberMode="original"
							pagination={{
								...getPagination({ rowsPerPage: itemsPerPage, page }),
								total: data?.data?.total || 0,
								onPageChange: handleOnPageChange,
								onRowsPerPageChange: handleOnRowsPerPageChange,
							}}
							renderTopToolbarCustomActions={() => (
								<ApprovedTabSearch
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
	);
};

export default PrivateRouter(ApprovalTab, "pi_approval_list_view");

const MuiBreadcrumbsRoot = styled(Box)(({ theme }) => {
	return {
		paddingTop: "0.5rem",
		paddingBottom: "0.5rem",

		"& .MuiBreadcrumbs-ol": {
			color: theme.palette.text.secondary,
		},
	};
});

const ItemRequestInfo = ({ primary, second }) => (
	<ListItem
		sx={{
			gap: "20px",
			padding: "3px 16px",
			"& .MuiListItemText-root": {
				flex: "0 0 calc(50% - 10px)",
				maxWidth: "calc(50% - 10px)",
				width: "calc(50% - 10px)",
			},
		}}
	>
		<ListItemText sx={{ textAlign: "right" }}>
			<Typography fontWeight={"bold"} color={"primary.main"}>
				{primary}
			</Typography>
		</ListItemText>
		<ListItemText>
			<Typography color={"primary.main"}>{second}</Typography>
		</ListItemText>
	</ListItem>
);
