import { ThemeOptions } from "@mui/material";

const background = {
	default: "#F9FAFC",
	paper: "#FFFFFF",
	primary: "#F2F1FA",
};

const neutral = {
	100: "#F3F4F6",
	700: "#5D5A88",
	900: "#9E9E9E",
};

const primary = {
	main: "#5D5A88",
};

const success = {
	main: "#04B500",
	contrastText: "#FFFFFF",
};

const info = {
	main: "#006EC9",
	contrastText: "#FFFFFF",
};

const warning = {
	main: "#d32f2f",
	contrastText: "#FFFFFF",
};

const error = {
	main: "#D60000",
	contrastText: "#FFFFFF",
};

const text = {
	primary: "#5D5A88",
	secondary: "#ADABC3",
};

const typography = {
	fontFamily: '"Roboto", sans-serif',
	h1: {
		fontWeight: 700,
		fontSize: "96px",
		lineHeight: "96px",
	},
	h2: {
		fontWeight: 700,
		fontSize: "60px",
		lineHeight: "60px",
	},
	h3: {
		fontWeight: 700,
		fontSize: "48px",
		lineHeight: "50px",
		color: "#5D5A88",
	},
	h4: {
		fontWeight: 700,
		fontSize: "34px",
		lineHeight: "50px",
	},
	h5: {
		fontWeight: 700,
		fontSize: "0.875rem",
		lineHeight: 1.4,
		color: "#5D5A88",
	},
	h6: {
		fontWeight: 400,
		fontSize: "20px",
		lineHeight: "24px",
	},
	body1: {
		fontSize: "14px",
		lineHeight: "18px",
	},
	body2: {
		fontSize: "14px",
		lineHeight: "18px",
		color: text.primary,
	},
};

const boxShadow = ["rgb(100 116 139 / 40%) 0px 1px 4px"];

export const baseThemeOptions: ThemeOptions = {
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 1000,
			lg: 1200,
			xl: 1440,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				"*": {
					boxSizing: "border-box",
				},
				html: {
					MozOsxFontSmoothing: "grayscale",
					WebkitFontSmoothing: "antialiased",
					display: "flex",
					flexDirection: "column",
					minHeight: "100%",
					width: "100%",
				},
				body: {
					display: "flex",
					flex: "1 1 auto",
					flexDirection: "column",
					minHeight: "100%",
					width: "100%",
				},
				"#nprogress": {
					pointerEvents: "none",
				},
				"#nprogress .bar": {
					backgroundColor: "#5048E5",
					height: 3,
					left: 0,
					position: "fixed",
					top: 0,
					width: "100%",
					zIndex: 2000,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					color: "#D4D2E3",
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					fontSize: "14px",
					"& .MuiAlert-message": {
						whiteSpace: "break-spaces",
					},
				},
			},
		},
		MuiRadio: {
			defaultProps: {
				color: "primary",
			},
		},
		MuiSwitch: {
			defaultProps: {
				color: "primary",
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					border: "none",
					background: "#fff",
					boxShadow: boxShadow[0],
					borderRadius: "8px",
					"& .MuiAutocomplete-listbox": {
						color: neutral[700],
						fontSize: "0.75rem",
					},
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						padding: "7px",
					},
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
			styleOverrides: {
				root: {
					textTransform: "none",
					fontSize: "14px",
					lineHeight: "24px",
					borderRadius: "4px",
					fontWeight: "500",
					padding: "6px 16px",
					minWidth: "80px",
				},
				outlinedPrimary: {
					borderColor: text.primary,
				},
				sizeLarge: {
					padding: "12px 20px",
				},
				sizeSmall: {
					padding: "7px 14px",
					fontSize: "14px",
					lineHeight: 1.5,

					"& .MuiButton-startIcon": {
						"& .MuiSvgIcon-root": {
							fontSize: "16px",
						},
					},
				},
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					textTransform: "none",

					"& .MuiInputLabel-sizeSmall": {
						fontSize: "14px",
						lineHeight: "18px",
					},

					"& .MuiFormHelperText-sizeSmall": {
						margin: "4px 0 0",
						fontSize: "0.675rem",
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					"&.Mui-disabled": {
						color: text.secondary,
						// "-webkit-text-fill-color": text.secondary,
						WebkitTextFillColor: text.secondary,

						"& .MuiInputBase-input": {
							color: text.secondary,
							WebkitTextFillColor: text.secondary,
							// "-webkit-text-fill-color": text.secondary,
						},
					},
					fontSize: "14px",
					lineHeight: "18px",
					fontWeight: 400,
					borderRadius: "5px",
					color: text.primary,
					background: "transparent",
					minHeight: "37px",
				},
				sizeSmall: {
					fontSize: "14px",
					".MuiInputBase-input": {
						height: "1.2em",
						color: text.primary,
					},

					"& .MuiInputAdornment-root": {
						"& .MuiSvgIcon-root": {
							width: "16px",
							height: "16px",
						},

						"& .MuiTypography-root": {
							fontSize: "inherit",
							color: "inherit",
						},

						"& +.MuiInputBase-inputAdornedStart": {
							paddingLeft: "0px",
						},
					},
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					"&:hover": {
						"& td": {
							backgroundColor: "unset",
						},
					},
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					fontSize: "14px",
					lineHeight: "19px",
					color: text.primary,
					borderBottom: "1px solid rgba(204, 204, 204, 0.5)",
					padding: ".6rem .5rem",
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					backgroundColor: `${neutral[100]} !important`,
					".MuiTableCell-root": {
						color: neutral[700],
						padding: ".6rem .5rem",
						"&:hover": {
							outline: "unset",
						},
					},
				},
			},
		},
		MuiTableBody: {
			styleOverrides: {
				root: {
					".MuiTableCell-root": {
						padding: ".6rem .5rem",
						"&:hover": {
							outline: "unset",
						},
					},
				},
			},
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					marginRight: "16px",
					"&.MuiListItemIcon-root": {
						minWidth: "unset",
					},
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					color: text.primary,
					padding: "12px 16px",
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					"& .MuiMenuItem-root": {
						fontSize: "14px",
					},
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: text.primary,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-input": {
						padding: "14px 15px",
						height: "20px",
						borderColor: text.primary,
						background: "transparent",
					},
					"& .MuiInputBase-inputMultiline": {
						padding: "0",
						height: "20px",
						borderColor: text.primary,
						background: "transparent",
					},
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: text.primary,
					},
				},
				sizeSmall: {
					"& .MuiOutlinedInput-input:not(textarea)": {
						padding: "8px 14px",
						fontSize: "14px",
						lineHeight: "20px",
					},
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					minHeight: "42px",
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					fontSize: "14px",
					fontWeight: 400,
					lineHeight: "24px",
					minWidth: "auto",
					minHeight: "42px",
					padding: "8px 20px",
					textTransform: "none",
					"& + &": {
						marginLeft: 16,
					},
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					padding: "0 16px !important",
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					cursor: "pointer",
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				fontSizeSmall: {
					width: "16px",
					height: "16px",
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					padding: "0 9px",
				},
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltipPlacementRight: {
					"&.MuiTooltip-tooltip": {
						marginLeft: "0px !important",
					},
				},
			},
		},
	},
	typography,
	palette: {
		background,
		primary,
		text,
		success,
		info,
		warning,
		error,
	},
};
