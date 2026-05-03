import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  useEffect(() => {
  console.log("Navbar user updated:", user);
}, [user]);

  return (
    <div className="bg-white px-4 md:px-6 py-4 shadow-sm flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-3 w-full">
        <button
          className="md:hidden text-xl"
          onClick={onMenuClick}
        >
          ☰
        </button>


      </div>

      {/* RIGHT */}
      <div className="relative flex items-center gap-3 ml-4">
<div className="hidden sm:flex flex-col items-end leading-tight">
  
  {/* NAME IN ONE LINE */}
  <span className="text-m font-semibold text-gray-800 whitespace-nowrap">
    {user?.name || user?.email?.split("@")[0] || "User"}
  </span>

  {/* ROLE */}
  <span className={`text-[12px] px-2 py-[2px] rounded-full font-bold uppercase mt-1 ${
    user?.role === "ADMIN"
      ? "text-red-600"
      : "text-red-600"
  }`}>
    {user?.role}
  </span>

</div>

        {/* AVATAR */}
<div
  onClick={() => setOpen(!open)}
  className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
>
 {user?.profileImage ? (
  <img
    src={user.profileImage}
    alt="avatar"
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-semibold">
    {(user?.name || user?.email || "U")[0].toUpperCase()}
  </div>
)}
</div>

       {open && (
  <div className="absolute right-0 top-12 w-52 bg-white shadow-lg rounded-lg py-2 z-50">

    <div className="px-4 py-2 border-b">
      <p className="text-sm font-medium text-gray-800">
        {user?.name || "User"}
      </p>
      <p className="text-xs text-gray-500">
        {user?.email}
      </p>
    </div>

    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
    >
      Logout
    </button>

  </div>
)}
      </div>
    </div>
  );
};

export default Navbar;