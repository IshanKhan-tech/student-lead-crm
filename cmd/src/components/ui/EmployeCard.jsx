import React from "react";

const EmployeCard = ({ emp, idx }) => {
  return (
    <div
      className={`relative rounded-[30px] p-5 border transition-all duration-300 hover:-translate-y-1

      ${
        idx === 0 &&
        "bg-gradient-to-br from-[#1A1200] via-[#B8860B] to-[#FFD700] border-[#FFD700] shadow-[0_15px_40px_rgba(255,215,0,0.55)]"
      }

      ${
        idx === 1 &&
        "bg-gradient-to-br from-[#EAEAEA] via-[#BFBFBF] to-[#7D7D7D] border-[#D9D9D9] shadow-[0_10px_30px_rgba(192,192,192,0.45)]"
      }

      ${
        idx === 2 &&
        "bg-gradient-to-br from-[#E6B17A] via-[#CD7F32] to-[#8C4A15] border-[#B87333] shadow-[0_10px_30px_rgba(205,127,50,0.4)]"
      }

      ${
        idx > 2 &&
        "bg-[#F8F6F2] border-[#DDD6CB] shadow-sm"
      }

      `}
    >
      <div className="absolute top-4 right-4">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm

          ${
            idx === 0 &&
            "bg-gradient-to-br from-[#FFF3B0] via-[#D4AF37] to-[#8B7500] text-[#2B1D00] border border-[#FFD700]"
          }

          ${
            idx === 1 &&
            "bg-gradient-to-br from-[#F5F5F5] via-[#C0C0C0] to-[#7D7D7D] text-white border border-[#D9D9D9]"
          }

          ${
            idx === 2 &&
            "bg-gradient-to-br from-[#E6B17A] via-[#CD7F32] to-[#8C4A15] text-white border border-[#B87333]"
          }

          ${
            idx > 2 &&
            "bg-[#ECE7DE] text-[#555]"
          }

          `}
        >
          #{idx + 1}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <img
          src={`https://ui-avatars.com/api/?name=${emp.name}&background=random`}
          alt="employee"
          className="size-14 rounded-full object-cover border border-white/30"
        />

        <div>
          <h2
            className={`text-xl font-bold

            ${
              idx <= 2
                ? "text-white"
                : "text-[#2B2B2B]"
            }

            `}
          >
            {emp.name}
          </h2>

          <p
            className={`text-sm

            ${
              idx <= 2
                ? "text-white/80"
                : "text-[#777]"
            }

            `}
          >
            Admission Counselor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">

        <div
          className={`rounded-2xl p-3

          ${
            idx <= 2
              ? "bg-white/10 backdrop-blur-sm"
              : "bg-[#ECE7DE]"
          }

          `}
        >
          <p
            className={`text-xs

            ${
              idx <= 2
                ? "text-white/80"
                : "text-[#777]"
            }

            `}
          >
            Total Leads
          </p>

          <h3
            className={`text-2xl font-bold

            ${
              idx <= 2
                ? "text-white"
                : "text-[#2B2B2B]"
            }

            `}
          >
            {emp.totalLeads}
          </h3>
        </div>

        <div
          className={`rounded-2xl p-3

          ${
            idx <= 2
              ? "bg-green-400/15"
              : "bg-green-50"
          }

          `}
        >
          <p
            className={`text-xs

            ${
              idx <= 2
                ? "text-green-100"
                : "text-[#777]"
            }

            `}
          >
            Enrolled
          </p>

          <h3 className="text-2xl font-bold text-green-400">
            {emp.enrolled}
          </h3>
        </div>

        <div
          className={`rounded-2xl p-3

          ${
            idx <= 2
              ? "bg-yellow-300/15"
              : "bg-yellow-50"
          }

          `}
        >
          <p
            className={`text-xs

            ${
              idx <= 2
                ? "text-yellow-100"
                : "text-[#777]"
            }

            `}
          >
            Pending
          </p>

          <h3 className="text-2xl font-bold text-yellow-400">
            {emp.pending}
          </h3>
        </div>

        <div
          className={`rounded-2xl p-3

          ${
            idx <= 2
              ? "bg-red-300/15"
              : "bg-red-50"
          }

          `}
        >
          <p
            className={`text-xs

            ${
              idx <= 2
                ? "text-red-100"
                : "text-[#777]"
            }

            `}
          >
            Not Interested
          </p>

          <h3 className="text-2xl font-bold text-red-300">
            {emp.notInterested}
          </h3>
        </div>

      </div>
    </div>
  );
};

export default EmployeCard;