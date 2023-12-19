import React, { FC, useCallback, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box } from "@mui/material";

interface IProps {
	data: any;
	onDetail: (value: any, parentName: string) => void;
	parentName?: string;
	isExpanded?: boolean;
	detailId: number | undefined;
}

const MCGAccordion: FC<IProps> = ({
	data,
	onDetail,
	parentName = "",
	isExpanded = false,
	detailId,
}) => {
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const handleChange =
		(panel: string, value: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
			handleViewDetail(event, value);
		};

	const handleViewDetail = useCallback(
		(e, value) => {
			e.stopPropagation();
			onDetail && onDetail(value, parentName);
		},
		[parentName]
	);

	useEffect(() => {
		return () => {
			isExpanded && setExpanded(false);
		};
	}, [isExpanded]);

	return (
		<Box>
			{data?.map((accordionItem) => {
				return (
					<Accordion
						expanded={
							!!accordionItem?.children &&
							!!accordionItem?.children?.length &&
							expanded === accordionItem.id
						}
						onChange={handleChange(accordionItem.id, accordionItem)}
						key={accordionItem.id}
						sx={{
							margin: 0,
							"&.Mui-expanded": {
								margin: "0",
							},
							"& .MuiAccordionSummary-root": {
								"&.Mui-expanded": {
									minHeight: "unset",
								},
								"& .MuiAccordionSummary-content": {
									"&.Mui-expanded": {
										margin: "12px 0",
									},
								},
							},
							"& .MuiAccordionDetails-root": {
								padding: 0,
							},
						}}
					>
						<AccordionSummary
							expandIcon={
								!!accordionItem?.children && !!accordionItem?.children?.length ? (
									<ArrowDropDownIcon
										sx={{
											color: "#5D5A88",
										}}
									/>
								) : (
									<span style={{ width: "24px" }}></span>
								)
							}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
							sx={{
								flexDirection: "row-reverse",
								background: `${accordionItem.id === detailId ? "#F2F1FA" : "#fff"}`,
								paddingLeft:
									accordionItem?.level === 0 ? "10px" : `${24 * accordionItem?.level + 10}px`,
								"& .MuiAccordionSummary-content": {
									alignItems: "center",
									justifyContent: "space-between",
									padding: "0 10px",
								},
							}}
						>
							<Typography variant="subtitle1">
								{accordionItem?.name}{" "}
								{!accordionItem?.is_last_child ? (
									<strong>({accordionItem?.count_child})</strong>
								) : (
									!!accordionItem?.count_sku && <strong>(Used {accordionItem?.count_sku})</strong>
								)}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{!!accordionItem?.children && !!accordionItem?.children?.length && (
								<MCGAccordion
									data={accordionItem?.children}
									onDetail={onDetail}
									parentName={accordionItem?.name}
									isExpanded={expanded === accordionItem?.id}
									detailId={detailId}
								/>
							)}
						</AccordionDetails>
					</Accordion>
				);
			})}
		</Box>
	);
};

export default MCGAccordion;
