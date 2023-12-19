import React, { useMemo, useState, MouseEvent, ChangeEvent } from "react";
import { Box, Button } from "@mui/material";
import { MuiTable } from "src/components/mui-table";
import { FORMAT_DATE, PAGINATION } from "src/constants";
import { clone, mergeWith, pick } from "lodash";
import { getPagination } from "src/utils/pagination";
import { useMutation, useQuery } from "react-query";
import {
	deletePSGroup,
	getPSGroupDetail,
	getPSGroupList,
	updateGroupDetail,
} from "src/services/profit-simulation/profit.services";
import { formatDateToString } from "src/utils/date";
import { toastOptions } from "src/components/toast/toast.options";
import { SavedListSearch } from "./saved-list-search";
import { SavedListDetail } from "./saved-list-details";
import { BoxLoading } from "src/components/box-loading";
import { formatFilter } from "src/utils/common";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";
interface IStateView {
	isView: boolean;
	record: any;
}

export const SavedListTab = () => {
	const [stateView, setStateView] = useState<IStateView>({
		isView: false,
		record: {},
	});
	const [params, setParams]: any = useState({
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

	const { size, page } = pick(mergeParams, ["size", "page"]);

	const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams({ page: newPage, size: params?.size || PAGINATION.PAGE_SIZE });
	};
	const { searchBy, searchByValue } = pick(params, ["searchBy", "searchByValue"]);

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
	const activities = useSelector(selectActivities);
	const columns = useMemo(() => {
		return [
			{
				header: "Record name",
				minSize: 300,
				accessorKey: "name",
				typeFilter: "includesMultipleFilter",
				Cell: ({ row, cell }) => {
					if (!activities.hasOwnProperty("ps_record_view")) return <>{cell.getValue()}</>;
					return (
						<Button
							variant="text"
							onClick={() => {
								getDetail(row?.original?.id);
							}}
							sx={{
								color: "info.main",
								textDecoration: "underline",
								textUnderlinePosition: "under",
								padding: "5px",
								justifyContent: "start",
							}}
						>
							{cell.getValue()}
						</Button>
					);
				},
			},
			{
				header: "Created time",
				minSize: 200,
				accessorKey: "created_at",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
			},
			{
				header: "Created by",
				minSize: 200,
				accessorKey: "created_by.email",
				typeFilter: "includesMultipleFilter",
			},
		];
	}, [activities]);

	const {
		data: PSGroupList,
		isFetching: isLoading,
		refetch,
	} = useQuery(
		[`profit-simulation-group-listing-${JSON.stringify(mergeParams)}`],
		() =>
			getPSGroupList({
				page: mergeParams.page + 1,
				itemsPerPage: mergeParams.size,
				q: "''",
				filter: formatFilter(mergeParams),
				sortBy: JSON.stringify([{ field: "created_at", direction: "desc" }]),
				descending: [],
			}),
		{
			onSuccess: (data) => {},
			keepPreviousData: true,
		}
	);

	const { mutate: getDetail, isLoading: isGetting } = useMutation(async (id: number | string) => {
		try {
			const response: any = await getPSGroupDetail(id);
			if (response?.status !== 200) {
				return false;
			} else {
				setStateView({
					isView: true,
					record: response?.data,
				});
				return true;
			}
		} catch (error) {
			return false;
		}
	});

	const { mutate: onDeleteGroup, isLoading: isDeletingGroup } = useMutation(async (ids: any[]) => {
		try {
			const response: any = await deletePSGroup(ids);
			if (response?.status !== 200) {
				toastOptions("error", "Delete error");
				return false;
			} else {
				toastOptions("success", "Delete success");
				setStateView({
					isView: false,
					record: {},
				});
				refetch();
				setSelectedRows({});
				return true;
			}
		} catch (error) {
			toastOptions("error", "Delete error");
			return false;
		}
	});

	const [selectedRows, setSelectedRows] = useState<any>({});

	if (stateView.isView) {
		return (
			<SavedListDetail
				stateView={stateView}
				setStateView={setStateView}
				getDetail={getDetail}
				refetch={refetch}
				isDeletingGroup={isDeletingGroup}
				onDeleteGroup={onDeleteGroup}
			/>
		);
	}

	return (
		<BoxLoading loading={isDeletingGroup}>
			<Box mt={{ xs: 1 }}>
				<MuiTable
					columns={columns}
					hasCheckbox
					loading={false}
					data={PSGroupList?.data?.items || []}
					enableRowNumbers
					enableColumnActions={false}
					enableColumnDragging={false}
					enableRowDragging={false}
					enableColumnResizing={false}
					pagination={{
						...getPagination({ rowsPerPage: size, page }),
						total: PSGroupList?.data?.total || 0,
						onPageChange: handleOnPageChange,
						onRowsPerPageChange: handleOnRowsPerPageChange,
					}}
					state={{ rowSelection: selectedRows }}
					onRowSelectionChange={setSelectedRows}
					getRowId={(row: any) => row?.id}
					renderTopToolbarCustomActions={() => (
						<SavedListSearch
							onSearch={handleOnSearch}
							selectedRows={selectedRows}
							setSelectedRows={setSelectedRows}
							valuesSearch={{
								searchBy,
								searchByValue,
							}}
						/>
					)}
				/>
			</Box>
		</BoxLoading>
	);
};
