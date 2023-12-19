import { CheckBox, CheckBoxOutlineBlank, Search } from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Checkbox,
	Grid,
	InputAdornment,
	MenuItem,
	TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { isEmpty, isEqual, map, uniqWith } from "lodash";
import { MuiChipsInput } from "mui-chips-input";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getOptionsCate } from "src/services/product-info/productInfo.services";
import { getValidateFormik } from "src/utils/formik";

export const ProductMasterFilter = ({ onSearch, dataInput, dataSearch }) => {
	const formik = useFormik({
		initialValues: dataSearch,
		onSubmit: (values) => {
			onSearch(values);
		},
	});

	useEffect(() => {
		formik.setValues(dataSearch);
	}, [dataSearch]);

	const sortItems = (id, key) => {
		const a = (formik.values?.[`${key}`] || [])?.find((item) => item === id);
		if (a) return -1;
		if (!a) return 1;
		return 0;
	};

	const sortSalesManagerOptions = (data) => {
		const a = (formik.values?.sales_manager || [])?.find((item) => item.id === data.id);
		if (a) return -1;
		if (!a) return 1;
		return 0;
	};

	const [isCopy, setIsCopy] = useState<boolean>(false);
	const [value, setValue] = useState("");

	const handleFormatChip = (array) => {
		let result = [];
		for (let i = 0; i < array.length; i++) {
			const data = array[i].replaceAll(" ", ",");
			if (data.includes(",")) {
				result = [...result, ...data.split(",")];
			} else {
				result.push(array[i]);
			}
		}
		return uniqWith(result, isEqual);
	};
	const handleChangeChip = (newChips) => {
		formik.setFieldValue("sku_upc_asin", handleFormatChip(newChips));
	};

	const handleInputChange = (inputValue) => {
		if (isCopy) {
			if (!isEmpty(inputValue)) {
				formik.setFieldValue(
					"sku_upc_asin",
					handleFormatChip([...formik.values.sku_upc_asin, inputValue])
				);
				setIsCopy(false);
			}
			setValue("");
		} else {
			setValue(inputValue);
		}
	};

	const getOptions = (manager) => {
		return manager.reduce((arr, manager) => {
			const pic = dataInput?.data?.sales_manager
				.find((item) => item.email === manager.email)
				?.sales_staff?.map((item) => item);
			return [...arr, ...pic];
		}, []);
	};

	const {
		data: dataCate,
		isFetching: isLoadingCate,
		refetch: refreshCate,
	} = useQuery(
		[`get-cate-options`, formik?.values?.sales_manager?.length, formik?.values?.pic?.length],
		() => {
			return getOptionsCate({
				manager_ids: JSON.stringify(formik?.values?.sales_manager?.map((item) => item.id)),
				sales_ids: JSON.stringify(formik?.values?.pic?.map((item) => item.id)),
			});
		},
		{
			keepPreviousData: true,
			enabled: !!formik?.values?.sales_manager?.length && !!formik?.values?.pic?.length,
			select: (data) => data?.data?.category,
		}
	);

	return (
		<Grid container spacing={{ xs: 2, sm: 2 }}>
			<Grid item xs={12} sm={4}>
				<MuiChipsInput
					value={formik.values.sku_upc_asin || []}
					onChange={handleChangeChip}
					addOnWhichKey={["Enter", " ", "Backspace"]}
					inputValue={value}
					variant="outlined"
					onInputChange={handleInputChange}
					onPaste={() => setIsCopy(true)}
					onBlur={() => {
						setIsCopy(false);
						if (!isEmpty(value)) {
							formik.setFieldValue(
								"sku_upc_asin",
								handleFormatChip([...formik.values.sku_upc_asin, value])
							);
						}
						setValue("");
					}}
					clearInputOnBlur
					disableEdition
					label="Search SKU, UPC, ASIN"
					placeholder={formik.values.sku_upc_asin?.length === 0 ? "Search SKU, UPC, ASIN" : ""}
					sx={{
						width: "100%",
						".MuiInputBase-colorPrimary.MuiInputBase-formControl": {
							minHeight: "91px",
						},
						".MuiInputBase-root input": {
							alignSelf: "flex-start",
						},
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={4}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={6}>
						<TextField
							size="small"
							name="category_level"
							label="Choose level of Category"
							fullWidth
							select
							{...getValidateFormik({
								formik,
								field: "category_level",
								handleChange: () => {
									formik.setFieldValue("category", "");
								},
							})}
						>
							{map(Object.values(optionsCates), ({ label, value }) => (
								<MenuItem key={value} value={value}>
									{label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={6}>
						<TextField
							size="small"
							name="category"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search color="primary" />
									</InputAdornment>
								),
							}}
							select={
								!!dataCate && formik.values?.sales_manager?.length && formik.values?.pic?.length
							}
							placeholder="Search Category"
							fullWidth
							{...getValidateFormik({
								formik,
								field: "category",
							})}
						>
							{map(
								dataCate?.[`${optionsCates?.[formik.values.category_level].key}`],
								({ name, level, id }) => (
									<MenuItem key={id} value={name}>
										{name}
									</MenuItem>
								)
							)}
						</TextField>
					</Grid>
					<Grid item xs={12}>
						<TextField
							size="small"
							name="product_name"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search color="primary" />
									</InputAdornment>
								),
							}}
							placeholder="Product name"
							fullWidth
							{...getValidateFormik({
								formik,
								field: "product_name",
							})}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} sm={4}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={12}>
						<Autocomplete
							multiple
							clearIcon={<></>}
							options={
								(dataInput?.data?.sales_manager || [])?.sort(
									(a, b) => sortSalesManagerOptions(a) - sortSalesManagerOptions(b)
								) || []
							}
							getOptionLabel={(option: any) => option.full_name}
							onChange={(_, option) => {
								formik.setFieldValue("sales_manager", option);
								formik.setFieldValue("pic", []);
								formik.setFieldValue("category", "");
							}}
							value={formik.values.sales_manager || []}
							disableCloseOnSelect
							renderOption={(props, option, { selected }) => (
								<li {...props}>
									<Checkbox
										icon={<CheckBoxOutlineBlank fontSize="small" />}
										checkedIcon={<CheckBox fontSize="small" />}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option.full_name}
								</li>
							)}
							ChipProps={{
								sx: {
									fontSize: "12px",
									height: "26px",
									"&.MuiAutocomplete-tag": {
										margin: "1px 3px",
									},
								},
							}}
							limitTags={2}
							onBlur={formik.handleBlur}
							renderInput={(params) => (
								<TextField
									{...params}
									size="small"
									name="sales_manager"
									label="Sales manager"
									fullWidth
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Autocomplete
							multiple
							clearIcon={<></>}
							options={(formik.values?.sales_manager?.length
								? getOptions(formik.values?.sales_manager)
								: dataInput?.data?.pic || []
							)?.sort((a, b) => sortItems(a, "pic") - sortItems(b, "pic"))}
							getOptionLabel={(option: any) => option.full_name}
							onChange={(_, option) => {
								formik.setFieldValue("pic", option);
								formik.setFieldValue("category", "");
							}}
							value={formik.values.pic || []}
							disableCloseOnSelect
							renderOption={(props, option, { selected }) => (
								<li {...props}>
									<Checkbox
										icon={<CheckBoxOutlineBlank fontSize="small" />}
										checkedIcon={<CheckBox fontSize="small" />}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option?.full_name}
								</li>
							)}
							ChipProps={{
								sx: {
									fontSize: "12px",
									height: "26px",
									"&.MuiAutocomplete-tag": {
										margin: "1px 3px",
									},
								},
							}}
							limitTags={2}
							onBlur={formik.handleBlur}
							renderInput={(params) => (
								<TextField {...params} size="small" name="pic" label="PIC" fullWidth />
							)}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} sm={4}>
				<Button
					type="button"
					variant="contained"
					onClick={() => {
						formik.handleSubmit();
					}}
					sx={{ mr: 1 }}
				>
					Search
				</Button>
				<Button
					type="button"
					variant="outlined"
					onClick={() => {
						formik.resetForm();
						formik.handleSubmit();
						// onReset();
					}}
					sx={{ mr: 1 }}
				>
					Reset
				</Button>
			</Grid>
		</Grid>
	);
};
const optionsCates = {
	0: { label: "Master Category", value: 0, key: "relative_master_category" },
	1: { label: "Super Category", value: 1, key: "relative_super_category" },
	2: { label: "Main Category", value: 2, key: "relative_main_category" },
	3: { label: "Category", value: 3, key: "relative_category" },
	4: { label: "Product Line", value: 4, key: "relative_product_line" },
	5: { label: "Product Variant", value: 5, key: "relative_product_variant" },
	// 6: { label: "Product Name", value: 6, key: "relative_product_name" },
};
