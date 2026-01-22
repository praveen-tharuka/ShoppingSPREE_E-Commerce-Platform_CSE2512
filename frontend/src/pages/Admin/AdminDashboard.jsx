import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied');
      return;
    }
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/dashboard');
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">Failed to load dashboard</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Total Products', value: stats.totalProducts, color: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'bg-yellow-50', textColor: 'text-yellow-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className={`${card.color} rounded-lg p-6 shadow-md`}>
            <p className="text-gray-600 text-sm font-medium mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${(stats.pendingOrders / stats.totalOrders) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-semibold text-sm w-12">{stats.pendingOrders}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(stats.processingOrders / stats.totalOrders) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-semibold text-sm w-12">{stats.processingOrders}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipped</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${(stats.shippedOrders / stats.totalOrders) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-semibold text-sm w-12">{stats.shippedOrders}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivered</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(stats.deliveredOrders / stats.totalOrders) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-semibold text-sm w-12">{stats.deliveredOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="/admin/products"
              className="block px-4 py-3 bg-sky-100 text-sky-700 hover:bg-sky-200 rounded-lg font-semibold transition-colors text-center"
            >
              Manage Products
            </a>
            <a
              href="/admin/orders"
              className="block px-4 py-3 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-semibold transition-colors text-center"
            >
              Manage Orders
            </a>
            <a
              href="/admin/users"
              className="block px-4 py-3 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-semibold transition-colors text-center"
            >
              Manage Users
            </a>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm font-semibold text-gray-600">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-semibold text-sky-600">
                      {order.orderNumber}
                    </td>
                    <td className="py-3">{order.user.name}</td>
                    <td className="py-3 font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'shipped'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
