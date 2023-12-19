import { Grid } from "@mui/material";
import { clone, mergeWith, pick } from "lodash";
import React, { ChangeEvent, FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { MuiTable } from "src/components/mui-table";
import { FORMAT_DATE, PAGINATION, PATH } from "src/constants";
import { getPagination } from "src/utils/pagination";
import { Link } from "react-router-dom";
import { Skeleton } from "src/components/skeleton";
import { SignUpTabSearch } from "./sign-up-tab-search";
import { getSignUpRequestList } from "src/services/accounts-list";
import { formatDateToString } from "src/utils/date";
interface IProps {
	email: string;
	activities: any;
}

export const SignUpRequestTab: FC<IProps> = ({ activities, email }) => {
	const [params, setParams]: any = useState({
		itemsPerPage: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});
	const [isFirst, setFirst] = useState<boolean>(true);

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

	const columns = useMemo(
		() => [
			{
				header: "Full name",
				size: 200,
				accessorKey: "full_name",
				typeFilter: "includesMultipleFilter",
				Cell: ({ row, cell }) => {
					if (activities.hasOwnProperty("account_view")) {
						return (
							<Link to={`${PATH.ACCOUNT_LIST}${PATH.DETAIL}/${row?.original?.id}`}>
								{row.original.full_name}
							</Link>
						);
					}
					return <>{cell.getValue()}</>;
				},
			},
			{
				header: "Email",
				size: 200,
				accessorKey: "email",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Organization",
				size: 200,
				accessorKey: "organization.name",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Department",
				size: 180,
				accessorKey: "department.name",
				typeFilter: "includesMultipleFilter",
			},
			// {
			// 	header: "Role",
			// 	size: 150,
			// 	accessorKey: "role",
			// 	typeFilter: "includesMultipleFilter",
			// },
			{
				header: "Created time",
				size: 200,
				accessorKey: "created_at",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
			},
			{
				header: "Created by",
				size: 200,
				accessorKey: "created_by.full_name",
				typeFilter: "includesMultipleFilter",
			},
		],
		[activities]
	);

	const formatFilter = useCallback(
		(params, mail) => {
			if (mail && isFirst) {
				return JSON.stringify([{ field: "email", op: "==", value: email }]);
			}
			if (params.searchBy && params.searchByValue) {
				return JSON.stringify([
					{ field: params.searchBy, op: "ilike", value: `%${params.searchByValue}%` },
				]);
			}
			return [];
		},
		[isFirst]
	);

	const {
		data,
		isFetching: isLoading,
		refetch,
	} = useQuery(
		[`sign-up-listing-${JSON.stringify(mergeParams)}`, mergeParams],
		() =>
			getSignUpRequestList({
				...mergeParams,
				page: mergeParams.page + 1,
				q: "''",
				filter: formatFilter(mergeParams, email),
				sortBy: [],
				descending: [],
			}),
		{
			onSuccess: () => {
				isFirst && setFirst(false);
			},
			keepPreviousData: true,
		}
	);

	const [selectedRows, setSelectedRows] = useState<any>({});

	return (
		<>
			<Skeleton isLoading={isLoading}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item sm={12}>
						<MuiTable
							columns={columns}
							data={data?.data?.items || []}
							hasCheckbox
							enableRowNumbers={true}
							rowNumberMode="original"
							onRowSelectionChange={setSelectedRows}
							pagination={{
								...getPagination({ rowsPerPage: itemsPerPage, page }),
								total: data?.data?.total || 0,
								onPageChange: handleOnPageChange,
								onRowsPerPageChange: handleOnRowsPerPageChange,
							}}
							getRowId={(row: any) => row.id}
							state={{ rowSelection: selectedRows }}
							renderTopToolbarCustomActions={() => (
								<SignUpTabSearch
									activities={activities}
									refetch={() => {
										refetch();
										setSelectedRows({});
									}}
									onSearch={handleOnSearch}
									selectedRows={selectedRows}
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
};
