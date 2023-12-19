import { Box, Container, Grid, Typography } from "@mui/material";
import React, { ChangeEvent, FC, useMemo, useState, MouseEvent } from "react";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
import { PAGINATION, PATH } from "src/constants";
import { useParams } from "react-router";
import { getProductDetail } from "src/services/product-info/productInfo.services";
import { useQuery } from "react-query";
import { Skeleton } from "src/components/skeleton";
import { useSelector } from "react-redux";
import { selectRoleAccount } from "src/store/auth/selectors";
import { ERole } from "src/interface/groupPermission.interface";
import { MuiTable } from "src/components/mui-table";
import { formatCurrencyPrefix } from "src/utils/currency";
import { getPagination } from "src/utils/pagination";
import { pick } from "lodash";
import { ChangeLogSearch } from "./change-log-search";

interface IProps {}

const ProductChangeLog: FC<IProps> = () => {
	const { id } = useParams();
	const role = useSelector(selectRoleAccount);
	const {
		data,
		isLoading: isLoading,
		isFetching: isFetching,
		refetch,
	} = useQuery([`items-report-listing-${JSON.stringify(id)}`, id], () => getProductDetail(id), {
		keepPreviousData: true,
		enabled:
			!!id &&
			(role.code === ERole.admin || role.code === ERole.sales || role.code === ERole.manager),
	});

	const items = [
		{ path: PATH.HOME, name: `Home` },
		{
			name: "Product Master Data",
			path: PATH.PRODUCT_MASTER,
		},
		{
			name: `Changelog`,
		},
	];
	const columns = useMemo(
		() => [
			{
				header: "From",
				size: 140,
				accessorKey: "from",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Timestamp",
				size: 180,
				accessorKey: "timestamp",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Email update",
				size: 180,
				accessorKey: "email",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "User name update",
				size: 240,
				accessorKey: "user",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Notification type",
				size: 180,
				accessorKey: "notification_type",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Log type",
				size: 180,
				accessorKey: "log_type",
				typeFilter: "includesMultipleFilter",
			},
			{
				Header: () => (
					<Typography fontWeight={700} color={"#000"}>
						Old value
					</Typography>
				),
				header: "Old value",
				size: 180,
				accessorKey: "old_value",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						color: "#000",
					},
				},
				Cell: ({ cell }) => <>{formatCurrencyPrefix(cell.getValue())}</>,
			},
			{
				Header: () => (
					<Typography fontWeight={700} color={"#52710C"}>
						New value
					</Typography>
				),
				header: "New value",
				size: 180,
				accessorKey: "new_value",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						color: "#52710C",
					},
				},
				Cell: ({ cell }) => <>{formatCurrencyPrefix(cell.getValue())}</>,
			},
			{
				header: "Approved by",
				size: 180,
				accessorKey: "approved_by",
				typeFilter: "includesMultipleFilter",
			},
		],
		[]
	);

	const [params, setParams]: any = useState({
		itemsPerPage: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});

	const { itemsPerPage, page, searchBy, searchByValue, date } = pick(params, [
		"itemsPerPage",
		"page",
		"searchBy",
		"searchByValue",
		"date",
	]);

	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams((prev) => ({
			...prev,
			page: newPage,
			itemsPerPage: params?.size || PAGINATION.PAGE_SIZE,
		}));
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

	const handleOnSearch = (values) => {
		setParams({
			page: PAGINATION.PAGE,
			itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE,
			...values,
		});
	};

	const mockData = [
		{
			from: "PIMS",
			timestamp: "19/05/2023 13:42:57",
			email: "user@yes4all.com",
			user: "User name",
			notification_type: "Cost/Price updated",
			log_type: "COGS",
			old_value: 89.99,
			new_value: 90.99,
			approved_by: "User name",
		},
		{
			from: "PLM",
			timestamp: "19/05/2023 13:42:57",
			email: "user@yes4all.com",
			user: "User name",
			notification_type: "Cost/Price updated",
			log_type: "FOB",
			old_value: 89.99,
			new_value: 90.99,
			approved_by: "User name",
		},
		{
			from: "SMS",
			timestamp: "19/05/2023 13:42:57",
			email: "user@yes4all.com",
			user: "User name",
			notification_type: "Cost/Price updated",
			log_type: "Cost to Market Place",
			old_value: 89.99,
			new_value: 90.99,
			approved_by: "User name",
		},
	];

	return (
		<Container maxWidth={false}>
			<Skeleton isLoading={isLoading || isFetching}>
				<Box mt={{ xs: 1 }}>
					<MuiBreadcrumbs items={items} />
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Changelog
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<InfoProduct
								market_place={data?.data?.market_place}
								market_place_id={data?.data?.market_place_id}
								upc={data?.data?.upc}
								country={data?.data?.country}
								sku={data?.data?.sku?.code}
								vendor_code={data?.data?.vendor_code}
							/>
						</Grid>
						<Grid item xs={12}>
							<MuiTable
								columns={columns}
								loading={false}
								data={mockData}
								pagination={{
									...getPagination({ rowsPerPage: itemsPerPage, page }),
									total: 3,
									onPageChange: handleOnPageChange,
									onRowsPerPageChange: handleOnRowsPerPageChange,
								}}
								renderTopToolbarCustomActions={() => (
									<ChangeLogSearch
										onSearch={handleOnSearch}
										valuesSearch={{
											searchBy,
											searchByValue,
											date,
										}}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Box>
			</Skeleton>
		</Container>
	);
};

export default ProductChangeLog;

const InfoProduct = ({ market_place, market_place_id, upc, country, sku, vendor_code }) => {
	return (
		<Grid container columnGap={"70px"}>
			<Grid item>
				<ItemInfo label="Market Place: " value={market_place} />
				<ItemInfo label="Market Place ID: " value={market_place_id} />
			</Grid>
			<Grid item>
				<ItemInfo label="UPC: " value={upc} />
				<ItemInfo label="Country: " value={country} />
			</Grid>
			<Grid item>
				<ItemInfo label="SKU: " value={sku} />
				<ItemInfo label="Vendor Code: " value={vendor_code} />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body1" fontSize={"14px"} color={"text.primary"}>
					Created by action <strong> Add Vendor Code</strong> from ASIN{" "}
					<strong>{market_place_id}</strong> - Vendor Code <strong>{vendor_code}</strong> by User
					name (email) at 19/05/2023 13:42:57
				</Typography>
			</Grid>
		</Grid>
	);
};

const ItemInfo = ({ label, value }: any) => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				paddingBottom: "6px",
				gap: "5px",
			}}
		>
			<Typography variant="body1" fontSize={"14px"} color={"text.primary"}>
				{label}
			</Typography>
			<Typography variant="body1" fontSize={"14px"} color={"text.primary"}>
				{value}
			</Typography>
		</Box>
	);
};
