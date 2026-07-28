import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../components/shared/SideBar";
import Navbar from "../components/shared/Navbar";
import { toast } from "react-toastify";
const Employees = () => {
  const [employees, setEmployees] = useState([]);

  const [openForm, setOpenForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        // "http://localhost:5000/users"
      );

      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createEmployee = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/create-employee`,
        // "http://localhost:5000/create-employee",

        {
          name,
          email,
          password,
        },
      );

      setName("");
      setEmail("");
      setPassword("");

      setOpenForm(false);

      fetchEmployees();
      toast.success("New Employee Added");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-user/${id}`);

      fetchEmployees();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-3.5 p-4 h-screen w-full bg-[#ECE8E0]">
      <SideBar />

      <div className="w-full flex flex-col gap-2 h-full">
        <Navbar />

        <div className="flex-1 overflow-y-auto rounded-[32px] bg-[#F3F1EC] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#2B2B2B]">Employees</h1>

              <p className="text-[#777] mt-1">Manage your sales team</p>
            </div>

            <button
              onClick={() => setOpenForm(true)}
              className="bg-[#2F3A2F] hover:bg-[#3B473B] transition-all text-white px-5 py-3 rounded-2xl"
            >
              Add Employee
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {employees.map((emp) => {
              return (
                <div
                  key={emp._id}
                  className="bg-[#F8F6F2] border border-[#E7E1D7] rounded-[28px] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2B2B2B]">
                        {emp.name}
                      </h2>

                      <p className="text-[#777] mt-1">{emp.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${emp.name}?`)) {
                          deleteEmployee(emp._id);
                        }
                      }}
                      className="bg-[#E76F51] text-white px-4 py-2 rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {openForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={createEmployee}
            className="w-full max-w-[420px] bg-[#F8F6F2] border border-[#DDD6CB] rounded-[32px] p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">
              Create Employee
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-2xl border border-[#DDD6CB] bg-white px-5 outline-none"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border border-[#DDD6CB] bg-white px-5 outline-none"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl border border-[#DDD6CB] bg-white px-5 outline-none"
                required
              />

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-[#2F3A2F] text-white font-semibold"
                >
                  Create
                </button>

                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="flex-1 h-14 rounded-2xl bg-[#E76F51] text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Employees;
