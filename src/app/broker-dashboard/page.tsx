import React from 'react'


const page = () => {
  return (
    <>
    <div className="overflow-x-auto">
    <table className="table w-full">
        <thead>
        <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th>1</th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
        </tr>
        <tr className="hover">
            <th>2</th>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
        </tr>
        <tr>
            <th>3</th>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
        </tr>
        </tbody>
    </table>
    </div>
    </>
  )
}

export default page