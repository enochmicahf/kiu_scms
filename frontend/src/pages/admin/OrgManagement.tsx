import { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Users, 
  ChevronRight, 
  ChevronDown,
  Trash2,
  Edit2,
  LayoutGrid,
  Search
} from 'lucide-react';
import api from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export default function OrgManagement() {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaculties, setExpandedFaculties] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  // Modal States
  const [facultyModal, setFacultyModal] = useState<{ open: boolean; data: any | null }>({ open: false, data: null });
  const [departmentModal, setDepartmentModal] = useState<{ open: boolean; data: any | null }>({ open: false, data: null });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; type: 'faculty' | 'department'; id: number | null }>({ open: false, type: 'faculty', id: null });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [facRes, depRes] = await Promise.all([
        api.get('/admin/faculties'),
        api.get('/admin/departments')
      ]);
      setFaculties(facRes.data.data);
      setDepartments(depRes.data.data);
    } catch (err) {} finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedFaculties(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as any).name.value;
    setSubmitting(true);
    try {
      if (facultyModal.data) {
        await api.put(`/admin/faculties/${facultyModal.data.id}`, { name });
        toast.success('Faculty updated successfully');
      } else {
        await api.post('/admin/faculties', { name });
        toast.success('New faculty registered');
      }
      setFacultyModal({ open: false, data: null });
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as any).name.value;
    const facultyId = (e.target as any).facultyId.value;
    setSubmitting(true);
    try {
      if (departmentModal.data) {
        await api.put(`/admin/departments/${departmentModal.data.id}`, { name, facultyId });
        toast.success('Department updated successfully');
      } else {
        await api.post('/admin/departments', { name, facultyId });
        toast.success('New department registered');
      }
      setDepartmentModal({ open: false, data: null });
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!confirmDelete.id) return;
    setSubmitting(true);
    try {
      const endpoint = confirmDelete.type === 'faculty' ? `/admin/faculties/${confirmDelete.id}` : `/admin/departments/${confirmDelete.id}`;
      await api.delete(endpoint);
      toast.success(`${confirmDelete.type === 'faculty' ? 'Faculty' : 'Department'} removed`);
      setConfirmDelete({ open: false, type: 'faculty', id: null });
      fetchData();
    } catch (err) {
      toast.error('Deletion failed. Ensure no dependent records exist.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/4" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight tracking-tighter">Institutional Structure</h1>
          <p className="text-gray-500 font-medium">Manage the hierarchy of faculties and academic departments.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setFacultyModal({ open: true, data: null })}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-100 text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add Faculty
          </button>
          <button 
            onClick={() => setDepartmentModal({ open: true, data: null })}
            className="inline-flex items-center px-4 py-2 bg-[#008540] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add Department
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Hierarchy Explorer */}
        <div className="lg:col-span-3 space-y-4">
           {faculties.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map((faculty) => {
             const facultyDeps = departments.filter(d => d.faculty_id === faculty.id);
             const isExpanded = expandedFaculties.includes(faculty.id);

             return (
               <div key={faculty.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:border-primary-100">
                  <div 
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4" onClick={() => toggleExpand(faculty.id)}>
                       <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 group-hover:scale-110 transition-transform">
                          <Building2 className="h-6 w-6" />
                       </div>
                       <div>
                          <h3 className="text-base font-black text-gray-900 uppercase tracking-tighter">{faculty.name}</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                             {facultyDeps.length} Departments Managed
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setFacultyModal({ open: true, data: faculty }); }}
                            className="p-2.5 hover:bg-white text-gray-400 hover:text-primary-600 rounded-lg shadow-sm border border-transparent hover:border-gray-100 transition-all active:scale-95"
                          >
                             <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete({ open: true, type: 'faculty', id: faculty.id }); }}
                            className="p-2.5 hover:bg-white text-gray-400 hover:text-rose-600 rounded-lg shadow-sm border border-transparent hover:border-gray-100 transition-all active:scale-95"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                       <div onClick={() => toggleExpand(faculty.id)}>
                        {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-300" /> : <ChevronRight className="h-5 w-5 text-gray-300" />}
                       </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-gray-50/50 border-t border-gray-50 p-4 space-y-2">
                       {facultyDeps.length === 0 ? (
                         <p className="p-6 text-center text-sm text-gray-300 font-medium">No departments registered for this faculty.</p>
                       ) : facultyDeps.map(dep => (
                         <div key={dep.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 shadow-sm hover:border-[#008540]/30 transition-all group">
                            <div className="flex items-center gap-3">
                               <MapPin className="h-4 w-4 text-gray-300 group-hover:text-[#008540] transition-colors" />
                               <span className="text-sm font-bold text-gray-700">{dep.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="flex items-center text-xs font-black text-gray-300 uppercase tracking-widest mr-4">
                                  <Users className="h-3 w-3 mr-1" /> 24 Staff
                               </div>
                               <button 
                                onClick={() => setDepartmentModal({ open: true, data: dep })}
                                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-50 text-gray-400 hover:text-primary-600 rounded-lg transition-all"
                               >
                                  <Edit2 className="h-4 w-4" />
                               </button>
                               <button 
                                onClick={() => setConfirmDelete({ open: true, type: 'department', id: dep.id })}
                                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-50 text-gray-400 hover:text-rose-500 rounded-lg transition-all"
                               >
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
             );
           })}
        </div>

        {/* Quick Insights Slider */}
        <div className="space-y-6">
           <div className="bg-[#008540] p-8 rounded-3xl text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
              <LayoutGrid className="h-8 w-8 text-emerald-200 mb-6" />
              <h4 className="text-base font-black uppercase tracking-[0.2em] mb-4">Search Index</h4>
              <div className="relative group/search">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-hover/search:text-white transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Find unit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border-none rounded-xl text-sm font-bold placeholder:text-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                 />
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-3 flex items-center">
                 <Building2 className="h-4 w-4 mr-2 text-[#008540]" /> Organizational Depth
              </h3>
              <div className="space-y-4 pt-2">
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500">Total Faculties</span>
                    <span className="font-black text-gray-900">{faculties.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500">Active Depts</span>
                    <span className="font-black text-gray-900">{departments.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500">Orphaned Depts</span>
                    <span className="font-black text-rose-600">0</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Faculty Modal */}
      <Modal 
        isOpen={facultyModal.open} 
        onClose={() => setFacultyModal({ open: false, data: null })}
        title={facultyModal.data ? 'Edit Faculty' : 'Register Faculty'}
      >
        <form onSubmit={handleSaveFaculty} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Faculty Name</label>
            <input 
              name="name"
              defaultValue={facultyModal.data?.name || ''}
              required 
              autoFocus
              className="premium-input w-full"
              placeholder="e.g. Faculty of Engineering"
            />
          </div>
          <div className="flex gap-3 pt-4">
             <button 
               type="button" 
               onClick={() => setFacultyModal({ open: false, data: null })}
               className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
             >
                Cancel
             </button>
             <button 
               disabled={submitting}
               type="submit" 
               className="flex-1 py-4 bg-[#008540] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all disabled:opacity-50"
             >
                {submitting ? 'Processing...' : (facultyModal.data ? 'Update Faculty' : 'Confirm Registration')}
             </button>
          </div>
        </form>
      </Modal>

      {/* Department Modal */}
      <Modal 
        isOpen={departmentModal.open} 
        onClose={() => setDepartmentModal({ open: false, data: null })}
        title={departmentModal.data ? 'Edit Department' : 'Register Department'}
      >
        <form onSubmit={handleSaveDepartment} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parent Faculty</label>
            <select 
              name="facultyId"
              defaultValue={departmentModal.data?.faculty_id || ''}
              required
              className="premium-input w-full appearance-none"
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department Name</label>
            <input 
              name="name"
              defaultValue={departmentModal.data?.name || ''}
              required
              className="premium-input w-full"
              placeholder="e.g. Computer Science"
            />
          </div>
          <div className="flex gap-3 pt-4">
             <button 
               type="button" 
               onClick={() => setDepartmentModal({ open: false, data: null })}
               className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
             >
                Cancel
             </button>
             <button 
               disabled={submitting}
               type="submit" 
               className="flex-1 py-4 bg-[#008540] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all disabled:opacity-50"
             >
                {submitting ? 'Processing...' : (departmentModal.data ? 'Update Department' : 'Confirm Registration')}
             </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal 
        isOpen={confirmDelete.open} 
        onClose={() => setConfirmDelete({ open: false, type: 'faculty', id: null })}
        title="Confirm Deletion"
      >
        <div className="space-y-6 text-center">
          <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
             <Trash2 className="h-10 w-10" />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-2">Are you absolutely sure?</h4>
            <p className="text-slate-500 font-medium">
              You are about to remove a {confirmDelete.type}. This action cannot be undone and may affect associated records.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
             <button 
               onClick={() => setConfirmDelete({ open: false, type: 'faculty', id: null })}
               className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
             >
                No, Keep it
             </button>
             <button 
               disabled={submitting}
               onClick={executeDelete}
               className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-900/10 hover:shadow-xl transition-all disabled:opacity-50"
             >
                {submitting ? 'Removing...' : 'Yes, Delete Unit'}
             </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
