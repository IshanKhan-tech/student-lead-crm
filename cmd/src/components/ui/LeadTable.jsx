import React from 'react'

const LeadTable = ({ leads }) => {
  return (
    <div className='bg-white rounded-2xl p-4 mt-6 overflow-hidden'>
      
      <h2 className='text-2xl font-semibold mb-4'>
        Recent Leads
      </h2>

      <table className='w-full border-collapse'>
        
        <thead>
          <tr className='bg-gray-100 text-left'>
            <th className='p-3'>Student</th>
            <th className='p-3'>Course</th>
            <th className='p-3'>Status</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead, idx) => {
            return (
              <tr key={idx} className='border-b'>
                
                <td className='p-3'>
                  {lead.name}
                </td>

                <td className='p-3'>
                  {lead.course}
                </td>

                <td className='p-3'>
                  {lead.status}
                </td>

              </tr>
            )
          })}
        </tbody>

      </table>
    </div>
  )
}

export default LeadTable