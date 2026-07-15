import { useState } from 'react';
import { BookOpen, Clock, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

const LESSON_PLAN = [
  {
    subject: 'Chemistry',
    icon: '🧪',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    lessons: [
      { id: 1, title: 'Chemical Reactions and Equations', duration: '3 to 4 hours', topics: ['Types of chemical reactions', 'Balancing equations', 'Oxidation & reduction', 'Corrosion and rancidity'] },
      { id: 2, title: 'Acids, Bases and Salts', duration: '3 to 4 hours', topics: ['Properties of acids & bases', 'pH scale', 'Chemical properties', 'Uses of salts'] },
      { id: 3, title: 'Metals and Non-Metals', duration: '3 to 4 hours', topics: ['Physical & chemical properties', 'Reactivity series', 'Extraction of metals', 'Corrosion'] },
      { id: 4, title: 'Carbon and Its Compounds', duration: '3 to 4 hours', topics: ['Covalent bonding', 'Hydrocarbons', 'Functional groups', 'Soaps & detergents'] },
      { id: 5, title: 'Periodic Classification of Elements', duration: '3 to 4 hours', topics: ['Modern periodic table', 'Trends (valency, atomic size)', 'Mendeleev’s contribution'] },
    ]
  },
  {
    subject: 'Physics',
    icon: '🔬',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    lessons: [
      { id: 6, title: 'Light – Reflection and Refraction', duration: '3 to 4 hours', topics: ['Laws of reflection', 'Refraction', 'Mirrors & lenses', 'Image formation'] },
      { id: 7, title: 'Human Eye and Colourful World', duration: '3 to 4 hours', topics: ['Structure of eye', 'Defects of vision', 'Dispersion of light', 'Atmospheric refraction'] },
      { id: 8, title: 'Electricity', duration: '3 to 4 hours', topics: ['Electric current & voltage', 'Ohm’s Law', 'Resistance', 'Electric power'] },
      { id: 9, title: 'Magnetic Effects of Electric Current', duration: '3 to 4 hours', topics: ['Magnetic field', 'Electromagnets', 'Electric motor', 'Fleming’s rules'] },
    ]
  },
  {
    subject: 'Biology',
    icon: '🌱',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    lessons: [
      { id: 10, title: 'Life Processes', duration: '3 to 4 hours', topics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion'] },
      { id: 11, title: 'Control and Coordination', duration: '3 to 4 hours', topics: ['Nervous system', 'Hormones', 'Reflex actions'] },
      { id: 12, title: 'How do Organisms Reproduce', duration: '3 to 4 hours', topics: ['Asexual & sexual reproduction', 'Human reproduction', 'DNA basics'] },
      { id: 13, title: 'Heredity and Evolution', duration: '3 to 4 hours', topics: ['Mendel’s laws', 'Traits & inheritance', 'Evolution'] },
      { id: 14, title: 'Our Environment', duration: '3 to 4 hours', topics: ['Ecosystem', 'Food chains', 'Environmental issues'] },
      { id: 15, title: 'Management of Natural Resources', duration: '3 to 4 hours', topics: ['Conservation of resources', 'Sustainable development', 'Forest & wildlife protection'] },
    ]
  }
];

export default function TeacherLessons() {
  const [expandedSections, setExpandedSections] = useState({
    'Chemistry': true,
    'Physics': true,
    'Biology': true
  });

  const toggleSection = (subject) => {
    setExpandedSections(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Lesson Planning Navigation</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl text-sm">
            View and manage your comprehensive syllabus covering Chemistry, Physics, and Biology. Each lesson is structured to take approximately 3 to 4 hours.
          </p>
        </div>
      </div>

      {/* Syllabus Content */}
      <div className="space-y-6">
        {LESSON_PLAN.map((subjectGroup) => (
          <div key={subjectGroup.subject} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Subject Header */}
            <button 
              onClick={() => toggleSection(subjectGroup.subject)}
              className="w-full flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{subjectGroup.icon}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {subjectGroup.subject}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${subjectGroup.color}`}>
                  {subjectGroup.lessons.length} Lessons
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                {expandedSections[subjectGroup.subject] ? (
                  <ChevronDown className="h-5 w-5 text-slate-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-500" />
                )}
              </div>
            </button>

            {/* Lessons List */}
            {expandedSections[subjectGroup.subject] && (
              <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectGroup.lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                        {lesson.id}. {lesson.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-slate-900/50 w-fit px-2 py-1 rounded-md">
                      <Clock size={14} />
                      {lesson.duration}
                    </div>

                    <div className="space-y-2">
                      {lesson.topics.map((topic, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        ))}
      </div>

    </div>
  );
}
