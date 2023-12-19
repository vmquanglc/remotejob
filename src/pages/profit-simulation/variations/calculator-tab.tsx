import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, TextField, Paper, CircularProgress, Button } from "@mui/material";
import { assign, cloneDeep, isBoolean, isNumber, omit, without } from "lodash";
import { MuiTable } from "src/components/mui-table";
import { VariationsSearch } from "./variations-search";
import { VariationHeader } from "./variation-header";
import { Restore } from "@mui/icons-material";
import {
	createGroupDetail,
	exportCalculator,
	getInfoAsin,
} from "src/services/profit-simulation/profit.services";
import { Stack } from "@mui/system";
import { IInputs } from "src/interface/profitSimulation.interface";
import {
	calSizeTier,
	calBlue,
	rounded,
	calMaxLoadingCapacity,
	calculator,
} from "src/utils/profit-simulation/formulaPS";
import { Skeleton } from "src/components/skeleton";
import { formatCurrencyPrefix } from "src/utils/currency";
import { BoxLoading } from "src/components/box-loading";
import { useMutation } from "react-query";
import { toastOptions } from "src/components/toast/toast.options";
import { NumericFormat } from "react-number-format";
import {
	COLUMNS_VISIBILITY,
	DEFAULT_FILTER,
	DEFAULT_VALUE_CALCULATOR_PS,
} from "src/constants/profitSimulation.constant";
import { formatNumber } from "src/utils/number";
import { ToolTip } from "src/components/tooltip";
import { socketProductInfo } from "src/utils/socket/socketProductInfo";
import uuid from "uuidv4";
import { useSelector, useDispatch } from "react-redux";
import { selectCalculator } from "src/store/calculator/selectors";
import {
	setAsinInfo,
	setAsinInfoError,
	setInitialCalReducer,
	setListRows,
	setRowInfo,
} from "src/store/calculator/actions";
import { getToken } from "src/utils/auth";

const colors = {
	first: "#F2F1FA",
	second: "#E7E6F2",
	third: "#ADABC3",
};

export const defaultVariables = {
	percent_submit_to_amz_di: null,
	percent_submit_to_amz_ds: null,
	percent_submit_to_amz_wh: null,
	amz_refund_and_chargeback: null,
	mix_channel_di: null,
	mix_channel_ds: null,
	mix_channel_wh: null,
	mix_channel_fba: null,
	percent_mkt_fee: null,
	percent_price_discount: null,
	period: "",
	product_source: "",
	category: "",
	suggested_duty: null,
	type_of_cont_shipping: "",
};

export const CalculatorTab = ({ assumption, suggestDuty }) => {
	const [socketID, setSocketID] = useState<string>("");
	const [selectedRows, setSelectedRows] = useState<any>({});
	const [columnVisibility, setColumnVisibility] = useState<any>({
		brand: false,
		channel: false,
		country: false,
		competitor_bep: false,
		max_loading_capacity: false,
		size_tier: false,
		longest_side: false,
		median_side: false,
		shortest_side: false,
		weight: false,
	});
	const [filter, setFilter] = useState<any>(
		Array(10).fill({
			...DEFAULT_FILTER,
			product_source: suggestDuty?.product_source[0],
			category: suggestDuty?.category[0],
			suggested_duty:
				suggestDuty?.suggested_duty?.[`${suggestDuty?.product_source[0]}`]?.[
					`${suggestDuty?.category[0]}`
				],
		})
	);

	const calculatorData = useSelector(selectCalculator);
	const [rowState, setRow] = useState<any>(0);
	const dispatch = useDispatch();
	const columns = useMemo(() => {
		return [
			{
				header: "ASIN",
				hidden: false,
				size: 100,
				accessorKey: "asin",
				typeFilter: "includesMultipleFilter",
				enableEditing: (row) => {
					return row?.index === 0 ? true : row?.original?.isAllowed;
				},
				Edit: ({ row, cell, table }) => {
					return (
						<TextField
							fullWidth
							size="medium"
							name="asin"
							variant="standard"
							autoFocus
							defaultValue={cell.getValue()}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
									handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
								}
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
								handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
							}}
						/>
					);
				},
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
							background: rowState === row.index ? "rgb(236, 237, 239)" : "#fff",
						},
					};
				},
			},
			{
				header: "Image",
				hidden: false,
				size: 60,
				accessorKey: "image",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				muiTableBodyCellProps: ({ row }) => {
					return {
						align: "center",
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				muiTableHeadCellProps: {
					align: "center",
					sx: {
						background: colors.first,
					},
				},
				Cell: ({ cell, row }) => (
					<>
						{cell.getValue() ? (
							<img
								width={"40px"}
								height={"40px"}
								src={`${cell.getValue()}`}
								srcSet={`${cell.getValue()}`}
								alt={row?.original?.product_name}
								loading="lazy"
							/>
						) : (
							<Box
								sx={{
									height: "40px",
									width: "40px",
								}}
							></Box>
						)}
					</>
				),
			},
			{
				header: "MSRP",
				enableEditing: (row) => {
					return row?.index === 0 ? true : row?.original?.isAllowed;
				},
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									MSRP <br /> (Mode)
								</span>
								<ToolTip title="Mode price in last 6 month of submitted ASIN" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				muiTableHeadCellProps: {
					align: "right",
				},
				hidden: false,
				size: 100,
				accessorKey: "rrp",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : "#fff",
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				Cell: ({ cell, row }) => {
					if (row?.original?.isLoading) {
						return (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						);
					}
					return (
						<>
							{cell.getValue() ? (
								<Stack direction="row" alignItems={"center"} spacing={1} sx={{ width: "100%" }}>
									<Restore
										sx={{
											opacity:
												row?.original?.rrp_previous &&
												+row?.original?.rrp_previous !== +cell.getValue()
													? 1
													: 0.4,
										}}
										onClick={() => {
											row?.original?.rrp_previous &&
												+row?.original?.rrp_previous !== +cell.getValue() &&
												handleResetValue("rrp", row?.original, cell);
										}}
									/>
									<Box sx={{ flex: "1 1", textAlign: "right" }}>
										{formatNumber({ number: cell.getValue() })}
									</Box>
								</Stack>
							) : (
								<>{cell.getValue()}</>
							)}
						</>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<NumericFormat
							allowNegative={false}
							decimalScale={2}
							fixedDecimalScale
							valueIsNumericString
							fullWidth
							autoFocus
							size="small"
							name="rrp"
							variant="standard"
							customInput={TextField}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
									handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
								}
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
								handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
							}}
							defaultValue={cell.getValue()}
						/>
					);
				},
			},
			{
				header: "FOB",
				muiTableHeadCellProps: {
					align: "right",
				},
				enableEditing: (row) => {
					return row?.index === 0 ? true : row?.original?.isAllowed;
				},
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>FOB</span>
								<ToolTip title="Default is 20% of the RRP" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 90,
				accessorKey: "fob",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : "#fff",
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				Cell: ({ cell, row }) => {
					if (row?.original?.isLoading) {
						return (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						);
					}
					return (
						<>
							{cell.getValue() ? (
								<Stack direction="row" alignItems={"center"} spacing={1} sx={{ width: "100%" }}>
									<Restore
										sx={{
											opacity:
												row?.original?.fob_previous &&
												+row?.original?.fob_previous !== +cell.getValue()
													? 1
													: 0.4,
										}}
										onClick={() => {
											row?.original?.fob_previous &&
												+row?.original?.fob_previous !== +cell.getValue() &&
												handleResetValue("fob", row?.original, cell);
										}}
									/>
									<Box sx={{ flex: "1 1", textAlign: "right" }}>
										{formatNumber({ number: cell.getValue() })}
									</Box>
								</Stack>
							) : (
								<>{cell.getValue()}</>
							)}
						</>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<NumericFormat
							allowNegative={false}
							decimalScale={2}
							fixedDecimalScale
							valueIsNumericString
							fullWidth
							autoFocus
							size="small"
							name="fob"
							variant="standard"
							customInput={TextField}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
									handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
								}
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
								handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
							}}
							defaultValue={cell.getValue()}
						/>
					);
				},
			},
			{
				header: "Blue?",
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>Blue?</span>
								<ToolTip
									title={`Blue: Size tier is oversize product and packaging actual weight > 5 pound. \nRed: Size tier is standard size product\nNote: Direct market sizre doesn't take account`}
									fontSize="small"
									sx={{
										whiteSpace: "break-spaces",
									}}
								/>
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 60,
				accessorKey: "is_blue",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ cell }) => {
					if (!isBoolean(cell.getValue())) return "";
					return (
						<Typography
							sx={{
								textAlign: "center",
								color: cell.getValue() ? "#003DDA" : "#D60000",
							}}
						>
							{cell.getValue() ? "Blue" : "Red"}
						</Typography>
					);
				},
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				muiTableHeadCellProps: {
					sx: {
						background: colors.first,
					},
				},
			},

			// {
			// 	header: "Internal channel",
			// 	Header: ({ row }) =>
			// 		MergeUIColumns({
			// 			...InterCMGroupOptions,
			// 			row: row,
			// 			isHeader: true,
			// 			labelGroup: "CM Internal ($/unit)",
			// 		}),
			// 	hidden: false,
			// 	size: 500,
			// 	minSize: 500,
			// 	accessorKey: "internal_channel",
			// 	typeFilter: "includesMultipleFilter",
			// 	enableEditing: false,
			// 	Cell: ({ row }) => {
			// 		return MergeUIColumns({
			// 			...InterCMGroupOptions,
			// 			row: row,
			// 			isHeader: false,
			// 			labelGroup: "CM Internal ($/unit)",
			// 		});
			// 	},
			// 	muiTableBodyCellProps: {
			// 		sx: {
			// 			padding: "0 !important",
			// 			background: colors.second,
			// 		},
			// 	},
			// 	muiTableHeadCellProps: {
			// 		sx: {
			// 			padding: "0 !important",
			// 			background: colors.second,
			// 		},
			// 	},
			// },
			// {
			// 	header: "Internal channel percent",
			// 	Header: ({ row }) =>
			// 		MergeUIColumns({
			// 			...InterCMGroupOptionsPercent,
			// 			row: row,
			// 			isHeader: true,
			// 			labelGroup: "CM Internal % ($/unit)",
			// 		}),
			// 	hidden: false,
			// 	size: 500,
			// 	minSize: 500,
			// 	accessorKey: "internal_channel_percent",
			// 	typeFilter: "includesMultipleFilter",
			// 	enableEditing: false,
			// 	Cell: ({ row }) => {
			// 		return MergeUIColumns({
			// 			...InterCMGroupOptionsPercent,
			// 			row: row,
			// 			isHeader: false,
			// 			labelGroup: "CM Internal % ($/unit)",
			// 		});
			// 	},
			// 	muiTableBodyCellProps: {
			// 		sx: {
			// 			padding: "0 !important",
			// 			background: colors.second,
			// 		},
			// 	},
			// 	muiTableHeadCellProps: {
			// 		sx: {
			// 			padding: "0 !important",
			// 			background: colors.second,
			// 		},
			// 	},
			// },
			//cm external
			{
				header: "Channel mix",
				Header: ({ row }) =>
					MergeUIColumns({
						...ChannelMixOptions,
						row: row,
						isHeader: true,
						labelGroup: "Channel mix",
					}),
				hidden: false,
				size: 520,
				minSize: 520,
				accessorKey: "channel_mix",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ row }) => {
					return MergeUIColumns({
						...ChannelMixOptions,
						row: row,
						isHeader: false,
						labelGroup: "Channel mix",
					});
				},
				muiTableBodyCellProps: ({ row }) => ({
					sx: {
						padding: "0 !important",
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.second,
					},
				}),
				muiTableHeadCellProps: {
					sx: {
						padding: "0 !important",
						background: colors.second,
					},
				},
			},
			{
				header: "External contribution margin ($/unit)",
				Header: ({ row }) =>
					MergeUIColumns({
						...ExternalOptions,
						row: row,
						isHeader: true,
						labelGroup: "External contribution margin ($/unit)",
					}),
				hidden: false,
				size: 400,
				minSize: 400,
				accessorKey: "external_channel",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ row }) => {
					return MergeUIColumns({
						...ExternalOptions,
						row: row,
						isHeader: false,
						labelGroup: "External contribution margin ($/unit)",
					});
				},
				muiTableBodyCellProps: ({ row }) => ({
					sx: {
						padding: "0 !important",
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
					},
				}),
				muiTableHeadCellProps: {
					sx: {
						padding: "0 !important",
						background: colors.first,
					},
				},
			},
			{
				header: "External contribution margin (%/unit)",
				Header: ({ row }) =>
					MergeUIColumns({
						...ExternalOptionsPercent,
						row: row,
						isHeader: true,
						labelGroup: "External contribution margin (%/unit)",
					}),
				hidden: false,
				size: 400,
				minSize: 400,
				accessorKey: "external_channel_percent",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ row }) => {
					return MergeUIColumns({
						...ExternalOptionsPercent,
						row: row,
						isHeader: false,
						labelGroup: "External contribution margin (%/unit)",
					});
				},
				muiTableBodyCellProps: ({ row }) => ({
					sx: {
						padding: "0 !important",
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.second,
					},
				}),
				muiTableHeadCellProps: {
					sx: {
						padding: "0 !important",
						background: colors.second,
					},
				},
			},

			//net profit
			// {
			// 	header: "Net profit",
			// 	Header: ({ row }) =>
			// 		MergeUIColumns({
			// 			...NetProfitOptions,
			// 			row: row,
			// 			isHeader: true,
			// 			labelGroup: "Net profit ($/unit)",
			// 		}),
			// 	hidden: false,
			// 	size: 500,
			// 	minSize: 500,
			// 	accessorKey: "net_profit",
			// 	typeFilter: "includesMultipleFilter",
			// 	enableEditing: false,
			// 	Cell: ({ row }) => {
			// 		return MergeUIColumns({
			// 			...NetProfitOptions,
			// 			row: row,
			// 			isHeader: false,
			// 			labelGroup: "Net profit ($/unit)",
			// 		});
			// 	},
			// 	muiTableBodyCellProps: {
			// 		sx: {
			// 			padding: "0 !important",
			// 			background: colors.second,
			// 		},
			// 	},
			// 	muiTableHeadCellProps: {
			// 		sx: {
			// 			padding: "0 !important",
			// 			background: colors.second,
			// 		},
			// 	},
			// },
			//Net PPM
			{
				header: "Net PPM ($/unit)",
				Header: ({ row }) =>
					MergeUIColumns({
						...NetPPMOptions,
						row: row,
						isHeader: true,
						labelGroup: "Net PPM ($/unit)",
					}),
				hidden: false,
				size: 300,
				minSize: 300,
				accessorKey: "net_ppm",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ row }) => {
					return MergeUIColumns({
						...NetPPMOptions,
						row: row,
						isHeader: false,
						labelGroup: "Net PPM ($/unit)",
					});
				},
				muiTableBodyCellProps: ({ row }) => ({
					sx: {
						padding: "0 !important",
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
					},
				}),
				muiTableHeadCellProps: {
					sx: {
						padding: "0 !important",
						background: colors.first,
					},
				},
			},
			//Net PPM percent
			{
				header: "Net PPM (%/unit)",
				Header: ({ row }) =>
					MergeUIColumns({
						...NetPPMPercentOptions,
						row: row,
						isHeader: true,
						labelGroup: "Net PPM (%/unit)",
					}),
				hidden: false,
				size: 300,
				minSize: 300,
				accessorKey: "net_ppm_percent",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				Cell: ({ row }) => {
					return MergeUIColumns({
						...NetPPMPercentOptions,
						row: row,
						isHeader: false,
						labelGroup: "Net PPM (%/unit)",
					});
				},
				muiTableBodyCellProps: ({ row }) => ({
					sx: {
						padding: "0 !important",
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.second,
					},
				}),
				muiTableHeadCellProps: {
					sx: {
						padding: "0 !important",
						background: colors.second,
					},
				},
			},
			{
				header: "Brand",
				hidden: false,
				size: 140,
				accessorKey: "brand",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				muiTableHeadCellProps: {
					sx: {
						background: colors.first,
					},
				},
			},
			{
				header: "Channel",
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									Current buy
									<br />
									box channel
								</span>
								<ToolTip title="Selling channel of seller who wins Buy Box" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 100,
				accessorKey: "channel",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				muiTableBodyCellProps: ({ row }) => ({
					sx: {
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
						color:
							!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
					},
				}),
				muiTableHeadCellProps: {
					sx: {
						background: colors.first,
					},
				},
			},
			{
				header: "Country",
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>Country</span>
								<ToolTip
									title="The country-of-origin of the seller who owns the Buy Box"
									fontSize="small"
								/>
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 100,
				accessorKey: "country",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				muiTableBodyCellProps: ({ row }) => ({
					sx: {
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
						color:
							!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
					},
				}),
				muiTableHeadCellProps: {
					sx: {
						background: colors.first,
					},
				},
			},
			{
				header: "Competitor BEP (FBA)",
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									Competitor
									<br />
									BEP (FBA)
								</span>
								<ToolTip title="Breakeven point of competitor at FBA channel" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 100,
				accessorKey: "competitor_bep",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				muiTableBodyCellProps: ({ row }) => ({
					align: "right",
					sx: {
						background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
						color:
							!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
					},
				}),
				muiTableHeadCellProps: {
					align: "right",
					sx: {
						background: colors.first,
					},
				},
				Cell: ({ cell, row }) => {
					if (!isNumber(cell.getValue())) return <></>;
					return (
						<Typography
							sx={{
								color:
									cell.getValue() < 0
										? "error.main"
										: !row?.original?.isViewResult && !row?.original?.isLoading
										? "error.main"
										: "text.primary",
							}}
						>
							{cell.getValue() < 0
								? `(${formatCurrencyPrefix(cell.getValue() * -1)})`
								: `${formatCurrencyPrefix(cell.getValue())}`}
						</Typography>
					);
				},
			},

			// {
			// 	header: "Packaging dimension?",
			// 	Header: () => (
			// 		<>
			// 			<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
			// 				Packaging <br /> dimension?
			// 			</Typography>
			// 		</>
			// 	),
			// 	hidden: false,
			// 	size: 120,
			// 	accessorKey: "is_packaging_dimension",
			// 	typeFilter: "includesMultipleFilter",
			// 	enableEditing: false,

			// 	muiTableBodyCellProps: ({ row }) => {
			// 		return {
			// 			sx: {
			// 				background: colors.first,
			// 				color:
			// 					!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
			// 			},
			// 		};
			// 	},
			// 	muiTableHeadCellProps: {
			// 		sx: {
			// 			background: colors.first,
			// 		},
			// 	},
			// 	Cell: ({ cell }) => {
			// 		if (!isBoolean(cell.getValue())) return "";
			// 		return <Typography>{cell.getValue() ? "Yes" : "No"}</Typography>;
			// 	},
			// },
			{
				header: "Max loading capacity",
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									Max loading
									<br />
									capacity
								</span>
								<ToolTip title="Maximum number of pieces loaded per container" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 110,
				accessorKey: "max_loading_capacity",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				muiTableBodyCellProps: ({ row }) => {
					return {
						align: "right",
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				muiTableHeadCellProps: {
					align: "right",
					sx: {
						background: colors.first,
					},
				},
				Cell: ({ cell }) => {
					if (!isNumber(cell.getValue())) return "";
					return <Typography>{cell.getValue()}</Typography>;
				},
			},
			{
				header: "Size-tier",
				hidden: false,
				size: 110,
				accessorKey: "size_tier",
				typeFilter: "includesMultipleFilter",
				enableEditing: false,
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				muiTableHeadCellProps: {
					sx: {
						background: colors.first,
					},
				},
				Cell: ({ cell }) => {
					if (!cell.getValue()) return "";
					return <Typography>{cell.getValue()}</Typography>;
				},
			},
			{
				header: "Length",
				enableEditing: (row) => {
					return row?.index === 0 ? true : row?.original?.isAllowed;
				},
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									Length
									<br />
									(in)
								</span>
								<ToolTip title="Packaging length " fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : "initial",
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				Cell: ({ cell, row }) => {
					if (row?.original?.isLoading) {
						return (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						);
					}
					return (
						<>
							{cell.getValue() ? (
								<Stack direction="row" alignItems={"center"} spacing={1} sx={{ width: "100%" }}>
									<Restore
										sx={{
											opacity:
												row?.original?.longest_side_previous &&
												+row?.original?.longest_side_previous !== +cell.getValue()
													? 1
													: 0.4,
										}}
										onClick={() => {
											row?.original?.longest_side_previous &&
												+row?.original?.longest_side_previous !== +cell.getValue() &&
												handleResetValue("longest_side", row?.original, cell);
										}}
									/>
									<Box sx={{ flex: "1 1", textAlign: "right" }}>
										{formatNumber({ number: cell.getValue() })}
									</Box>
								</Stack>
							) : (
								<>{cell.getValue()}</>
							)}
						</>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<NumericFormat
							allowNegative={false}
							decimalScale={2}
							fixedDecimalScale
							valueIsNumericString
							fullWidth
							autoFocus
							size="small"
							name="longest_side"
							variant="standard"
							customInput={TextField}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
									handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
								}
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
								handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
							}}
							defaultValue={cell.getValue()}
						/>
					);
				},
				hidden: false,
				size: 90,
				accessorKey: "longest_side",
				typeFilter: "includesMultipleFilter",
				muiTableHeadCellProps: {
					align: "right",
				},
			},
			{
				header: "Width",
				enableEditing: (row) => {
					return row?.index === 0 ? true : row?.original?.isAllowed;
				},
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									Width
									<br />
									(in)
								</span>
								<ToolTip title="Packaging width" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 90,
				accessorKey: "median_side",
				typeFilter: "includesMultipleFilter",
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : "initial",
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				Cell: ({ cell, row }) => {
					if (row?.original?.isLoading) {
						return (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						);
					}
					return (
						<>
							{cell.getValue() ? (
								<Stack direction="row" alignItems={"center"} spacing={1} sx={{ width: "100%" }}>
									<Restore
										sx={{
											opacity:
												row?.original?.median_side_previous &&
												+row?.original?.median_side_previous !== +cell.getValue()
													? 1
													: 0.4,
										}}
										onClick={() => {
											row?.original?.median_side_previous &&
												+row?.original?.median_side_previous !== +cell.getValue() &&
												handleResetValue("median_side", row?.original, cell);
										}}
									/>
									<Box sx={{ flex: "1 1", textAlign: "right" }}>
										{formatNumber({ number: cell.getValue() })}
									</Box>
								</Stack>
							) : (
								<>{cell.getValue()}</>
							)}
						</>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<NumericFormat
							allowNegative={false}
							decimalScale={2}
							fixedDecimalScale
							valueIsNumericString
							fullWidth
							autoFocus
							size="small"
							name="median_side"
							variant="standard"
							customInput={TextField}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
									handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
								}
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
								handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
							}}
							defaultValue={cell.getValue()}
						/>
					);
				},
			},
			{
				header: "Height",
				enableEditing: (row) => {
					return row?.index === 0 ? true : row?.original?.isAllowed;
				},
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									Height
									<br />
									(in)
								</span>
								<ToolTip title="Packaging heght" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 90,
				accessorKey: "shortest_side",
				typeFilter: "includesMultipleFilter",
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : "initial",
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				Cell: ({ cell, row }) => {
					if (row?.original?.isLoading) {
						return (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						);
					}
					return (
						<>
							{cell.getValue() ? (
								<Stack direction="row" alignItems={"center"} spacing={1} sx={{ width: "100%" }}>
									<Restore
										sx={{
											opacity:
												row?.original?.shortest_side_previous &&
												+row?.original?.shortest_side_previous !== +cell.getValue()
													? 1
													: 0.4,
										}}
										onClick={() => {
											row?.original?.shortest_side_previous &&
												+row?.original?.shortest_side_previous !== +cell.getValue() &&
												handleResetValue("shortest_side", row?.original, cell);
										}}
									/>
									<Box sx={{ flex: "1 1", textAlign: "right" }}>
										{formatNumber({ number: cell.getValue() })}
									</Box>
								</Stack>
							) : (
								<>{cell.getValue()}</>
							)}
						</>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<NumericFormat
							allowNegative={false}
							decimalScale={2}
							fixedDecimalScale
							valueIsNumericString
							fullWidth
							autoFocus
							size="small"
							name="shortest_side"
							variant="standard"
							customInput={TextField}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
									handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
								}
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
								handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
							}}
							defaultValue={cell.getValue()}
						/>
					);
				},
			},
			{
				header: "Actual Weight",
				enableEditing: (row) => {
					return row?.index === 0 ? true : row?.original?.isAllowed;
				},
				Header: () => (
					<>
						<Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
							<Typography
								sx={{
									display: "flex",
									fontWeight: "bold",
									flex: "1 1",
									width: "100%",
									justifyContent: "space-between",
									gap: "5px",
								}}
							>
								<span>
									Actual Weight
									<br />
									(lb)
								</span>
								<ToolTip title="Packaging actual weight" fontSize="small" />
							</Typography>
						</Typography>
					</>
				),
				hidden: false,
				size: 120,
				accessorKey: "weight",
				typeFilter: "includesMultipleFilter",
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : "initial",
							color:
								!row?.original?.isViewResult && !row?.original?.isLoading ? "#C10000" : "#5D5A88",
						},
					};
				},
				Cell: ({ cell, row }) => {
					if (row?.original?.isLoading) {
						return (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						);
					}
					return (
						<>
							{cell.getValue() ? (
								<Stack direction="row" alignItems={"center"} spacing={1} sx={{ width: "100%" }}>
									<Restore
										sx={{
											opacity:
												row?.original?.weight_previous &&
												+row?.original?.weight_previous !== +cell.getValue()
													? 1
													: 0.4,
										}}
										onClick={() => {
											row?.original?.weight_previous &&
												+row?.original?.weight_previous !== +cell.getValue() &&
												handleResetValue("weight", row?.original, cell);
										}}
									/>
									<Box sx={{ flex: "1 1", textAlign: "right" }}>
										{formatNumber({ number: cell.getValue() })}
									</Box>
								</Stack>
							) : (
								<>{cell.getValue()}</>
							)}
						</>
					);
				},
				Edit: ({ row, cell, table }) => {
					return (
						<NumericFormat
							allowNegative={false}
							decimalScale={2}
							fixedDecimalScale
							valueIsNumericString
							fullWidth
							autoFocus
							size="small"
							name="weight"
							variant="standard"
							customInput={TextField}
							onKeyDown={(e: any) => {
								if (e.keyCode === 13) {
									table.setEditingCell(false);
									handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
								}
							}}
							onBlur={(e) => {
								table.setEditingCell(false);
								handleOnSave(table, row, cell, e.target.value, filter[cell.row.index], socketID);
							}}
							defaultValue={cell.getValue()}
						/>
					);
				},
			},
		];
	}, [calculatorData, assumption, filter, rowState, socketID]);

	const handleOnSave = async (
		table: any,
		row: any,
		cell: any,
		value: number | string,
		inputs: any,
		socket_id: string
	) => {
		if (!value) {
			return;
		}

		const { max_vol_cont_40, max_wei_cont_40 } = assumption;
		if (cell.column.id !== "asin") {
			const new_rrp = cell.column.id === "rrp" ? +value : row?.original?.rrp;
			const new_fob = cell.column.id === "fob" ? +value : row?.original?.fob;
			const new_longest_side =
				cell.column.id === "longest_side" ? +value : row?.original?.longest_side;
			const new_median_side =
				cell.column.id === "median_side" ? +value : row?.original?.median_side;
			const new_shortest_side =
				cell.column.id === "shortest_side" ? +value : row?.original?.shortest_side;
			const new_weight = cell.column.id === "weight" ? +value : row?.original?.weight;
			dispatch(
				setRowInfo(
					{
						...row?.original,
						[cell.column.id]: value,
						inputs: inputs,
						isAllowed: true,
						size_tier: calSizeTier(
							new_longest_side,
							new_median_side,
							new_shortest_side,
							new_weight
						),
						is_blue: calBlue(new_longest_side, new_median_side, new_shortest_side, new_weight),
						max_loading_capacity: calMaxLoadingCapacity(
							max_vol_cont_40,
							new_longest_side,
							new_median_side,
							new_shortest_side,
							max_wei_cont_40,
							new_weight
						),
						...DEFAULT_VALUE_CALCULATOR_PS,
						isViewResult: true,
						...calculator(
							assumption,
							new_rrp,
							new_fob,
							new_longest_side,
							new_median_side,
							new_shortest_side,
							new_weight,
							inputs
						),
					},
					cell.row.index
				)
			);

			if (cell.row.index < 9) {
				dispatch(
					setRowInfo(
						{
							...table?.options?.data?.[row.index + 1],
							isAllowed: true,
							inputs: inputs,
						},
						cell.row.index + 1
					)
				);
			}

			setSelectedRows((state) => ({
				...omit(state, [cell.row.index]),
			}));
			return;
		}
		if (row?.original?.asin === value) return;
		setLoading(true);
		if (cell.row.index < 9) {
			dispatch(
				setRowInfo(
					{
						...table?.options?.data?.[row.index + 1],
						isAllowed: true,
						inputs: inputs,
					},
					cell.row.index + 1
				)
			);
		}
		const request_id = uuid();
		dispatch(
			setRowInfo(
				{
					...row?.original,
					[cell.column.id]: value,
					request_id: request_id,
					isLoading: true,
					isViewResult: true,
					inputs: inputs,
					...DEFAULT_VALUE_CALCULATOR_PS,
				},
				cell.row.index
			)
		);
		await getInfoAsin({
			asinId: value,
			params: {
				socket_id: socket_id,
				request_id: request_id,
			},
		});
		setLoading(false);
		setSelectedRows((state) => ({
			...omit(state, [cell.row.index]),
		}));
		return;
	};

	const handleResetValue = useCallback(
		(id, data, cell) => {
			const new_rrp = id === "rrp" ? data?.rrp_previous : data?.rrp;
			const new_fob = id === "fob" ? data?.fob_previous : data?.fob;
			const new_longest_side =
				id === "longest_side" ? data?.longest_side_previous : data?.longest_side;
			const new_median_side = id === "median_side" ? data?.median_side_previous : data?.median_side;
			const new_shortest_side =
				id === "shortest_side" ? data?.shortest_side_previous : data?.shortest_side;
			const new_weight = id === "weight" ? data?.weight_previous : data?.weight;
			dispatch(
				setRowInfo(
					{
						...data,
						[id]: data[`${id}_previous`],
						isViewResult: true,
						inputs: filter[cell.row.index],
						...calculator(
							assumption,
							new_rrp,
							new_fob,
							new_longest_side,
							new_median_side,
							new_shortest_side,
							new_weight,
							filter[cell.row.index]
						),
					},
					cell.row.index
				)
			);
			setSelectedRows((state) => ({
				...omit(state, [cell.row.index]),
			}));
		},
		[calculatorData, filter]
	);

	const listCannotSave = Object.keys(selectedRows).length
		? without(
				Object.keys(selectedRows).map((item) => {
					const itemData = calculatorData?.[item];
					if (
						!itemData?.rrp ||
						!itemData?.shortest_side ||
						!itemData?.weight ||
						!itemData?.size_tier ||
						!itemData?.fob ||
						!itemData?.longest_side ||
						!itemData?.median_side
					)
						return {
							...itemData,
							id: item,
						};
				}),
				undefined
		  )
		: [];
	const handleConfirmModal = useCallback(
		(array) => {
			setSelectedRows(omit(selectedRows, array));
		},
		[selectedRows]
	);

	const [isLoading, setLoading] = useState<boolean>(false);

	const getInputs = useCallback(
		(value: IInputs) => {
			let item = calculatorData?.[rowState];
			const { rrp, fob, longest_side, median_side, shortest_side, weight } = item;
			if (rrp && fob && longest_side && median_side && shortest_side && weight) {
				item = assign(
					{ ...item, inputs: value, isViewResult: true },
					{
						...calculator(
							assumption,
							rrp,
							fob,
							longest_side,
							median_side,
							shortest_side,
							weight,
							value
						),
					}
				);
			}
			dispatch(setRowInfo(item, rowState));
		},
		[calculatorData, rowState]
	);

	const { mutate: onSave, isLoading: isSaving } = useMutation(async (data: any) => {
		try {
			const response: any = await createGroupDetail(data);
			if (response?.status !== 200) {
				toastOptions("error", "Save error");
				return false;
			} else {
				toastOptions("success", "Save success");
				return true;
			}
		} catch (error) {
			toastOptions("error", "Save error");
			return false;
		}
	});

	const { mutate: onExport, isLoading: isExporting } = useMutation(async (data: any) => {
		try {
			const response = await exportCalculator(data);
			if (response.status === 200) {
				toastOptions("success", "Export successfully");
			} else {
				toastOptions("error", "Export error");
			}
			setSelectedRows({});
		} catch (error) {
			return false;
		}
	});

	const handleSaveRecord = useCallback(
		async (name: string) => {
			setCreating(true);
			const idxItems = Object.keys(selectedRows);
			const itemsSave = idxItems.map((key) =>
				omit(calculatorData[key], [
					"fob_previous",
					"rrp_previous",
					"isViewResult",
					"isAllowed",
					"longest_side_previous",
					"median_side_previous",
					"shortest_side_previous",
					"weight_previous",
				])
			);
			const payload = {
				name: name,
				assumption: assumption,
				profit_simulations: itemsSave,
			};
			await onSave(payload);
			setSelectedRows({});
			setCreating(false);
			setOpen(false);
		},
		[selectedRows, calculatorData, assumption]
	);
	const [isOpen, setOpen] = useState<boolean>(false);
	const [isCreating, setCreating] = useState<boolean>(false);

	const handleExport = useCallback(
		async (arrayID: any[]) => {
			const itemsExport = arrayID.map((key) =>
				omit(calculatorData[key], [
					"fob_previous",
					"rrp_previous",
					"isViewResult",
					"isAllowed",
					"longest_side_previous",
					"median_side_previous",
					"shortest_side_previous",
					"weight_previous",
				])
			);
			const payload = {
				inputs: itemsExport[0].inputs,
				assumption: assumption,
				profit_simulations: itemsExport.map((item) => omit(item, "inputs")),
			};
			await onExport(payload);
		},
		[calculatorData, columns]
	);

	const handleDeleteRow = useCallback(
		(ids: any[]) => {
			let draft = cloneDeep(calculatorData);
			let filterDraft = cloneDeep(filter);
			for (let index = 0; index < ids.length; index++) {
				draft.splice(+ids[index] - index, 1);
				filterDraft.splice(+ids[index] - index, 1);
			}
			dispatch(
				setListRows(
					new Array(
						...draft,
						...Array(ids?.length).fill({
							inputs: defaultVariables,
							isViewResult: false,
							isLoading: false,
							isAllowed: false,
						})
					)
				)
			);

			setFilter(
				new Array(
					...filterDraft,
					...Array(ids?.length).fill({
						...DEFAULT_FILTER,
						product_source: suggestDuty?.product_source[0],
						category: suggestDuty?.category[0],
						suggested_duty:
							suggestDuty?.suggested_duty?.[`${suggestDuty?.product_source[0]}`]?.[
								`${suggestDuty?.category[0]}`
							],
					})
				)
			);

			setSelectedRows({});
		},
		[calculatorData, filter, setFilter, setSelectedRows]
	);

	const handleChangeInput = useCallback(
		(value) => {
			let newArr = cloneDeep(filter);
			newArr[rowState] = value;
			setFilter(newArr);
		},
		[rowState, filter, setFilter]
	);

	const handleDuplicate = useCallback(
		(ids: any[]) => {
			const emptyRows = calculatorData?.filter(
				(item) =>
					!item.rrp &&
					!item.fob &&
					!item.longest_side &&
					!item.median_side &&
					!item.shortest_side &&
					!item.weight
			);
			if (ids?.length > 5 || emptyRows?.length < ids?.length) {
				toastOptions("error", "Not enough empty row");
				return;
			}
			let draft = cloneDeep(calculatorData);
			let filterDraft = cloneDeep(filter);
			for (let index = 0; index < ids.length; index++) {
				for (let idx = 9; idx > +ids[index] + index; idx--) {
					draft[idx] = draft[idx - 1];
					filterDraft[idx] = filterDraft[idx - 1];
				}
			}
			dispatch(setListRows(draft));
			setFilter(filterDraft);
			setSelectedRows({});
		},
		[filter, calculatorData, setFilter, setSelectedRows]
	);
	const token = getToken();
	useEffect(() => {
		if (!token) return;
		const socket = socketProductInfo(token);
		if (!socket.connected) {
			socket.connect();
		}

		function onEventListener(data) {
			setSocketID(data?.data?.socket_id);
		}
		function onProfitSimulation(data) {
			if (data?.code === 200) {
				dispatch(setAsinInfo(data?.data, data?.request_id, assumption));
			} else {
				toastOptions("error", data?.message || "Get information asin error");
				dispatch(setAsinInfoError(data?.request_id));
			}
		}

		socket.on("event_listener", (data) => onEventListener(data));
		socket.on("profit_simulation", (data) => onProfitSimulation(data));

		return () => {
			socket.disconnect();
			dispatch(setInitialCalReducer());
		};
	}, [assumption, token]);

	return (
		<Box mt={{ xs: 1 }}>
			<BoxLoading loading={isSaving || isExporting}>
				<Paper sx={{ p: 2, mb: 2 }}>
					<VariationHeader
						getInputs={(value) => {
							getInputs(value);
							handleChangeInput(value);
						}}
						isLoading={isLoading}
						inputs={filter[rowState]}
						suggestDuty={suggestDuty}
						row={rowState}
						setRow={setRow}
						lengthRows={10}
					/>
					<Skeleton isLoading={!assumption}>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item sm={12}>
								<MuiTable
									columns={columns}
									hasCheckbox
									data={calculatorData || []}
									enableRowNumbers
									enableColumnActions={false}
									enableSorting={false}
									enableColumnDragging={false}
									enableRowDragging={false}
									enableColumnResizing={false}
									enableSelectAll={true}
									enableRowSelection={(row: any) => {
										if (row?.original?.isViewResult) {
											return true;
										} else {
											return false;
										}
									}}
									muiTableBodyRowProps={{
										sx: {
											"&:hover": {
												"& td": {
													background: "rgb(236, 237, 239) !important",
												},
											},
										},
									}}
									onRowSelectionChange={setSelectedRows}
									enableEditing
									onColumnVisibilityChange={setColumnVisibility}
									editingMode="cell"
									state={{
										rowSelection: selectedRows,
										columnVisibility: columnVisibility,
										columnPinning: { left: ["mrt-row-numbers", "mrt-row-select", "asin", "image"] },
									}}
									muiTableContainerProps={{ sx: { maxHeight: "670px" } }}
									enablePinning
									displayColumnDefOptions={{
										"mrt-row-numbers": {
											size: 40,
											Header: () => "No.",
											muiTableBodyCellProps: ({ row }) => ({
												sx: {
													background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
												},
											}),
											muiTableHeadCellProps: {
												sx: {
													background: colors.first,
												},
											},
										},
										"mrt-row-select": {
											size: 28,
											muiTableBodyCellProps: ({ row }) => ({
												sx: {
													background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
												},
											}),
											muiTableHeadCellProps: {
												sx: {
													background: colors.first,
												},
											},
										},
									}}
									renderTopToolbarCustomActions={() => (
										<Grid
											container
											spacing={2}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "inherit",
												pl: 0,
											}}
										>
											<Grid item>
												<VariationsSearch
													onClear={() => {
														dispatch(setInitialCalReducer());
														setSelectedRows({});
													}}
													handleConfirmModal={handleConfirmModal}
													listCannotSave={listCannotSave}
													selectedRows={selectedRows}
													handleExport={handleExport}
													handleSaveRecord={handleSaveRecord}
													setOpen={setOpen}
													isOpen={isOpen}
													isCreating={isCreating}
													handleDeleteRow={handleDeleteRow}
													handleDuplicate={handleDuplicate}
												/>
											</Grid>
											<Grid
												item
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "end",
												}}
											>
												{without(Object.values(columnVisibility), true)?.length ? (
													<Button
														variant="text"
														onClick={() => {
															setColumnVisibility({ ...COLUMNS_VISIBILITY });
														}}
													>
														Show all
													</Button>
												) : (
													<Button
														variant="text"
														onClick={() => {
															setColumnVisibility({
																brand: false,
																channel: false,
																country: false,
																competitor_bep: false,
																max_loading_capacity: false,
																size_tier: false,
																longest_side: false,
																median_side: false,
																shortest_side: false,
																weight: false,
															});
														}}
													>
														Show default
													</Button>
												)}
											</Grid>
										</Grid>
									)}
								/>
							</Grid>
						</Grid>
					</Skeleton>
				</Paper>
			</BoxLoading>
		</Box>
	);
};

export const MergeUIColumns = ({
	listCol,
	row,
	width,
	isHeader = false,
	labelGroup = "",
	hasTooltip = false,
	messTooltip = "",
	isView = false,
}) => {
	if (isHeader) {
		return (
			<>
				<Box
					sx={{
						padding: "0.6rem 0.5rem 0",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "5px",
					}}
				>
					{labelGroup}
					{hasTooltip && <ToolTip title={messTooltip} placement="top-start" fontSize="small" />}
				</Box>
				<Box
					sx={{
						display: "flex",
						minWidth: `${listCol?.length * width}px`,
						textAlign: "right",
						alignItems: "center",
					}}
				>
					{listCol?.map((item, index) => {
						return (
							<Box
								key={index}
								sx={{
									flex: `1 ${width}px`,
									padding: "0 0.5rem 0.6rem",
								}}
							>
								{item?.label}
							</Box>
						);
					})}
				</Box>
			</>
		);
	}

	return (
		<Box
			sx={{
				display: "flex",
				minWidth: `${listCol?.length * width}px`,
				height: "100%",
			}}
		>
			{listCol?.map((item, index) => {
				return (
					<Box
						key={index}
						sx={{
							flex: `1 ${width}px`,
							display: "flex",
							alignItems: "center",
							padding: "0.6rem 0.5rem",
							backgroundColor: item.backgroundColor ? item.backgroundColor : "inherit",
						}}
					>
						{!isNumber(row?.original?.[`${item.accessorKey}`]) ? (
							""
						) : (
							<Typography
								sx={
									isView
										? {
												flex: "1 1",
												color: "text.primary",
												textAlign: "right",
										  }
										: {
												flex: "1 1",
												color:
													row?.original?.[`${item.accessorKey}`] < 0
														? "error.main"
														: !row?.original?.isViewResult && !row?.original?.isLoading
														? "error.main"
														: "text.primary",
												textAlign: "right",
										  }
								}
							>
								{row?.original?.[`${item.accessorKey}`] < 0
									? `${item.formatNegative(row?.original?.[`${item.accessorKey}`])}`
									: `${item.formatPositive(row?.original?.[`${item.accessorKey}`])}`}
							</Typography>
						)}
					</Box>
				);
			})}
		</Box>
	);
};

export const InterCMGroupOptions = {
	listCol: [
		{
			label: "DI",
			accessorKey: "cm_in_di",
			formatPositive: (value) => formatCurrencyPrefix(value),
			formatNegative: (value) => formatCurrencyPrefix(value * -1),
			backgroundColor: "",
		},
		{
			label: "DS",
			accessorKey: "cm_in_ds",
			formatPositive: (value) => formatCurrencyPrefix(value),
			formatNegative: (value) => formatCurrencyPrefix(value * -1),
			backgroundColor: "",
		},
		{
			label: "WH",
			accessorKey: "cm_in_wh",
			formatPositive: (value) => formatCurrencyPrefix(value),
			formatNegative: (value) => formatCurrencyPrefix(value * -1),
			backgroundColor: "",
		},
		{
			label: "FBA",
			accessorKey: "cm_in_fba",
			formatPositive: (value) => formatCurrencyPrefix(value),
			formatNegative: (value) => formatCurrencyPrefix(value * -1),
			backgroundColor: "",
		},
		{
			label: "Channel mix",
			accessorKey: "cm_in_mix_channel",
			formatPositive: (value) => formatCurrencyPrefix(value),
			formatNegative: (value) => formatCurrencyPrefix(value * -1),
			backgroundColor: colors.third,
		},
	],
	width: 100,
	hasTooltip: true,
	messTooltip: "Check tooltip",
};

export const InterCMGroupOptionsPercent = {
	listCol: [
		{
			label: "DI",
			accessorKey: "cm_in_percent_di",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "DS",
			accessorKey: "cm_in_percent_ds",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "WH",
			accessorKey: "cm_in_percent_wh",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "FBA",
			accessorKey: "cm_in_percent_fba",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "Channel mix",
			accessorKey: "cm_in_percent_mix_channel",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: colors.third,
		},
	],
	width: 100,
};

export const ChannelMixOptions = {
	listCol: [
		{
			label: "CM_EX ($/unit)",
			accessorKey: "cm_ex_mix_channel",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "CM_EX (%/unit)",
			accessorKey: "cm_ex_percent_mix_channel",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "Net PPM ($/unit)",
			accessorKey: "net_ppm_mix_channel",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "Net PPM (%/unit)",
			accessorKey: "net_ppm_percent_mix_channel",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
	],
	width: 130,
};

export const ExternalOptions = {
	listCol: [
		{
			label: "DI",
			accessorKey: "cm_ex_di",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "DS",
			accessorKey: "cm_ex_ds",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "WH",
			accessorKey: "cm_ex_wh",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "FBA",
			accessorKey: "cm_ex_fba",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
	],
	width: 100,
};

export const ExternalOptionsPercent = {
	listCol: [
		{
			label: "DI",
			accessorKey: "cm_ex_percent_di",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "DS",
			accessorKey: "cm_ex_percent_ds",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "WH",
			accessorKey: "cm_ex_percent_wh",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "FBA",
			accessorKey: "cm_ex_percent_fba",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
	],
	width: 100,
};

export const NetProfitOptions = {
	listCol: [
		{
			label: "DI",
			accessorKey: "net_profit_di",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "DS",
			accessorKey: "net_profit_ds",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "WH",
			accessorKey: "net_profit_wh",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "FBA",
			accessorKey: "net_profit_fba",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "Channel mix",
			accessorKey: "net_profit_mix_channel",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: colors.third,
		},
	],
	width: 100,
};

export const NetPPMOptions = {
	listCol: [
		{
			label: "DI",
			accessorKey: "net_ppm_di",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "DS",
			accessorKey: "net_ppm_ds",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
		{
			label: "WH",
			accessorKey: "net_ppm_wh",
			formatPositive: (value) => formatCurrencyPrefix(rounded({ number: value, decimals: 0 }), 0),
			formatNegative: (value) =>
				`(${formatCurrencyPrefix(rounded({ number: value * -1, decimals: 0 }), 0)})`,
			backgroundColor: "",
		},
	],
	width: 100,
	hasTooltip: true,
	messTooltip: "AMZ gross profit value per unit",
};
export const NetPPMPercentOptions = {
	listCol: [
		{
			label: "DI",
			accessorKey: "net_ppm_percent_di",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "DS",
			accessorKey: "net_ppm_percent_ds",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
		{
			label: "WH",
			accessorKey: "net_ppm_percent_wh",
			formatPositive: (value) => `${rounded({ number: value * 100 })}%`,
			formatNegative: (value) => `${rounded({ number: value * 100 })}%`,
			backgroundColor: "",
		},
	],
	width: 100,
	hasTooltip: true,
	messTooltip: "AMZ gross profit percentage per unit",
};
