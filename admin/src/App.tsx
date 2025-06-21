// App.tsx (inside admin project)

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Order";
import MenuForm from "./components/MenuForm";
import MenuManagement from "./pages/MenuManagement";
import TableView from "./pages/TableView";
import Bill from "./components/Bill";
import Reports from "./pages/Reports";
import Kitchen from "./pages/Kitchen";
import Profile from "./pages/Profile";
import Developers from "./pages/Developers";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6 overflow-x-hidden">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/menu" element={<MenuForm />} />
                    <Route path="/tables" element={<TableView />} />
                    <Route path="/bill" element={<Bill />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/kitchen" element={<Kitchen />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/developers" element={<Developers />} />
                    <Route path="/menumanagement" element={<MenuManagement />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
