import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            © {currentYear} English Smart Admin Panel. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Version 1.0.0</span>
            <Link to="/admin/help" className="hover:text-blue-600 transition-colors">
              Help
            </Link>
            <Link to="/admin/documentation" className="hover:text-blue-600 transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
