import { FC } from "react";

import { styled } from "@mui/material/styles";

interface Props {
  text: string;
}

const EllipsisTextRoot = styled("span")(() => ({
  display: "-webkit-box",
  " -webkit-box-orient": "vertical",
  "-webkit-line-clamp": "1",
  overflow: "hidden",
}));

export const EllipsisText: FC<Props> = ({ text }) => {
  return <EllipsisTextRoot>{text}</EllipsisTextRoot>;
};
