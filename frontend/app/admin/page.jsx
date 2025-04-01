import React from 'react';

function page() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header Section */}
      <header className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <nav className="mt-4">
          <ul className="flex space-x-6">
            <li>
              <a href="/admin" className="text-blue-600 hover:underline font-medium">Home</a>
            </li>
            <li>
              <a href="/admin/users" className="text-blue-600 hover:underline font-medium">Users</a>
            </li>
            <li>
              <a href="/admin/settings" className="text-blue-600 hover:underline font-medium">Settings</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Welcome Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to the Admin Dashboard</h2>
          <p className="text-gray-600">Monitor complaints, manage users, and analyze reports efficiently.</p>
        </section>

        {/* Complaints Overview Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Complaints Overview</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Assigned To</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">1</td>
                <td className="border border-gray-300 px-4 py-2">Water Leakage</td>
                <td className="border border-gray-300 px-4 py-2">Pending</td>
                <td className="border border-gray-300 px-4 py-2">John Doe</td>
                <td className="border border-gray-300 px-4 py-2">
                  <a href="/admin/complaints/1" className="text-blue-600 hover:underline">View</a>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">2</td>
                <td className="border border-gray-300 px-4 py-2">Street Light Issue</td>
                <td className="border border-gray-300 px-4 py-2">Resolved</td>
                <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
                <td className="border border-gray-300 px-4 py-2">
                  <a href="/admin/complaints/2" className="text-blue-600 hover:underline">View</a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Complaints Distribution by Wards */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Complaints Pending in Each Ward</h3>
          <div className="grid grid-cols-4 gap-4">
            {["Ward 1", "Ward 2", "Ward 3", "Ward 4"].map((ward, index) => (
              <div key={index} className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center">
                <h4 className="text-lg font-semibold text-gray-800">{ward}</h4>
                <p className="text-xl font-bold text-gray-800">{Math.floor(Math.random() * 50) + 1}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Officer Performance Overview */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Officer Performance Overview</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Officer Name</th>
                <th className="border border-gray-300 px-4 py-2">Resolved Complaints</th>
                <th className="border border-gray-300 px-4 py-2">Performance Rating</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "John Doe", resolved: 45, rating: "Excellent" },
                { name: "Jane Smith", resolved: 30, rating: "Good" },
                { name: "Mark Johnson", resolved: 25, rating: "Average" },
              ].map((officer, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{officer.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{officer.resolved}</td>
                  <td className="border border-gray-300 px-4 py-2">{officer.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Reports & Analytics Section */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Reports & Analytics</h3>
          <div className="flex justify-between">
            <div className="w-1/2 bg-gray-50 border border-gray-300 rounded-lg p-4 mr-2">
              <h4 className="text-lg font-semibold text-gray-800">Pending Complaints</h4>
              <p className="text-2xl font-bold text-gray-800">120</p>
            </div>
            <div className="w-1/2 bg-gray-50 border border-gray-300 rounded-lg p-4 ml-2">
              <h4 className="text-lg font-semibold text-gray-800">Resolved Complaints</h4>
              <p className="text-2xl font-bold text-gray-800">200</p>
            </div>
          </div>

          {/* Report Generation */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800">Generate Reports</h4>
            <div className="flex space-x-4 mt-2">
              <input type="date" className="border border-gray-300 rounded p-2" />
              <input type="date" className="border border-gray-300 rounded p-2" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Download Report</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default page;