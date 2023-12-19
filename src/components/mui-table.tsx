import { FC, MouseEvent, useMemo } from "react";

import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";
import map from "lodash/map";
import debounce from "lodash/debounce";

import MaterialReactTable, { MaterialReactTableProps } from "material-react-table";

import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { styled } from "@mui/material/styles";
import {
	equalDateFilter,
	equalNumberFilter,
	includesFilter,
	includesMultipleFilter,
	rangeDateFilter,
	rangeNumberFilter,
} from "src/utils/filter";
import { TablePagination } from "./table-pagination";

const TextFieldFilter = ({ onChange, placeholderFilter }) => (
	<TextField
		sx={{ margin: 0 }}
		size="small"
		onChange={debounce(onChange, 800)}
		placeholder={placeholderFilter}
		fullWidth
	/>
);

const MuiTableRoot = styled(Paper)(({ theme }) => {
	return {
		// overflow: "hidden",
		position: "relative",
		"& > .MuiPaper-root": {
			boxShadow: "none",
			"& .MuiToolbar-root": {
				"& .MuiCollapse-root": {
					display: "none",
				},
			},
		},

		"& .MuiTable-root": {
			"& .MuiTableHead-root": {
				"& .MuiTableRow-root": {
					boxShadow: "none",

					"& .MuiTableCell-root": {
						"& .MuiDivider-root": {
							marginRight: "-4px",
							opacity: 0,
							height: "1.6rem",
						},

						"& .MuiTableSortLabel-root": {
							"& .MuiTableSortLabel-icon": {
								color: theme.palette.text.primary,
							},
							"+ span > button": {
								pointerEvents: "none",
							},
						},

						"& .MuiCollapse-entered": {
							paddingRight: "4px",
						},
						"&:hover": {
							"& .MuiDivider-root": {
								opacity: 1,
							},
						},
					},
				},
			},

			"& .MuiTableBody-root": {
				"& .MuiTableRow-root": {
					background: "none",
					// "&:hover": {
					// 	"& td": {
					// 		background: "red",
					// 	},
					// },
				},
			},
		},

		"& .loading": {
			position: "absolute",
			overflow: "hidden",
			zIndex: 2,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "rgb(158 158 158 / 10%)",
			borderRadius: "8px",
		},
	};
});

export interface MuiTablePaginationProps {
	total?: number;
	rowsPerPage?: number;
	page?: number;
	onPageChange?: (event?: MouseEvent<HTMLButtonElement> | null, newPage?: number) => void;
	onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface Props extends Omit<MaterialReactTableProps, "columns"> {
	pagination?: MuiTablePaginationProps;
	loading?: boolean;
	columns?: any[];
	hasCheckbox?: boolean;
	state?: any;
}

export const MuiTable: FC<Props> = (props) => {
	const {
		initialState,
		loading,
		pagination,
		columns,
		data = [],
		hasCheckbox = false,
		state,
		...restProps
	} = props;

	const {
		page,
		rowsPerPage,
		onRowsPerPageChange,
		onPageChange,
		total = 0,
	} = pick(pagination, ["page", "rowsPerPage", "onRowsPerPageChange", "onPageChange", "total"]);

	const cloneColumns = map(columns, (item) => {
		let result: any = {};

		if (!item?.Filter) {
			result.Filter = (col) => {
				return (
					<TextFieldFilter
						onChange={(e) => col.header.column.setFilterValue(e.target.value || undefined)}
						placeholderFilter={item?.placeholderFilter || "Eg: 3,-5,3-,5-10"}
					/>
				);
			};
		}

		if (!item.filterFn) {
			result.filterFn = (row, _columnIds, filterValue) => {
				let funFilter = includesFilter;

				switch (item.typeFilter) {
					case "includesMultipleFilter":
						funFilter = includesMultipleFilter;
						break;
					case "equalDateFilter":
						funFilter = equalDateFilter;
						break;

					case "rangeDateFilter":
						funFilter = rangeDateFilter;
						break;

					case "equalNumberFilter":
						funFilter = equalNumberFilter;
						break;
					case "rangeNumberFilter":
						funFilter = rangeNumberFilter;
						break;
				}
				return !isEmpty(funFilter({ data: [row.original], field: _columnIds, value: filterValue }));
			};
		}

		return {
			...item,
			...result,
		};
	});

	return (
		<MuiTableRoot>
			<MaterialReactTable
				columns={cloneColumns}
				data={data}
				enableColumnOrdering
				enablePagination={false}
				enablePinning
				enableDensityToggle={false}
				initialState={{ density: "compact", ...initialState }}
				enableColumnResizing
				enableColumnFilters
				enableBottomToolbar={false}
				selectAllMode="all"
				enableRowSelection={hasCheckbox}
				enableGlobalFilter={false}
				state={{ isLoading: loading, ...state }}
				enableRowVirtualization
				enableStickyHeader
				muiTableContainerProps={{ sx: { maxHeight: "600px" } }}
				displayColumnDefOptions={{
					"mrt-row-numbers": {
						maxSize: 40,
						Header: () => "No.",
					},
					"mrt-row-select": {
						maxSize: 28,
					},
				}}
				{...restProps}
			/>
			{!isEmpty(pagination) && (
				<Box sx={{ pl: 2, pr: 2 }}>
					<TablePagination
						total={total}
						page={page}
						rowsPerPage={rowsPerPage}
						onPageChange={onPageChange}
						onRowsPerPageChange={onRowsPerPageChange}
					/>
				</Box>
			)}
		</MuiTableRoot>
	);
};
