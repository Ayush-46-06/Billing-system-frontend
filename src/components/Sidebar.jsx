import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Wrench,
  UserCog,
  Percent
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/color.png";
import { useNavigate, NavLink } from "react-router-dom";

const Sidebar = ({ closeSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const handleClick = () => {
    if (closeSidebar) closeSidebar();
  };

  return (
    <div className="w-64 bg-white shadow-md p-5 flex flex-col justify-between h-full">

      {/*TOP */}
      <div>
        <img src={logo} alt="Athenura" className="h-16 mb-6" />

        <nav className="space-y-3 text-gray-600">

          <NavLink
            to="/dashboard"
            onClick={handleClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/invoices"
            onClick={handleClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <FileText size={18} />
            Invoices
          </NavLink>

          <NavLink
            to="/customers"
            onClick={handleClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <Users size={18} />
            Customers
          </NavLink>

          {/*  SERVICES (ADMIN ONLY) */}
          {user?.role === "ADMIN" && (
            <NavLink
              to="/services"
              onClick={handleClick}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <Wrench size={18} />
              Services
            </NavLink>
          )}

    

              {user?.role === "ADMIN" && (
  <NavLink
    to="/managers"
    onClick={handleClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-full ${
        isActive
          ? "bg-blue-100 text-blue-600 font-medium"
          : "hover:bg-gray-100"
      }`
    }
  >
    <UserCog size={18} />
    Managers
  </NavLink>
)}

{user?.role === "ADMIN" && (
  <NavLink
    to="/taxes"
    onClick={handleClick}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded-full ${
        isActive
          ? "bg-blue-100 text-blue-600 font-medium"
          : "hover:bg-gray-100"
      }`
    }
  >
    <Percent size={18} />
    Taxes
  </NavLink>
)}

   <NavLink
  to="/profile"
  onClick={handleClick}
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full ${
      isActive
        ? "bg-blue-100 text-blue-600 font-medium"
        : "hover:bg-gray-100"
    }`
  }
>
  <Users size={18} />
  Profile
</NavLink>

  

        </nav>
      </div>

    </div>
  );
};

export default Sidebar;