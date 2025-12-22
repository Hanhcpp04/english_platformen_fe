import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../../../../../service/authService';

const AdminFooter = () => {
  const [profile, setProfile] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        if (mounted && res && res.code === 1000 && res.result) {
          setProfile(res.result);
        }
      } catch (err) {
        // silent fail - footer should not break app
        console.error('Failed to load profile for footer', err);
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, []);

  return (
    <footer className="bg-white border-t border-zinc-200">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-sm text-zinc-600 text-center sm:text-left">
            <div>© {currentYear} English Smart Admin Panel. All rights reserved.</div>
            {profile && (
              <div className="mt-1 text-xs text-zinc-500">
                <span className="font-medium text-zinc-800">{profile.fullname || profile.username}</span>
                <span className="mx-2">•</span>
                <span>{profile.email}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>Version 1.0.0</span>
            <Link to="/admin/help" className="hover:text-zinc-900 transition-colors">
              Help
            </Link>
            <Link to="/admin/documentation" className="hover:text-zinc-900 transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
