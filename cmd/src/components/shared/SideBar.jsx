import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  RiDashboardLine,
  RiFolder3Line,
  RiTeamLine,
} from "react-icons/ri";

const SideBar = () => {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const sidebarContent = [
    {
      name: "Dashboard",
      path: "/",
      icon: <RiDashboardLine size={22} />,
    },

    {
      name: "My Leads",
      path: "/leads",
      icon: <RiFolder3Line size={22} />,
    },


    ...(user?.role === "admin"
      ? [
          {
            name: "Employees",
            path: "/employees",
            icon: <RiTeamLine size={22} />,
          },
        ]
      : []),
  ];

  return (
    <div
      onMouseEnter={() =>
        window.innerWidth >= 1024 && setOpen(true)
      }
      onMouseLeave={() =>
        window.innerWidth >= 1024 && setOpen(false)
      }
      className={`

        h-full
        bg-[#2F3A2F]
        rounded-[32px]
        p-4

        flex
        flex-col
        justify-between

        transition-all
        duration-500
        ease-in-out

        ${open ? "w-64" : "w-24"}

      `}
    >
      <div>
        <div
          className={`

            h-16
            rounded-2xl
            mb-8

            flex
            items-center

            transition-all
            duration-300

            ${open ? "px-4 justify-start" : "justify-center"}

            bg-[#84CC16]

          `}
        >
          <div
            className="

              size-10
              rounded-xl
              bg-white/20

              flex
              items-center
              justify-center

              text-white
              font-bold
              text-lg

            "
          >
            C
          </div>

          {open && (
            <div className="ml-3">
              <h2 className="text-white font-bold leading-none">
                CRM
              </h2>

              <p className="text-[11px] text-white/70 mt-1">
                Lead Manager
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {sidebarContent.map((elem, idx) => {
            const isActive =
              location.pathname === elem.path;

            return (
              <Link key={idx} to={elem.path}>
                <div
                  className={`

                    flex
                    items-center

                    ${open
                      ? "justify-start px-4"
                      : "justify-center"}

                    gap-3
                    py-3

                    rounded-2xl

                    transition-all
                    duration-300

                    ${
                      isActive
                        ? "bg-[#84CC16] text-white shadow-lg"
                        : "text-[#D6DBCF] hover:bg-[#3B473B]"
                    }

                  `}
                >
                  {elem.icon}

                  {open && (
                    <span
                      className="

                        font-medium
                        whitespace-nowrap

                      "
                    >
                      {elem.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className={`

          bg-[#3B473B]
          rounded-2xl

          transition-all
          duration-300

          ${open ? "p-4" : "p-2"}

        `}
      >
        <div
          className={`

            flex
            items-center

            ${open ? "gap-3" : "justify-center"}

          `}
        >
          <div
            className="

              size-11
              rounded-full

              bg-[#84CC16]

              flex
              items-center
              justify-center

              text-white
              font-bold
              text-lg

            "
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {open && (
            <div className="overflow-hidden">
              <h3 className="text-white font-semibold capitalize leading-none">
                {user?.name}
              </h3>

              <p className="text-xs text-[#C7D0BE] capitalize mt-1">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;