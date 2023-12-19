import { clone, mergeWith, orderBy, pick } from "lodash";
import React, { MouseEvent, ChangeEvent, useMemo, useState, useLayoutEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Skeleton } from "src/components/skeleton";
import { PAGINATION } from "src/constants";
import {
	Box,
	Breadcrumbs,
	Button,
	CircularProgress,
	Grid,
	Link,
	Typography,
	styled,
} from "@mui/material";
import { MuiTable } from "src/components/mui-table";
import { getPagination } from "src/utils/pagination";
import { HistoryTabSearch } from "./history-tab-search";
import {
	exportAssumptions,
	getAssumptionDetail,
	getHistoriesAssumption,
} from "src/services/profit-simulation/profit.services";
import { convertTimeToGMT7 } from "src/utils/date";
import { DetailAssumptions } from "./detail-assumptions";
import { IAssumption } from "src/interface/profitSimulation.interface";
import { initialAssumption } from "src/utils/profit-simulation/formulaPS";
import { toastOptions } from "src/components/toast/toast.options";

export default function HistoryTab({ activities }) {
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

	interface IDetail extends IAssumption {
		name: string;
	}
	interface IState {
		isOpen: boolean;
		isLoading: boolean;
		detail: any;
		id: string;
	}
	const [stateDetails, setStateDetails] = useState<IState>({
		isOpen: false,
		isLoading: false,
		id: null,
		detail: {
			name: "",
			...initialAssumption,
		},
	});

	const columns = useMemo(
		() => [
			{
				header: "Version",
				size: 200,
				accessorKey: "name",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell, row }) => (
					<Button
						variant="text"
						sx={{ color: "info.main", textDecoration: "underline", textUnderlinePosition: "under" }}
						onClick={() => {
							setStateDetails({
								isOpen: true,
								isLoading: true,
								id: row?.original?.id,
								detail: {},
							});
						}}
					>
						{cell.getValue()}
					</Button>
				),
			},
			{
				header: "Created by",
				size: 200,
				accessorKey: "created_by.full_name",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Start applied date",
				size: 180,
				accessorKey: "created_at",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <>{convertTimeToGMT7(cell.getValue(), "HH:mm:ss DD/MM/YYYY")}</>,
			},
		],
		[]
	);

	const formatFilter = (params: any) => {
		if (params.searchBy && params.searchByValue) {
			if (params.searchBy === "created_by") {
				return JSON.stringify([
					{ model: "User", field: "full_name", op: "ilike", value: `%${params.searchByValue}%` },
				]);
			}
			return JSON.stringify([
				{ field: params.searchBy, op: "ilike", value: `%${params.searchByValue}%` },
			]);
		}
		return [];
	};

	const { data: dataHistories, isFetching: isLoading } = useQuery(
		[`assumption-history-listing-${JSON.stringify(mergeParams)}`, mergeParams],
		() =>
			getHistoriesAssumption({
				page: mergeParams.page + 1,
				itemsPerPage: mergeParams.itemsPerPage,
				q: "''",
				filter: formatFilter(mergeParams),
				sortBy: JSON.stringify([{ field: "created_at", direction: "desc" }]),
				descending: [],
				organization_code: "yes4all",
			}),
		{
			keepPreviousData: true,
			enabled: activities?.hasOwnProperty("ps_assumption_manage_update"),
		}
	);

	const [selectedRows, setSelectedRows] = useState<any>({});

	const { mutate: onExport, isLoading: isSaving } = useMutation(async (data: any) => {
		try {
			const response: any = await exportAssumptions(data);
			if (response?.status !== 200) {
				toastOptions("error", "Export assumption error");
				return false;
			} else {
				toastOptions("success", "Export assumption success");
				setSelectedRows({});
				return true;
			}
		} catch (error) {
			toastOptions("error", "Export assumption error");
			return false;
		}
	});

	const getInfo = async (id) => {
		const res: any = await getAssumptionDetail({
			assumption_id: id,
			organization_code: "yes4all",
		});
		if (res?.status === 200) {
			setStateDetails((state) => ({
				...state,
				isLoading: false,
				detail: res?.data,
			}));
		} else {
			setStateDetails({
				isOpen: false,
				isLoading: false,
				id: null,
				detail: {},
			});
			toastOptions("error", "Get detail Assumption error");
		}
	};

	useLayoutEffect(() => {
		if (stateDetails.id) {
			getInfo(stateDetails.id);
		}
	}, [stateDetails.id]);

	if (stateDetails.isOpen) {
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
									isOpen: false,
									isLoading: false,
									id: null,
									detail: {},
								});
							}}
							sx={{ textDecoration: "none" }}
						>
							<Typography variant="body1" color={(theme) => theme?.palette?.text?.secondary}>
								History
							</Typography>
						</Link>
						<Typography variant="body1" color={(theme) => theme?.palette?.text?.primary}>
							{stateDetails.detail?.name}
						</Typography>
					</Breadcrumbs>
				</MuiBreadcrumbsRoot>
				{stateDetails.isLoading ? (
					<CircularProgress size={20} />
				) : (
					<DetailAssumptions assumption={stateDetails.detail} isView />
				)}
			</>
		);
	}

	return (
		<>
			<Skeleton isLoading={isLoading}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item sm={12}>
						<MuiTable
							columns={columns}
							data={dataHistories?.data?.items || []}
							hasCheckbox
							enableRowNumbers={true}
							rowNumberMode="original"
							pagination={{
								...getPagination({ rowsPerPage: mergeParams.itemsPerPage, page: mergeParams.page }),
								total: dataHistories?.data?.total || 0,
								onPageChange: handleOnPageChange,
								onRowsPerPageChange: handleOnRowsPerPageChange,
							}}
							getRowId={(row: any) => row?.id}
							onRowSelectionChange={setSelectedRows}
							state={{ rowSelection: selectedRows }}
							renderTopToolbarCustomActions={() => (
								<HistoryTabSearch
									selectedRows={selectedRows}
									onExport={() => onExport({ assumption_ids: Object.keys(selectedRows) })}
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
			</Skeleton>
		</>
	);
}

const MuiBreadcrumbsRoot = styled(Box)(({ theme }) => {
	return {
		paddingTop: "0.5rem",
		paddingBottom: "0.5rem",

		"& .MuiBreadcrumbs-ol": {
			color: theme.palette.text.secondary,
		},
	};
});
