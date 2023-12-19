import { Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { downloadLink } from "src/utils/common";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { MuiTable } from "src/components/mui-table";
import { map, without } from "lodash";
import { formatCurrencyPrefix } from "src/utils/currency";
import { NumericFormatCustom } from "../../number-format-custom";
import { useMutation } from "react-query";
import {
	deletePreview,
	editPreview,
} from "src/services/profit-simulation/preview-spreadsheet-list.services";
import { toastOptions } from "src/components/toast/toast.options";
import { useNavigate } from "react-router";
import { PATH } from "src/constants";

export const AddVendorCode = ({ data, formik, handleOnSave, refetch, id }: any) => {
	const mappingLabel = {
		YES4A: { label: "Yes4All, us_sporting_goods, YES4A", value: "YES4A" },
		YES4B: { label: "Yes4All - DROPSHIP, us_sporting_goods, YES4B", value: "YES4B" },
	};
	const [isEdit, setEdit] = useState<boolean>(false);
	const navigate = useNavigate();

	const getPropertiesTextFieldProps = (row) => {
		return {
			disabled: row.index === 0,
			sx: {
				"& .MuiInputBase-root.Mui-disabled:before": {
					borderColor: "transparent",
				},
				"& .MuiInput-root": {
					"& .MuiInputBase-input": {
						"&.Mui-disabled": {
							color: "#5D5A88",
							WebkitTextFillColor: "#5D5A88",
						},
					},
				},
			},
		};
	};

	const columns = useMemo(
		() => [
			{
				header: "Vendor Code",
				Header: () => (
					<Typography sx={{ lineHeight: "37px", fontWeight: "bold" }}>Vendor Code</Typography>
				),
				size: 350,
				accessorKey: "vendor_code",
				typeFilter: "includesMultipleFilter",
				hidden: false,
				Cell: ({ cell }) => {
					return (
						<Typography sx={{ lineHeight: "37px" }}>
							{mappingLabel[cell.getValue()].label}
						</Typography>
					);
				},
				enableEditing: (row) => {
					return row.index !== 0;
				},
				Edit: ({ row, cell, table }) => {
					return (
						<TextField
							fullWidth
							autoFocus
							size="small"
							name="vendor_code"
							variant="standard"
							{...getPropertiesTextFieldProps(row)}
							defaultValue={row.index !== 0 ? cell.getValue() : mappingLabel[cell.getValue()].label}
							onChange={(e) => {
								handleOnSave(table.options.data, cell, e.target.value);
							}}
							onBlur={() => {
								table.setEditingCell(false);
							}}
							select={row.index !== 0}
						>
							{map(Object.values(mappingLabel), (item) => (
								<MenuItem
									key={item.value}
									value={item.value}
									disabled={item.value === data?.data?.spreadsheet_table?.content[0]?.vendor_code}
								>
									{item.label}
								</MenuItem>
							))}
						</TextField>
					);
				},
			},
			{
				header: "List Price",
				Header: () => (
					<Typography sx={{ lineHeight: "37px", fontWeight: "bold" }}>List Price</Typography>
				),
				size: 180,
				accessorKey: "rrp",
				typeFilter: "includesMultipleFilter",
				hidden: false,
				enableEditing: (row) => {
					return row.index !== 0;
				},
				Cell: ({ cell }) => {
					return (
						<Typography sx={{ lineHeight: "37px" }}>
							{formatCurrencyPrefix(cell.getValue())}
						</Typography>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<TextField
							fullWidth
							autoFocus
							size="small"
							name="rrp"
							{...getPropertiesTextFieldProps(row)}
							variant="standard"
							defaultValue={cell.getValue()}
							InputProps={{
								inputComponent: NumericFormatCustom as any,
							}}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
								}
							}}
							onChange={(e) => {
								handleOnSave(table.options.data, cell, e.target.value);
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
							}}
						/>
					);
				},
			},
			{
				header: "Cost Price",
				Header: () => (
					<Typography sx={{ lineHeight: "37px", fontWeight: "bold" }}>Cost Price</Typography>
				),
				size: 180,
				accessorKey: "cost_to_market_place",
				typeFilter: "includesMultipleFilter",
				hidden: false,
				enableEditing: (row) => {
					return row.index !== 0;
				},
				Cell: ({ cell }) => {
					return (
						<Typography sx={{ lineHeight: "37px" }}>
							{formatCurrencyPrefix(cell.getValue())}
						</Typography>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<TextField
							fullWidth
							autoFocus
							size="small"
							name="cost_to_market_place"
							{...getPropertiesTextFieldProps(row)}
							variant="standard"
							defaultValue={cell.getValue()}
							InputProps={{
								inputComponent: NumericFormatCustom as any,
							}}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
								}
							}}
							onChange={(e) => {
								handleOnSave(table.options.data, cell, e.target.value);
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
							}}
						/>
					);
				},
			},
		],
		[data?.data?.type]
	);

	const { mutate: onSubmitEdit, isLoading: isLoading } = useMutation(async (data: any) => {
		try {
			const response: any = await editPreview(data);
			if (response?.status !== 200) {
				toastOptions("error", "Update spreadsheet preview error");
				formik.setFieldValue(
					"dataTable",
					without(data?.data?.spreadsheet_table?.content, undefined)
				);
				return false;
			} else {
				toastOptions("success", "Update spreadsheet preview success");
				refetch();
				setEdit(false);
				return true;
			}
		} catch (error) {
			toastOptions("error", "Update spreadsheet preview error");
			formik.setFieldValue("dataTable", without(data?.data?.spreadsheet_table?.content, undefined));
			return false;
		}
	});

	const { mutate: onDelete, isLoading: isLoadingDelete } = useMutation(async (data: any) => {
		try {
			const response: any = await deletePreview(id);
			if (response?.status !== 200) {
				toastOptions("error", "Delete spreadsheet preview error");
				return false;
			} else {
				toastOptions("success", "Delete spreadsheet preview success");
				navigate(PATH.PREVIEW_SPREADSHEET_LIST);
				return true;
			}
		} catch (error) {
			toastOptions("error", "Delete spreadsheet preview error");
			return false;
		}
	});

	return (
		<Grid container spacing={{ xs: 2, sm: 2 }}>
			<Grid item xs={12}>
				<Typography variant="h6" color="primary">
					{`Preview excel columns: Add Vendor Code Template SKU ${data?.data?.additional_data?.sku_code}`}
				</Typography>
			</Grid>
			{/* <Grid item xs={12}>
				<Typography variant="body1" color="primary" fontWeight={"bold"}>
					Download file will be imported to Amazon
				</Typography>
				<Button
					variant="text"
					sx={{
						color: "info.main",
						textDecoration: "underline",
						textUnderlinePosition: "under",
						px: "5px",
					}}
					onClick={() => {
						downloadLink(data?.data?.spreadsheet_filename, data?.data?.spreadsheet_url);
					}}
				>
					<Stack direction={"row"} gap="5px" alignItems={"flex-end"}>
						<AttachFileIcon />
						{data?.data?.spreadsheet_filename}
					</Stack>
				</Button>
			</Grid> */}
			<Grid item xs={12}>
				<Typography variant="body1" color="primary">
					Preview spreadsheet name: <strong>{data?.data?.spreadsheet_name}</strong>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<MuiTable
					columns={columns}
					data={formik.values.dataTable || []}
					enableColumnActions={false}
					enableColumnDragging={false}
					enableColumnOrdering={false}
					enableColumnResizing={false}
					enableTopToolbar={false}
					editingMode="cell"
					enableEditing={isEdit}
					muiTableBodyRowProps={({ row }) => {
						return {
							sx: {
								"&:hover": {
									"& td": {
										background: row?.index === 0 ? "#BEBEBE !important" : "inherit",
									},
								},
								"& .MuiTableCell-root": {
									background: row?.index === 0 ? "#BEBEBE" : "inherit",
									"&:hover": {
										background:
											row?.index === 0
												? "#BEBEBE !important"
												: isEdit
												? "#eeeeee!important"
												: "inherit",
										outline: "unset",
									},
								},
							},
						};
					}}
					enableBottomToolbar={isEdit}
					renderBottomToolbarCustomActions={() => (
						<Typography sx={{ fontStyle: "italic", p: "0 1rem" }} variant="body2">
							Double-Click a Cell to Edit
						</Typography>
					)}
					muiBottomToolbarProps={{
						sx: {
							minHeight: "30px",
						},
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				{isEdit ? (
					<>
						<Button
							variant="contained"
							sx={{ mr: 1 }}
							onClick={() => {
								onSubmitEdit({
									id: id,
									data: {
										spreadsheet_table: {
											content: formik.values.dataTable.map(
												({ cost_to_market_place, rrp, vendor_code }) => ({
													cost_to_market_place: +cost_to_market_place,
													rrp: +rrp,
													vendor_code,
												})
											),
											sheet_name: data?.data?.spreadsheet_name,
										},
									},
								});
							}}
						>
							Save
						</Button>
						<Button
							variant="outlined"
							sx={{ mr: 1 }}
							onClick={() => {
								setEdit(false);
								formik.setFieldValue(
									"dataTable",
									without(data?.data?.spreadsheet_table?.content, undefined)
								);
							}}
						>
							Cancel
						</Button>
					</>
				) : (
					<>
						<Button
							variant="contained"
							sx={{ mr: 1 }}
							onClick={() => {
								setEdit(false);
								formik.setFieldValue(
									"dataTable",
									without(data?.data?.spreadsheet_table?.content, undefined)
								);
							}}
						>
							Request Submit
						</Button>
						<Button variant="contained" sx={{ mr: 1 }} onClick={() => setEdit(true)}>
							Edit
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={() => {
								onDelete(id);
							}}
						>
							Delete
						</Button>
					</>
				)}
			</Grid>
		</Grid>
	);
};
