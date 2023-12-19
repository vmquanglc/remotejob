import { Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import BasicDialog from "src/components/modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getValidateFormik } from "src/utils/formik";
import { useMutation } from "react-query";
import { mockGetLDMange, getTopicTreeMockData, mockDelete, mockCreate } from "src/services/ldservice/ld.mockdata.service";
import { deleteLdTopic, creatRootTopicLd } from "src/services/ldservice/ld.service";
import { toastOptions } from "src/components/toast/toast.options";
import { useCallback, useMemo } from "react";
const RootTopicHtml = ({ header, formik, isLoading, handleOnClick, handleOnClose }) => {
    return (
        <>
            <Grid container height="100%" spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12}>
                    <Typography variant="h6" color="primary">{header}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                            },
                        }}
                        size="medium"
                        fullWidth
                        placeholder={"Root topic name"}
                        name="name"
                        {...getValidateFormik({
                            formik,
                            field: "name",
                            required: true,
                        })}
                        disabled={isLoading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                            },
                        }}
                        size="medium"
                        fullWidth
                        placeholder={"Assign PIC"}
                        name="pic"
                        {...getValidateFormik({
                            formik,
                            field: "pic",
                            required: false,
                        })}
                        disabled={isLoading}
                    />
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
                <Grid item xs={12} textAlign="right" mr="8px" mt="auto">
                    <Button
                        variant="contained"
                        type="button"
                        size="medium"
                        sx={{
                            mr: 2,
                        }}
                        onClick={handleOnClick}
                        disabled={isLoading}
                    >
                        Save
                    </Button>
                    <Button variant="outlined" type="button" size="medium" onClick={handleOnClose}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}
const DeleteTopicPopup = ({ data, onClose, onSubmitDone }) => {
    const { id, name, type } = data
    const { mutate: handleDeleteTopic, isLoading } = useMutation(async (data: any) => {
        try {
            const response: any = await deleteLdTopic(id);
            if (response?.status !== 200) {
                toastOptions("error", "Delete error");
                return false;
            } else {
                toastOptions("success", "Delete success");
                onSubmitDone(id)
                return true;
            }
        } catch (error) {
            toastOptions("error", "Delete error");
            // formik.setFieldValue("name", "nbthanh ngu vcl");
            return false;
        }
    });
    return (
        {
            dialogStyle: {
                width: "444px",
                height: "200px",
                padding: "16px 0px"
            },
            content: (
                <>
                    <Grid item xs={12} ml="24px" mr="24px">
                        <Typography variant="h6" fontWeight={"bold"}>Delete topic?</Typography>
                    </Grid>
                    <Grid item xs={12} ml="24px" mr="24px" mt="16px">
                        <Typography variant="body1" color="primary">
                            Delete <Typography variant="body1" color="primary" fontWeight={"bold"} sx={{ display: "inline-block" }}>"{name}"</Typography> topic?
                        </Typography>
                        <Typography variant="body1" color="primary">
                            All the sub-topic, video/audio/article material belong to
                        </Typography>
                        <Typography variant="body1" color="primary">
                            <Typography variant="body1" color="primary" fontWeight={"bold"} sx={{ display: "inline-block" }}>"{name}"</Typography> will be deleted accordingly.
                        </Typography>
                        <Typography variant="body1" color="primary">
                            This action cannot be reverted.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} textAlign="right" mr="8px" mt="auto">
                        <Button
                            variant="contained"
                            type="button"
                            size="medium"
                            sx={{
                                mr: 2,
                            }}
                            onClick={() => handleDeleteTopic(id)}
                            disabled={isLoading}
                        >
                            Delete
                        </Button>
                        <Button variant="outlined" type="button" size="medium" onClick={onClose}>
                            Cancel
                        </Button>
                    </Grid>
                </>
            )
        }
    )
}

const DeleteTopicCourse = ({ data, onClose, onSubmitDone }) => {
    console.log('rerender topic popup')
    const { id, name, type } = data
    const dialogStyle = {
        width: "444px",
        height: "158px",
        padding: "16px 0px"
    }
    const { mutate: handleDeleteTopic, isLoading: isLoadingDelete } = useMutation(async (data: any) => {
        try {
            const response: any = await deleteLdTopic(id);
            if (response?.status !== 200) {
                toastOptions("error", "Delete error");
                return false;
            } else {
                toastOptions("success", "Delete success");
                onSubmitDone(id)
                return true;
            }
        } catch (error) {
            toastOptions("error", "Delete error");
            // formik.setFieldValue("name", "nbthanh ngu vcl");
            return false;
        }
    });

    return (
        {
            dialogStyle: {
                width: "444px",
                height: "158px",
                padding: "16px 0px"
            },
            content: (
                <>
                    <Grid container height="100%">
                        <Grid item xs={12} ml="24px" mr="24px">
                            <Typography variant="h6" fontWeight={"bold"}>Delete material?</Typography>
                        </Grid>
                        <Grid item xs={12} ml="24px" mr="24px" mt="16px">
                            <Typography variant="body1" color="primary">
                                Delete <Typography variant="body1" color="primary" fontWeight={"bold"} sx={{ display: "inline-block" }}>"{name}"</Typography> material?
                            </Typography>
                            <Typography variant="body1" color="primary">
                                This action cannot be reverted.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} textAlign="right" mr="8px" mt="auto">
                            <Button
                                variant="contained"
                                type="button"
                                size="medium"
                                sx={{
                                    mr: 2,
                                }}
                                onClick={() => handleDeleteTopic(id)}
                                disabled={isLoadingDelete}
                            >
                                Delete
                            </Button>
                            <Button variant="outlined" type="button" size="medium" onClick={onClose}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </>
            )
        }
    )
}

const CreateRootTopic = ({ onSubmitDone, onClose, data }) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            pic: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .max(500, "Topic must be at most 500 characters")
                .required("Field is required"),
            description: Yup.string()
                .max(5000, "Description must be at most 5000 characters")
        }),
        onSubmit: (values) => {
            console.log('value', values)
        },
    });
    const { mutate: handleCreateTopic, isLoading: isLoading } = useMutation(async () => {
        try {
            const response: any = await creatRootTopicLd({ name: formik.values.name, description: formik.values.description, pic_id: parseInt((formik.values.pic as any) || 0, 10) });
            if (response?.status !== 200) {
                toastOptions("error", "Create error");
                return false;
            } else {
                toastOptions("success", "Create success");
                onSubmitDone();
                return true;
            }
        } catch (error) {
            toastOptions("error", "Delete error");
            return false;
        }
    });

    return {
        dialogStyle: {
            // height: "311px",
            width: "340px",
            padding: "20px 30px"
        },
        content: (
            <>
                <RootTopicHtml
                    header="Create root topic"
                    formik={formik}
                    isLoading={isLoading}
                    handleOnClick={handleCreateTopic}
                    handleOnClose={onClose}
                />
            </>
        )
    }
}
const UpdateRootTopic = ({ onSubmitDone, onClose, data }) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            pic: "",
            ...data
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .max(500, "Topic must be at most 500 characters")
                .required("Field is required"),
            description: Yup.string()
                .max(5000, "Description must be at most 5000 characters")
        }),
        onSubmit: (values) => {
            console.log('value', values)
        },
    });
    const { mutate: handleUpdateTopic, isLoading: isLoading } = useMutation(async (data: any) => {
        try {
            const response: any = await mockCreate(data.id);
            if (response?.status !== 200) {
                toastOptions("error", "Create error");
                return false;
            } else {
                toastOptions("success", "Create success");
                onSubmitDone()
                return true;
            }
        } catch (error) {
            toastOptions("error", "Delete error");
            // formik.setFieldValue("name", "nbthanh ngu vcl");
            return false;
        }
    });

    return {
        dialogStyle: {
            height: "311px",
            width: "340px",
            padding: "20px 30px"
        },
        content: (
            <>
                <RootTopicHtml
                    header="Update root topic"
                    formik={formik}
                    isLoading={isLoading}
                    handleOnClick={handleUpdateTopic}
                    handleOnClose={onClose}
                />
            </>
        )
    }
}


const CreateTopic = ({ onSubmitDone, onClose, data }) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .max(500, "Topic must be at most 500 characters")
                .required("Field is required"),
            description: Yup.string()
                .max(5000, "Description must be at most 5000 characters")
        }),
        onSubmit: (values) => {
            console.log('value', values)
        },
    });
    const { mutate: handleCreateTopic, isLoading: isLoading } = useMutation(async (data: any) => {
        try {
            const response: any = await mockCreate(data.id);
            if (response?.status !== 200) {
                toastOptions("error", "Create error");
                return false;
            } else {
                toastOptions("success", "Create success");
                return true;
            }
        } catch (error) {
            toastOptions("error", "Delete error");
            // formik.setFieldValue("name", "nbthanh ngu vcl");
            return false;
        }
    });
    return {
        dialogStyle: {
            width: "340px",
            height: "253px",
            padding: "20px 30px"
        },
        content: (
            <>
                <Grid item xs={12}>
                    <Typography variant="h6" color="primary">Create root</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                            },
                        }}
                        size="medium"
                        fullWidth
                        placeholder={"Root topic name"}
                        name="name"
                        {...getValidateFormik({
                            formik,
                            field: "name",
                            required: true,
                        })}
                        disabled={isLoading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                            },
                        }}
                        size="medium"
                        fullWidth
                        placeholder={"Description"}
                        name="description"
                        {...getValidateFormik({
                            formik,
                            field: "description",
                            required: false,
                        })}
                        disabled={isLoading}
                    />
                </Grid>
            </>
        )
    }
}
const UpdateTopic = ({ onSubmitDone, onClose, data }) => {
    const {topicList}=data;
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            pTopic: {
                id: "",
                name: ""
            }
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .max(500, "Topic must be at most 500 characters")
                .required("Field is required"),
            description: Yup.string()
                .max(5000, "Description must be at most 5000 characters")
        }),
        onSubmit: (values) => {
            console.log('value', values)
        },
    });
    const { mutate: handleCreateTopic, isLoading: isLoading } = useMutation(async (data: any) => {
        try {
            const response: any = await mockCreate(data.id);
            if (response?.status !== 200) {
                toastOptions("error", "Create error");
                return false;
            } else {
                toastOptions("success", "Create success");
                return true;
            }
        } catch (error) {
            toastOptions("error", "Delete error");
            // formik.setFieldValue("name", "nbthanh ngu vcl");
            return false;
        }
    });
    return {
        dialogStyle: {
            width: "340px",
            height: "253px",
            padding: "20px 30px"
        },
        content: (
            <>
                <Grid item xs={12}>
                    <Typography variant="h6" color="primary">Create root</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                            },
                        }}
                        size="medium"
                        fullWidth
                        placeholder={"Root topic name"}
                        name="name"
                        {...getValidateFormik({
                            formik,
                            field: "name",
                            required: true,
                        })}
                        disabled={isLoading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                            },
                        }}
                        size="medium"
                        fullWidth
                        placeholder={"Root topic name"}
                        name="pic"
                        {...getValidateFormik({
                            formik,
                            field: "pic",
                            required: false,
                        })}
                        disabled={isLoading}
                    />
                </Grid>
                <Grid
                    item
                    sm={12}
                >
                    <TextField
                        fullWidth
                        label={`Parent Topic Id`}
                        size="medium"
                        select
                        disabled={isLoading}
                        name="pTopic.id"
                        {...getValidateFormik({
                            formik,
                            field: "pTopic.id",
                            // required: true,
                        })}
                        onChange={(e) => {
                            const topic = topicList.find((item) => item.id === e.target.value);
                            formik.setFieldValue("pTopic", topic);
                        }}
                    >
                        {topicList.map(({ id, name, managers }) => (
                            <MenuItem key={id} value={id} disabled={!managers.length}>
                                {name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </>
        )
    }
}

export const CreateTopicPopup = ({ onSubmitDone, onClose, type, data }) => {
    const { id, name } = data
    const configSetup = useCallback((type) => {
        switch (type) {
            case 'CreateRootTopic':
                return CreateRootTopic({ onSubmitDone, onClose, data })
                break;
            case 'UpdateRootTopic':
                return UpdateRootTopic({ onSubmitDone, onClose, data })
                break;
            case 'CreateTopic':
                return CreateTopic({ onSubmitDone, onClose, data })
                break;
            case 'UpdateTopic':
                return UpdateTopic({ onSubmitDone, onClose, data })
                break;
            case 'DeleteTopic':
            case 'DeleteNode':
                return DeleteTopicPopup({ onSubmitDone, onClose, data })
                break;
            case 'DeleteCourse':
                return DeleteTopicCourse({ onSubmitDone, onClose, data })
                break;

        }
    }, [])

    return (
        <>
            <BasicDialog
                disabledBackdropClick
                open
                handleClose={onClose}
                sxDialog={configSetup(type).dialogStyle}
                onClose={false}
            >
                {configSetup(type).content}
            </BasicDialog>
        </>
    );
};
