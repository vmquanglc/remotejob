import React, { useEffect, useState } from "react";
import {
	Box,
	Grid,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	FormControlLabel,
	Checkbox,
	Divider,
	Button,
} from "@mui/material";
import { without } from "lodash";
import { ExpandMore } from "@mui/icons-material";
import { ALL_ACTIVITIES, MAPPING_KEY_ACTIVITIES_ID } from "src/constants/activities.constant";
import { useFormik } from "formik";

import { useMutation } from "react-query";
import { toastOptions } from "src/components/toast/toast.options";
import { updateActivitiesRole, updateInfoRole } from "src/services/settings/permission.services";
import { ButtonLoading } from "src/components/button-loading";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";

export const PermissionOptionsTab = ({ data, isView, onClose, refetchListing }) => {
	const activitiesRole = useSelector(selectActivities);
	const [expanded, setExpanded] = useState<string[]>([]);
	const formatActivities = (activities: any[]) => {
		return (
			activities.length &&
			activities?.reduce((obj, item) => {
				obj[item.code] = true;
				return obj;
			}, {})
		);
	};

	const formik = useFormik({
		initialValues: {
			id: data?.id || "",
			activities: formatActivities(data?.activities || {}),
		},
		onSubmit: (values) => {
			let listID = [];
			for (let i = 0; i < Object.keys(values.activities).length; i++) {
				if (values.activities[Object.keys(values.activities)[i]]) {
					listID.push(MAPPING_KEY_ACTIVITIES_ID[Object.keys(values.activities)[i]]);
				}
			}
			onUpdateActivitiesRole({
				id: values.id,
				activity_ids: listID,
			});
		},
	});

	useEffect(() => {
		formik.setValues({
			id: data?.id || "",
			activities: formatActivities(data?.activities || {}),
		});
	}, [data]);

	const { mutate: onUpdateActivitiesRole, isLoading } = useMutation(async (data: any) => {
		if (!activitiesRole.hasOwnProperty("permission_edit_in_role")) {
			toastOptions("error", `You are not authorized to do`);
			onClose();
			return;
		}
		try {
			const response: any = await updateActivitiesRole(data);
			if (response?.status !== 200) {
				toastOptions("error", "Update activities for role error");
				onClose();
				return false;
			} else {
				toastOptions("success", "Update activities for role success!");
				refetchListing();
				onClose();
				return true;
			}
		} catch (error) {
			toastOptions("error", "Update activities for role error");
			onClose();
			return false;
		}
	});

	const handleChange = (panel: string) => {
		setExpanded(
			expanded.includes(panel)
				? without(expanded, panel)
				: Array.from(new Set([...expanded, panel]))
		);
	};

	const handleChecked = (arrayKeys: string[], checked: boolean) => {
		for (let i = 0; i < arrayKeys.length; i++) {
			formik.setFieldValue(`activities[${arrayKeys[i]}]`, checked);
		}
	};

	const isChecked = (arrayKeys: string[]) => {
		const objectValues =
			arrayKeys &&
			arrayKeys?.length &&
			arrayKeys.reduce((obj, item) => {
				obj[`${item}`] = formik.values.activities[`${item}`];
				return obj;
			}, {});

		return without(Object.values(objectValues), false, undefined).length === arrayKeys.length;
	};

	const isDisabled = (arrayKeys: string[]) => {
		const objectValues = arrayKeys.reduce((obj, item) => {
			obj[`${item}`] = formik.values.activities[`${item}`];
			return obj;
		}, {});

		return (
			(without(Object.values(objectValues), false, undefined).length !== arrayKeys.length &&
				without(Object.values(objectValues), false, undefined).length > 0) ||
			without(Object.values(objectValues), false, undefined).length === arrayKeys.length
		);
	};

	const isIndeterminate = (arrayKeys: string[]) => {
		const objectValues = arrayKeys.reduce((obj, item) => {
			obj[`${item}`] = formik.values.activities[`${item}`];
			return obj;
		}, {});

		return !(
			without(Object.values(objectValues), false, undefined).length === arrayKeys.length ||
			without(Object.values(objectValues), true).length === arrayKeys.length
		);
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12}>
					<Box
						sx={{
							minHeight: "200px",
							maxHeight: "200px",
							overflowY: "auto",
						}}
					>
						{ALL_ACTIVITIES.map((act: any) => {
							return (
								<AccordionCustom
									isView={isView}
									key={act.code}
									expanded={expanded}
									item={act}
									handleChange={handleChange}
									isIndeterminate={isIndeterminate}
									isDisabled={isDisabled}
									isChecked={isChecked}
									handleChecked={handleChecked}
									data={data}
									disabled={!activitiesRole.hasOwnProperty("permission_edit_in_role")}
								/>
							);
						})}
					</Box>
				</Grid>
				{!isView && data.code !== "admin" && (
					<>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12} textAlign="right">
							<ButtonLoading
								loading={isLoading}
								variant="contained"
								type="submit"
								size="medium"
								disabled={!activitiesRole.hasOwnProperty("permission_edit_in_role")}
								sx={{
									mr: 2,
								}}
							>
								Save
							</ButtonLoading>
							<Button variant="outlined" type="button" size="medium" onClick={onClose}>
								Cancel
							</Button>
						</Grid>
					</>
				)}
			</Grid>
		</form>
	);
};

const AccordionCustom = ({
	expanded,
	item,
	handleChange,
	isIndeterminate,
	isDisabled,
	isChecked,
	handleChecked,
	isView,
	data,
	disabled,
}) => {
	const isExpanded = (data: string[], id: string) => {
		return data.includes(id);
	};

	return (
		<Accordion
			key={item.code}
			disableGutters
			expanded={isExpanded(expanded, item.code)}
			sx={{
				boxShadow: "none",
				background: "transparent",
				"&::before": { display: "none" },
				"& .MuiAccordionSummary-root": {
					minHeight: "30px",
				},
				"& .MuiAccordionSummary-content": {
					margin: 0,
					alignItems: "center",
				},
			}}
		>
			<AccordionSummary
				aria-controls="panel1bh-content"
				expandIcon={
					item?.children?.length ? (
						<ExpandMore
							onClick={() => {
								handleChange(item.code);
							}}
						/>
					) : (
						<></>
					)
				}
				id={item.code}
			>
				<FormControlLabel
					label={item.name}
					sx={{
						"& .MuiFormControlLabel-label.Mui-disabled": {
							color: (theme) => theme.palette.text.primary,
						},
					}}
					control={
						<Checkbox
							checked={isChecked(item.keyCheckBox)}
							indeterminate={isIndeterminate(item.keyCheckBox)}
							onChange={(e) => {
								handleChecked(item.keyCheckBox, e.target.checked);
							}}
							disabled={isView || data.code === "admin" || disabled}
						/>
					}
				/>
			</AccordionSummary>
			<AccordionDetails
				sx={{
					padding: " 0  0 0 16px",
				}}
			>
				{item?.children?.map((item: any) => {
					return (
						<AccordionCustom
							key={item.code}
							expanded={expanded}
							item={item}
							handleChange={handleChange}
							isIndeterminate={isIndeterminate}
							isDisabled={isDisabled}
							isChecked={isChecked}
							handleChecked={handleChecked}
							isView={isView}
							data={data}
							disabled={disabled}
						/>
					);
				})}
			</AccordionDetails>
		</Accordion>
	);
};
