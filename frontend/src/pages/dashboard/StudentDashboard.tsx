import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  PlusCircle, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import api from '../../lib/api';

interface DashboardStats {
  total: number;
  open: number;
  resolved: number;
  recent: any[];
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/complaints/stats');
        setStats(res.data.data);
      } catch (err: any) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Complaints', value: stats?.total || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Pending Review', value: stats?.open || 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Resolved Cases', value: stats?.resolved || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and manage your institutional grievances.</p>
        </div>
        <Link
          to="/dashboard/student/complaints/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Complaint
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
            <div className={`${stat.bg} p-3 rounded-lg mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Recent Complaints</h2>
          <Link to="/dashboard/student/complaints" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {stats?.recent && stats.recent.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Reference</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {stats.recent.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{complaint.reference_number}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{complaint.title}</td>
                    <td className="px-6 py-4 text-gray-600">{complaint.category_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                        complaint.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/dashboard/student/complaints/${complaint.id}`} className="text-primary-600 hover:underline font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No complaints found. Your latest activity will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
