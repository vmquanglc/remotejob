import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/store";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});
root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<Toaster position="top-right" />
			<ThemeProvider theme={createTheme({})}>
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	</Provider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
