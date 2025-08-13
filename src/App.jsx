// src/App.jsx
import { Routes, Route } from "react-router-dom";

// Route components
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyInvoices from "./pages/MyInvoices";
import CreateInvoice from "./pages/CreateInvoice";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
    return (
        // Wrap the entire routing system with AuthProvider to share auth state.

            <Routes>
                {/* Public routes (accessible without authentication) */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes (require authentication) */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/myinvoices"
                    element={
                        <PrivateRoute>
                            <MyInvoices />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/createinvoice"
                    element={
                        <PrivateRoute>
                            <CreateInvoice />
                        </PrivateRoute>
                    }
                />

                {/* Fallback route for unmatched URLs */}
                <Route path="*" element={<h1 className="text-center text-red-500 mt-10 text-xl">❌ Page Not Found</h1>} />
            </Routes>

    );
}

export default App;