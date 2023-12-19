import {
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { map, omit } from "lodash";
import React, { FC } from "react";
import { NumericFormat } from "react-number-format";
import { FORMAT_DATE_FULL } from "src/constants";
import { MAP_LABEL_REQUEST } from "src/constants/productInfo.constant";
import { ERole } from "src/interface/groupPermission.interface";
import { convertTimeToGMT7 } from "src/utils/date";
import { getValidateFormik, getValidateNumeric } from "src/utils/formik";

interface IProps {
	details: any;
	formik: any;
	isEditing: boolean;
	isViewRequest?: boolean;
	isViewApproved?: boolean;
	role?: ERole;
	categoryTree: any;
	dataInput: any;
}

export const SKUInfoChange: FC<IProps> = ({
	details,
	formik,
	isEditing,
	role,
	isViewRequest = false,
	isViewApproved = false,
	categoryTree = {},
	dataInput = {},
}) => {
	if (role === ERole.sales || isViewRequest) {
		return (
			<Grid container spacing={{ xs: 2, sm: 2 }}>
				<Grid
					item
					xs={12}
					sm={isViewRequest || details?.product_update_request?.type_sku?.id ? 8 : 12}
				>
					<Paper sx={{ p: 2 }}>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12} sm={6}>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Applied
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Product Classification
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="details.sku.category.relative_master_category.name"
											label="Master Category (Level 1)"
											fullWidth
											value={details?.sku?.category?.relative_master_category?.name}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="details.sku.category.relative_super_category.name"
											label="Super Category (Level 2)"
											fullWidth
											value={details?.sku?.category?.relative_super_category?.name}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="details.sku.category.relative_super_category.name"
											label="Main Category (Level 3)"
											fullWidth
											value={details?.sku?.category?.relative_super_category?.name}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="details.sku.category.relative_category.name"
											label="Category (Level 4)"
											fullWidth
											value={details?.sku?.category?.relative_category?.name}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="details.sku.category.relative_product_line.name"
											label="Product Line (Level 5)"
											fullWidth
											value={details?.sku?.category?.relative_product_line?.name}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="details.sku.category.name"
											label="Product Variant (Level 6)"
											fullWidth
											value={details?.sku?.category?.name}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Product Information
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="sku.sell_type"
											label="Sell Type"
											fullWidth
											value={details?.sku?.sell_type}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="sku.life_cycle"
											label="Life Cycle"
											fullWidth
											value={details?.sku?.life_cycle}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Rep lead time
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="sku.order_proccessing_lead_time"
											label="Order proccessing Lead-time"
											fullWidth
											value={details.sku.order_proccessing_lead_time}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="sku.international_transportation_lead_time"
											label="International Transportation Lead-time"
											fullWidth
											value={details.sku.international_transportation_lead_time}
											disabled={true}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="sku.domestic_lead_time"
											label="Domestic Lead-time"
											fullWidth
											value={details.sku.domestic_lead_time}
											disabled={true}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Sales request update to Sales Manager
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Product Classification
										</Typography>
									</Grid>
									<Grid item xs={12}>
										{isEditing ? (
											<TextField
												size="small"
												name="sku.category.relative_master_category.id"
												label="Master Category (Level 1)"
												fullWidth
												disabled={!isEditing}
												{...getValidateFormik({
													formik,
													field: "sku.category.relative_master_category.id",
													required: true,
													showHelpText: false,
													handleChange: (e) => {
														formik.setFieldValue("sku.category", {
															...formik.values.sku.category,
															relative_master_category: omit(
																categoryTree?.[e.target.value],
																"children"
															),
															relative_super_category: {},
															relative_main_category: {},
															relative_category: {},
															relative_product_line: {},
															code: null,
															description: null,
															id: null,
															name: null,
															parent_id: null,
														});
													},
												})}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_master_category?.id !==
															details?.sku?.category?.relative_master_category?.id
																? "error.main"
																: "inherit",
														"&.Mui-disabled": {
															color:
																formik.values?.sku?.category?.relative_master_category?.id !==
																details?.sku?.category?.relative_master_category?.id
																	? "error.main"
																	: "inherit",
														},
													},
												}}
												select
											>
												{map(Object.values(categoryTree || {}), (item: any) => (
													<MenuItem key={item.id} value={item.id}>
														{item.name}
													</MenuItem>
												))}
											</TextField>
										) : (
											<TextField
												size="small"
												name="sku.category.relative_master_category.name"
												label="Master Category (Level 1)"
												fullWidth
												disabled
												value={formik.values?.sku?.category?.relative_master_category?.name}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_master_category?.name !==
															details?.sku?.category?.relative_master_category?.name
																? "error.main"
																: "inherit",
														"&.Mui-disabled": {
															color:
																formik.values?.sku?.category?.relative_master_category?.name !==
																details?.sku?.category?.relative_master_category?.name
																	? "error.main"
																	: "inherit",
															WebkitTextFillColor:
																formik.values?.sku?.category?.relative_master_category?.name !==
																details?.sku?.category?.relative_master_category?.name
																	? "#D60000"
																	: "inherit",
														},
													},
												}}
											/>
										)}
									</Grid>
									<Grid item xs={12}>
										{isEditing ? (
											<TextField
												size="small"
												name="category.relative_super_category.id"
												label="Super Category (Level 2)"
												placeholder="Super Category (Level 2)"
												fullWidth
												disabled={
													!isEditing || !formik.values?.sku?.category?.relative_master_category?.id
												}
												{...getValidateFormik({
													formik,
													field: "sku.category.relative_super_category.id",
													required: true,
													showHelpText: false,
													handleChange: (e) => {
														formik.setFieldValue("sku.category", {
															...formik.values.sku.category,
															relative_super_category: omit(
																categoryTree?.[
																	formik.values?.sku?.category?.relative_master_category?.id
																]?.children?.[e.target.value],
																"children"
															),
															relative_main_category: {},
															relative_category: {},
															relative_product_line: {},
															code: null,
															description: null,
															id: null,
															name: null,
															parent_id: null,
														});
													},
												})}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_super_category?.id !==
															details?.sku?.category?.relative_super_category?.id
																? "error.main"
																: "inherit",
													},
												}}
												select
											>
												{map(
													Object.values(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children || {}
													),
													(item: any) => (
														<MenuItem key={item.id} value={item.id}>
															{item.name}
														</MenuItem>
													)
												)}
											</TextField>
										) : (
											<TextField
												size="small"
												name="sku.category.relative_super_category.name"
												label="Super Category (Level 2)"
												fullWidth
												disabled
												value={formik.values?.sku?.category?.relative_super_category?.name}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_super_category?.name !==
															details?.sku?.category?.relative_super_category?.name
																? "error.main"
																: "inherit",
														"&.Mui-disabled": {
															color:
																formik.values?.sku?.category?.relative_super_category?.name !==
																details?.sku?.category?.relative_super_category?.name
																	? "error.main"
																	: "inherit",
															WebkitTextFillColor:
																formik.values?.sku?.category?.relative_super_category?.name !==
																details?.sku?.category?.relative_super_category?.name
																	? "#D60000"
																	: "inherit",
														},
													},
												}}
											/>
										)}
									</Grid>
									<Grid item xs={12}>
										{isEditing ? (
											<TextField
												size="small"
												name="sku.category.relative_main_category.id"
												label="Main Category (Level 3)"
												placeholder="Main Category (Level 3)"
												fullWidth
												disabled={
													!isEditing || !formik.values?.sku?.category?.relative_super_category?.id
												}
												{...getValidateFormik({
													formik,
													field: "sku.category.relative_main_category.id",
													required: true,
													showHelpText: false,
													handleChange: (e) => {
														formik.setFieldValue("sku.category", {
															...formik.values.sku.category,
															relative_main_category: omit(
																categoryTree?.[
																	formik.values?.sku?.category?.relative_master_category?.id
																]?.children?.[
																	formik.values?.sku?.category?.relative_super_category?.id
																]?.children?.[e.target.value],
																"children"
															),
															relative_category: {},
															relative_super_category: {},
															code: null,
															description: null,
															id: null,
															name: null,
															parent_id: null,
														});
													},
												})}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_main_category?.id !==
															details?.sku?.category?.relative_main_category?.id
																? "error.main"
																: "inherit",
													},
												}}
												select
											>
												{map(
													Object.values(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children || {}
													),
													(item: any) => (
														<MenuItem key={item.id} value={item.id}>
															{item.name}
														</MenuItem>
													)
												)}
											</TextField>
										) : (
											<TextField
												size="small"
												name="sku.category.relative_main_category.name"
												label="Main Category (Level 3)"
												fullWidth
												disabled
												value={formik.values?.sku?.category?.relative_main_category?.name}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_main_category?.name !==
															details?.sku?.category?.relative_main_category?.name
																? "error.main"
																: "inherit",
														"&.Mui-disabled": {
															color:
																formik.values?.sku?.category?.relative_main_category?.name !==
																details?.sku?.category?.relative_main_category?.name
																	? "error.main"
																	: "inherit",
															WebkitTextFillColor:
																formik.values?.sku?.category?.relative_main_category?.name !==
																details?.sku?.category?.relative_main_category?.name
																	? "#D60000"
																	: "inherit",
														},
													},
												}}
											/>
										)}
									</Grid>
									<Grid item xs={12}>
										{isEditing ? (
											<TextField
												size="small"
												name="sku.category.relative_category.id"
												label="Category (Level 4)"
												placeholder="Category (Level 4)"
												fullWidth
												disabled={
													!isEditing || !formik.values?.sku?.category?.relative_main_category?.id
												}
												{...getValidateFormik({
													formik,
													field: "sku.category.relative_category.id",
													required: true,
													showHelpText: false,
													handleChange: (e) => {
														formik.setFieldValue("sku.category", {
															...formik.values.sku.category,
															relative_category: omit(
																categoryTree?.[
																	formik.values?.sku?.category?.relative_master_category?.id
																]?.children?.[
																	formik.values?.sku?.category?.relative_super_category?.id
																]?.children?.[
																	formik.values?.sku?.category?.relative_main_category?.id
																]?.children?.[e.target.value],
																"children"
															),
															relative_product_line: {},
															code: null,
															description: null,
															id: null,
															name: null,
															parent_id: null,
														});
													},
												})}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_category?.id !==
															details?.sku?.category?.relative_category?.id
																? "error.main"
																: "inherit",
													},
												}}
												select
											>
												{map(
													Object.values(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
															?.children || {}
													),
													(item: any) => (
														<MenuItem key={item.id} value={item.id}>
															{item.name}
														</MenuItem>
													)
												)}
											</TextField>
										) : (
											<TextField
												size="small"
												name="sku.category.relative_category.name"
												label="Category (Level 4)"
												fullWidth
												disabled
												value={formik.values?.sku?.category?.relative_category?.name}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_category?.name !==
															details?.sku?.category?.relative_category?.name
																? "error.main"
																: "inherit",
														"&.Mui-disabled": {
															color:
																formik.values?.sku?.category?.relative_category?.name !==
																details?.sku?.category?.relative_category?.name
																	? "error.main"
																	: "inherit",
															WebkitTextFillColor:
																formik.values?.sku?.category?.relative_category?.name !==
																details?.sku?.category?.relative_category?.name
																	? "#D60000"
																	: "inherit",
														},
													},
												}}
											/>
										)}
									</Grid>
									<Grid item xs={12}>
										{isEditing ? (
											<TextField
												size="small"
												name="sku.category.relative_product_line.id"
												label="Product Line (Level 5)"
												placeholder="Product Line (Level 5)"
												fullWidth
												disabled={
													!isEditing || !formik.values?.sku?.category?.relative_category?.id
												}
												{...getValidateFormik({
													formik,
													field: "sku.category.relative_product_line.id",
													required: true,
													showHelpText: false,
													handleChange: (e) => {
														formik.setFieldValue("sku.category", {
															...formik.values.sku.category,
															relative_product_line: omit(
																categoryTree?.[
																	formik.values?.sku?.category?.relative_master_category?.id
																]?.children?.[
																	formik.values?.sku?.category?.relative_super_category?.id
																]?.children?.[
																	formik.values?.sku?.category?.relative_main_category?.id
																]?.children?.[formik.values?.sku?.category?.relative_category?.id]
																	?.children?.[e.target.value],
																"children"
															),
															code: null,
															description: null,
															id: null,
															name: null,
															parent_id: null,
														});
													},
												})}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_product_line?.id !==
															details?.sku?.category?.relative_product_line?.id
																? "error.main"
																: "inherit",
													},
												}}
												select
											>
												{map(
													Object.values(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_category?.id]
															?.children || {}
													),
													(item: any) => (
														<MenuItem key={item.id} value={item.id}>
															{item.name}
														</MenuItem>
													)
												)}
											</TextField>
										) : (
											<TextField
												size="small"
												name="sku.category.relative_product_line.name"
												label="Product Line (Level 5)"
												fullWidth
												disabled
												value={formik.values?.sku?.category?.relative_product_line?.name}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.relative_product_line?.name !==
															details?.sku?.category?.relative_product_line?.name
																? "error.main"
																: "inherit",
														"&.Mui-disabled": {
															color:
																formik.values?.sku?.category?.relative_product_line?.name !==
																details?.sku?.category?.relative_product_line?.name
																	? "error.main"
																	: "inherit",
															WebkitTextFillColor:
																formik.values?.sku?.category?.relative_product_line?.name !==
																details?.sku?.category?.relative_product_line?.name
																	? "#D60000"
																	: "inherit",
														},
													},
												}}
											/>
										)}
									</Grid>
									<Grid item xs={12}>
										{isEditing ? (
											<TextField
												size="small"
												name="sku.category.id"
												label="Product Variant (Level 6)"
												placeholder="Product Variant (Level 6)"
												fullWidth
												disabled={
													!isEditing || !formik.values?.sku?.category?.relative_product_line?.id
												}
												{...getValidateFormik({
													formik,
													field: "sku.category.id",
													required: true,
													showHelpText: false,
													handleChange: (e) => {
														formik.setFieldValue("sku.category", {
															...formik.values.sku.category,
															...omit(
																categoryTree?.[
																	formik.values?.sku?.category?.relative_master_category?.id
																]?.children?.[
																	formik.values?.sku?.category?.relative_super_category?.id
																]?.children?.[
																	formik.values?.sku?.category?.relative_main_category?.id
																]?.children?.[formik.values?.sku?.category?.relative_category?.id]
																	?.children?.[
																	formik.values?.sku?.category?.relative_product_line?.id
																]?.children?.[e.target.value],
																"children"
															),
														});
													},
												})}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.id !== details?.sku?.category?.id
																? "error.main"
																: "inherit",
													},
												}}
												select
											>
												{map(
													Object.values(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_product_line?.id]
															?.children || {}
													),
													(item: any) => (
														<MenuItem key={item.id} value={item.id}>
															{item.name}
														</MenuItem>
													)
												)}
											</TextField>
										) : (
											<TextField
												size="small"
												name="sku.category.name"
												label="Product Variant (Level 6)"
												fullWidth
												disabled
												value={formik.values?.sku?.category?.name}
												sx={{
													"& .MuiInputBase-input": {
														color:
															formik.values?.sku?.category?.name !== details?.sku?.category?.name
																? "error.main"
																: "inherit",
														"&.Mui-disabled": {
															color:
																formik.values?.sku?.category?.name !== details?.sku?.category?.name
																	? "error.main"
																	: "inherit",
															WebkitTextFillColor:
																formik.values?.sku?.category?.name !== details?.sku?.category?.name
																	? "#D60000"
																	: "inherit",
														},
													},
												}}
											/>
										)}
									</Grid>
									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Product Information
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="sku.sell_type"
											label="Sell Type"
											fullWidth
											disabled={!isEditing}
											{...getValidateFormik({
												formik,
												field: "sku.sell_type",
												required: true,
												showHelpText: false,
											})}
											select={isEditing}
											sx={{
												"& .MuiInputBase-input": {
													color:
														formik.values?.sku?.sell_type !== details?.sku?.sell_type
															? "error.main"
															: "inherit",
													"&.Mui-disabled": {
														color:
															formik.values?.sku?.sell_type !== details?.sku?.sell_type
																? "error.main"
																: "inherit",
														WebkitTextFillColor:
															formik.values?.sku?.sell_type !== details?.sku?.sell_type
																? "#D60000"
																: "inherit",
													},
												},
											}}
										>
											{map(dataInput?.data?.sell_type || [], (item) => (
												<MenuItem key={item} value={item}>
													{item}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12}>
										<TextField
											size="small"
											name="sku.life_cycle"
											label="Life Cycle"
											fullWidth
											disabled={!isEditing}
											{...getValidateFormik({
												formik,
												field: "sku.life_cycle",
												showHelpText: false,
												required: true,
											})}
											select={isEditing}
											sx={{
												"& .MuiInputBase-input": {
													color:
														formik.values?.sku?.life_cycle !== details?.sku?.life_cycle
															? "error.main"
															: "inherit",
													"&.Mui-disabled": {
														color:
															formik.values?.sku?.life_cycle !== details?.sku?.life_cycle
																? "error.main"
																: "inherit",
														WebkitTextFillColor:
															formik.values?.sku?.life_cycle !== details?.sku?.life_cycle
																? "#D60000"
																: "inherit",
													},
												},
											}}
										>
											{map(dataInput?.data?.life_cycle || [], (item) => (
												<MenuItem key={item} value={item}>
													{item}
												</MenuItem>
											))}
										</TextField>
									</Grid>

									<Grid item xs={12}>
										<Typography variant="body1" fontWeight="bold">
											Rep lead time
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											inputProps={{
												style: {
													color:
														Number(formik.values?.sku?.order_proccessing_lead_time) !==
														details?.sku?.order_proccessing_lead_time
															? "#D60000"
															: "inherit",
													WebkitTextFillColor:
														Number(formik.values?.sku?.order_proccessing_lead_time) !==
														details?.sku?.order_proccessing_lead_time
															? "#D60000"
															: "inherit",
												},
											}}
											size="small"
											name="sku.order_proccessing_lead_time"
											label="Order proccessing Lead-time"
											fullWidth
											decimalScale={2}
											disabled={!isEditing}
											thousandSeparator=","
											customInput={TextField}
											{...getValidateNumeric({
												formik,
												field: "sku.order_proccessing_lead_time",
												required: true,
											})}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											inputProps={{
												style: {
													color:
														Number(formik.values?.sku?.international_transportation_lead_time) !==
														details?.sku?.international_transportation_lead_time
															? "#D60000"
															: "inherit",
													WebkitTextFillColor:
														Number(formik.values?.sku?.international_transportation_lead_time) !==
														details?.sku?.international_transportation_lead_time
															? "#D60000"
															: "inherit",
												},
											}}
											size="small"
											name="sku.international_transportation_lead_time"
											label="International Transportation Lead-time"
											fullWidth
											decimalScale={2}
											disabled={!isEditing}
											thousandSeparator=","
											customInput={TextField}
											{...getValidateNumeric({
												formik,
												field: "sku.international_transportation_lead_time",
												required: true,
											})}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											inputProps={{
												style: {
													color:
														Number(formik.values?.sku?.domestic_lead_time) !==
														details?.sku?.domestic_lead_time
															? "#D60000"
															: "inherit",
													WebkitTextFillColor:
														Number(formik.values?.sku?.domestic_lead_time) !==
														details?.sku?.domestic_lead_time
															? "#D60000"
															: "inherit",
												},
											}}
											size="small"
											name="sku.domestic_lead_time"
											label="Domestic Lead-time"
											fullWidth
											decimalScale={2}
											disabled={!isEditing}
											thousandSeparator=","
											customInput={TextField}
											{...getValidateNumeric({
												formik,
												field: "sku.domestic_lead_time",
												required: true,
											})}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				{details?.product_update_request?.type_sku?.id && (
					<Grid item xs={12} sm={4}>
						<Paper>
							<Typography sx={{ fontWeight: "bold", padding: "9px 0", textAlign: "center" }}>
								Request information
							</Typography>
							<Divider />
							<List>
								<ItemRequestInfo
									primary="Request type"
									second={`Edit ${
										MAP_LABEL_REQUEST[details?.product_update_request?.type_sku?.type]
									}`}
								/>
								<ItemRequestInfo
									primary="SKU"
									second={details?.product_update_request?.type_sku?.additional_data?.sku}
								/>
								<ItemRequestInfo
									primary="Sales request"
									second={details?.product_update_request?.type_sku?.created_by?.email}
								/>
								<ItemRequestInfo
									primary="Request time"
									second={convertTimeToGMT7(
										details?.product_update_request?.type_sku?.created_at,
										FORMAT_DATE_FULL
									)}
								/>
								<ItemRequestInfo
									primary="Sales Manager"
									second={details?.product_update_request?.type_sku?.created_by?.manager?.email}
								/>
								{isViewApproved && (
									<>
										<ItemRequestInfo
											primary="Decision"
											second={
												<Typography
													color={
														details?.product_update_request?.type_sku?.is_approved
															? "primary.main"
															: "error.main"
													}
												>
													{details?.product_update_request?.type_sku?.is_approved
														? "Approved"
														: "Decline"}
												</Typography>
											}
										/>
										{details?.product_update_request?.type_sku?.reason && (
											<ItemRequestInfo
												primary="Reason"
												second={details?.product_update_request?.type_sku?.reason}
											/>
										)}
										<ItemRequestInfo
											primary="Decision time"
											second={convertTimeToGMT7(
												details?.product_update_request?.type_sku?.approved_at
											)}
										/>
									</>
								)}
							</List>
						</Paper>
					</Grid>
				)}
			</Grid>
		);
	}
	if (role === ERole.manager || role === ERole.admin) {
		return (
			<Paper sx={{ p: 2 }}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={12} sm={4}>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12}>
								<Typography variant="body1" fontWeight="bold">
									Product Classification
								</Typography>
							</Grid>
							<Grid item xs={12}>
								{isEditing ? (
									<TextField
										size="small"
										name="sku.category.relative_master_category.id"
										label="Master Category (Level 1)"
										fullWidth
										disabled={!isEditing}
										{...getValidateFormik({
											formik,
											field: "sku.category.relative_master_category.id",
											required: true,
											handleChange: (e) => {
												formik.setFieldValue("sku.category", {
													...formik.values.sku.category,
													relative_master_category: omit(
														categoryTree?.[e.target.value],
														"children"
													),
													relative_super_category: {},
													relative_main_category: {},
													relative_category: {},
													relative_product_line: {},
													code: null,
													description: null,
													id: null,
													name: null,
													parent_id: null,
												});
											},
										})}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_master_category?.id !==
													details?.sku?.category?.relative_master_category?.id
														? "error.main"
														: "inherit",
											},
										}}
										select
									>
										{map(Object.values(categoryTree || {}), (item: any) => (
											<MenuItem key={item.id} value={item.id}>
												{item.name}
											</MenuItem>
										))}
									</TextField>
								) : (
									<TextField
										size="small"
										name="sku.category.relative_master_category.name"
										label="Master Category (Level 1)"
										fullWidth
										disabled
										value={formik.values?.sku?.category?.relative_master_category?.name}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_master_category?.name !==
													details?.sku?.category?.relative_master_category?.name
														? "error.main"
														: "inherit",
											},
										}}
									/>
								)}
							</Grid>
							<Grid item xs={12}>
								{isEditing ? (
									<TextField
										size="small"
										name="sku.category.relative_super_category.id"
										label="Super Category (Level 2)"
										placeholder="Super Category (Level 2)"
										fullWidth
										disabled={
											!isEditing || !formik.values?.sku?.category?.relative_master_category?.id
										}
										{...getValidateFormik({
											formik,
											field: "sku.category.relative_super_category.id",
											required: true,
											handleChange: (e) => {
												formik.setFieldValue("sku.category", {
													...formik.values.sku.category,
													relative_super_category: omit(
														categoryTree?.[formik.values?.sku?.category?.relative_root_category?.id]
															?.children?.[e.target.value],
														"children"
													),
													relative_main_category: {},
													relative_category: {},
													relative_product_line: {},
													code: null,
													description: null,
													id: null,
													name: null,
													parent_id: null,
												});
											},
										})}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_super_category?.id !==
													details?.sku?.category?.relative_super_category?.id
														? "error.main"
														: "inherit",
											},
										}}
										select
									>
										{map(
											Object.values(
												categoryTree?.[formik.values?.sku?.category?.relative_master_category?.id]
													?.children || {}
											),
											(item: any) => (
												<MenuItem key={item.id} value={item.id}>
													{item.name}
												</MenuItem>
											)
										)}
									</TextField>
								) : (
									<TextField
										size="small"
										name="sku.category.relative_super_category.name"
										label="Super Category (Level 2)"
										fullWidth
										disabled
										value={formik.values?.sku?.category?.relative_super_category?.name}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_super_category?.name !==
													details?.sku?.category?.relative_super_category?.name
														? "error.main"
														: "inherit",
											},
										}}
									/>
								)}
							</Grid>
							<Grid item xs={12}>
								{isEditing ? (
									<TextField
										size="small"
										name="sku.category.relative_main_category.id"
										label="Main Category (Level 3)"
										placeholder="Main Category (Level 3)"
										fullWidth
										disabled={
											!isEditing || !formik.values?.sku?.category?.relative_super_category?.id
										}
										{...getValidateFormik({
											formik,
											field: "sku.category.relative_main_category.id",
											required: true,
											handleChange: (e) => {
												formik.setFieldValue("sku.category", {
													...formik.values.sku.category,
													relative_main_category: omit(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children?.[e.target.value],
														"children"
													),
													relative_category: {},
													relative_product_line: {},
													code: null,
													description: null,
													id: null,
													name: null,
													parent_id: null,
												});
											},
										})}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_main_category?.id !==
													details?.sku?.category?.relative_main_category?.id
														? "error.main"
														: "inherit",
											},
										}}
										select
									>
										{map(
											Object.values(
												categoryTree?.[formik.values?.sku?.category?.relative_master_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
													?.children || {}
											),
											(item: any) => (
												<MenuItem key={item.id} value={item.id}>
													{item.name}
												</MenuItem>
											)
										)}
									</TextField>
								) : (
									<TextField
										size="small"
										name="sku.category.relative_main_category.name"
										label="Main Category (Level 3)"
										fullWidth
										disabled
										value={formik.values?.sku?.category?.relative_main_category?.name}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_main_category?.name !==
													details?.sku?.category?.relative_main_category?.name
														? "error.main"
														: "inherit",
											},
										}}
									/>
								)}
							</Grid>
							<Grid item xs={12}>
								{isEditing ? (
									<TextField
										size="small"
										name="sku.category.relative_category.id"
										label="Category (Level 4)"
										placeholder="Category (Level 4)"
										fullWidth
										disabled={
											!isEditing || !formik.values?.sku?.category?.relative_main_category?.id
										}
										{...getValidateFormik({
											formik,
											field: "sku.category.relative_category.id",
											required: true,
											handleChange: (e) => {
												formik.setFieldValue("sku.category", {
													...formik.values.sku.category,
													relative_category: omit(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
															?.children?.[e.target.value],
														"children"
													),
													relative_product_line: {},
													code: null,
													description: null,
													id: null,
													name: null,
													parent_id: null,
												});
											},
										})}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_category?.id !==
													details?.sku?.category?.relative_category?.id
														? "error.main"
														: "inherit",
											},
										}}
										select
									>
										{map(
											Object.values(
												categoryTree?.[formik.values?.sku?.category?.relative_master_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
													?.children || {}
											),
											(item: any) => (
												<MenuItem key={item.id} value={item.id}>
													{item.name}
												</MenuItem>
											)
										)}
									</TextField>
								) : (
									<TextField
										size="small"
										name="sku.category.relative_category.name"
										label="Category (Level 4)"
										fullWidth
										disabled
										value={formik.values?.sku?.category?.relative_category?.name}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_category?.name !==
													details?.sku?.category?.relative_category?.name
														? "error.main"
														: "inherit",
											},
										}}
									/>
								)}
							</Grid>
							<Grid item xs={12}>
								{isEditing ? (
									<TextField
										size="small"
										name="sku.category.relative_product_line.id"
										label="Product Line (Level 5)"
										placeholder="Product Line (Level 5)"
										fullWidth
										disabled={!isEditing || !formik.values?.sku?.category?.relative_category?.id}
										{...getValidateFormik({
											formik,
											field: "sku.category.relative_product_line.id",
											required: true,
											handleChange: (e) => {
												formik.setFieldValue(
													"sku.category.relative_product_line",
													omit(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_category?.id]
															?.children?.[e.target.value],
														"children"
													)
												);
											},
										})}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_product_line?.id !==
													details?.sku?.category?.relative_product_line?.id
														? "error.main"
														: "inherit",
											},
										}}
										select
									>
										{map(
											Object.values(
												categoryTree?.[formik.values?.sku?.category?.relative_master_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_category?.id]
													?.children || {}
											),
											(item: any) => (
												<MenuItem key={item.id} value={item.id}>
													{item.name}
												</MenuItem>
											)
										)}
									</TextField>
								) : (
									<TextField
										size="small"
										name="sku.category.relative_product_line.name"
										label="Product Line (Level 5)"
										fullWidth
										disabled
										value={formik.values?.sku?.category?.relative_product_line?.name}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.relative_product_line?.name !==
													details?.sku?.category?.relative_product_line?.name
														? "error.main"
														: "inherit",
											},
										}}
									/>
								)}
							</Grid>
							<Grid item xs={12}>
								{isEditing ? (
									<TextField
										size="small"
										name="sku.category.id"
										label="Product Variant (Level 6)"
										placeholder="Product Variant (Level 6)"
										fullWidth
										disabled={
											!isEditing || !formik.values?.sku?.category?.relative_product_line?.id
										}
										{...getValidateFormik({
											formik,
											field: "sku.category.id",
											required: true,
											handleChange: (e) => {
												formik.setFieldValue("sku.category", {
													...formik.values.sku.category,
													...omit(
														categoryTree?.[
															formik.values?.sku?.category?.relative_master_category?.id
														]?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_category?.id]
															?.children?.[formik.values?.sku?.category?.relative_product_line?.id]
															?.children?.[e.target.value],
														"children"
													),
												});
											},
										})}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.id !== details?.sku?.category?.id
														? "error.main"
														: "inherit",
											},
										}}
										select
									>
										{map(
											Object.values(
												categoryTree?.[formik.values?.sku?.category?.relative_master_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_super_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_main_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_category?.id]
													?.children?.[formik.values?.sku?.category?.relative_product_line?.id]
													?.children || {}
											),
											(item: any) => (
												<MenuItem key={item.id} value={item.id}>
													{item.name}
												</MenuItem>
											)
										)}
									</TextField>
								) : (
									<TextField
										size="small"
										name="sku.category.name"
										label="Product Variant (Level 6)"
										fullWidth
										disabled
										value={formik.values?.sku?.category?.name}
										sx={{
											"& .MuiInputBase-input": {
												color:
													formik.values?.sku?.category?.name !== details?.sku?.category?.name
														? "error.main"
														: "inherit",
											},
										}}
									/>
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12}>
								<Typography variant="body1" fontWeight="bold">
									Product Information
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField
									size="small"
									name="sku.sell_type"
									label="Sell Type"
									fullWidth
									disabled={!isEditing}
									{...getValidateFormik({
										formik,
										field: "sku.sell_type",
										required: true,
									})}
									select
									sx={{
										"& .MuiInputBase-input": {
											color:
												formik.values?.sku?.sell_type !== details?.sku?.sell_type
													? "error.main"
													: "inherit",
										},
									}}
								>
									{map(dataInput?.data?.sell_type || [], (item) => (
										<MenuItem key={item} value={item}>
											{item}
										</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item xs={12}>
								<TextField
									size="small"
									name="sku.life_cycle"
									label="Life Cycle"
									fullWidth
									disabled={!isEditing}
									{...getValidateFormik({
										formik,
										field: "sku.life_cycle",
										required: true,
									})}
									select
									sx={{
										"& .MuiInputBase-input": {
											color:
												formik.values?.sku?.life_cycle !== details?.sku?.life_cycle
													? "error.main"
													: "inherit",
										},
									}}
								>
									{map(dataInput?.data?.life_cycle || [], (item) => (
										<MenuItem key={item} value={item}>
											{item}
										</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item xs={12}>
								<TextField
									size="small"
									name="sku.manager_id"
									label="Sales Manager"
									fullWidth
									disabled={!isEditing}
									{...getValidateFormik({
										formik,
										field: "sku.manager_id",
										required: true,
										handleChange: (e) => {
											formik.setFieldValue(
												"sku.manager",
												dataInput?.data?.sales_manager.find((item) => item.id === e.target.value)
											);
											formik.setFieldValue("sku.sales_id", null);
											formik.setFieldValue("sku.sales", {});
										},
									})}
									select
									sx={{
										"& .MuiInputBase-input": {
											color:
												formik.values?.sku?.manager_id !== details?.sku?.manager_id
													? "error.main"
													: "inherit",
										},
									}}
								>
									{map(dataInput?.data?.sales_manager || [], (item: any) => (
										<MenuItem key={item.id} value={item.id}>
											{item.full_name}
										</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item xs={12}>
								<TextField
									size="small"
									name="sku.sales_id"
									label="Sales"
									fullWidth
									disabled={!isEditing}
									{...getValidateFormik({
										formik,
										field: "sku.sales_id",
										required: true,
										handleChange: (e) => {
											formik.setFieldValue(
												"sku.sales",
												dataInput?.data?.pic.find((item) => item.id === e.target.value)
											);
										},
									})}
									select
									sx={{
										"& .MuiInputBase-input": {
											color:
												formik.values?.sku?.sales_id !== details?.sku?.sales_id
													? "error.main"
													: "inherit",
										},
									}}
								>
									{map(
										formik.values?.sku?.manager_id
											? dataInput?.data?.sales_manager.find(
													(item) => item.id === formik.values?.sku?.manager_id
											  )?.sales_staff
											: dataInput?.data?.pic || [],
										(item: any) => (
											<MenuItem key={item.id} value={item.id}>
												{item.full_name}
											</MenuItem>
										)
									)}
								</TextField>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12}>
								<Typography variant="body1" fontWeight="bold">
									Rep lead time
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									inputProps={{
										style: {
											color:
												Number(formik.values?.sku?.order_proccessing_lead_time) !==
												details?.sku?.order_proccessing_lead_time
													? "#D60000"
													: "inherit",
											WebkitTextFillColor:
												Number(formik.values?.sku?.order_proccessing_lead_time) !==
												details?.sku?.order_proccessing_lead_time
													? "#D60000"
													: "inherit",
										},
									}}
									size="small"
									name="sku.order_proccessing_lead_time"
									label="Order proccessing Lead-time"
									fullWidth
									decimalScale={2}
									disabled={!isEditing}
									thousandSeparator=","
									customInput={TextField}
									{...getValidateNumeric({
										formik,
										field: "sku.order_proccessing_lead_time",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									inputProps={{
										style: {
											color:
												Number(formik.values?.sku?.international_transportation_lead_time) !==
												details?.sku?.international_transportation_lead_time
													? "#D60000"
													: "inherit",
											WebkitTextFillColor:
												Number(formik.values?.sku?.international_transportation_lead_time) !==
												details?.sku?.international_transportation_lead_time
													? "#D60000"
													: "inherit",
										},
									}}
									size="small"
									name="sku.international_transportation_lead_time"
									label="International Transportation Lead-time"
									fullWidth
									decimalScale={2}
									disabled={!isEditing}
									thousandSeparator=","
									customInput={TextField}
									{...getValidateNumeric({
										formik,
										field: "sku.international_transportation_lead_time",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									inputProps={{
										style: {
											color:
												Number(formik.values?.sku?.domestic_lead_time) !==
												details?.sku?.domestic_lead_time
													? "#D60000"
													: "inherit",
											WebkitTextFillColor:
												Number(formik.values?.sku?.domestic_lead_time) !==
												details?.sku?.domestic_lead_time
													? "#D60000"
													: "inherit",
										},
									}}
									size="small"
									name="sku.domestic_lead_time"
									label="Domestic Lead-time"
									fullWidth
									decimalScale={2}
									disabled={!isEditing}
									thousandSeparator=","
									customInput={TextField}
									{...getValidateNumeric({
										formik,
										field: "sku.domestic_lead_time",
										required: true,
									})}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		);
	}
};
const ItemRequestInfo = ({ primary, second }) => (
	<ListItem
		sx={{
			gap: "20px",
			padding: "3px 16px",
			"& .MuiListItemText-root": {
				flex: "0 0 calc(50% - 10px)",
				maxWidth: "calc(50% - 10px)",
				width: "calc(50% - 10px)",
			},
		}}
	>
		<ListItemText sx={{ textAlign: "right" }}>
			<Typography fontWeight={"bold"} color={"primary.main"}>
				{primary}
			</Typography>
		</ListItemText>
		<ListItemText>
			<Typography color={"primary.main"}>{second}</Typography>
		</ListItemText>
	</ListItem>
);
