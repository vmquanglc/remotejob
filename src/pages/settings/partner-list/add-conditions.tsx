import {
	Autocomplete,
	Avatar,
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	TextField,
	Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { FC } from "react";
import { CONDITIONS_LIST } from "src/constants";
import { getValidateFormik } from "src/utils/formik";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ReactComponent as ArrowUpIcon } from "src/assets/images/arrow-up.svg";
import { ReactComponent as ArrowDownIcon } from "src/assets/images/arrow-down.svg";
import { cloneDeep, sortBy } from "lodash";

interface IProps {
	isCreate?: boolean;
	onClose: (value?: any) => void;
	data?: any;
	partnerName: string;
}
export const AddConditions: FC<IProps> = ({ onClose, partnerName }) => {
	const formik = useFormik({
		initialValues: {
			condition: {
				value: "",
			},
			formatRule: "",
			conditionsList: [],
		},
		onSubmit: (values) => {
			console.log("values", values);
		},
	});

	const onAddCondition = () => {
		const indexCondition = formik.values.conditionsList.findIndex(
			(item) => item.value === formik.values.condition.value
		);
		const draftConditions = cloneDeep(formik.values.conditionsList);
		if (indexCondition > -1) {
			draftConditions[indexCondition].formatRule = formik.values.formatRule;
		} else {
			draftConditions.push({
				...formik.values.condition,
				formatRule: formik.values.formatRule,
				priority: formik.values.conditionsList.length + 1,
			});
		}

		formik.setFieldValue("conditionsList", draftConditions);
		formik.setFieldValue("formatRule", "");
	};

	const adjustPriority = (condition: any, isUp: boolean) => {
		const idxConditionNearChange = isUp
			? formik.values.conditionsList.findIndex((item) => item.priority === condition.priority - 1)
			: formik.values.conditionsList.findIndex((item) => item.priority === condition.priority + 1);
		const indexCondition = formik.values.conditionsList.findIndex(
			(item) => item.priority === condition.priority
		);
		const draftConditions = cloneDeep(formik.values.conditionsList);
		if (isUp) {
			draftConditions[indexCondition].priority = draftConditions[indexCondition].priority - 1;
			draftConditions[idxConditionNearChange].priority =
				draftConditions[idxConditionNearChange].priority + 1;
		} else {
			draftConditions[indexCondition].priority = draftConditions[indexCondition].priority + 1;
			draftConditions[idxConditionNearChange].priority =
				draftConditions[idxConditionNearChange].priority - 1;
		}
		formik.setFieldValue("conditionsList", draftConditions);
	};

	const onDelete = (condition: any) => {
		formik.setFieldValue(
			"conditionsList",
			formik.values.conditionsList.reduce((arr, item) => {
				if (item.value !== condition.value) {
					arr.push({
						...item,
						priority: item.priority > condition.priority ? item.priority - 1 : item.priority,
					});
				}
				return arr;
			}, [])
		);
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12} sm={12}>
					<Typography variant="h6" color="primary" fontWeight={700}>
						{`Setup conditions for ${partnerName}`}
					</Typography>
				</Grid>
				<Grid item xs={5}>
					<Autocomplete
						sx={{
							"& + .MuiAutocomplete-popper": {
								"& .MuiAutocomplete-paper .MuiAutocomplete-listbox": {
									maxHeight: "120px",
								},
							},
						}}
						fullWidth
						disablePortal
						disableClearable
						options={CONDITIONS_LIST}
						onChange={(_, option) => {
							formik.setFieldValue("condition", option);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Search CM, Net Profit..."
								size="small"
								name="condition.value"
								{...getValidateFormik({
									formik,
									field: "condition.value",
									required: true,
									handleChange: () => {
										formik.setFieldValue("formatRule", "");
									},
								})}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={4}>
					<TextField
						type="number"
						fullWidth
						size="small"
						name="formatRule"
						variant="outlined"
						label="Format rule (Ex: >= 15)"
						{...getValidateFormik({
							formik,
							field: "formatRule",
						})}
					/>
				</Grid>
				<Grid item xs={3}>
					<Button
						fullWidth
						size="medium"
						variant={
							formik.values.condition.value === "" || formik.values.formatRule === ""
								? "contained"
								: "outlined"
						}
						color="primary"
						disabled={formik.values.condition.value === "" || formik.values.formatRule === ""}
						onClick={() =>
							formik.values.condition.value !== "" &&
							formik.values.formatRule !== "" &&
							onAddCondition()
						}
					>
						Add condition
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12} sm={12}>
					<Typography variant="body1" color="primary" sx={{ mb: 2 }}>
						{`Conditions list`}
					</Typography>
					<Grid container spacing={{ xs: "12px" }}>
						{!!formik.values.conditionsList.length &&
							sortBy(formik.values.conditionsList, ["priority"]).map((item) => (
								<ItemCondition
									key={item.value}
									item={item}
									length={formik.values.conditionsList.length}
									adjustPriority={adjustPriority}
									onDelete={onDelete}
								/>
							))}
					</Grid>
				</Grid>
				<Grid item xs={12} sm={12} textAlign="right">
					<Button
						size="medium"
						variant="contained"
						color="primary"
						type="submit"
						sx={{ mr: 1 }}
						disabled={!formik.values.conditionsList.length}
					>
						Save
					</Button>
					<Button size="medium" variant="outlined" color="primary" onClick={onClose}>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

const ItemCondition = ({ item, length, adjustPriority, onDelete }) => {
	return (
		<>
			<Grid item xs={5}>
				<Box
					sx={{
						display: "flex",
					}}
				>
					<ListItemIcon
						sx={{
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{item.priority !== 1 && (
							<Box
								sx={{
									lineHeight: "10px",
									opacity: 0.6,
									transition: ".2s all ease",
									"&:hover": {
										opacity: 1,
									},
								}}
							>
								<ArrowUpIcon
									style={{
										padding: "2px",
										width: "14px",
										height: "7px",
										cursor: "pointer",
									}}
									onClick={() => item.priority !== 1 && adjustPriority(item, true)}
								/>
							</Box>
						)}
						{length !== item.priority && (
							<Box
								sx={{
									lineHeight: "10px",
									opacity: 0.6,
									transition: ".2s all ease",
									"&:hover": {
										opacity: 1,
									},
								}}
							>
								<ArrowDownIcon
									style={{
										padding: "2px",
										width: "14px",
										height: "7px",
										cursor: "pointer",
									}}
									onClick={() => length !== item.priority && adjustPriority(item, false)}
								/>
							</Box>
						)}
					</ListItemIcon>
					<Typography>{item.label}</Typography>
				</Box>
			</Grid>
			<Grid item xs={4}>
				<Typography>{`>= ${item.formatRule}`}</Typography>
			</Grid>
			<Grid item xs={3}>
				<DeleteOutlineIcon
					fontSize="small"
					color="error"
					onClick={() => onDelete(item)}
					sx={{
						cursor: "pointer",
						opacity: 0.6,
						transition: ".2s all ease",
						"&:hover": {
							opacity: 1,
						},
					}}
				/>
			</Grid>
		</>
	);
};
