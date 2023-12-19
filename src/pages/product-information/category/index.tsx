import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import "moment-timezone";
import { useSearchParams } from "src/hooks/use-search-params";
import { MCGSearchCategory } from "./manage-category-group/manage-category-group-search";
import MCGAccordion from "./manage-category-group/manage-category-group-accordion";
import { MCGFormAction } from "./manage-category-group/manage-form-action";
import { useQuery } from "react-query";
import { Skeleton } from "src/components/skeleton";
import { getCategoryTree } from "src/services/product-info/productInfo.services";
import { AddNewCategory } from "./manage-category-group/add-new-category";
import { ChangeParentCate } from "./manage-category-group/change-parent-category";
import { RequestPopup } from "./manage-category-group/request-cate-popup";
import ApprovalPopup from "./manage-category-group/approval-popup";

const CategoryPage = () => {
	const [params, setParams]: any = useSearchParams({});
	const [formData, setFormData] = useState<any>({});

	const {
		data: dataCate = [],
		isLoading,
		refetch,
	} = useQuery([`category-${JSON.stringify(params)}`, params], async () => getCategoryTree(), {
		keepPreviousData: true,
		select: (data) => data?.data,
	});

	const onDetail = (value: any, parentName: string) => {
		setFormData({ ...value, parentName });
	};

	const [open, setOpen] = useState<boolean>(false);
	const [changeCate, setChangeCate] = useState<any>({
		isOpen: false,
		currentCate: "",
		currentLevel: null,
		parentCate: "",
		parentLevel: null,
	});

	const [isOpenReq, setOpenReq] = useState<boolean>(false);
	const [isOpenApproved, setOpenApproved] = useState<boolean>(false);

	return (
		<>
			<Skeleton isLoading={isLoading}>
				<Container maxWidth="lg">
					<Grid container spacing={{ xs: 1, sm: 2 }} pt={2}>
						<Grid item xs={12}>
							<Typography variant="h6" color={"text.primary"}>
								Manage Categories
							</Typography>
						</Grid>
						<Grid item xs={12} sm={7}>
							<Grid container rowSpacing={{ xs: 2 }}>
								<Grid item xs={12}>
									<MCGSearchCategory onSubmit={(value) => console.log("value", value)} title="" />
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body1" fontWeight={"bold"} color={"text.primary"} mb={1}>
										Category Tree
									</Typography>
									<Box
										sx={{
											maxHeight: "460px",
											overflowY: "scroll",
											overflowX: "hidden",
											border: "1px solid #CCC",
											borderRadius: "4px",
										}}
									>
										<MCGAccordion
											data={dataCate || []}
											onDetail={onDetail}
											detailId={formData?.id ?? undefined}
										/>
									</Box>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={5}>
							<Grid container spacing={{ xs: 2 }}>
								<Grid item xs={6} sx={{ marginTop: "26px" }}>
									<Button
										fullWidth
										variant="outlined"
										sx={{
											backgroundColor: "#F2F1FA",
										}}
										onClick={() => {
											setOpenReq(true);
										}}
									>
										Request
									</Button>
								</Grid>
								<Grid item xs={6} sx={{ marginTop: "26px" }}>
									<Button
										fullWidth
										variant="outlined"
										sx={{
											backgroundColor: "#F2F1FA",
										}}
										onClick={() => {
											setOpenApproved(true);
										}}
									>
										Approval
									</Button>
								</Grid>
								<Grid item xs={12}>
									<Button
										fullWidth
										variant="outlined"
										sx={{
											backgroundColor: "#F2F1FA",
										}}
										onClick={() => {
											setOpen(true);
										}}
									>
										Add New Master Category (level 1)
									</Button>
								</Grid>
								<Grid item xs={12}>
									<MCGFormAction formData={formData} setChangeCate={setChangeCate} />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Container>
				{open && <AddNewCategory open={open} setOpen={setOpen} level={0} parentCate={""} />}
				{changeCate.isOpen && (
					<ChangeParentCate
						open={changeCate.isOpen}
						data={changeCate}
						setOpen={(value) => {
							setChangeCate({
								isOpen: false,
								currentCate: "",
								currentLevel: null,
								parentCate: "",
								parentLevel: null,
							});
						}}
					/>
				)}
			</Skeleton>
			{isOpenReq && <RequestPopup open={isOpenReq} setOpen={setOpenReq} />}
			{isOpenApproved && <ApprovalPopup open={isOpenApproved} setOpen={setOpenApproved} />}
		</>
	);
};

export default CategoryPage;
