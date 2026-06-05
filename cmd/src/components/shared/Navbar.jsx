import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [time, setTime] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user"),
  );

  useEffect(() => {
    const updateClock = () => {
      const current = new Date();

      const formatted =
        current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      setTime(formatted);
    };

    updateClock();

    const interval = setInterval(
      updateClock,
      1000,
    );

    return () => clearInterval(interval);

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";

      case "/leads":
        return "Leads";

      case "/employees":
        return "Employees";

      default:
        return "CRM Panel";
    }
  };

  return (
    <div className="bg-white border border-[#E7E5DF] px-6 py-4 rounded-[28px] flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-[28px] font-bold text-[#2F3A2F]">
          {getPageTitle()}
        </h1>

        <p className="text-sm text-[#8A8F84] mt-1">
          Manage your leads and sales activity
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center justify-center bg-[#F5F6F1] border border-[#E4E7DD] rounded-2xl px-4 py-2 min-w-[90px]">
          <h2 className="text-[#2F3A2F] font-bold text-lg">
            {time}
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-[#F7F8F3] border border-[#E5E7DE] px-3 py-2 rounded-2xl">
          <div className="size-11 rounded-full bg-[#84CC16] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-[#2F3A2F] capitalize leading-none">
              {user?.name}
            </h3>

            <div className="flex items-center gap-2 mt-1">

              <div
                className={`

                  px-2 py-[2px]
                  rounded-full
                  text-[10px]
                  font-semibold
                  uppercase

                  ${
                    user?.role === "admin"
                      ? "bg-[#2F3A2F] text-white"
                      : "bg-[#D9F99D] text-[#365314]"
                  }

                `}
              >
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#2F3A2F] hover:bg-[#3B473B] transition-all text-white px-5 py-3 rounded-2xl font-medium shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;