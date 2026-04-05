export default function StudentProfile() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center text-sm text-[#3dbe6b] mb-4">
        <span>Profile</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-gray-800">Student profile</h1>
        <button className="bg-[#3dbe6b] text-white px-4 py-2 text-sm rounded shadow-sm hover:bg-primary-600 transition-colors">
          Register for semester
        </button>
      </div>

      {/* Hero Card */}
      <div className="bg-white border border-gray-200 p-6 flex items-center justify-between shadow-sm">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
          <img src="https://ui-avatars.com/api/?name=Benjamin+Angella&background=random" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-right">
          <h2 className="text-lg font-medium text-gray-900 uppercase">ANGELLA, BENJAMIN</h2>
          <p className="text-sm text-gray-500">2023-08-21073</p>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">ADMISSION NO: 620163</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200 text-sm">
          <button className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">Profile</button>
          <button className="px-6 py-3 text-[#3dbe6b] border-b-2 border-[#3dbe6b] font-medium">Requests</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-sm">Basic Information</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[140px_1fr] items-center">
                <span className="text-gray-500">Surname</span>
                <span className="text-gray-900 uppercase">ANGELLA</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-center">
                <span className="text-gray-500">Other names</span>
                <span className="text-gray-900 uppercase">BENJAMIN</span>
              </div>
              <div className="grid grid-cols-[140px_1fr_40px] items-center">
                <span className="text-gray-500">Primary number</span>
                <span className="text-gray-900">0757726388</span>
                <button className="text-[#3dbe6b] text-xs font-semibold">Edit</button>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-center">
                <span className="text-gray-500">Secondary number</span>
                <span className="text-gray-900">0787726388</span>
              </div>
              <div className="grid grid-cols-[140px_1fr_40px] items-center">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900">bangella23@gmail.com</span>
                <button className="text-[#3dbe6b] text-xs font-semibold">Edit</button>
              </div>
               <div className="grid grid-cols-[140px_1fr] items-center">
                <span className="text-gray-500">KIU email</span>
                <span className="text-gray-900">benjamin.angella@studmc.kiu.ac.ug</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-center">
                <span className="text-gray-500">Nationality</span>
                <span className="text-gray-900">Ugandan</span>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6 flex flex-col">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Disciplinary status</h3>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded text-sm border border-gray-100">
                <span className="text-gray-600">Status: <span className="text-[#3dbe6b]">Clean</span></span>
                <button className="text-[#3dbe6b]">History</button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-sm mt-4">Financial information</h3>
              <div className="bg-gray-50 p-3 rounded text-sm border border-gray-100 text-gray-700">
                Sponsorship: <span className="text-gray-900">KIU Scholarship Scheme (Bursaries)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
