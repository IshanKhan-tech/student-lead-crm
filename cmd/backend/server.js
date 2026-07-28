const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Lead = require("./models/Lead");
const User = require("./models/User");

const app = express();

const multer = require("multer");
const XLSX = require("xlsx");

const path = require("path");

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


const upload = multer({
  dest: "uploads/",
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })

  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Backend Running");
});




app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User Not Found",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Credentials",
      });

    }

    const token = jwt.sign(

      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    res.json({

      token,

      user: {

        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

      },

    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});




app.post("/create-employee", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "Employee Already Exists",
      });

    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newEmployee = new User({

      name,
      email,

      password: hashedPassword,

      role: "employee",

    });

    await newEmployee.save();

    // =========================
    // AUTO DISTRIBUTE LEADS
    // =========================

    const employees = await User.find({
      role: "employee",
    });

    const unassignedLeads = await Lead.find({
      assignedTo: "Unassigned",
    });

    // CASE 1
    // IF UNASSIGNED LEADS EXIST

    if (unassignedLeads.length > 0) {

      for (const lead of unassignedLeads) {

        let employeeLeadCounts = [];

        for (const employee of employees) {

          const totalLeads =
            await Lead.countDocuments({
              assignedTo: employee.name,
            });

          employeeLeadCounts.push({

            name: employee.name,

            totalLeads,

          });

        }

        employeeLeadCounts.sort(
          (a, b) => a.totalLeads - b.totalLeads
        );

        await Lead.findByIdAndUpdate(

          lead._id,

          {
            assignedTo: employeeLeadCounts[0].name,
          }

        );

      }

    }


    else {

      let employeeLeadCounts = [];

      for (const employee of employees) {

        const totalLeads =
          await Lead.countDocuments({
            assignedTo: employee.name,
          });

        employeeLeadCounts.push({

          name: employee.name,

          totalLeads,

        });

      }

      employeeLeadCounts.sort(
        (a, b) => b.totalLeads - a.totalLeads
      );

      const highestEmployee =
        employeeLeadCounts[0];

      if (highestEmployee) {

        const leadsToTransfer =
          Math.floor(
            highestEmployee.totalLeads / 2
          );

        const highestEmployeeLeads =
          await Lead.find({

            assignedTo:
              highestEmployee.name,

          }).limit(leadsToTransfer);

        for (const lead of highestEmployeeLeads) {

          await Lead.findByIdAndUpdate(

            lead._id,

            {
              assignedTo: name,
            }

          );

        }

      }

    }

    res.status(201).json({
      message: "Employee Created Successfully",
    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});




app.post("/add-lead", async (req, res) => {

  try {

    const employees = await User.find({
      role: "employee",
    });

    let assignedEmployee = "Unassigned";

    if (employees.length > 0) {

      let employeeLeadCounts = [];

      for (const employee of employees) {

        const totalLeads =
          await Lead.countDocuments({

            assignedTo: employee.name,

          });

        employeeLeadCounts.push({

          name: employee.name,

          totalLeads,

        });

      }

      employeeLeadCounts.sort(
        (a, b) => a.totalLeads - b.totalLeads
      );

      assignedEmployee =
        employeeLeadCounts[0].name;

    }

    const newLead = new Lead({

      ...req.body,

      assignedTo:
        req.body.assignedTo === "Unassigned"
          ? assignedEmployee
          : req.body.assignedTo,

    });

    await newLead.save();

    res.status(201).json({

      message: "Lead Added",

      lead: newLead,

    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});




app.get("/leads", async (req, res) => {

  try {

    const leads = await Lead.find();

    res.json(leads);

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});



app.delete("/delete-lead/:id", async (req, res) => {

  try {

    await Lead.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Lead Deleted",
    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});


app.put("/update-status/:id", async (req, res) => {

  try {

    const updatedLead =
      await Lead.findByIdAndUpdate(

        req.params.id,

        {
          status: req.body.status,
        },

        {
          new: true,
        }

      );

    res.json(updatedLead);

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});

app.get("/users", async (req, res) => {

  try {

    const users = await User.find({
      role: "employee",
    });

    res.json(users);

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});

app.delete("/delete-user/:id", async (req, res) => {

  try {

    const user = await User.findById(
      req.params.id
    );

    if (!user) {

      return res.status(404).json({
        message: "Employee Not Found",
      });

    }

    await Lead.updateMany(

      {
        assignedTo: user.name,
      },

      {
        assignedTo: "Unassigned",
      }

    );

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Employee Deleted Successfully",
    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});



app.put("/reassign-lead/:id", async (req, res) => {

  try {

    const updatedLead =
      await Lead.findByIdAndUpdate(

        req.params.id,

        {
          assignedTo: req.body.assignedTo,
        },

        {
          new: true,
        }

      );

    res.json(updatedLead);

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});



app.get("/redistribute-leads", async (req, res) => {

  try {

    const employees = await User.find({
      role: "employee",
    });

    const leads = await Lead.find();

    if (employees.length === 0) {

      return res.json({
        message: "No Employees Found",
      });

    }

    for (const lead of leads) {

      const employeeExists =
        employees.find(

          (emp) =>
            emp.name === lead.assignedTo

        );

      if (
        !employeeExists ||
        lead.assignedTo === "Unassigned"
      ) {

        let employeeLeadCounts = [];

        for (const employee of employees) {

          const totalLeads =
            await Lead.countDocuments({

              assignedTo: employee.name,

            });

          employeeLeadCounts.push({

            name: employee.name,

            totalLeads,

          });

        }

        employeeLeadCounts.sort(
          (a, b) => a.totalLeads - b.totalLeads
        );

        await Lead.findByIdAndUpdate(

          lead._id,

          {
            assignedTo:
              employeeLeadCounts[0].name,
          }

        );

      }

    }

    res.json({
      message:
        "Leads Redistributed Successfully",
    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});

app.post(
  "/upload-leads",
  upload.single("file"),
  async (req, res) => {
    try {
      const workbook = XLSX.readFile(req.file.path);

      const sheetName = workbook.SheetNames[0];

      const rows = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );

      let added = 0;
      let duplicate = 0;

      for (const row of rows) {
        const contact = String(
          row.Contact || ""
        ).trim();

        if (!contact) continue;

        const alreadyExists =
          await Lead.findOne({
            contact,
          });

        if (alreadyExists) {
          duplicate++;
          continue;
        }

        const employees = await User.find({
          role: "employee",
        });

        let assignedEmployee =
          "Unassigned";

        if (employees.length > 0) {
          let employeeLeadCounts = [];

          for (const employee of employees) {
            const totalLeads =
              await Lead.countDocuments({
                assignedTo: employee.name,
              });

            employeeLeadCounts.push({
              name: employee.name,
              totalLeads,
            });
          }

          employeeLeadCounts.sort(
            (a, b) =>
              a.totalLeads -
              b.totalLeads
          );

          assignedEmployee =
            employeeLeadCounts[0].name;
        }

        await Lead.create({
          name: row.Name || "",
          contact,
          location:
            row.Location || "",
          school:
            row.School || "",
          status: "Pending",
          assignedTo:
            assignedEmployee,
        });

        added++;
      }

      res.json({
        message: `${added} leads imported successfully`,
        duplicates: duplicate,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Started On Port", PORT);
});