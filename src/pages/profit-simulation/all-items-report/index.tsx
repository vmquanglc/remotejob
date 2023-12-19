import { Container, Box, Paper, Grid, Typography } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { MuiTable } from "src/components/mui-table";
import { PAGINATION } from "src/constants";
import { useSearchParams } from "src/hooks/use-search-params";
import { getItemsReport } from "src/services/profit-simulation";
import { formatCurrency } from "src/utils/currency";
import { getPagination } from "src/utils/pagination";
import { ItemsReportSearch } from "./items-report-search";

export const AllItemsReport = () => {
	const [selectedRows, setSelectedRows] = useState<any>({});

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

	const { size, page } = pick(mergeParams, ["size", "page"]);

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

	const {
		data,
		isFetching: isLoading,
		refetch,
	} = useQuery(
		[`items-report-listing-${JSON.stringify(mergeParams)}`, mergeParams],
		() => getItemsReport(mergeParams),
		{
			keepPreviousData: true,
		}
	);

	const columns = useMemo(() => {
		return [
			{
				header: "Asin",
				size: 160,
				accessorKey: "asin",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "SKU",
				size: 140,
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
				header: "Idea Code",
				size: 140,
				accessorKey: "ideaCode",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Product Name",
				size: 240,
				accessorKey: "productName",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Category",
				size: 170,
				accessorKey: "category",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Subcategory",
				size: 170,
				accessorKey: "subCategory",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Launching Date",
				size: 180,
				accessorKey: "launchingDate",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "RRP",
				size: 160,
				accessorKey: "rrp",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <>{formatCurrency({ number: cell.getValue() })}</>,
			},
			{
				header: "COGS",
				size: 140,
				accessorKey: "cogs",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "% Submit to  AMZ - DI%",
				size: 240,
				accessorKey: "submitDI",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(0, 110, 201, 0.2)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(0, 110, 201, 0.2)",
					},
				},
			},
			{
				header: "% Submit to  AMZ - DS%",
				size: 240,
				accessorKey: "submitDS",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(0, 110, 201, 0.2)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(0, 110, 201, 0.2)",
					},
				},
			},
			{
				header: "% Submit to  AMZ - WH%",
				size: 240,
				accessorKey: "submitWH",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(0, 110, 201, 0.2)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(0, 110, 201, 0.2)",
					},
				},
			},
			{
				header: "%MKT Fee BAU",
				size: 240,
				accessorKey: "freeBAU",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "CM ($) BAU - DI",
				size: 240,
				accessorKey: "cmBauDI",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
			},
			{
				header: "CM ($) BAU - DS",
				size: 240,
				accessorKey: "cmBauDS",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
			},
			{
				header: "CM ($) BAU - WH",
				size: 240,
				accessorKey: "cmBauWH",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
			},
			{
				header: "CM ($) BAU - FBA",
				size: 240,
				accessorKey: "cmBauFBA",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.3)",
					},
				},
			},
			{
				header: "Net Profit ($) BAU - DI",
				size: 240,
				accessorKey: "netBauDI",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
			},
			{
				header: "Net Profit ($) BAU - DS",
				size: 240,
				accessorKey: "netBauDS",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
			},
			{
				header: "Net Profit ($) BAU - WH",
				size: 240,
				accessorKey: "netBauWH",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
			},
			{
				header: "Net Profit ($) BAU - FBA",
				size: 240,
				accessorKey: "netBauFBA",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
				muiTableHeadCellProps: {
					sx: {
						background: "rgba(93, 90, 136, 0.2)",
					},
				},
			},
		];
	}, []);

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<Paper sx={{ p: 2, mb: 2 }}>
					<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								All items report
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<MuiTable
								columns={columns}
								hasCheckbox
								loading={isLoading}
								data={data?.details || []}
								enableRowNumbers={true}
								rowNumberMode="original"
								onRowSelectionChange={setSelectedRows}
								pagination={{
									...getPagination({ rowsPerPage: size, page }),
									total: data?.totalItems || 0,
									onPageChange: handleOnPageChange,
									onRowsPerPageChange: handleOnRowsPerPageChange,
								}}
								state={{ rowSelection: selectedRows }}
								renderTopToolbarCustomActions={() => (
									<ItemsReportSearch
										selectedRows={selectedRows}
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
		</Container>
	);
};
