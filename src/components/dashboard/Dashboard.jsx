import React from 'react';
import PageHeader from '../common/PageHeader';

const Dashboard = () => {
  return (
    <div>
      <PageHeader title="Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Contacts</h3>
          <p className="text-3xl font-bold text-gray-900">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Companies</h3>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Templates</h3>
          <p className="text-3xl font-bold text-gray-900">8</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <p className="text-gray-500">No recent activity found.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
