import type { FC } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import { Box, Button, IconButton, List, Tooltip, Typography } from "@mui/material";

import { X as XIcon } from "src/components/icons/x";
import { EllipsisText } from "./ellipsis-text";
import { ButtonLoading } from "./button-loading";

interface Props extends DropzoneOptions {
	showList?: boolean;
	files?: any[];
	onRemove?: (file: any) => void;
	onCancel?: (file: any) => void;
	onUpload?: (file?: any) => void;
	hideButtonUpload?: boolean;
	multiple?: boolean;
	isLoading?: boolean;
}

export const FileUpload: FC<Props> = (props) => {
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
		onCancel,
		onUpload,
		preventDropOnDocument,
		showList,
		hideButtonUpload = false,
		multiple = false,
		isLoading = false,
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
		<div {...(other as any)}>
			{files && files.length > 0 ? (
				<Box
					sx={{
						paddingBottom: "8px",
					}}
				>
					<List>
						{files.map((file, index) => (
							<Box
								key={index}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: "5px",
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="11"
									height="23"
									viewBox="0 0 11 23"
									fill="none"
								>
									<path
										d="M9.5 5.5V17C9.5 19.21 7.71 21 5.5 21C3.29 21 1.5 19.21 1.5 17V4.5C1.5 3.12 2.62 2 4 2C5.38 2 6.5 3.12 6.5 4.5V15C6.5 15.55 6.05 16 5.5 16C4.95 16 4.5 15.55 4.5 15V5.5H3V15C3 16.38 4.12 17.5 5.5 17.5C6.88 17.5 8 16.38 8 15V4.5C8 2.29 6.21 0.5 4 0.5C1.79 0.5 0 2.29 0 4.5V17C0 20.04 2.46 22.5 5.5 22.5C8.54 22.5 11 20.04 11 17V5.5H9.5Z"
										fill="#006EC9"
									/>
								</svg>
								<Box
									sx={{
										flex: "1 1",
									}}
								>
									<Box
										sx={{
											maxWidth: "300px",
											" -webkit-box-orient": "vertical",
											"-webkit-line-clamp": "1",
											textOverflow: "ellipsis",
											overflow: "hidden",
											whiteSpace: "nowrap",
											color: "#006EC9",
										}}
									>
										<Box
											component={"span"}
											sx={{
												position: "relative",
												"&::before": {
													content: "''",
													position: "absolute",
													bottom: "0",
													left: "0",
													width: "100%",
													height: "1px",
													background: "#006EC9",
												},
											}}
										>
											{file.name}
										</Box>
									</Box>
								</Box>
								<Tooltip title="Remove">
									<IconButton edge="end" onClick={() => onRemove && !isLoading && onRemove(file)}>
										<XIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</Box>
						))}
					</List>
				</Box>
			) : (
				<Box
					sx={{
						outline: "none",
						paddingBottom: "16px",
						paddingTop: "16px",
						cursor: "pointer",
						...(isDragActive && {}),
					}}
					{...getRootProps()}
				>
					<input {...getInputProps()} multiple={multiple} />
					<Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
						<ImportIcon size={16} />
						<Typography fontSize={"14px"} fontWeight={400} color={"#006EC9"}>
							Browse file
						</Typography>
					</Box>
				</Box>
			)}
			<Box
				sx={{
					borderTop: "1px solid #D4D2E3",
					display: "flex",
					justifyContent: "flex-end",
					paddingTop: "16px",
				}}
			>
				{!hideButtonUpload && (
					<ButtonLoading
						loading={isLoading}
						onClick={onUpload}
						size="small"
						disabled={!files.length}
						sx={{ ml: 1 }}
						type="button"
						variant="contained"
					>
						Check Preview and rules
					</ButtonLoading>
				)}
				<Button
					size="small"
					sx={{ ml: 1 }}
					type="button"
					variant="outlined"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
			</Box>
		</div>
	);
};

const ImportIcon = ({ size = 13, fill = "#006EC9" }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 13 13"
		fill="none"
	>
		<g clipPath="url(#clip0_2603_132184)">
			<path
				d="M6.49967 1.08398C3.50967 1.08398 1.08301 3.51065 1.08301 6.50065C1.08301 9.49065 3.50967 11.9173 6.49967 11.9173C9.48967 11.9173 11.9163 9.49065 11.9163 6.50065C11.9163 3.51065 9.48967 1.08398 6.49967 1.08398ZM9.20801 7.04232H7.04134V9.20898H5.95801V7.04232H3.79134V5.95898H5.95801V3.79232H7.04134V5.95898H9.20801V7.04232Z"
				fill={fill}
			/>
		</g>
		<defs>
			<clipPath id="clip0_2603_132184">
				<rect width="13" height="13" fill="white" />
			</clipPath>
		</defs>
	</svg>
);
