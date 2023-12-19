import {
	Box,
	Button,
	Collapse,
	Container,
	Grid,
	List,
	MenuItem,
	Popover,
	Stack,
	Typography,
} from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { useMemo, useState, MouseEvent, ChangeEvent } from "react";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
import HoverText from "src/components/hover-text";
import { FORMAT_DATE, PAGINATION, PATH } from "src/constants";
import { DotsVertical } from "src/components/icons/dots-vertical";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useQuery } from "react-query";
import {
	getInputData,
	getProductInfoListing,
} from "src/services/product-info/productInfo.services";
import { getPagination } from "src/utils/pagination";
import { formatDateToString } from "src/utils/date";
import { useNavigate } from "react-router";
import { Skeleton } from "src/components/skeleton";
import { PrivateRouter } from "src/components/private-router";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";
import { AddVendorCodePopup } from "./add-vendor-code-popup";
import { ReplaceAsinPopup } from "./replace-asin-popup";
import { ProductMasterFilter } from "./product-master-filter";
import { TableProductInfo } from "./tab-table-product-master/table-product-infor";
import { TableDimensions } from "./tab-table-product-master/table-dimensision";
import { TableRepLead } from "./tab-table-product-master/table-rep-lead";
import { TableCompliance } from "./tab-table-product-master/table-compliance";

const ProductInformation = () => {
	const items = [{ path: PATH.HOME, name: `Home` }, { name: "Product Master Data" }];
	const [dataSearch, setDataSearch] = useState<any>({
		sku_upc_asin: [],
		category_level: 5,
		category: "",
		sales_manager: [],
		product_name: "",
		productGroup: "",
		pic: [],
	});
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
		isFetching: isLoading,
		refetch,
	} = useQuery(
		[`get-product-info-${JSON.stringify(mergeParams)}`, dataSearch],
		() => {
			return getProductInfoListing({
				...mergeParams,
				page: mergeParams.page + 1,
				sku_upc_asin: JSON.stringify(dataSearch.sku_upc_asin),
				category_level: dataSearch.category_level,
				category_name: dataSearch.category,
				manager_ids: JSON.stringify(dataSearch.sales_manager?.map((item) => item.id)),
				product_name: dataSearch.product_name,
				pic: JSON.stringify(dataSearch.pic?.map((item) => item.id)),
				q: "''",
				filter: [],
				sortBy: [],
				descending: [],
			});
		},
		{
			keepPreviousData: true,
		}
	);

	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams({ page: newPage, itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE });
	};

	const handleOnRowsPerPageChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setParams({
			itemsPerPage: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		});
	};

	const { itemsPerPage, page } = pick(params, ["itemsPerPage", "page"]);

	enum ETab {
		Product,
		Dimensions,
		RepLeadTime,
		Compliance,
	}
	const [tabInfo, setTabInfo] = useState<ETab>(ETab.Product);

	//control state add vendor code
	interface IStateProduct {
		isOpen: boolean;
		type: "asin" | "vendor" | null;
		id: number | string | null;
		status: null | "add" | "YES4A" | "YES4B" | "reject";
		sku: any;
	}
	const [stateProduct, setStateProduct] = useState<IStateProduct>({
		isOpen: false,
		type: null,
		sku: "",
		id: null,
		status: null,
	});

	const columns = useMemo(
		() =>
			[
				{
					header: "Link",
					size: 50,
					hidden: tabInfo !== ETab.Product,
					accessorKey: "link",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Image",
					size: 50,
					accessorKey: "sku.image",
					typeFilter: "includesMultipleFilter",
					enableResizing: false,
					Cell: ({ cell, row }) => (
						<>
							{cell.getValue() ? (
								<img
									width={"40px"}
									height={"40px"}
									src={`${cell.getValue()}`}
									srcSet={`${cell.getValue()}`}
									alt={row?.original?.product_name}
									loading="lazy"
								/>
							) : (
								<Box
									sx={{
										height: "40px",
										width: "40px",
									}}
								></Box>
							)}
						</>
					),
				},
				{
					header: "SKU",
					size: 60,
					accessorKey: "sku.code",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "UPC",
					size: 90,
					hidden: tabInfo !== ETab.Product,
					accessorKey: "upc",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Market Place",
					size: 105,
					accessorKey: "market_place",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Market Place ID",
					size: 120,
					accessorKey: "market_place_id",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Category",
					size: 120,
					accessorKey: "sku.category.relative_master_category.name",
					typeFilter: "includesMultipleFilter",
					Cell: ({ cell }) => <HoverText value={cell.getValue()} />,
				},
				{
					header: "Product Name",
					size: 180,
					accessorKey: "sku.product_name",
					typeFilter: "includesMultipleFilter",
					Cell: ({ cell }) => <HoverText value={cell.getValue()} />,
				},
				{
					header: "Product Type",
					hidden: tabInfo !== ETab.Product,
					size: 100,
					accessorKey: "product_type",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Sell Type",
					hidden: tabInfo !== ETab.Product,
					size: 100,
					accessorKey: "sku.sell_type",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Life Cycle",
					hidden: tabInfo !== ETab.Product,
					size: 100,
					accessorKey: "sku.life_cycle",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Country",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "country",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Channel",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "channel",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Vendor Code",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "vendor_code",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "RRP",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "rrp",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Cost to Market Place",
					hidden: tabInfo !== ETab.Product,
					size: 160,
					accessorKey: "cost_to_market_place",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "FOB",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "sku.fob",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "COGS",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "sku.cogs",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Manufacturer",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "sku.manufacturer",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Country of Origin",
					hidden: tabInfo !== ETab.Product,
					size: 120,
					accessorKey: "sku.country_of_origin",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Launching date",
					hidden: tabInfo !== ETab.Product,
					size: 110,
					accessorKey: "launching_date",
					typeFilter: "includesMultipleFilter",
					Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
				},
				{
					header: "PIC Sale/DL",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "sku.pic_sale_dl",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "PIC SPD",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "sku.pic_spd",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "PIC BA",
					hidden: tabInfo !== ETab.Product,
					size: 90,
					accessorKey: "sku.pic_ba",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Product Length (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.product_length",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Product Width (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.product_width",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Product Height (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.product_height",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Product Weight (lb)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.product_weight",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Inner Length (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 140,
					accessorKey: "sku.inner_length",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Inner Width (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 140,
					accessorKey: "sku.inner_width",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Inner Height (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 140,
					accessorKey: "sku.inner_height",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Inner Weight (lb)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 140,
					accessorKey: "sku.inner_weight",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Master Length (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.master_length",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Master Width (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.master_width",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Master Height (in)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.master_height",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Master Weight (lb)",
					hidden: tabInfo !== ETab.Dimensions,
					size: 150,
					accessorKey: "sku.master_weight",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Loading Quantity Cont 20",
					hidden: tabInfo !== ETab.Dimensions,
					size: 180,
					accessorKey: "sku.loading_quantity_cont_20",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Loading Quantity Cont 40",
					hidden: tabInfo !== ETab.Dimensions,
					size: 180,
					accessorKey: "sku.loading_quantity_cont_40",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "MOQ",
					hidden: tabInfo !== ETab.Dimensions,
					size: 90,
					accessorKey: "sku.moq",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Material",
					hidden: tabInfo !== ETab.Dimensions,
					size: 90,
					accessorKey: "sku.material",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Color",
					hidden: tabInfo !== ETab.Dimensions,
					size: 90,
					accessorKey: "sku.color",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Shape",
					hidden: tabInfo !== ETab.Dimensions,
					size: 90,
					accessorKey: "sku.shape",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Capacity",
					hidden: tabInfo !== ETab.Dimensions,
					size: 90,
					accessorKey: "sku.capacity",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Replenishment Lead-time",
					hidden: tabInfo !== ETab.RepLeadTime,
					size: 170,
					accessorKey: "sku.replenishment_lead_time",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Order processing Lead-time",
					hidden: tabInfo !== ETab.RepLeadTime,
					size: 200,
					accessorKey: "sku.order_proccessing_lead_time",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Product Lead-time",
					hidden: tabInfo !== ETab.RepLeadTime,
					size: 150,
					accessorKey: "sku.production_lead_time",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "International Transportation Lead-time",
					hidden: tabInfo !== ETab.RepLeadTime,
					size: 280,
					accessorKey: "sku.international_transportation_lead_time",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Domestic Lead-time",
					hidden: tabInfo !== ETab.RepLeadTime,
					size: 140,
					accessorKey: "sku.domestic_lead_time",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Warranty Policy",
					hidden: tabInfo !== ETab.Compliance,
					size: 125,
					accessorKey: "warranty_policies",
					typeFilter: "includesMultipleFilter",
					Cell: ({ row }) => {
						const view = row?.original?.sku?.category?.warranty_policies?.map(
							(item: any) => item.name
						);
						return view?.join(", ");
					},
				},
				{
					header: "Return Policy",
					hidden: tabInfo !== ETab.Compliance,
					size: 95,
					accessorKey: "return_policy",
					typeFilter: "includesMultipleFilter",
					Cell: ({ row }) => {
						const view = row?.original?.sku?.category?.return_policies?.map(
							(item: any) => item.name
						);
						return view?.join(", ");
					},
				},
				{
					header: "Proposition 65",
					hidden: tabInfo !== ETab.Compliance,
					size: 105,
					accessorKey: "sku.proposition_65",
					typeFilter: "includesMultipleFilter",
				},
				{
					header: "Action",
					size: 50,
					accessorKey: "action",
					typeFilter: "includesMultipleFilter",
					enableResizing: false,
					enableColumnDragging: false,
					enableColumnFilter: false,
					enableColumnOrdering: false,
					enableColumnActions: false,
					enablePinning: false,
					enableHiding: false,
					muiTableBodyCellProps: {
						sx: {
							textAlign: "center",
						},
					},
					muiTableHeadCellProps: {
						sx: {
							textAlign: "center",
						},
					},
					Cell: ({ row }) => <ColumnAction row={row} setStateProduct={setStateProduct} />,
				},
			].filter((item) => !item.hidden),
		[tabInfo]
	);

	const [checked, setChecked] = useState<boolean>(true);

	const { data: dataInput, isLoading: isLoadingInputData } = useQuery(
		[`get-input-data`],
		() => getInputData(),
		{
			keepPreviousData: true,
		}
	);

	return (
		<form>
			<Container maxWidth={false}>
				<Skeleton isLoading={isLoadingInputData}>
					<Box mt={{ xs: 1 }} mb={{ xs: 4 }}>
						<MuiBreadcrumbs items={items} />
						<Grid container spacing={{ xs: 1, sm: 1 }}>
							<Grid item xs={12} sm={12}>
								<Typography variant="h6" color="primary">
									Product Master Data
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Stack direction={"row"} alignItems={"center"} gap={"5px"} mb={1}>
									<Typography
										variant="body1"
										color={"text.primary"}
										sx={{
											fontWeight: "700",
											alignItems: "center",
										}}
									>
										Filter
									</Typography>
									<Button
										variant="text"
										onClick={() => setChecked((prev) => !prev)}
										sx={{ minWidth: "20px", padding: "0 3px" }}
									>
										{!checked ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
									</Button>
								</Stack>
								<Collapse
									in={checked}
									sx={{
										paddingTop: "10px",
										marginBottom: checked ? "20px" : 0,
									}}
								>
									<ProductMasterFilter
										dataSearch={dataSearch}
										onSearch={setDataSearch}
										dataInput={dataInput}
									/>
								</Collapse>
							</Grid>
							<Grid item xs={12}>
								{tabInfo === ETab.Product && (
									<TableProductInfo
										setTabInfo={setTabInfo}
										columns={columns}
										data={data?.data?.items || []}
										loading={isLoading}
										pagination={{
											...getPagination({
												rowsPerPage: itemsPerPage,
												page,
											}),
											total: data?.data?.total || 0,
											onPageChange: handleOnPageChange,
											onRowsPerPageChange: handleOnRowsPerPageChange,
										}}
									/>
								)}
								{tabInfo === ETab.Dimensions && (
									<TableDimensions
										setTabInfo={setTabInfo}
										columns={columns}
										data={data?.data?.items || []}
										loading={isLoading}
										pagination={{
											...getPagination({
												rowsPerPage: itemsPerPage,
												page,
											}),
											total: data?.data?.total || 0,
											onPageChange: handleOnPageChange,
											onRowsPerPageChange: handleOnRowsPerPageChange,
										}}
									/>
								)}
								{tabInfo === ETab.RepLeadTime && (
									<TableRepLead
										setTabInfo={setTabInfo}
										columns={columns}
										data={data?.data?.items || []}
										loading={isLoading}
										pagination={{
											...getPagination({
												rowsPerPage: itemsPerPage,
												page,
											}),
											total: data?.data?.total || 0,
											onPageChange: handleOnPageChange,
											onRowsPerPageChange: handleOnRowsPerPageChange,
										}}
									/>
								)}
								{tabInfo === ETab.Compliance && (
									<TableCompliance
										setTabInfo={setTabInfo}
										columns={columns}
										data={data?.data?.items || []}
										loading={isLoading}
										pagination={{
											...getPagination({
												rowsPerPage: itemsPerPage,
												page,
											}),
											total: data?.data?.total || 0,
											onPageChange: handleOnPageChange,
											onRowsPerPageChange: handleOnRowsPerPageChange,
										}}
									/>
								)}
							</Grid>
						</Grid>
					</Box>
				</Skeleton>
				{stateProduct.isOpen && stateProduct.type === "vendor" && (
					<AddVendorCodePopup
						open={stateProduct.isOpen}
						id={stateProduct.id}
						sku={stateProduct.sku}
						setOpen={(value) =>
							setStateProduct((state) => ({
								...state,
								isOpen: value,
							}))
						}
					/>
				)}
				{stateProduct.isOpen && stateProduct.type === "asin" && (
					<ReplaceAsinPopup
						open={stateProduct.isOpen}
						id={stateProduct.id}
						setOpen={(value) =>
							setStateProduct((state) => ({
								...state,
								isOpen: value,
							}))
						}
					/>
				)}
			</Container>
		</form>
	);
};

export default PrivateRouter(ProductInformation, "pi_master_data_view");

const ColumnAction = ({ row, setStateProduct }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	const navigate = useNavigate();
	const activities = useSelector(selectActivities);
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
						disabled={!activities?.hasOwnProperty("pi_a_request_edit")}
						onClick={() => {
							navigate(`${PATH.PRODUCT_MASTER}${PATH.EDIT}/${row?.original?.id}`);
						}}
					>
						Edit
					</MenuItem>
					<MenuItem
						key="addVendor"
						onClick={() => {
							setStateProduct((state) => ({
								...state,
								isOpen: true,
								type: "vendor",
								id: row?.original?.id,
								sku: row?.original?.sku,
							}));
							handleClose();
						}}
					>
						Add Vendor Code
					</MenuItem>
					<MenuItem
						key="replace"
						onClick={() => {
							setStateProduct((state) => ({
								...state,
								isOpen: true,
								type: "asin",
								id: row?.original?.id,
								sku: row?.original?.sku,
							}));
							handleClose();
						}}
					>
						Replace ASIN
					</MenuItem>
					<MenuItem
						key="add"
						onClick={() => {
							navigate(`${PATH.PRODUCT_MASTER}${PATH.CHANGE_LOG}/${row?.original?.id}`);
						}}
					>
						Change log
					</MenuItem>
				</List>
			</Popover>
		</>
	);
};
