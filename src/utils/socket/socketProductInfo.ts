import { io } from "socket.io-client";

export const socketProductInfo = (token) =>
	io(process.env.REACT_APP_BASE_URL, {
		transports: ["websocket", "polling"],
		autoConnect: false,
		auth: {
			token,
		},
	});
