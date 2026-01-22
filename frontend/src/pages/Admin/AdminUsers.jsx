import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const { data } = await api.put(`/admin/users/${userId}`, {
        role: newRole,
      });
      setUsers(users.map((u) => (u._id === userId ? data.user : u)));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      setUpdatingId(userId);
      const { data } = await api.delete(`/admin/users/${userId}`);
      setUsers(users.map((u) => (u._id === userId ? data.user : u)));
      toast.success('User deactivated');
    } catch (error) {
      toast.error('Failed to deactivate user');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage Users</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-semibold text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{user.email}</td>
                  <td className="px-6 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updatingId === user._id}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-sky-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDeactivateUser(user._id)}
                      disabled={updatingId === user._id || !user.isActive}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {user.isActive ? 'Deactivate' : 'Deactivated'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
