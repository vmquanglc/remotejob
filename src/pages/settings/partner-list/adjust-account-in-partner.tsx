import { toLower } from "lodash";
import React, { useEffect, useState, useMemo, MouseEvent, FC } from "react";
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
import { getAccountsList } from "src/services/settings-page";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

interface IProps {
	type: "createOrg" | "editOrg" | "viewAccounts" | "addAccounts" | "delete" | "addConditions" | "";
	onClose: (value?: any) => void;
	accountsList: any[];
	partnerName: string;
}

export const AdjustAccountsInPartner: FC<IProps> = ({
	type,
	onClose,
	accountsList,
	partnerName,
}) => {
	useEffect(() => {
		type === "addAccounts" &&
			(async () => {
				const listAccount = await getAccountsList();
				if (listAccount.length) {
					setLeft(listAccount);
					setRight([]);
				}
			})();
	}, []);

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
				accessorKey: "firstName",
				typeFilter: "includesMultipleFilter",
				Cell: ({ row }) => (
					<>
						{row.original.firstName} {row.original.lastName}
					</>
				),
			},
			{
				header: "Department",
				size: 160,
				accessorKey: "department",
				typeFilter: "includesMultipleFilter",
			},
			{
				header: "Status",
				size: 140,
				accessorKey: "status",
				typeFilter: "includesMultipleFilter",
			},
		],
		[]
	);

	//transfer list
	const [checked, setChecked] = useState<readonly string[]>([]);
	const [left, setLeft] = useState<readonly string[]>([]);
	const [right, setRight] = useState<readonly string[]>([]);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const handleToggle = (value: string) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const numberOfChecked = (items: readonly string[]) => intersection(checked, items).length;

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

	const customList = (items: readonly string[], isLeft = false) => (
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
				{items.map((value: string) => {
					const labelId = `transfer-list-all-item-${value}-label`;

					return (
						<ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
							<ListItemIcon>
								<Checkbox
									checked={checked.indexOf(value) !== -1}
									tabIndex={-1}
									disableRipple
									inputProps={{
										"aria-labelledby": labelId,
									}}
								/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={value} />
						</ListItem>
					);
				})}
			</List>
		</Paper>
	);

	if (type === "viewAccounts") {
		return (
			<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12} sm={12}>
					<Typography variant="h6" color="primary" mb={1}>
						{`Assigned Accounts to ${partnerName}`}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<MuiTable
						columns={columns}
						data={accountsList?.filter((item) => toLower(item.email).includes(valueSearch)) || []}
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
						{`Add account to be in charge of ${partnerName}`}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Grid container justifyContent="center" alignItems="center" spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={5}>
							{customList(
								left.filter((item) => toLower(item).includes(valueSearch)),
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
									disabled={leftChecked.length === 0}
									aria-label="move selected right"
								>
									&gt;
								</Button>
								<Button
									sx={{ my: 0.5 }}
									variant="outlined"
									size="small"
									onClick={handleCheckedLeft}
									disabled={rightChecked.length === 0}
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
					<Button
						variant="contained"
						type="button"
						size="medium"
						disabled={!right.length}
						sx={{
							mr: 2,
						}}
						onClick={() => console.log("check", right)}
					>
						Add Account
					</Button>
					<Button variant="outlined" type="button" size="medium" onClick={onClose}>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</>
	);
};
function not(a: readonly string[], b: readonly string[]) {
	return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
	return a.filter((value) => b.indexOf(value) !== -1);
}
