import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Mail,
  Building2,
  Edit2
} from 'lucide-react';
import api from '../../lib/api';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { useToast } from '../../context/ToastContext';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', { 
        params: { search, role: roleFilter } 
      });
      setUsers(res.data.data);
    } catch (err) {
      // Background re-fetch silent catch
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const toggleStatus = async (id: number, current: boolean) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !current });
      toast.success(current ? 'System Access Suspended.' : 'Identity Access Restored.');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to augment user clearance. Verify network and privileges.');
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Unified Identity Center</h1>
          <p className="text-slate-500 font-medium mt-2">Oversee credentials for students, staff, and system administrators.</p>
        </div>
        <button className="inline-flex items-center px-8 py-4 bg-[#008540] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-emerald-900/20 hover:-translate-y-1 hover:shadow-emerald-900/40 active:scale-95 transition-all">
          <UserPlus className="mr-3 h-4 w-4" />
          Register Identity
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100/60 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search active identities or institutional IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="premium-input pl-14 bg-slate-50 border-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="premium-input pl-12 pr-10 w-full md:w-56 appearance-none font-bold bg-slate-50 border-none"
          >
            <option value="">All Affiliations</option>
            <option value="Student">Scholars</option>
            <option value="Staff">Faculty</option>
            <option value="Admin">Overseers</option>
          </select>
        </div>
      </div>

      {/* Premium Table Component */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>User Profile</TableHeaderCell>
            <TableHeaderCell>Institutional ID</TableHeaderCell>
            <TableHeaderCell>Access Tier</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Controls</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
             <>
               <TableRowSkeleton />
               <TableRowSkeleton />
               <TableRowSkeleton />
               <TableRowSkeleton />
               <TableRowSkeleton />
             </>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                 <div className="py-16 text-center text-slate-400 font-bold">No identities matched your criteria.</div>
              </TableCell>
            </TableRow>
          ) : (
             users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-black text-sm shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{user.first_name} {user.last_name}</p>
                      <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1 group-hover:text-emerald-600/80 transition-colors">
                          <Mail className="h-3 w-3 mr-1.5" />
                          {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{user.id_number || 'SYSTEM RECORD'}</span>
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    user.role_name === 'Admin' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-100/50' :
                    user.role_name === 'Staff' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100/50' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/50'
                  }`}>
                    {user.role_name}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-xs font-bold text-slate-500">
                    <Building2 className="h-4 w-4 mr-2 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                    {user.department_name || 'Unassigned'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-300'}`} />
                    {user.is_active ? 'Active' : 'Suspended'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => toggleStatus(user.id, user.is_active)}
                      title={user.is_active ? 'Suspend Clearance' : 'Restore Clearance'}
                      className={`p-2.5 rounded-xl transition-all ${user.is_active ? 'hover:bg-red-50 text-slate-300 hover:text-red-500 hover:scale-110 active:scale-95' : 'hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 hover:scale-110 active:scale-95'}`}
                    >
                        {user.is_active ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                    </button>
                    <button className="p-2.5 hover:bg-slate-50 text-slate-300 hover:text-slate-600 rounded-xl transition-all hover:scale-110 active:scale-95">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
             ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
