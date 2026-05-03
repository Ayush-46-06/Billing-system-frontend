import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden ">

      {/* MOBILE SIDEBAR OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50 h-full w-64 bg-white shadow-md
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col w-full">

        {/* NAVBAR */}
        <Navbar onMenuClick={() => setOpen(true)} />

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;