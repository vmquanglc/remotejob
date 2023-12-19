import { toLower } from "lodash";
import React, { useEffect, useState, useMemo } from "react";
import {
	Grid,
	Typography,
	Button,
	Divider,
	Checkbox,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	InputAdornment,
} from "@mui/material";
import { MuiTable } from "src/components/mui-table";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { getUserAccountsList } from "src/services/accounts-list";
import { useMutation } from "react-query";
import { addUserIntoRole } from "src/services/settings/permission.services";
import { toastOptions } from "src/components/toast/toast.options";

import { ButtonLoading } from "src/components/button-loading";

export const AdjustAccountsInRole = ({
	isView = false,
	onClose,
	role,
	refetchListing,
	activities,
}) => {
	useEffect(() => {
		!isView &&
			(async () => {
				const data = await getUserAccountsList({
					page: 1,
					itemsPerPage: 20,
					q: "''",
					filter: JSON.stringify([
						{ model: "Role", field: "code", op: "!=", value: `${role.code}` },
					]),
					sortBy: [],
					descending: [],
				});
				if (data?.data?.items?.length) {
					setLeft(data?.data?.items);
					setRight([]);
				}
			})();
	}, [role]);

	const columns = useMemo(
		() => [
			{
				header: "Email",
				size: 200,
				accessorKey: "email",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Fullname",
				size: 200,
				accessorKey: "full_name",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Department",
				size: 160,
				accessorKey: "aaa",
				typeFilter: "includesMultipleFilter",
				Cell: ({ row }) => <>{row?.original?.department?.name}</>,
			},
			{
				header: "Status",
				size: 140,
				accessorKey: "status",
				typeFilter: "includesMultipleFilter",
				Cell: ({ cell }) => <>{cell.getValue() ? "Active" : "Deactive"}</>,
			},
		],
		[]
	);

	//transfer list
	const [checked, setChecked] = useState<readonly any[]>([]);
	const [left, setLeft] = useState<readonly any[]>([]);
	const [right, setRight] = useState<readonly any[]>([]);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const handleToggle = (user: any) => () => {
		const currentIndex = checked.findIndex((item) => item.id === user.id);
		const newChecked = [...checked];
		if (currentIndex === -1) {
			newChecked.push(user);
		} else {
			newChecked.splice(currentIndex, 1);
		}
		setChecked(newChecked);
	};

	const numberOfChecked = (items: readonly any[]) => intersection(checked, items).length;

	const isChecked = (user: any) => {
		const currentIndex = checked.findIndex((item) => item.id === user.id);
		if (currentIndex === -1) {
			return false;
		} else {
			return true;
		}
	};

	const handleCheckedRight = () => {
		setRight(right.concat(leftChecked));
		setLeft(not(left, leftChecked));
		setChecked(not(checked, leftChecked));
	};

	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked));
		setRight(not(right, rightChecked));
		setChecked(not(checked, rightChecked));
	};

	const [valueSearch, setValueSearch] = useState<string>("");

	const { mutate: onAddUserToRole, isLoading } = useMutation(async (data: any) => {
		if (!activities.hasOwnProperty("account_add_into_role")) {
			toastOptions("error", `You are not authorized to do`);
			onClose();
			return;
		}
		try {
			const response: any = await addUserIntoRole(data);
			if (response?.status !== 200) {
				toastOptions("error", "Add user to role error");
				return false;
			} else {
				toastOptions("success", "Add user to success!");
				refetchListing();
				onClose();
				return true;
			}
		} catch (error) {
			toastOptions("error", "Add user to error");
			onClose();
			return false;
		}
	});

	const customList = (items: readonly any[], isLeft = false) => (
		<Paper>
			{isLeft ? (
				<Box
					sx={{
						padding: "20px 25px 12px",
					}}
				>
					<TextField
						fullWidth
						size="small"
						variant="outlined"
						label="Search email"
						value={valueSearch}
						onChange={(e) => setValueSearch(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon color="primary" />
								</InputAdornment>
							),
						}}
						sx={{
							mb: 1,
						}}
					/>
					<Typography
						variant="body2"
						sx={{
							color: "rgba(0, 0, 0, 0.6)",
						}}
					>{`${numberOfChecked(items)}/${items.length} selected`}</Typography>
				</Box>
			) : (
				<Box
					sx={{
						padding: "30px 25px 12px",
					}}
				>
					<Typography
						variant="body1"
						sx={{
							mb: "17px",
						}}
					>
						Selected accounts
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: "rgba(0, 0, 0, 0.6)",
						}}
					>{`${items.length} account`}</Typography>
				</Box>
			)}
			<Divider />
			<List
				sx={{
					height: 350,
					bgcolor: "background.paper",
					overflow: "auto",
				}}
				dense
				component="div"
				role="list"
			>
				{items.map((item: any) => {
					const labelId = `transfer-list-all-item-${item?.id}-label`;
					return (
						<ListItem key={item?.id} role="listitem" button onClick={handleToggle(item)}>
							<ListItemIcon>
								<Checkbox
									checked={isChecked(item)}
									tabIndex={-1}
									disabled={isLoading}
									disableRipple
									inputProps={{
										"aria-labelledby": labelId,
									}}
								/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={`${item?.email} (${item?.role?.name})`} />
						</ListItem>
					);
				})}
			</List>
		</Paper>
	);

	if (isView) {
		return (
			<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12} sm={12}>
					<Typography variant="h6" color="primary" mb={1}>
						{`Sales Executive's account`}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<MuiTable
						columns={columns}
						data={role?.users?.filter((item) => toLower(item.email).includes(valueSearch)) || []}
						enableRowNumbers={true}
						rowNumberMode="original"
						enableColumnFilters={false}
						muiTableContainerProps={{ sx: { maxHeight: "420px" } }}
						renderTopToolbarCustomActions={() => (
							<TextField
								fullWidth
								size="small"
								variant="outlined"
								label="Search email"
								value={valueSearch}
								sx={{ width: 250 }}
								onChange={(e) => setValueSearch(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon color="primary" />
										</InputAdornment>
									),
								}}
							/>
						)}
					/>
				</Grid>
			</Grid>
		);
	}

	return (
		<>
			<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12} sm={12}>
					<Typography variant="h6" color="primary" mb={1}>
						{`Add account to ${role.code} role`}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Grid container justifyContent="center" alignItems="center" spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={5}>
							{customList(
								// left.filter((item) => toLower(item).includes(valueSearch)),
								left,
								true
							)}
						</Grid>
						<Grid item xs={2}>
							<Grid container direction="column" alignItems="center">
								<Button
									sx={{ my: 0.5 }}
									variant="outlined"
									size="small"
									onClick={handleCheckedRight}
									disabled={leftChecked.length === 0 || isLoading}
									aria-label="move selected right"
								>
									&gt;
								</Button>
								<Button
									sx={{ my: 0.5 }}
									variant="outlined"
									size="small"
									onClick={handleCheckedLeft}
									disabled={rightChecked.length === 0 || isLoading}
									aria-label="move selected left"
								>
									&lt;
								</Button>
							</Grid>
						</Grid>
						<Grid item xs={5}>
							{customList(right, false)}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} textAlign="right">
					<ButtonLoading
						loading={isLoading}
						variant="contained"
						type="button"
						size="medium"
						disabled={
							!right.length || isLoading || !activities.hasOwnProperty("account_add_into_role")
						}
						sx={{
							mr: 2,
						}}
						onClick={() =>
							activities.hasOwnProperty("account_add_into_role") &&
							onAddUserToRole({
								role_pk: role.id,
								user_ids: right.map((item) => item.id),
							})
						}
					>
						Add Account
					</ButtonLoading>
					<Button variant="outlined" type="button" size="medium" onClick={onClose}>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</>
	);
};
function not(a: readonly number[], b: readonly number[]) {
	return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
	return a.filter((value) => b.indexOf(value) !== -1);
}
