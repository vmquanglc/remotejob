import { Clear, ArrowForwardIos, Search } from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	Divider,
	Grid,
	IconButton,
	InputBase,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { get } from "lodash";
import React, { useState } from "react";
export default function AmzCategory() {
	const formatCateTree = (arr, depth, path) => {
		return arr.reduce((obj, item) => {
			const newPath = path ? `${path}.${item.id}.child` : `${item.id}.child`;
			obj[item.id] = {
				...item,
				child: item.child.length ? formatCateTree(item.child, depth + 1, newPath) : {},
				depth: depth,
				path: newPath,
			};
			return obj;
		}, {});
	};
	let jsonData = formatCateTree(require("src/constants/data-json/category-amz.json"), 0, "");
	const [stateTree, setStateTree] = useState<any>({});
	const [productTypeSelected, setProductTypeSelected] = useState<string[]>([]);
	const [path, setPath] = useState<string>("");

	const handleSelectTree = (item) => {
		setStateTree((prev) => ({
			...prev,
			[item.depth]: item,
		}));
	};

	const onChangeDepthTree = (depth: number) => {
		let newObj = {};
		for (let index = 0; index <= depth; index++) {
			newObj[index] = stateTree[index];
		}
		setStateTree(newObj);
	};

	const Item = ({ item }) => {
		return (
			<Box
				sx={{
					borderBottom: "1px solid #CCCCCC",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "8px 15px",
					cursor: Object.keys(item.child).length ? "pointer" : "default",
					"&:hover": {
						background: Object.keys(item.child).length ? "rgba(248, 248, 248, 0.84)" : "unset",
						transition: "0.3s",
					},
				}}
				onClick={() => {
					Object.keys(item.child).length && setPath(item.path);
					Object.keys(item.child).length && handleSelectTree(item);
				}}
			>
				<Typography
					variant="body1"
					color={"text.primary"}
					sx={{
						fontSize: "14px",
						lineHeight: "37px",
					}}
				>
					{item.label}
				</Typography>
				{Object.keys(item.child).length ? (
					<ArrowForwardIos fontSize="small" />
				) : (
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-end",
							alignItems: "center",
							gap: "10px",
						}}
					>
						<Stack direction={"column"} alignItems={"flex-end"}>
							<Typography color={"text.secondary"} fontSize={"14px"}>
								Product Type
							</Typography>
							<Typography color={"text.secondary"} fontSize={"14px"}>
								{item.productType}
							</Typography>
						</Stack>
						<Button
							sx={{ minWidth: "88px" }}
							size="small"
							variant={productTypeSelected.includes(item.productType) ? "contained" : "outlined"}
							disabled={
								productTypeSelected.includes(item.productType) || productTypeSelected.length === 20
							}
							onClick={() => setProductTypeSelected((prev) => [...prev, item.productType])}
						>
							{productTypeSelected.includes(item.productType) ? "Selected" : "Select"}
						</Button>
					</Box>
				)}
			</Box>
		);
	};

	return (
		<Container maxWidth="lg">
			<Grid container spacing={{ xs: 2 }} mb={"50px"}>
				<Grid item xs={12}>
					<Typography variant="h6" color={"text.primary"}>
						Select a product type
					</Typography>
				</Grid>
				<Grid item xs={12} sm={8}>
					<Grid container rowSpacing={{ xs: 2 }}>
						<Grid item xs={12}>
							<Typography variant="body1" fontWeight={"bold"} color={"text.primary"} mb={1}>
								Search
							</Typography>
							<Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
								<InputBase
									sx={{ ml: 1, flex: 1 }}
									size="medium"
									name="search"
									placeholder="Search for a category"
									fullWidth
								/>
								<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
								<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
									<Search />
								</IconButton>
							</Paper>
						</Grid>
						<Grid item xs={12}>
							<Box>
								<Typography variant="body1" fontWeight={"bold"} color={"text.primary"}>
									Browse
								</Typography>
								<Box
									sx={{
										border: "1px solid #CCCCCC",
										display: "flex",
										minHeight: "50px",
										height: "100%",
									}}
								>
									<Box
										sx={{
											flex: "1 1",
											padding: "10px",
										}}
									>
										{Object.keys(stateTree).length ? (
											Object.values(stateTree || {}).map((item: any, index) => (
												<Typography
													key={item.id}
													variant="body1"
													color={"text.primary"}
													fontWeight={700}
													onClick={() => {
														setPath(item.path);
														onChangeDepthTree(item.depth);
													}}
													sx={{ display: "inline", cursor: "pointer" }}
												>
													{item.label} {index < Object.values(stateTree).length - 1 ? "  >  " : ""}
												</Typography>
											))
										) : (
											<Typography
												variant="body1"
												color={"text.primary"}
												fontWeight={700}
												lineHeight={"30px"}
											>
												Select a category
											</Typography>
										)}
									</Box>
									<Button
										variant="text"
										sx={{ width: "50px", minWidth: "50px" }}
										onClick={() => {
											setPath("");
											setStateTree({});
										}}
									>
										<Clear />
									</Button>
								</Box>
								<Box
									sx={{
										border: "1px solid #CCCCCC",
										height: "350px",
										overflowY: "scroll",
									}}
								>
									{Object.values(path ? get(jsonData, path) : jsonData).map((item: any) => (
										<Item item={item} key={item?.id} />
									))}
								</Box>
							</Box>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Typography variant="body1" fontWeight={"bold"} color={"text.primary"} mb={1}>
						{productTypeSelected.length} product types selected
					</Typography>
					<Box
						sx={{
							border: "1px solid #CCCCCC",
							overflowY: "scroll",
							height: "446px",
						}}
					>
						{productTypeSelected.length ? (
							productTypeSelected.map((item) => (
								<Stack
									direction={"row"}
									justifyContent={"space-between"}
									alignItems={"center"}
									key={item}
									sx={{
										borderBottom: "1px solid #CCCCCC",
										padding: "5px 10px",
									}}
								>
									<Typography color={"text.primary"}>{item}</Typography>
									<Button
										variant="text"
										sx={{ color: "#006EC9" }}
										onClick={() =>
											setProductTypeSelected((prev) => prev.filter((type) => type !== item))
										}
									>
										Remove
									</Button>
								</Stack>
							))
						) : (
							<Typography
								color={"text.primary"}
								sx={{
									padding: "20px 10px",
								}}
							>
								Select up to 20 product types
								<br />
								<br />
								Note: If you do not see your product's type, it may require approval, be restricted,
								or your application is under review.
							</Typography>
						)}
					</Box>
					<Button
						variant="contained"
						fullWidth
						disabled={!productTypeSelected.length}
						sx={{
							borderRadius: "0px",
						}}
					>
						Download a blank template
					</Button>
				</Grid>
			</Grid>
		</Container>
	);
}
