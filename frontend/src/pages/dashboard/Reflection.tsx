import { MessageSquareQuote, Sparkles, Award, ShieldCheck } from 'lucide-react';

export default function Reflection() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
             <div className="h-1 w-12 bg-emerald-600 rounded-full" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Phase 7 Finalization</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Personal <span className="text-emerald-600">Reflection.</span>
          </h1>
          <p className="text-slate-500 mt-4 font-medium max-w-xl leading-relaxed italic">
            Synthesizing the technical and creative journey of the SCMS & Content Development project.
          </p>
        </div>
        <div className="h-16 w-16 bg-white border border-slate-100 rounded-[1.5rem] shadow-xl flex items-center justify-center text-emerald-600">
          <Award className="h-8 w-8" />
        </div>
      </div>

      {/* Reflection Content Card */}
      <div className="premium-card relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <MessageSquareQuote className="h-64 w-64 rotate-12" />
        </div>
        
        <div className="p-10 lg:p-16 relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-xl tracking-tighter leading-none mb-1">Learning Outcomes</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post-Implementation Analysis</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl lg:text-2xl font-bold text-slate-800 leading-relaxed tracking-tight first-letter:text-5xl first-letter:font-black first-letter:text-emerald-600 first-letter:mr-3 first-letter:float-left">
              This assignment helped me understand how to create and edit audio content using simple tools. 
              I learned how to record clear audio, remove unwanted noise, and adjust volume to improve sound quality. 
              I also gained knowledge about exporting audio in MP3 format and the importance of bitrate in audio quality.
            </p>
            
            <div className="my-12 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <p className="text-xl lg:text-2xl font-bold text-slate-800 leading-relaxed tracking-tight mb-10">
              While working on the podcast, I faced some challenges such as background noise and maintaining a steady voice, 
              but I was able to improve through practice. Overall, this task enhanced my technical and communication skills, 
              and I now feel more confident in producing audio content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-emerald-200 transition-all">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">Technical Proficiency</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                   Mastered audio editing protocols including noise suppression and bitrate optimization.
                </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-emerald-200 transition-all">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquareQuote className="h-5 w-5" />
                </div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">Communication Strategy</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                   Enhanced vocal delivery and production quality for high-impact knowledge sharing.
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Branding Footer */}
      <div className="bg-[#08271c] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
         <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-6">Conclusion of <span className="text-emerald-500">Phase 7.</span></h2>
            <p className="text-emerald-100/60 font-medium text-lg leading-relaxed italic">
               "Technical skills provide the foundation, but reflection drives the evolution of professional excellence."
            </p>
         </div>
      </div>
    </div>
  );
}
