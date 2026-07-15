import { useState } from 'react';
import { Share2, FileText, Video, Download, ExternalLink, Search, Filter } from 'lucide-react';
import ChatBox from '../../components/ChatBox';

const RESOURCES = [
  {
    id: 1,
    title: 'Chemical Reactions Chapter 1 Notes',
    subject: 'Chemistry',
    type: 'pdf',
    size: '2.4 MB',
    dateAdded: '2026-04-10',
    icon: FileText,
    color: 'emerald'
  },
  {
    id: 2,
    title: 'Balancing Equations Tutorial',
    subject: 'Chemistry',
    type: 'video',
    duration: '14:20',
    dateAdded: '2026-04-12',
    icon: Video,
    color: 'emerald'
  },
  {
    id: 3,
    title: 'Laws of Motion Formula Sheet',
    subject: 'Physics',
    type: 'pdf',
    size: '1.1 MB',
    dateAdded: '2026-04-15',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 4,
    title: 'Ohm’s Law Experiment Demo',
    subject: 'Physics',
    type: 'video',
    duration: '08:45',
    dateAdded: '2026-04-16',
    icon: Video,
    color: 'blue'
  },
  {
    id: 5,
    title: 'Human Eye Diagram & Functions',
    subject: 'Biology',
    type: 'pdf',
    size: '4.5 MB',
    dateAdded: '2026-04-18',
    icon: FileText,
    color: 'rose'
  },
  {
    id: 6,
    title: 'DNA Structure 3D Animation',
    subject: 'Biology',
    type: 'video',
    duration: '05:30',
    dateAdded: '2026-04-20',
    icon: Video,
    color: 'rose'
  },
  {
    id: 7,
    title: 'Algebra Expressions Practice',
    subject: 'Math',
    type: 'pdf',
    size: '1.8 MB',
    dateAdded: '2026-04-22',
    icon: FileText,
    color: 'indigo'
  }
];

export default function TeacherResources() {
  const [filterType, setFilterType] = useState('all'); // 'all', 'pdf', 'video'

  const filteredResources = filterType === 'all' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.type === filterType);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Digital Resource Sharing</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl text-sm">
            Manage and share digital materials with your students. Upload subject PDFs, study notes, and educational video links.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('pdf')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${filterType === 'pdf' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'}`}
            >
              <FileText size={16} /> PDFs
            </button>
            <button 
              onClick={() => setFilterType('video')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${filterType === 'video' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'}`}
            >
              <Video size={16} /> Videos
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search resources by title or subject..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm"
          />
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm">
          <Filter size={18} />
          Filter by Subject
        </button>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            <div className={`h-2 bg-${resource.color}-500`} />
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-${resource.color}-50 dark:bg-${resource.color}-900/20 border border-${resource.color}-100 dark:border-${resource.color}-800 flex items-center justify-center text-${resource.color}-600 dark:text-${resource.color}-400 group-hover:scale-110 transition-transform`}>
                  <resource.icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  {resource.dateAdded}
                </span>
              </div>
              
              <div className="mb-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-${resource.color}-100 dark:bg-${resource.color}-900/40 text-${resource.color}-700 dark:text-${resource.color}-400`}>
                  {resource.subject}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2">
                {resource.title}
              </h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {resource.type === 'pdf' ? `PDF • ${resource.size}` : `Video • ${resource.duration}`}
                </span>
                <button className={`p-2 rounded-lg text-slate-400 hover:text-${resource.color}-600 dark:hover:text-${resource.color}-400 hover:bg-${resource.color}-50 dark:hover:bg-${resource.color}-900/30 transition-colors`}>
                  {resource.type === 'pdf' ? <Download size={18} /> : <ExternalLink size={18} />}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Upload New Resource Card */}
        <button className="bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors hover:border-indigo-400 dark:hover:border-indigo-500 group min-h-[240px]">
          <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-transform mb-4">
            <Share2 size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Add New Resource</h3>
          <p className="text-sm text-slate-500 text-center">Upload PDF documents or share external video links.</p>
        </button>
      </div>

      {/* AI Assistant ChatBox */}
      <div className="pt-8">
        <ChatBox botName="Resource Guide" welcomeMessage="Hello! Need help finding a specific PDF, video, or subject topic? Ask me here." />
      </div>

    </div>
  );
}
