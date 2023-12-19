import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import Pagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { PAGINATION } from "src/constants";
import { roundUp } from "src/utils/profit-simulation/formulaPS";

const TextFieldGotoPageRoot = styled(TextField)(() => ({
	"& .MuiInputBase-input": {
		// padding: "2px 8px !important",
		textAlign: "center",

		"&::-webkit-inner-spin-button": {
			WebkitAppearance: "none",
			margin: 0,
		},
	},
}));

const GoToPage = ({ page, onPageChange, totalPage }) => {
	const [pageState, setPageState] = useState(page);

	useEffect(() => {
		setPageState(page || 0);
	}, [page]);

	const handleOnChange = (event) => {
		const newPage =
			parseInt((event.target?.value as any) || 1, 10) > totalPage
				? totalPage
				: parseInt((event.target?.value as any) || 1, 10);

		setPageState(newPage - 1);
	};

	const onPageChangeDebounce = debounce((newPage) => onPageChange(null, newPage), 300);

	return (
		<>
			<Typography variant="body2" sx={{ ml: 4, mr: 2, flexShrink: 0 }}>
				Page
			</Typography>
			<TextFieldGotoPageRoot
				value={pageState + 1}
				onChange={handleOnChange}
				onBlur={() => onPageChangeDebounce(pageState)}
				size="small"
				type="number"
				style={{ width: 80 }}
				inputProps={{
					onClick: (e: any) => {
						e.target.select();
					},
				}}
			/>
		</>
	);
};

const TablePaginationRoot = styled("div")(() => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "end",

	"& .MuiTablePagination-root": {
		"& .MuiTablePagination-select": {
			fontSize: "0.75rem",
		},
	},
}));

export const TablePagination = ({
	total,
	page,
	onPageChange,
	rowsPerPage,
	onRowsPerPageChange,
}) => {
	return (
		<TablePaginationRoot>
			<Pagination
				size="small"
				rowsPerPageOptions={PAGINATION.PER_PAGE_OPTIONS}
				component="div"
				count={total}
				page={page}
				onPageChange={onPageChange}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={onRowsPerPageChange}
				showFirstButton
				showLastButton
			/>
			<GoToPage
				page={page}
				onPageChange={onPageChange}
				totalPage={roundUp({ number: total / rowsPerPage, decimals: 0 })}
			/>
		</TablePaginationRoot>
	);
};
