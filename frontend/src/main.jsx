import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { SidebarProvider } from "./components/ui/sidebar.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <SidebarProvider>
                <App />
            </SidebarProvider>
        </BrowserRouter>
    </Provider>
);
