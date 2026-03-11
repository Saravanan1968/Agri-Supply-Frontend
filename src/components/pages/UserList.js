import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from './Loading';
import { Users, UserPlus, Phone, Briefcase, Mail, Shield, User } from 'lucide-react';

const UserList = () => {
  const navigate = useNavigate();
  const [fetchedUsers, setFetchedUsers] = useState(null)

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`); // Redirect to detail page with userId as a parameter
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/fetch-users`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFetchedUsers(data.Users)
        }
        else {
          alert(data.message)
        }
      })
      .catch(err => {
        console.log('Trouble in connecting to the Server: ', err)
        // alert("Trouble in connecting to the Server! Please try again later.")
      })
  }, [])



  if (fetchedUsers === null) {
    return <LoadingPage />
  }
  else {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in-up min-h-[70vh]">
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20 text-primary-light">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Users</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Manage authorized personnel</p>
              </div>
            </div>
            <button
              className="btn-primary-gradient py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              onClick={() => window.location.href = "/create-user"}
            >
              <UserPlus size={18} />
              <span>Create New User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 text-left">
                  <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">User ID</th>
                  <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Full Name</th>
                  <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Contact</th>
                  <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {fetchedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No active users found in the system.
                    </td>
                  </tr>
                ) : (
                  fetchedUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary/20 group-hover:text-primary-light transition-colors">
                            <User size={14} />
                          </div>
                          <span className="font-mono text-gray-700 dark:text-gray-300 text-sm">{user.id}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900 dark:text-white">{user.fullname}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 text-sm">
                          <Phone size={14} />
                          {user.contact}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${user.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : user.role === 'manufacturer'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}>
                          <Shield size={12} />
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
};

export default UserList;
