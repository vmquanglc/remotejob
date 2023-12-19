import { ReactElement } from "react";
import { toast } from "react-hot-toast";
import { DoneAll, PriorityHigh } from "@mui/icons-material";

export const toastOptions = (type: "success" | "error", message: string, icon?: ReactElement) => {
	switch (type) {
		case "success":
			return toast.success(message, {
				icon: icon ? icon : <DoneAll />,
				style: {
					color: "#3AD29F",
				},
				duration: 3000,
			});
		case "error":
			return toast.error(message, {
				icon: icon ? icon : <PriorityHigh />,
				style: {
					color: "#F11A16",
				},
				duration: 3000,
			});
	}
};
