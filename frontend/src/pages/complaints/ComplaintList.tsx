import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  FileText, 
  ChevronRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import api from '../../lib/api';

export default function ComplaintList() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, catRes] = await Promise.all([
          api.get('/complaints', { 
            params: { 
              search: search || undefined,
              status: statusFilter || undefined,
              category: categoryFilter || undefined,
              page,
              limit
            }
          }),
          api.get('/complaints/categories')
        ]);
        setComplaints(compRes.data.data);
        setTotal(compRes.data.total);
        setCategories(catRes.data.data);
      } catch (err: any) {
        setError('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [search, statusFilter, categoryFilter, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter]);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-700 font-semibold';
      case 'Rejected': return 'bg-red-100 text-red-700 font-semibold';
      case 'In Progress': return 'bg-amber-100 text-amber-700 font-semibold';
      case 'Under Review': return 'bg-blue-100 text-blue-700 font-semibold';
      default: return 'bg-gray-100 text-gray-700 font-semibold';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-500 mt-1">Manage and track your submitted grievances.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by reference or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-40 text-gray-800">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="relative flex-1 md:w-48 text-gray-800">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="flex-1">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
              Loading complaints...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 flex flex-col items-center">
              <AlertCircle className="h-10 w-10 mb-4" />
              {error}
            </div>
          ) : complaints.length > 0 ? (
            <div className="divide-y divide-gray-50 text-gray-800">
              {complaints.map((complaint) => (
                <Link
                  key={complaint.id}
                  to={`/dashboard/student/complaints/${complaint.id}`}
                  className="block hover:bg-gray-50 transition-colors p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded tracking-wide">
                          {complaint.reference_number}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${getStatusStyle(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 leading-tight">{complaint.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span className="flex items-center"><FileText className="h-3 w-3 mr-1" /> {complaint.category_name}</span>
                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(complaint.created_at).toLocaleDateString()}</span>
                        <span className={`flex items-center ${
                          complaint.priority === 'Critical' ? 'text-red-600 font-bold' :
                          complaint.priority === 'High' ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          <AlertCircle className="h-3 w-3 mr-1" /> {complaint.priority} Priority
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 mt-2" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-24 text-center text-gray-400">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-10" />
              <p className="text-lg font-medium">No complaints found</p>
              <p className="text-sm mt-1">Try adjusting your filters or submit a new grievance.</p>
            </div>
          )}
        </div>

        {/* Pagination UI */}
        {total > limit && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
            <p className="text-sm text-gray-500 font-medium text-gray-800">
              Showing <span className="font-bold">{((page - 1) * limit) + 1}</span> to <span className="font-bold">{Math.min(page * limit, total)}</span> of <span className="font-bold">{total}</span> complaints
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-800"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
