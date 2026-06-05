import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddLeadForm = ({ setLeads, setOpenForm }) => {
  const [studentName, setStudentName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contact.length !== 10) {
      alert("Contact number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);

      const existingLeads = await axios.get(
        "http://localhost:5000/leads"
      );

      const duplicateLead = existingLeads.data.find(
        (lead) => lead.contact === contact
      );

      if (duplicateLead) {
        toast.warning("Lead already exists with this contact number");
        setLoading(false);
        return;
      }

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const newLead = {
        name: studentName || "N/A",
        contact,
        location,
        school,

        status: "Pending",

        assignedTo:
          user?.role === "employee"
            ? user.name
            : "Unassigned",
      };

      const res = await axios.post(
        "http://localhost:5000/add-lead",
        newLead
      );

      setLeads((prev) => [
        res.data.lead,
        ...prev,
      ]);

      setStudentName("");
      setContact("");
      setLocation("");
      setSchool("");

      toast.success("Lead Added Successfully");

      if (setOpenForm) {
        setOpenForm(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[420px] bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 flex flex-col gap-4"
    >
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-800">
          Add New Lead
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Quickly create a new student lead
        </p>
      </div>

      <input
        value={studentName}
        onChange={(e) =>
          setStudentName(e.target.value)
        }
        type="text"
        placeholder="Student Name (Optional)"
        className="h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
      />

      <div>
        <input
          value={contact}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*$/.test(value)) {
              if (value.length <= 10) {
                setContact(value);
              }
            }
          }}
          type="text"
          inputMode="numeric"
          placeholder="Contact Number *"
          required
          className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
        />

        {contact.length > 0 &&
          contact.length < 10 && (
            <p className="text-red-500 text-sm mt-1 ml-1">
              Contact number must be 10 digits
            </p>
          )}
      </div>

      <input
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
        type="text"
        placeholder="Location (Optional)"
        className="h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
      />

      <input
        value={school}
        onChange={(e) =>
          setSchool(e.target.value)
        }
        type="text"
        placeholder="School Name (Optional)"
        className="h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
      />

      <button
        disabled={
          contact.length !== 10 || loading
        }
        className="h-14 mt-2 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading
          ? "Adding Lead..."
          : "Save Lead"}
      </button>
    </form>
  );
};

export default AddLeadForm;