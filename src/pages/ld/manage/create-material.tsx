import { Grid, Typography, Button, TextField, MenuItem } from "@mui/material"
import { Box } from "@mui/system"
import { MuiBreadcrumbs } from "src/components/breadcrumbs"
import { MuiTable } from "src/components/mui-table"
import { getPagination } from "src/utils/pagination"
import { defaultRootId, EditIcon, DeleteIcon, activeState } from "../baseld"
import { Skeleton } from "src/components/skeleton";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getValidateFormik } from "src/utils/formik";
import { map } from "lodash"
import { useState } from "react"
import { FileUpload } from "src/components/file-upload";

export const CreateMaterial = ({ items }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            status: "",
            source: "",
            description: "",
            video: "",
            files: []
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required("Field is required"),
            status: Yup.string()
                .required("Field is required"),
            source: Yup.string()
                .required("Field is required"),
            description: Yup.string()
                .max(5000, "Description must be at most 5000 characters")
        }),
        onSubmit: (values) => {
            console.log('value', values)
        },
    });
    const [videoFiles, setVideoFiles] = useState<any[]>([]);
    const onFileUpload = () => {
		if (videoFiles) {
			const formData = new FormData();
			formData.append("file", videoFiles[0], videoFiles[0].name);
		}
	};
    return (
        <>
            <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <Skeleton isLoading={false}>
                    <Grid container alignContent={'center'} >
                        <Grid item alignSelf="center" xs={12}>
                            <Typography variant="h6" color="primary">
                                Create Material
                            </Typography>
                            <MuiBreadcrumbs items={items} />
                            <Typography variant="h6" color="primary">
                                Description of the topic
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                size="small"
                                name="type"
                                label="Type"
                                fullWidth
                                {...getValidateFormik({
                                    formik,
                                    field: "type",
                                    required: true,
                                })}
                                disabled={!isEditing}
                                select
                                sx={{
                                    // "& .MuiInputBase-root .MuiInputBase-input": {
                                    //     color:
                                    //         formik.values.product_type !== details.product_type
                                    //             ? "error.main"
                                    //             : "inherit",
                                    // },
                                    // "& .MuiInputBase-input.Mui-disabled": {
                                    //     color:
                                    //         formik.values.product_type !== details.product_type
                                    //             ? "error.main"
                                    //             : "inherit",
                                    //     WebkitTextFillColor:
                                    //         formik.values.product_type !== details.product_type
                                    //             ? "#D60000"
                                    //             : "inherit",
                                    // },
                                }}
                            >
                                {map(activeState, (item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                size="small"
                                name="status"
                                label="Status"
                                fullWidth
                                {...getValidateFormik({
                                    formik,
                                    field: "status",
                                    required: true,
                                })}
                                disabled={!isEditing}
                                select
                                sx={{
                                    // "& .MuiInputBase-root .MuiInputBase-input": {
                                    //     color:
                                    //         formik.values.product_type !== details.product_type
                                    //             ? "error.main"
                                    //             : "inherit",
                                    // },
                                    // "& .MuiInputBase-input.Mui-disabled": {
                                    //     color:
                                    //         formik.values.product_type !== details.product_type
                                    //             ? "error.main"
                                    //             : "inherit",
                                    //     WebkitTextFillColor:
                                    //         formik.values.product_type !== details.product_type
                                    //             ? "#D60000"
                                    //             : "inherit",
                                    // },
                                }}
                            >
                                {map(activeState, (item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="medium"
                                name="description"
                                variant="outlined"
                                placeholder={"Description"}
                                label={"Description"}
                                multiline
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        padding: "0",
                                    },
                                }}
                                rows={6}
                                {...getValidateFormik({
                                    formik,
                                    field: "description",
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary">Upload main material</Typography>

                            <FileUpload
								isLoading={isEditing}
								maxFiles={1}
								files={videoFiles}
								onDrop={(file) => {
									setVideoFiles(file);
								}}
								multiple={true}
								noDrag={true}
								accept={{}}
								onCancel={() => {
									// setOpen(false);
									setVideoFiles([]);
								}}
								onRemove={() => {
									setVideoFiles([]);
								}}
								onUpload={() => {
									onFileUpload();
								}}
							/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary">Upload pdf</Typography>
                            <FileUpload
								isLoading={isEditing}
								maxFiles={1}
								files={videoFiles}
								onDrop={(file) => {
									setVideoFiles(file);
								}}
								multiple={false}
								noDrag={true}
								accept={{}}
								onCancel={() => {
									// setOpen(false);
									setVideoFiles([]);
								}}
								onRemove={() => {
									setVideoFiles([]);
								}}
								onUpload={() => {
									onFileUpload();
								}}
							/>
                        </Grid>

                    </Grid>
                </Skeleton>
            </Box>
        </>
    )
}