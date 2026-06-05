import SideBar from "../components/shared/SideBar";
import Navbar from "../components/shared/Navbar";
import AddLeadForm from "../components/ui/AddLeadForm";
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leads");

      setLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");

      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/upload-leads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert(res.data.message);

      fetchLeads();
    } catch (error) {
      console.log(error);

      toast.error("Upload Failed");
    }

    setUploading(false);
  };

  const roleBasedLeads =
    user?.role === "admin"
      ? leads
      : leads.filter((lead) => lead.assignedTo === user?.name);

  const filteredLeads = roleBasedLeads.filter((lead) => {
    return (
      lead.contact &&
      ((lead.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
        lead.contact.includes(searchText))
    );
  });

  const totalLeads = filteredLeads.length;

  const enrolledLeads = filteredLeads.filter(
    (lead) => lead.status === "Enrolled",
  ).length;

  const pendingLeads = filteredLeads.filter(
    (lead) => lead.status === "Pending",
  ).length;

  const notInterestedLeads = filteredLeads.filter(
    (lead) => lead.status === "Not Interested",
  ).length;

  return (
    <div className="flex gap-3.5 p-4 h-screen w-full bg-[#ECE8E0]">
      <SideBar />

      <div className="w-full flex flex-col gap-2 h-full">
        <Navbar />

        <div className="flex-1 overflow-y-auto rounded-[32px] bg-[#F3F1EC] p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-3xl font-bold text-[#2B2B2B]">Leads</h1>

              <p className="text-sm text-[#7B7B7B] mt-1">
                Manage and track your student leads
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                placeholder="Search leads..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="bg-white border border-[#E7E1D7] rounded-2xl px-4 py-3 outline-none sm:w-64 shadow-sm text-sm"
              />
              {user?.role === "admin" && (
                <label className="bg-[#84CC16] hover:opacity-90 transition-all text-white px-5 py-3 rounded-2xl shadow-sm text-sm cursor-pointer">
                  {uploading ? "Uploading..." : "Bulk Upload"}

                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    hidden
                    onChange={handleFileUpload}
                  />
                </label>
              )}
              {user?.role === "admin" && (
                <button
                  onClick={() => setShowInstructions(true)}
                  className="bg-blue-500 text-white px-4 py-3 rounded-2xl"
                >
                  <FaInfoCircle />
                </button>
              )}
              <button
                onClick={() => setOpenForm(true)}
                className="bg-[#2F3A2F] hover:bg-[#3B473B] transition-all text-white px-5 py-3 rounded-2xl shadow-sm text-sm"
              >
                Add Lead
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="w-32 h-24 bg-[#F8F6F2] border border-[#DDD6CB] rounded-[22px] px-4 py-3 flex flex-col justify-center shadow-sm">
              <h1 className="text-3xl font-bold text-[#2B2B2B]">
                {totalLeads}
              </h1>

              <p className="text-xs text-[#777] mt-1 font-medium">
                Total Leads
              </p>
            </div>

            <div className="w-32 h-24 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-[22px] px-4 py-3 flex flex-col justify-center shadow-sm">
              <h1 className="text-3xl font-bold text-green-700">
                {enrolledLeads}
              </h1>

              <p className="text-xs text-[#666] mt-1 font-medium">Enrolled</p>
            </div>

            <div className="w-32 h-24 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-[22px] px-4 py-3 flex flex-col justify-center shadow-sm">
              <h1 className="text-3xl font-bold text-yellow-700">
                {pendingLeads}
              </h1>

              <p className="text-xs text-[#666] mt-1 font-medium">Pending</p>
            </div>

            <div className="w-32 h-24 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-[22px] px-4 py-3 flex flex-col justify-center shadow-sm">
              <h1 className="text-3xl font-bold text-red-600">
                {notInterestedLeads}
              </h1>

              <p className="text-[11px] text-[#666] mt-1 font-medium">Closed</p>
            </div>
          </div>

          <div className="bg-[#F8F6F2] border border-[#E7E1D7] rounded-[28px] overflow-hidden shadow-sm">
            <div className="hidden lg:grid grid-cols-7 bg-[#ECE7DE] px-5 py-4 font-semibold text-sm text-[#4B4B4B]">
              <h2>Name</h2>
              <h2>Contact</h2>
              <h2>Location</h2>
              <h2>Status</h2>
              <h2>Assigned To</h2>
              <h2>Reassign</h2>
              <h2>Delete</h2>
            </div>

            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead, idx) => {
                return (
                  <div
                    key={idx}
                    className="grid lg:grid-cols-7 gap-3 px-5 py-4 border-b border-[#ECE7DE] items-center hover:bg-[#F3EFE8] transition-all"
                  >
                    <div>
                      <p className="text-xs text-[#777] lg:hidden">Name</p>

                      <h3 className="font-semibold text-[#2B2B2B]">
                        {lead.name || "N/A"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-[#777] lg:hidden">Contact</p>

                      <p className="text-[#666]">{lead.contact}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#777] lg:hidden">Location</p>

                      <p className="text-[#666]">{lead.location || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#777] lg:hidden mb-1">
                        Status
                      </p>

                      <select
                        className={`border w-full lg:w-fit rounded-xl px-3 py-2 font-medium bg-white outline-none text-sm

                        ${
                          lead.status === "Pending" &&
                          "border-yellow-400 text-yellow-600"
                        }

                        ${
                          lead.status === "Enrolled" &&
                          "border-green-400 text-green-600"
                        }

                        ${
                          lead.status === "Not Interested" &&
                          "border-red-400 text-red-500"
                        }

                        `}
                        value={lead.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;

                          axios
                            .put(
                              `http://localhost:5000/update-status/${lead._id}`,
                              {
                                status: newStatus,
                              },
                            )

                            .then(() => {
                              const updatedLeads = leads.map((item) => {
                                if (item._id === lead._id) {
                                  return {
                                    ...item,
                                    status: newStatus,
                                  };
                                }

                                return item;
                              });

                              setLeads(updatedLeads);
                            })

                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                      >
                        <option>Pending</option>

                        <option>Enrolled</option>

                        <option>Not Interested</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs text-[#777] lg:hidden">
                        Assigned To
                      </p>

                      <p className="font-medium text-[#2B2B2B]">
                        {lead.assignedTo}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#777] lg:hidden mb-1">
                        Reassign
                      </p>

                      {user?.role === "admin" ? (
                        <select
                          value={lead.assignedTo}
                          onChange={async (e) => {
                            try {
                              await axios.put(
                                `http://localhost:5000/reassign-lead/${lead._id}`,
                                {
                                  assignedTo: e.target.value,
                                },
                              );

                              fetchLeads();
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          className="border border-[#DDD6CB] rounded-xl px-3 py-2 bg-white outline-none text-sm w-full"
                        >
                          <option>Unassigned</option>

                          {employees.map((emp, idx) => {
                            return (
                              <option key={idx} value={emp.name}>
                                {emp.name}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <p className="text-sm text-[#777]">No Access</p>
                      )}
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          toast.error('Lead Deleted')
                          axios
                            .delete(
                              `http://localhost:5000/delete-lead/${lead._id}`,
                            )

                            .then(() => {
                              const updatedLeads = leads.filter(
                                (item) => item._id !== lead._id,
                              );

                              setLeads(updatedLeads);
                            })

                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                        className="bg-[#E76F51] hover:opacity-90 transition-all text-white px-4 py-2 rounded-xl text-sm w-full lg:w-fit"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-[#7B7B7B] font-medium">
                No Leads Found
              </div>
            )}
          </div>

          {openForm && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative">
                <button
                  onClick={() => setOpenForm(false)}
                  className="absolute -top-3 -right-3 bg-[#E76F51] text-white size-8 rounded-full"
                >
                  X
                </button>

                <AddLeadForm setLeads={setLeads} />
              </div>
            </div>
          )}

          {selectedLead && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-[#F8F6F2] border border-[#E7E1D7] rounded-[30px] p-7 w-[95%] max-w-md relative shadow-lg">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-4 right-4 bg-[#E76F51] text-white size-8 rounded-full"
                >
                  X
                </button>

                <h2 className="text-3xl font-bold mb-6 text-[#2B2B2B]">
                  Lead Details
                </h2>

                <div className="flex flex-col gap-4 text-[#555]">
                  <p>
                    <span className="font-semibold text-[#2B2B2B]">Name:</span>{" "}
                    {selectedLead.name || "N/A"}
                  </p>

                  <p>
                    <span className="font-semibold text-[#2B2B2B]">
                      Contact:
                    </span>{" "}
                    {selectedLead.contact}
                  </p>

                  <p>
                    <span className="font-semibold text-[#2B2B2B]">
                      Location:
                    </span>{" "}
                    {selectedLead.location}
                  </p>

                  <p>
                    <span className="font-semibold text-[#2B2B2B]">
                      School:
                    </span>{" "}
                    {selectedLead.school}
                  </p>

                  <p>
                    <span className="font-semibold text-[#2B2B2B]">
                      Status:
                    </span>{" "}
                    {selectedLead.status}
                  </p>

                  <p>
                    <span className="font-semibold text-[#2B2B2B]">
                      Assigned To:
                    </span>{" "}
                    {selectedLead.assignedTo}
                  </p>
                </div>
              </div>
            </div>
          )}
          {showInstructions && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white w-[95%] max-w-xl rounded-3xl p-6 relative shadow-xl">

      <button
        onClick={() => setShowInstructions(false)}
        className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full"
      >
        X
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Bulk Upload Instructions
      </h2>

      <ul className="list-disc pl-5 space-y-2 text-gray-700">

        <li>
          Upload only <b>.xlsx</b>, <b>.xls</b> or <b>.csv</b> files.
        </li>

        <li>
          The first row must contain column names.
        </li>

        <li>
          <b>Contact</b> column is mandatory.
        </li>

        <li>
          <b>Name</b>, <b>Location</b> and <b>School</b> are optional.
        </li>

        <li>
          Duplicate contacts are skipped automatically.
        </li>

        <li>
          Leads without a Contact value will not be imported.
        </li>

      </ul>

      <div className="mt-5">

        <p className="font-semibold mb-2">
          Required Column:
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-3 font-mono text-sm">
          Contact
        </div>

      </div>

      <div className="mt-4">

        <p className="font-semibold mb-2">
          Optional Columns:
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 font-mono text-sm">
          Name | Location | School
        </div>

      </div>

      <div className="mt-5">

        <p className="font-semibold mb-2">
          Example Excel Format:
        </p>

        <div className="bg-gray-100 rounded-xl p-4 text-sm overflow-x-auto">

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">School</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2">Aamir Khan</td>
                <td className="border p-2">9876543210</td>
                <td className="border p-2">Bhopal</td>
                <td className="border p-2">ABC School</td>
              </tr>

              <tr>
                <td className="border p-2"></td>
                <td className="border p-2">9988776655</td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

    </div>

  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Leads;
