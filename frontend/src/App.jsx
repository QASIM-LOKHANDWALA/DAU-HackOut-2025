import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoutes";

const App = () => {
    return (
        <div className="min-h-screen w-full">
            <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/auth" element={<LoginPage />} />
                <Route path="/dashboard/*" element={<DashboardPage />} />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
