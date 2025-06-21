import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/orders", label: "Orders" },
    { path: "/menu", label: "Menu" },
    { path: "/tables", label: "Tables" },
    { path: "/bill", label: "Bill" },
    { path: "/reports", label: "Reports" },
    { path: "/kitchen", label: "Kitchen" },
    { path: "/profile", label: "Profile" },
    { path: "/developers", label: "Developers" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen px-4 py-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <ul>
        {links.map(link => (
          <li key={link.path} className="mb-4">
            <Link
              to={link.path}
              className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                location.pathname === link.path ? "bg-gray-700" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1 mt-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
