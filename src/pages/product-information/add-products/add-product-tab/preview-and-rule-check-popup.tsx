import { Box, Button, Divider, Grid, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { find, map } from "lodash";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import BasicDialog from "src/components/modal";
import { MuiTable } from "src/components/mui-table";

export default function PreviewAndRuleCheckPopup({
	open,
	setOpen,
	data,
	files,
	setFiles,
	isSmsError,
	message,
}) {
	const [currentTab, setCurrentTab] = useState<string>("");
	const tabs = useMemo(() => {
		return data?.spreadsheet_table?.map((item: any, index) => {
			index === 0 && setCurrentTab(item.sheet_name);
			return {
				label: item.sheet_name,
				value: item.sheet_name,
				data: item,
			};
		});
	}, [data]);

	const componentCurrentTab = find(tabs, (item) => item.value === currentTab);

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	};

	const renderColumns = useCallback((header) => {
		return header?.map((item) => {
			return {
				header: item.key,
				Header: () => (
					<Box
						sx={{
							width: "100%",
						}}
					>
						<Typography
							sx={{
								borderBottom: "1px solid #CCC",
								height: "30px",
								lineHeight: "30px",
								padding: ".5rem",
								borderTopRightRadius: "5px",
								borderTopLeftRadius: "5px",
							}}
						>
							{item.col_index}
						</Typography>
						<Typography sx={{ height: "30px", lineHeight: "30px", padding: ".5rem" }}>
							{item.col_name}
						</Typography>
					</Box>
				),
				size: 140,
				accessorKey: `${item.key}.value`,
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell, row }) => {
					if (!!row?.original?.[`${item.key}`]?.list_key?.length) {
						return (
							<Tooltip title={row?.original?.[`${item.key}`]?.list_key?.[0]} placement="top">
								<Box
									sx={{
										height: "100%",
										width: "100%",
										cursor: "help",
									}}
								>
									<TextEllipsis value={cell.getValue()} />
								</Box>
							</Tooltip>
						);
					}
					return <TextEllipsis value={cell.getValue()} />;
				},
				muiTableHeadCellProps: {
					sx: {
						padding: "0 !important",
						"& .Mui-TableHeadCell-Content": {
							flex: "1 1",
						},
						"& .Mui-TableHeadCell-Content-Wrapper": {
							flex: "1 1",
						},
						"& .Mui-TableHeadCell-Content-Labels": {
							flex: "1 1",
						},
						"& .MuiBadge-root": {
							display: "none",
						},
						"& .Mui-TableHeadCell-Content-Actions": {
							display: "none",
						},
					},
				},
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							padding: "0px !important",
							border: !!row?.original?.[`${item.key}`]?.list_key?.length ? "1px solid red" : "",
						},
					};
				},
			};
		});
	}, []);

	return (
		<BasicDialog
			open={open}
			onClose={false}
			disabledBackdropClick
			handleClose={() => {
				setOpen(false);
			}}
			sxDialog={{
				padding: "24px",
			}}
			PaperProps={{
				sx: {
					maxWidth: "1010px",
					width: "100%",
					background: "#F2F1FA",
					margin: "15px",
				},
			}}
		>
			<Grid container spacing={{ xs: 2 }}>
				<Grid item xs={12}>
					<Typography variant="h6" color={"text.primary"}>
						Preview and rules check
					</Typography>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: "10px",
							marginTop: "10px",
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="11"
							height="23"
							viewBox="0 0 11 23"
							fill="none"
						>
							<path
								d="M9.5 5.5V17C9.5 19.21 7.71 21 5.5 21C3.29 21 1.5 19.21 1.5 17V4.5C1.5 3.12 2.62 2 4 2C5.38 2 6.5 3.12 6.5 4.5V15C6.5 15.55 6.05 16 5.5 16C4.95 16 4.5 15.55 4.5 15V5.5H3V15C3 16.38 4.12 17.5 5.5 17.5C6.88 17.5 8 16.38 8 15V4.5C8 2.29 6.21 0.5 4 0.5C1.79 0.5 0 2.29 0 4.5V17C0 20.04 2.46 22.5 5.5 22.5C8.54 22.5 11 20.04 11 17V5.5H9.5Z"
								fill="#006EC9"
							/>
						</svg>
						<Box
							sx={{
								flex: "1 1",
								color: "#006EC9",
							}}
						>
							<Box
								component={"span"}
								sx={{
									position: "relative",
									"&::before": {
										content: "''",
										position: "absolute",
										bottom: "0",
										left: "0",
										width: "100%",
										height: "1px",
										background: "#006EC9",
									},
								}}
							>
								{files?.[0]?.name}
							</Box>
						</Box>
					</Box>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body1" color={"text.primary"} fontWeight={700}>
						Preview of your file by Amazon
					</Typography>
					<Typography
						component="p"
						variant="body1"
						color={"text.primary"}
						sx={{ marginTop: "8px" }}
					>
						This preview is a preliminary analysis of the most common issues and might not include
						all of the products from your file. It is possible that you will encounter more errors
						after submission.
					</Typography>
					<Typography
						component="p"
						variant="body1"
						color={data?.spreadsheet_table?.length ? "error.main" : "success.main"}
						sx={{ marginTop: "8px" }}
					>
						{data?.spreadsheet_table?.length
							? "Please fix the highlighted errors and re-upload the file."
							: "Have not found any errors yet"}
					</Typography>
				</Grid>
				{isSmsError ? (
					<Grid item xs={12}>
						<Typography variant="body1" color={"text.primary"} fontWeight={700}>
							SMS check Vendor Code, Vendor SKU rules
						</Typography>
						<Typography
							component="p"
							variant="body1"
							color={"text.primary"}
							sx={{ marginTop: "8px" }}
						>
							{message}
						</Typography>
						<Typography
							component="p"
							variant="body1"
							color={"error.main"}
							sx={{ marginTop: "8px" }}
						>
							Please update and re-upload file.
						</Typography>
					</Grid>
				) : (
					<>
						{!data?.spreadsheet_table?.length && (
							<Grid item xs={12}>
								<Typography variant="body1" color={"text.primary"} fontWeight={700}>
									SMS check Vendor Code, Vendor SKU rules
								</Typography>
								<Typography
									component="p"
									variant="body1"
									color={"text.primary"}
									sx={{ marginTop: "8px" }}
								>
									{message}
								</Typography>
								<Typography
									component="p"
									variant="body1"
									color={"success.main"}
									sx={{ marginTop: "8px" }}
								>
									Have not found any errors yet.
								</Typography>
								<Typography
									component="p"
									variant="body1"
									color={"text.primary"}
									sx={{ marginTop: "8px" }}
								>
									Click button Request Submit to send the Add Products Request to Sales Manager for
									approval
								</Typography>
							</Grid>
						)}
					</>
				)}
				{data?.spreadsheet_table?.length && (
					<>
						<Grid item xs={12}>
							<MuiTable
								columns={renderColumns(componentCurrentTab?.data?.header)}
								data={componentCurrentTab?.data?.content}
								loading={false}
								enableTopToolbar={false}
								enableColumnResizing={false}
								enableColumnDragging={false}
								enableColumnOrdering={false}
								enableColumnActions={false}
								enableColumnFilterModes={false}
								enableColumnFilters={false}
								enableGlobalFilter={false}
								enableMultiSort={false}
								enableRowActions={false}
								enableSorting={false}
								enableToolbarInternalActions={false}
							/>
						</Grid>
						<Grid item xs={12}>
							<Tabs
								indicatorColor="primary"
								onChange={handleOnChangeTab}
								scrollButtons="auto"
								textColor="primary"
								value={currentTab}
								variant="scrollable"
							>
								{map(tabs, (tab) => (
									<Tab
										key={tab.value}
										label={tab.label}
										value={tab.value}
										sx={{
											border: "1px solid",
											background: "#fff",
											margin: "0px",
											"& + &": {
												marginLeft: 0,
											},
										}}
									/>
								))}
							</Tabs>
						</Grid>
					</>
				)}
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12} textAlign={"right"}>
					{!data?.spreadsheet_table?.length && !isSmsError ? (
						<Button
							variant="contained"
							sx={{ marginRight: "10px" }}
							onClick={() => {
								console.log("Request Submit");
							}}
						>
							Request Submit
						</Button>
					) : (
						<Button
							variant="contained"
							sx={{ marginRight: "10px" }}
							onClick={() => {
								setOpen(false);
								setFiles([]);
							}}
						>
							Re-upload
						</Button>
					)}
					<Button
						variant="outlined"
						onClick={() => {
							setOpen(false);
						}}
					>
						Close
					</Button>
				</Grid>
			</Grid>
		</BasicDialog>
	);
}
const TextEllipsis = ({ value }) => (
	<Box
		sx={{
			" -webkit-box-orient": "vertical",
			"-webkit-line-clamp": "1",
			textOverflow: "ellipsis",
			overflow: "hidden",
			whiteSpace: "nowrap",
			padding: "0.6rem 0.5rem",
		}}
	>
		{value}
	</Box>
);
