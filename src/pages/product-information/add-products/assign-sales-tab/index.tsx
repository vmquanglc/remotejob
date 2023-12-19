import { Box, Container, Paper } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { MuiTable } from "src/components/mui-table";
import { PAGINATION } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { AssignSalesSearch } from "./assign-sales-search";
import { useQuery } from "react-query";
import { getAssignSales } from "src/services/product-info/add.product.services";
import HoverText from "src/components/hover-text";

export const AssignSalesTab = () => {
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

	const { itemsPerPage, page, searchBy, searchByValue } = pick(params, [
		"itemsPerPage",
		"page",
		"searchBy",
		"searchByValue",
	]);

	const columns = useMemo(
		() => [
			{
				header: "SKU",
				size: 120,
				accessorKey: "sku",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "UPC",
				size: 140,
				accessorKey: "upc",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Product name",
				size: 250,
				accessorKey: "product_name",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <HoverText value={cell.getValue()} />,
			},
			{
				header: "Category",
				size: 200,
				accessorKey: "category",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "MOQ",
				size: 160,
				accessorKey: "moq",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "FOB",
				size: 160,
				accessorKey: "fob",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Material",
				size: 160,
				accessorKey: "material",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Product length (in)",
				size: 160,
				accessorKey: "product_length",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Product width (in)",
				size: 160,
				accessorKey: "product_width",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Product height (in)",
				size: 160,
				accessorKey: "product_height",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Product weight (lb)",
				size: 160,
				accessorKey: "product_weight",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Vendor",
				size: 200,
				accessorKey: "vendor",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Origin",
				size: 160,
				accessorKey: "origin",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Sale Manager",
				size: 200,
				accessorKey: "sale_manager",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Create time",
				size: 200,
				accessorKey: "create_at",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Create by",
				size: 200,
				accessorKey: "create_by",
				typeFilter: "includesMultipleFilter",
			},
		],
		[]
	);

	const { data } = useQuery([`get-list-assign-sales`], () => getAssignSales(), {
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
				hasCheckbox
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
					<AssignSalesSearch
						selectedRows={selectedRows}
						onSearch={handleOnSearch}
						valuesSearch={{
							searchBy,
							searchByValue,
						}}
					/>
				)}
			/>
		</Box>
	);
};
