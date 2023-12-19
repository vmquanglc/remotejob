import { FC } from "react";

import {
  DesktopDatePicker as DatePicker,
  DatePickerProps,
} from "@mui/x-date-pickers";

import { styled } from "@mui/material/styles";

interface Props extends DatePickerProps<any, any> {
  size?: "small" | "medium" | "large";
}

const DesktopDatePickerRoot = styled("div")(() => {
  return {
    "&.MuiDesktopDatePicker-small": {
      display: "unset",
      "& .MuiOutlinedInput-root": {
        fontSize: "0.75rem",

        "& .MuiOutlinedInput-input": {
          height: "20px",
          lineHeight: "20px",
          padding: "6px 14px",
        },

        "& .MuiInputAdornment-root": {
          "& svg": {
            width: "0.875rem",
            height: "0.875rem",
          },
        },
      },
    },
  };
});

export const DesktopDatePicker: FC<Props> = (props) => {
  const { size = "medium", ...restProps } = props;

  return (
    <DesktopDatePickerRoot
      className={`MuiDesktopDatePicker-root MuiDesktopDatePicker-${size}`}
    >
      <DatePicker inputFormat="MM/dd/yyyy" {...restProps} />
    </DesktopDatePickerRoot>
  );
};
