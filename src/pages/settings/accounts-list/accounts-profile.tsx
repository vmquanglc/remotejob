import { ExpandMore } from "@mui/icons-material";
import {
	Container,
	Box,
	Paper,
	Grid,
	Typography,
	TextField,
	Button,
	styled,
	Tabs,
	Tab,
	Accordion,
	AccordionSummary,
	FormControlLabel,
	Checkbox,
	AccordionDetails,
	Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { filter, find, get, keyBy, map, omit, without } from "lodash";
import React, { useEffect, useState, FC, ChangeEvent } from "react";

import * as Yup from "yup";
import { useParams } from "react-router";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
import { Skeleton } from "src/components/skeleton";
import { LIST_ROLE, PATH } from "src/constants";
import { getValidateFormik } from "src/utils/formik";
import { regexPassword } from "src/utils/regex";
import { AuthStateHoc } from "src/HOCs/auth-hoc";
import { getUserProfile } from "src/services/accounts-list";
import { useMutation, useQuery } from "react-query";
import { ALL_ACTIVITIES, MAPPING_KEY_ACTIVITIES_ID } from "src/constants/activities.constant";
import { PrivateRouter } from "src/components/private-router";
import { updateAdditionalActivities } from "src/services/settings/permission.services";
import { toastOptions } from "src/components/toast/toast.options";

import { ButtonLoading } from "src/components/button-loading";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";

const ProfileBreadcrumbs = ({ id }) => {
	const items = [
		{ path: PATH.HOME, name: "Home" },
		{ path: PATH.ACCOUNT_LIST, name: "Accounts List" },
		{ name: id },
	];

	return <MuiBreadcrumbs items={items} />;
};
interface IProps {
	auth?: any;
	setAuth?: (value: any) => void;
}

const validationSchemaAdmin = Yup.object().shape({
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.max(32, "Password must be at most 32 characters")
		.matches(regexPassword, {
			message:
				"Password must be 8-32 characters, with at least 1 digit, 1 letter and 1 special character",
		})
		.required("Field is required"),
	rePassword: Yup.string()
		.required("Field is required")
		.oneOf([Yup.ref("password"), null], "Passwords must match"),
});
const validationSchemaOther = Yup.object().shape({
	currentPass: Yup.string().required("Field is required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.max(32, "Password must be at most 32 characters")
		.matches(regexPassword, {
			message:
				"Password must be 8-32 characters, with at least 1 digit, 1 letter and 1 special character",
		})
		.required("Field is required"),
	rePassword: Yup.string()
		.required("Field is required")
		.oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const AccountsProfile: FC<IProps> = (props) => {
	const { auth } = props;
	const { id } = useParams();
	const [isLoading, setLoading] = useState<boolean>(false);

	const getProfile = async (id) => {
		const data = await getUserProfile(id);
		if (data) {
			formik.setValues((val) => ({
				...val,
				...data?.data,
			}));
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		getProfile(id);
	}, [id]);

	const formik = useFormik({
		initialValues: {
			activities: [],
			approve_by: {},
			created_at: "",
			created_by: {},
			department: {},
			email: "",
			id: "",
			first_name: "",
			full_name: "",
			last_name: "",
			manager: {},
			organization: {},
			role: {},
			status: false,
			updated_at: "",
		},
		validationSchema:
			auth?.role?.code === LIST_ROLE.ADMIN.value ? validationSchemaAdmin : validationSchemaOther,
		onSubmit: (values) => {
			console.log("values", values);
		},
	});

	const [currentTab, setCurrentTab] = useState<string>("information");
	const tabs = filter(
		[
			{
				labelKey: "Information",
				value: "information",
				component: <InformationTab formik={formik} />,
				isHide: false,
			},
			{
				labelKey: "Add Permission",
				value: "addPermission",
				component: (
					<AddPermission
						activities={formik.values.activities.filter((item) => !item.is_custom_activity)}
						additionalPer={formik.values.activities.filter((item) => item.is_custom_activity)}
						userID={id}
						onRefetch={() => getProfile(id)}
					/>
				),
				isHide: false,
			},
		],
		(item) => !item.isHide
	);

	const componentCurrentTab = find(tabs, (item) => item.value === currentTab);

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	};

	const TabsRoot = styled(Tabs)(({ theme }) => {
		return {
			borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
			"& .Mui-disabled": {
				display: "none",
				transition: "all 0.1s ease",
			},
		};
	});

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<Skeleton isLoading={isLoading}>
					<ProfileBreadcrumbs id={"Profile"} />
					<form onSubmit={formik.handleSubmit}>
						<Paper sx={{ p: 2, mb: 2 }}>
							<Grid container justifyContent="space-between">
								<Grid item xs={12} sm={12} mb={1}>
									<Typography variant="h6" color="primary">
										Profile
									</Typography>
								</Grid>
								<Grid item sm={12}>
									<Grid container spacing={{ xs: 2, sm: 2 }}>
										<Grid item xs={12}>
											<TabsRoot
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
														label={tab.labelKey}
														value={tab.value}
														iconPosition="start"
													/>
												))}
											</TabsRoot>
										</Grid>
										<Grid item xs={12}>
											{componentCurrentTab?.component}
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Paper>
					</form>
				</Skeleton>
			</Box>
		</Container>
	);
};
export default PrivateRouter(AuthStateHoc(AccountsProfile), "account_view");

const InformationTab = ({ formik }) => {
	return (
		<Paper sx={{ p: 2, mb: 2 }}>
			<Grid container spacing={{ xs: 2, sm: 2 }}>
				<Grid item sm={12}>
					<Typography
						variant="body1"
						color={(theme) => theme?.palette?.text?.secondary}
						sx={{ fontWeight: "700" }}
					>
						Overall Information
					</Typography>
				</Grid>
				<Grid item xs={12} sm={1.5}>
					<TextField
						size="medium"
						name="firstName"
						placeholder="First name"
						label="First name"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "first_name",
							required: true,
						})}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={2.5}>
					<TextField
						size="medium"
						name="lastName"
						placeholder="Last name"
						label="Last name"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "last_name",
							required: true,
						})}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						size="medium"
						name="organization"
						placeholder="Organization"
						label="Organization"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "organization.name",
							required: true,
						})}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						size="medium"
						name="status"
						placeholder="Status"
						label="Status"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "status",
							required: true,
						})}
						value={formik.values.status ? "Active" : "Deactive"}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						size="medium"
						name="email"
						placeholder="Email"
						label="Email"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "email",
							required: true,
						})}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						size="medium"
						name="department"
						placeholder="Department"
						label="Department"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "department.name",
							required: true,
						})}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						size="medium"
						name="role"
						placeholder="Role"
						label="Role"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "role.name",
							required: true,
						})}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						size="medium"
						name="partner"
						placeholder="Partner"
						label="Partner"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "partner",
							required: true,
						})}
						disabled
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						size="medium"
						name="manager.name"
						placeholder="Line Manager"
						label="Line Manager"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "manager.full_name",
							required: true,
						})}
						disabled
					/>
				</Grid>
			</Grid>
		</Paper>
	);
};

const AddPermission = ({ activities, additionalPer, userID, onRefetch }: any) => {
	const activitiesRole = useSelector(selectActivities);
	const formatActivities = (activities: any[]) => {
		return (
			activities.length &&
			activities?.reduce((obj, item) => {
				obj[item.code] = true;
				return obj;
			}, {})
		);
	};
	const addPermission = useFormik({
		initialValues: {
			...formatActivities(activities),
			...formatActivities(additionalPer),
		},
		onSubmit: (values) => {
			let listID = [];
			const additional = omit(values, Object.keys(formatActivities(activities)));
			for (let i = 0; i < Object.keys(additional).length; i++) {
				if (additional[Object.keys(additional)[i]]) {
					listID.push(MAPPING_KEY_ACTIVITIES_ID[Object.keys(additional)[i]]);
				}
			}
			onUpdateAdditionalAct({
				activity_ids: listID,
				user_id: userID,
			});
		},
	});

	useEffect(() => {
		addPermission.setValues({
			...formatActivities(activities),
			...formatActivities(additionalPer),
		});
	}, [activities, additionalPer]);

	const [expanded, setExpanded] = useState<string[]>([]);

	const handleChange = (panel: string) => {
		setExpanded(
			expanded.includes(panel)
				? without(expanded, panel)
				: Array.from(new Set([...expanded, panel]))
		);
	};

	const handleChecked = (arrayKeys: string[], checked: boolean) => {
		const objectValues = arrayKeys.reduce((obj, item) => {
			obj[`${item}`] = checked;
			return obj;
		}, {});
		addPermission.setValues({
			...addPermission.values,
			...objectValues,
		});
	};

	const isChecked = (arrayKeys: string[]) => {
		const objectValues =
			arrayKeys &&
			arrayKeys?.length &&
			arrayKeys.reduce((obj, item) => {
				obj[`${item}`] = addPermission.values[`${item}`];
				return obj;
			}, {});

		return without(Object.values(objectValues), false, undefined).length === arrayKeys.length;
	};

	const isDisabled = (arrayKeys: string[]) => {
		const objectValues = arrayKeys.reduce((obj, item) => {
			obj[`${item}`] = formatActivities(activities)[`${item}`];
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
			obj[`${item}`] = addPermission.values[`${item}`];
			return obj;
		}, {});

		return !(
			without(Object.values(objectValues), false, undefined).length === arrayKeys.length ||
			without(Object.values(objectValues), true).length === arrayKeys.length
		);
	};

	const hasDifferentValue = (obj1, obj2) => {
		const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
		for (const key of keys) {
			if (!obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key) && obj2[key]) {
				return true;
			}
			if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
				if (obj1[key] !== obj2[key]) {
					return true;
				}
			}
		}
		return false;
	};

	const { mutate: onUpdateAdditionalAct, isLoading } = useMutation(async (data: any) => {
		try {
			const response: any = await updateAdditionalActivities(data);
			if (response?.status !== 200) {
				toastOptions("error", "Update activities for user error");
				return false;
			} else {
				toastOptions("success", "Update activities for user success!");
				onRefetch();
				return true;
			}
		} catch (error) {
			toastOptions("error", "Update activities for user error");
			return false;
		}
	});

	return (
		<Grid container spacing={{ xs: 2, sm: 2 }}>
			<Grid item xs={12}>
				<Box>
					{ALL_ACTIVITIES.map((act: any) => {
						return (
							<AccordionCustom
								key={act.code}
								expanded={expanded}
								item={act}
								handleChange={handleChange}
								isIndeterminate={isIndeterminate}
								isDisabled={isDisabled}
								isChecked={isChecked}
								handleChecked={handleChecked}
								disabled={isLoading || !activitiesRole.hasOwnProperty("permission_add_in_account")}
							/>
						);
					})}
				</Box>
			</Grid>
			{hasDifferentValue(
				{ ...formatActivities(activities), ...formatActivities(additionalPer) },
				addPermission.values
			) && (
				<>
					<Grid item xs={12}>
						<Divider />
					</Grid>
					<Grid item xs={12}>
						<ButtonLoading
							variant="contained"
							loading={isLoading}
							type="button"
							size="medium"
							sx={{
								mr: 1,
							}}
							disabled={!activitiesRole.hasOwnProperty("permission_add_in_account")}
							onClick={() => {
								activitiesRole.hasOwnProperty("permission_add_in_account") &&
									addPermission.handleSubmit();
							}}
						>
							Save
						</ButtonLoading>
						<Button
							variant="outlined"
							type="button"
							size="medium"
							onClick={() =>
								addPermission.setValues({
									...formatActivities(activities),
									...formatActivities(additionalPer),
								})
							}
						>
							Cancel
						</Button>
					</Grid>
				</>
			)}
		</Grid>
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
							disabled={isDisabled(item.keyCheckBox) || disabled}
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
							disabled={disabled}
						/>
					);
				})}
			</AccordionDetails>
		</Accordion>
	);
};
