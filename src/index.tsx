import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.scss";

// MUI Date Picker: https://mui.com/x/react-date-pickers/getting-started/
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb"; // --> Change local from default US settings

// Redux:
import { Provider } from "react-redux";
import { store } from "./app/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb" >
                <App />
            </LocalizationProvider>
        </Provider>
    </React.StrictMode>
);
