import {
	Box,
	Breadcrumbs,
	Button,
	Grid,
	Link,
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography,
	styled,
} from "@mui/material";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { BoxLoading } from "src/components/box-loading";
import { VariationHeader } from "./variation-header";
import { MuiTable } from "src/components/mui-table";
import { formatCurrencyPrefix } from "src/utils/currency";
import { isBoolean, isNumber } from "lodash";
import { rounded } from "src/utils/profit-simulation/formulaPS";
import { useMutation } from "react-query";
import {
	deleteGroupDetail,
	deletePS,
	exportExcelPSInDetail,
	sentMailPS,
	updateGroupDetail,
} from "src/services/profit-simulation/profit.services";
import { toastOptions } from "src/components/toast/toast.options";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BasicDialog from "src/components/modal";
import { ButtonLoading } from "src/components/button-loading";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentModalSentMail } from "./content-modal-sent-mail";
import { useSelector } from "react-redux";
import { selectAuth } from "src/store/selectors";
import { getValidateFormik } from "src/utils/formik";
import { ToolTip } from "src/components/tooltip";
import { formatNumber } from "src/utils/number";
import {
	ChannelMixOptions,
	ExternalOptions,
	ExternalOptionsPercent,
	MergeUIColumns,
	NetPPMOptions,
	NetPPMPercentOptions,
} from "./calculator-tab";

const colors = {
	first: "#F2F1FA",
	second: "#E7E6F2",
	third: "#ADABC3",
};

interface IProps {
	isDeletingGroup: boolean;
	stateView: IStateView;
	setStateView: (value: any) => void;
	getDetail: (value: any) => void;
	onDeleteGroup: (value: any) => void;
	refetch: () => void;
}

interface IStateView {
	isView: boolean;
	record: any;
}

export const SavedListDetail: FC<IProps> = ({
	isDeletingGroup,
	stateView,
	setStateView,
	getDetail,
	refetch,
	onDeleteGroup,
}) => {
	const [isEdit, setEdit] = useState<boolean>(false);
	const [rowState, setRow] = useState<any>(0);

	const { mutate: onUpdate, isLoading: isUpdate } = useMutation(async (data: any) => {
		try {
			const response: any = await updateGroupDetail(data);
			if (response?.status !== 200) {
				toastOptions("error", "Update error");
				return false;
			} else {
				toastOptions("success", "Update success");
				setEdit(false);
				await getDetail(data?.id);
				return true;
			}
		} catch (error) {
			toastOptions("error", "Update error");
			return false;
		}
	});
	const columnsRecord = useMemo(() => {
		return [
			{
				header: "ASIN",
				hidden: false,
				size: 100,
				accessorKey: "asin",
				typeFilter: "includesMultipleFilter",
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
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
						},
					};
				},
				Cell: ({ cell, row }) => {
					return (
						<Box sx={{ flex: "1 1", textAlign: "right" }}>
							{formatNumber({ number: cell.getValue() })}
						</Box>
					);
				},
			},
			{
				header: "FOB",
				muiTableHeadCellProps: {
					align: "right",
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
						},
					};
				},
				Cell: ({ cell, row }) => (
					<Box sx={{ flex: "1 1", textAlign: "right" }}>
						{formatNumber({ number: cell.getValue() })}
					</Box>
				),
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
				Cell: ({ cell }) => (
					<Typography
						sx={{
							textAlign: "center",
							color: cell.getValue() ? "#003DDA" : "#D60000",
						}}
					>
						{cell.getValue() ? "Blue" : "Red"}
					</Typography>
				),
				muiTableBodyCellProps: ({ row }) => {
					return {
						sx: {
							background: rowState === row.index ? "rgb(236, 237, 239)" : colors.first,
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
			// isView: true,
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
			// isView: true,
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
			// isView: true,
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
			// isView: true,
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
						isView: true,
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
						isView: true,
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
						isView: true,
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
						isView: true,
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
						isView: true,
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
						isView: true,
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
			// isView: true,
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
			// isView: true,
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
						isView: true,
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
						isView: true,
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
						isView: true,
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
						isView: true,
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
								color: cell.getValue() < 0 ? "error.main" : "text.primary",
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
						},
					};
				},
				Cell: ({ cell, row }) => (
					<Box sx={{ flex: "1 1", textAlign: "right" }}>
						{formatNumber({ number: cell.getValue() })}
					</Box>
				),
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
						},
					};
				},
				Cell: ({ cell, row }) => (
					<Box sx={{ flex: "1 1", textAlign: "right" }}>
						{formatNumber({ number: cell.getValue() })}
					</Box>
				),
			},
			{
				header: "Height",
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
						},
					};
				},
				Cell: ({ cell, row }) => (
					<Box sx={{ flex: "1 1", textAlign: "right" }}>
						{formatNumber({ number: cell.getValue() })}
					</Box>
				),
			},
			{
				header: "Actual Weight",
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
						},
					};
				},
				Cell: ({ cell, row }) => (
					<Box sx={{ flex: "1 1", textAlign: "right" }}>
						{formatNumber({ number: cell.getValue() })}
					</Box>
				),
			},
		];
	}, [rowState]);
	const auth = useSelector(selectAuth);

	const [selectedRows, setSelectedRows] = useState<any>({});

	const { mutate: handleExport, isLoading: isGetting } = useMutation(async (data: any) => {
		try {
			const response = await exportExcelPSInDetail(data);
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

	const { mutate: onDeletePS, isLoading: isDeleting } = useMutation(async (ids: any[]) => {
		try {
			const response: any = await deletePS(ids);
			if (response?.status !== 200) {
				toastOptions("error", "Delete error");
				return false;
			} else {
				toastOptions("success", "Delete success");
				const new_profit_simulations = stateView.record?.profit_simulations?.filter(
					(item: any) => !ids.includes(item.id?.toString())
				);
				setStateView((state: any) => ({
					...state,
					record: {
						...state.record,
						profit_simulations: new_profit_simulations,
					},
				}));
				setRow(0);
				setSelectedRows({});
				return true;
			}
		} catch (error) {
			toastOptions("error", "Delete error");
			return false;
		}
	});

	const handleDelete = useCallback(
		(ids: any[]) => {
			if (auth.email === stateView?.record?.created_by?.email) {
				if (ids.length === stateView.record.profit_simulations.length) {
					onDeleteGroup([stateView.record.id]);
				} else {
					onDeletePS(ids);
				}
			}
		},
		[stateView, auth]
	);

	//control sent mail in profit
	const [openSentMail, setOpenSentMail] = useState<boolean>(false);
	const formik = useFormik({
		initialValues: {
			email_to: [],
			email_subject: "",
			email_content: "",
		},
		validationSchema: Yup.object({
			email_to: Yup.array()
				.min(1, "Email To field must have at least 1 items")
				.required("Required"),
			email_subject: Yup.string()
				.max(150, "The subject must be at most 150 characters")
				.required("Required"),
		}),
		onSubmit: async (values) => {
			await onSentMail({
				profit_simulation_group_id: Number(stateView.record.id),
				profit_simulation_ids: Object.keys(selectedRows).map(Number),
				...values,
			});
		},
	});

	const { mutate: onSentMail, isLoading: isSending } = useMutation(async (data: any) => {
		try {
			const response: any = await sentMailPS(data);
			if (response?.status !== 200) {
				toastOptions("error", "Sent mail error");
				return false;
			} else {
				formik.resetForm();
				setOpenSentMail(false);
				setSelectedRows({});
				toastOptions("success", "Sent mail success");
				return true;
			}
		} catch (error) {
			toastOptions("error", "Sent mail error");
			return false;
		}
	});

	const [openOptions, setOpenOptions] = useState<boolean>(false);

	const handleClose = () => {
		setOpenOptions(false);
	};

	const handleOpen = () => {
		setOpenOptions(true);
	};

	return (
		<BoxLoading loading={isUpdate || isDeleting || isDeletingGroup} sx={{ mb: 2 }}>
			<BreadcrumbsSavedList
				record={stateView.record}
				onBack={() =>
					setStateView({
						isView: false,
						record: {},
					})
				}
				auth={auth}
				refresh={refetch}
				onUpdate={onUpdate}
				isEdit={isEdit}
				setEdit={setEdit}
			/>
			<Box>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={12}>
						<VariationHeader
							getInputs={() => {}}
							suggestDuty={stateView?.record?.assumption || {}}
							isView={true}
							inputs={stateView?.record?.profit_simulations[rowState]?.inputs}
							row={rowState}
							setRow={setRow}
							lengthRows={stateView?.record?.profit_simulations.length}
						/>
					</Grid>
					<Grid item xs={12}>
						<MuiTable
							columns={columnsRecord}
							hasCheckbox
							loading={isDeleting}
							data={stateView.record?.profit_simulations || []}
							enableRowNumbers
							enableColumnActions={false}
							enableSorting={false}
							enableColumnDragging={false}
							enableRowDragging={false}
							enableColumnResizing={false}
							enableSelectAll={true}
							onRowSelectionChange={setSelectedRows}
							enablePinning
							state={{
								columnPinning: { left: ["mrt-row-numbers", "mrt-row-select", "asin", "image"] },
								rowSelection: selectedRows,
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
							getRowId={(row: any) => row?.id}
							renderTopToolbarCustomActions={() => (
								<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
									<Grid item>
										<Select
											fullWidth
											size="small"
											name="bulkActions"
											variant="outlined"
											value="Bulk Actions"
											open={openOptions}
											onClose={handleClose}
											onOpen={handleOpen}
											multiple={false}
											sx={{
												width: 140,
											}}
										>
											<MenuItem
												value={"Bulk Actions"}
												disabled={true}
												sx={{ fontWeight: "700", display: "none" }}
											>
												Bulk Actions
											</MenuItem>
											<Tooltip title="Select rows to enable button" placement="right">
												<Box>
													<MenuItem
														value={"export"}
														sx={{ fontWeight: "700" }}
														disabled={!Object.keys(selectedRows).length}
														onClick={() => {
															handleExport({
																profit_simulation_group_id: stateView.record?.id,
																profit_simulation_ids: Object.keys(selectedRows),
															});
															handleClose();
														}}
													>
														Export
													</MenuItem>
												</Box>
											</Tooltip>
											<Tooltip title="Select rows to enable button" placement="right">
												<Box>
													<MenuItem
														value={"delete"}
														sx={{ fontWeight: "700" }}
														disabled={
															!Object.keys(selectedRows).length ||
															auth.email !== stateView?.record?.created_by?.email
														}
														onClick={() => {
															auth.email === stateView?.record?.created_by?.email &&
																handleDelete(Object.keys(selectedRows));
															handleClose();
														}}
													>
														Delete
													</MenuItem>
												</Box>
											</Tooltip>
											<Tooltip title="Select rows to enable button" placement="right">
												<Box>
													<MenuItem
														value={"sent email"}
														sx={{ fontWeight: "700" }}
														disabled={!Object.keys(selectedRows).length}
														onClick={() => {
															setOpenSentMail(true);
															handleClose();
														}}
													>
														Send email
													</MenuItem>
												</Box>
											</Tooltip>
										</Select>
									</Grid>
								</Grid>
							)}
						/>
					</Grid>
				</Grid>
			</Box>
			{openSentMail && (
				<BasicDialog
					open={openSentMail}
					disabledBackdropClick
					handleClose={() => setOpenSentMail(false)}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							background: "#F2F1FA",
							maxWidth: "600px",
						},
					}}
				>
					<ContentModalSentMail formik={formik} isSending={isSending} setOpen={setOpenSentMail} />
				</BasicDialog>
			)}
		</BoxLoading>
	);
};

interface Props {
	record: any;
	onBack: () => void;
	onUpdate: (value: any) => void;
	refresh?: () => void;
	auth: any;
	isEdit: boolean;
	setEdit: (value: any) => void;
}

const BreadcrumbsSavedList: FC<Props> = ({
	record,
	onBack,
	onUpdate,
	refresh,
	auth,
	isEdit,
	setEdit,
}) => {
	const formik = useFormik({
		initialValues: {
			name: record?.name ?? "",
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.required("required")
				.matches(/^[a-zA-Z0-9 !@#$&()%\-_`.+,\"]*$/, "Only alphabets are allowed for this field "),
		}),
		onSubmit: (value) => {
			onUpdate({ name: value.name, id: record?.id });
		},
	});
	useEffect(() => {
		formik.setFieldValue("name", record?.name);
		setEdit(false);
	}, [record?.name]);

	const [isOpen, setOpen] = useState<boolean>(false);

	const { mutate: onDelete, isLoading: isDelete } = useMutation(async (id: number | string) => {
		try {
			const response: any = await deleteGroupDetail(id);
			if (response?.status !== 200) {
				toastOptions("error", "Delete error");
				return false;
			} else {
				onBack();
				refresh && refresh();
				toastOptions("success", "Delete success");
				return true;
			}
		} catch (error) {
			toastOptions("error", "Delete error");
			return false;
		}
	});

	return (
		<>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
					height: "53px",
					alignItems: "center",
				}}
			>
				<MuiBreadcrumbsRoot>
					<Breadcrumbs separator=">">
						<Link
							key={"savedList"}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onBack();
								refresh && refresh();
							}}
							sx={{ textDecoration: "none" }}
						>
							<Typography variant="body1" color={(theme) => theme?.palette?.text?.secondary}>
								Saved list
							</Typography>
						</Link>
						{isEdit ? (
							<TextField
								size="small"
								name="name"
								variant="standard"
								fullWidth
								{...getValidateFormik({
									formik,
									field: "name",
								})}
								sx={{ minWidth: "250px" }}
								error={formik.touched.name && Boolean(formik.errors.name)}
							/>
						) : (
							<Typography variant="body1" color={(theme) => theme?.palette?.text?.primary}>
								{formik.values.name}
							</Typography>
						)}
					</Breadcrumbs>
				</MuiBreadcrumbsRoot>
				{auth.email === record?.created_by?.email && (
					<>
						{!isEdit ? (
							<>
								<Button
									variant="text"
									sx={{
										minWidth: " 20px",
										padding: "6px",
									}}
									onClick={() => setEdit(true)}
								>
									<EditIcon fontSize="small" />
								</Button>
								<Button
									variant="text"
									sx={{
										minWidth: " 20px",
										padding: "6px",
									}}
									onClick={() => setOpen(true)}
								>
									<DeleteIcon fontSize="small" color="error" />
								</Button>
							</>
						) : (
							<>
								<Button
									variant="text"
									sx={{
										minWidth: " 20px",
										padding: "6px",
									}}
									onClick={() => {
										setEdit(false);
										formik.setFieldValue("name", record?.name);
									}}
								>
									<CloseIcon fontSize="small" />
								</Button>
								<Button
									variant="text"
									sx={{
										minWidth: " 20px",
										padding: "6px",
									}}
									disabled={formik.touched.name && Boolean(formik.errors.name)}
									onClick={() => formik.handleSubmit()}
								>
									<CheckIcon fontSize="small" color="success" />
								</Button>
							</>
						)}
					</>
				)}
				{isOpen && (
					<BasicDialog
						disabledBackdropClick
						open={isOpen}
						handleClose={() => {
							setOpen(false);
							formik.setFieldValue("name", "");
						}}
						PaperProps={{
							sx: {
								margin: "15px",
								width: "100%",
								background: "#F2F1FA",
								maxWidth: "400px",
							},
						}}
					>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12}>
								<Typography variant="h6">Delete record?</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1">
									Record name <strong>{record?.name}</strong> would be deleted. This action cannot
									be reverted.
								</Typography>
							</Grid>
							<Grid item xs={12} sm={12} textAlign="right">
								<ButtonLoading
									loading={isDelete}
									variant="contained"
									type="button"
									size="medium"
									disabled={isDelete}
									sx={{
										mr: 1,
									}}
									onClick={() => {
										onDelete(record?.id);
									}}
								>
									Delete
								</ButtonLoading>
								<Button
									variant="outlined"
									type="button"
									size="medium"
									disabled={isDelete}
									onClick={() => {
										setOpen(false);
									}}
								>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</BasicDialog>
				)}
			</Box>
			{/* <FormHelperText
				sx={{
					color: (theme) => theme.palette.warning.main,
				}}
			>
				{formik.touched.name && Boolean(formik.errors.name) && formik.errors.name}
			</FormHelperText> */}
		</>
	);
};

const MuiBreadcrumbsRoot = styled(Box)(({ theme }) => {
	return {
		paddingTop: "0.5rem",
		paddingBottom: "0.5rem",

		"& .MuiBreadcrumbs-ol": {
			color: theme.palette.text.secondary,
		},
	};
});
