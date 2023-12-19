import type { FC } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import {
	Box,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
	Typography,
} from "@mui/material";

import { Duplicate as DuplicateIcon } from "src/components/icons/duplicate";
import { CheckCircleRoundedIcon } from "src/components/icons/check-circle";

import { X as XIcon } from "src/components/icons/x";
import { bytesToSize } from "src/utils/bytes-to-size";
import { EllipsisText } from "./ellipsis-text";

interface Props extends DropzoneOptions {
	showList?: boolean;
	files?: any[];
	onRemove?: (file: any) => void;
	onRemoveAll?: () => void;
	onUpload?: () => void;
	showIcon?: boolean;
	hideButtonUpload?: boolean;
	hideButtonRemove?: boolean;
	multiple?: boolean;
}

export const FileDropzone: FC<Props> = (props) => {
	const {
		accept,
		disabled,
		files,
		getFilesFromEvent,
		maxFiles,
		maxSize,
		minSize,
		noClick,
		noDrag,
		noDragEventsBubbling,
		noKeyboard,
		onDrop,
		onDropAccepted,
		onDropRejected,
		onFileDialogCancel,
		onRemove,
		onRemoveAll,
		onUpload,
		preventDropOnDocument,
		showList,
		showIcon = false,
		hideButtonUpload = false,
		hideButtonRemove = false,
		multiple = true,
		...other
	} = props;

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept,
		maxFiles,
		maxSize,
		minSize,
		onDrop,
		disabled,
	});

	return (
		<Box component={"div"}>
			<Box
				sx={{
					alignItems: "center",
					border: 1,
					borderRadius: 1,
					borderStyle: "dashed",
					borderColor: "divider",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					outline: "none",
					p: 2,
					...(isDragActive && {
						backgroundColor: "action.active",
						opacity: 0.5,
					}),
					"&:hover": {
						backgroundColor: "action.hover",
						cursor: "pointer",
						opacity: 0.5,
					},
				}}
				{...getRootProps()}
			>
				<input {...getInputProps()} multiple={multiple} />
				<Box
					sx={{
						"& img": {
							width: 60,
						},
					}}
				>
					<img alt="Chọn tài liệu" src="/static/images/undraw_add_file2_gvbb.svg" />
				</Box>
				<Box sx={{ p: 2 }}>
					<Typography variant="h5">Select file</Typography>
					<Box sx={{ mt: 0.5 }}>
						<Typography variant="body2">Drag or drop files from computer</Typography>
					</Box>
				</Box>
			</Box>
			{showList && files && files.length > 0 && (
				<Box>
					<List>
						{files.map((file) => (
							<ListItem
								key={file.path}
								sx={{
									border: 1,
									borderColor: "divider",
									borderRadius: 1,
									"& + &": {
										mt: 1,
									},
								}}
							>
								{showIcon && (
									<CheckCircleRoundedIcon
										sx={{
											position: "absolute",
											top: "-8px",
											fontSize: "19px",
											backgroundColor: "#fff",
											right: "-8px",
											color: "#3ad29f",
											zIndex: 2,
										}}
									/>
								)}
								<ListItemIcon sx={{ mr: 1 }}>
									<DuplicateIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={
										<Box maxWidth={{ xs: 65, sm: 80, md: 100 }}>
											<EllipsisText text={file.name} />
										</Box>
									}
									primaryTypographyProps={{
										color: "textPrimary",
										variant: "subtitle1",
									}}
									secondaryTypographyProps={{
										color: "textSecondary",
										variant: "subtitle2",
									}}
									secondary={bytesToSize(file.size)}
								/>
								<Tooltip title="Remove">
									<IconButton edge="end" onClick={() => onRemove && onRemove(file)}>
										<XIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</ListItem>
						))}
					</List>
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						{!hideButtonRemove && (
							<Button onClick={onRemoveAll} size="small" type="button">
								Remove all
							</Button>
						)}
						{!hideButtonUpload && (
							<Button
								onClick={onUpload}
								size="small"
								sx={{ ml: 1 }}
								type="button"
								variant="contained"
							>
								Upload
							</Button>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
};
