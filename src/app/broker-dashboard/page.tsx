'use client'
import React, { useState } from 'react';

const BrokerDashboard = () => {
  // Initialize the data state with an array of objects representing rows
  const [data, setData] = useState<Array<{ ID: string; Address: string; Size: string; Leader: string; }>>([]);

  // Function to add a new row of data to the table
  const addRow = () => {
    const newRow = {
      ID: 'id',
      Address: 'New Person',
      Size: 'New Job',
      Leader: 'New Color',
    };

    setData([...data, newRow]);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Address</th>
              <th>Size</th>
              <th>Leader</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.ID}>
                <th>{row.ID}</th>
                <td>{row.Address}</td>
                <td>{row.Size}</td>
                <td>{row.Leader}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow}>Add Row</button>
    </>
  );
};

export default BrokerDashboard;