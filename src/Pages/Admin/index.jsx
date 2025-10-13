import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/Layouts/DefaultLayout/AdminLayout';
import AdminDashboard from './Dashboard';
import UserManagement from './UserManagement';
import TopicVocabManagement from './TopicVocabManagement';
import VocabManagement from './VocabManagement';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/topics" element={<TopicVocabManagement />} />
        <Route path="/vocabulary" element={<VocabManagement />} />
        {/* Add more routes as needed */}
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
