import React, { useState, useEffect } from 'react'
import axios from 'axios'

import SideBar from '../components/shared/SideBar'
import Navbar from '../components/shared/Navbar'
import Card from '../components/ui/Card'
import EmployeCard from '../components/ui/EmployeCard'

const DashboardLayout = () => {

  const [leads, setLeads] = useState([])
  const [employeesData, setEmployeesData] = useState([])

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  useEffect(() => {

    fetchLeads()
    fetchEmployees()

  }, [])

  const fetchLeads = async () => {

    try {

      const res = await axios.get(
        'http://localhost:5000/leads'
      )

      setLeads(res.data)

    }

    catch (err) {

      console.log(err)

    }

  }

  const fetchEmployees = async () => {

    try {

      const res = await axios.get(
        'http://localhost:5000/users'
      )

      setEmployeesData(res.data)

    }

    catch (err) {

      console.log(err)

    }

  }

  const totalLeads = leads.filter(
    (lead) => lead.contact
  ).length

  const enrolledLeads = leads.filter(
    (lead) => lead.status === "Enrolled"
  ).length

  const pendingLeads = leads.filter(
    (lead) => lead.status === "Pending"
  ).length

  const notInterestedLeads = leads.filter(
    (lead) => lead.status === "Not Interested"
  ).length

  const unassignedLeads = leads.filter(
    (lead) => lead.assignedTo === "Unassigned"
  ).length

  const conversionRate = totalLeads > 0

    ? Math.floor((enrolledLeads / totalLeads) * 100)

    : 0

  const cards = [

    {
      title: "Total Leads",
      value: totalLeads,
      color: "border-blue-500"
    },

    {
      title: "Enrolled",
      value: enrolledLeads,
      color: "border-green-500"
    },

    {
      title: "Pending",
      value: pendingLeads,
      color: "border-yellow-500"
    },

    {
      title: "Closed",
      value: notInterestedLeads,
      color: "border-red-500"
    },

    {
      title: "Unassigned",
      value: unassignedLeads,
      color: "border-purple-500"
    },

    {
      title: "Conversion",
      value: `${conversionRate}%`,
      color: "border-emerald-500"
    }

  ]

  const employeeNames = employeesData.map(
    (emp) => emp.name
  )

  const employees = employeeNames.map((employeeName) => {

    return {

      name: employeeName,

      totalLeads: leads.filter(
        (lead) => lead.assignedTo === employeeName
      ).length,

      enrolled: leads.filter(
        (lead) =>
          lead.assignedTo === employeeName &&
          lead.status === "Enrolled"
      ).length,

      pending: leads.filter(
        (lead) =>
          lead.assignedTo === employeeName &&
          lead.status === "Pending"
      ).length,

      notInterested: leads.filter(
        (lead) =>
          lead.assignedTo === employeeName &&
          lead.status === "Not Interested"
      ).length

    }

  })

  const sortedEmployees = [...employees].sort(

    (a, b) => b.enrolled - a.enrolled

  )

  const myLeads = leads.filter(
    (lead) => lead.assignedTo === user?.name
  )

  const myCards = [

    {
      title: "My Leads",
      value: myLeads.length,
      color: "border-blue-500"
    },

    {
      title: "My Pending",
      value: myLeads.filter(
        (lead) => lead.status === "Pending"
      ).length,
      color: "border-yellow-500"
    },

    {
      title: "My Enrolled",
      value: myLeads.filter(
        (lead) => lead.status === "Enrolled"
      ).length,
      color: "border-green-500"
    },

    {
      title: "My Closed",
      value: myLeads.filter(
        (lead) => lead.status === "Not Interested"
      ).length,
      color: "border-red-500"
    }

  ]

  return (

    <div className='flex gap-3.5 p-4 h-screen w-full bg-[#ECE8E0]'>

      <SideBar />

      <div className='w-full flex flex-col gap-2 h-full'>

        <Navbar />

        <div className='flex-1 overflow-y-auto rounded-[32px] bg-[#F3F1EC] p-6'>

          {

            user?.role === 'employee' && (

              <>

                <h2 className='text-2xl font-semibold mb-3 text-[#2B2B2B]'>
                  My Performance
                </h2>

                <div className='flex flex-wrap gap-3 mb-7'>

                  {myCards.map((elem, idx) => {

                    return <Card dets={elem} key={idx} />

                  })}

                </div>

              </>

            )

          }

          <div className='flex items-center justify-between mb-3'>

            <div>

              <h2 className='text-2xl font-semibold text-[#2B2B2B]'>
                Overview
              </h2>

              <p className='text-sm text-[#777] mt-1'>
                CRM analytics & performance
              </p>

            </div>

          </div>

          <div className='flex flex-wrap gap-3 mb-8'>

            {cards.map((elem, idx) => {

              return <Card dets={elem} key={idx} />

            })}

          </div>

          <div className='flex items-center justify-between'>

            <div>

              <h2 className='text-2xl font-semibold text-[#2B2B2B]'>
                Top Performers
              </h2>

              <p className='text-sm text-[#777] mt-1'>
                Ranked by highest enrollments
              </p>

            </div>

          </div>

          <div className='grid grid-cols-3 gap-4 mt-5'>

            {

              sortedEmployees.length > 0 ? (

                sortedEmployees.map((elem, idx) => {

                  return (

                    <EmployeCard
                      emp={elem}
                      idx={idx}
                      key={idx}
                    />

                  )

                })

              ) : (

                <div className='text-[#777] mt-4'>
                  No Employees Found
                </div>

              )

            }

          </div>

        </div>

      </div>

    </div>

  )

}

export default DashboardLayout