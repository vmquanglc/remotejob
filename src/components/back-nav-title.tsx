import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ArrowLeft } from "./icons/arrow-left";
import { ToolTip } from "./tooltip";

export const BackNavTitle = ({ onClick, title, isShowToolTip = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        zIndex: 1,
      }}
    >
      <ArrowLeft fontSize="small" onClick={onClick} />
      <Typography sx={{ ml: 1 }} variant="h5" color="primary" onClick={onClick}>
        {title}
      </Typography>
      {isShowToolTip && (
        <Box sx={{ display: "flex", marginLeft: "auto" }}>
          <ToolTip title="Tooltip" placement="top-start" />
        </Box>
      )}
    </Box>
  );
};
