import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/ChatBox';
import { Award, Calendar, Clock, Zap, FileText, Download, MessageSquare, LifeBuoy } from 'lucide-react';
import LogoImage from '../../assets/logo.png';

export default function StudentDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [countdown, setCountdown] = useState('00:00:00');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    const pathTab = location.pathname.split('/')[2];
    if (['subjects', 'homework', 'exams', 'timetable', 'reminders', 'performance', 'communication', 'profile'].includes(pathTab)) {
      setActiveTab(pathTab);
    } else {
      setActiveTab(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab !== 'reminders') return;

    const updateCountdown = () => {
      const now = new Date();
      const today = now.toDateString();
      const nextSession = reminderSchedule
        .map((item) => ({
          ...item,
          start: new Date(`${today} ${item.time}`),
        }))
        .find((item) => item.start > now);

      if (!nextSession) {
        setCountdown('00:00:00');
        return;
      }

      const diff = nextSession.start.getTime() - now.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleQuizSubmit = () => {
    const score = mcqQuestions.reduce((total, question) => {
      return total + (selectedAnswers[question.id] === question.answer ? 1 : 0);
    }, 0);
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const stats = [
    { label: 'Current GPA', value: '3.8 / 4.0', icon: Award, color: 'bg-green-500' },
    { label: 'Attendance', value: '95%', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Assignments Due', value: '3', icon: Zap, color: 'bg-orange-500' },
    { label: 'Study Hours', value: '42', icon: Clock, color: 'bg-purple-500' },
  ];

  const subjects = [
    { id: 1, name: 'Mathematics', instructor: 'Mr. John', progress: 85, color: 'bg-blue-500' },
    { id: 2, name: 'Chemistry', instructor: 'Ms. Sarah', progress: 78, color: 'bg-green-500' },
    { id: 3, name: 'Biology', instructor: 'Mr. David', progress: 82, color: 'bg-purple-500' },
    { id: 4, name: 'Physics', instructor: 'Mrs. Lisa', progress: 76, color: 'bg-orange-500' },
    { id: 5, name: 'Kannada', instructor: 'Mr. Kumar', progress: 88, color: 'bg-red-500' },
    { id: 6, name: 'English', instructor: 'Ms. Mary', progress: 91, color: 'bg-indigo-500' },
  ];

  const lessons = {
    Mathematics: [
      { id: 1, title: 'Algebra Basics', duration: '45 min', completed: true },
      { id: 2, title: 'Geometry Fundamentals', duration: '50 min', completed: true },
      { id: 3, title: 'Calculus Introduction', duration: '60 min', completed: false },
      { id: 4, title: 'Trigonometry', duration: '40 min', completed: false },
    ],
    Chemistry: [
      { id: 1, title: 'Periodic Table', duration: '35 min', completed: true },
      { id: 2, title: 'Chemical Reactions', duration: '45 min', completed: true },
      { id: 3, title: 'Organic Chemistry', duration: '55 min', completed: false },
    ],
    Biology: [
      { id: 1, title: 'Cell Structure', duration: '40 min', completed: true },
      { id: 2, title: 'Human Anatomy', duration: '50 min', completed: false },
      { id: 3, title: 'Ecosystems', duration: '45 min', completed: false },
    ],
    Physics: [
      { id: 1, title: 'Newton\'s Laws', duration: '50 min', completed: true },
      { id: 2, title: 'Electricity', duration: '45 min', completed: false },
      { id: 3, title: 'Thermodynamics', duration: '55 min', completed: false },
    ],
    Kannada: [
      { id: 1, title: 'Basic Grammar', duration: '30 min', completed: true },
      { id: 2, title: 'Vocabulary Building', duration: '35 min', completed: true },
      { id: 3, title: 'Literature Appreciation', duration: '40 min', completed: false },
    ],
    English: [
      { id: 1, title: 'Grammar Rules', duration: '40 min', completed: true },
      { id: 2, title: 'Reading Comprehension', duration: '45 min', completed: true },
      { id: 3, title: 'Creative Writing', duration: '50 min', completed: false },
    ],
  };

  const reminderSchedule = [
    { subject: 'Mathematics', time: '9:00 AM' },
    { subject: 'Chemistry', time: '10:00 AM' },
    { subject: 'Biology', time: '11:00 AM' },
    { subject: 'Physics', time: '12:00 PM' },
    { subject: 'Kannada', time: '1:00 PM' },
    { subject: 'English', time: '2:00 PM' },
  ];

  const assignments = [
    { id: 1, title: 'Math Homework 3', course: 'Mathematics', dueDate: 'Tomorrow', status: 'pending' },
    { id: 2, title: 'Chemistry Lab Report', course: 'Chemistry', dueDate: 'Friday', status: 'pending' },
    { id: 3, title: 'English Essay', course: 'English', dueDate: 'Next Week', status: 'submitted' },
  ];

  const courses = [
    { id: 1, name: 'Mathematics', instructor: 'Mr. John', progress: 85, grade: 'A' },
    { id: 2, name: 'Chemistry', instructor: 'Ms. Sarah', progress: 78, grade: 'B+' },
    { id: 3, name: 'Biology', instructor: 'Mr. David', progress: 82, grade: 'A-' },
    { id: 4, name: 'Physics', instructor: 'Mrs. Lisa', progress: 76, grade: 'B' },
    { id: 5, name: 'Kannada', instructor: 'Mr. Kumar', progress: 88, grade: 'A+' },
    { id: 6, name: 'English', instructor: 'Ms. Mary', progress: 91, grade: 'A+' },
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: 'What is the value of x if 2x + 3 = 11?',
      options: ['3', '4', '5', '6'],
      answer: '4',
    },
    {
      id: 2,
      question: 'Which gas do plants use for photosynthesis?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      answer: 'Carbon Dioxide',
    },
    {
      id: 3,
      question: 'What is the chemical symbol for sodium?',
      options: ['Na', 'S', 'N', 'So'],
      answer: 'Na',
    },
    {
      id: 4,
      question: 'What is the capital of India?',
      options: ['Mumbai', 'Chennai', 'Kolkata', 'New Delhi'],
      answer: 'New Delhi',
    },
    {
      id: 5,
      question: 'Which organ pumps blood through the body?',
      options: ['Liver', 'Heart', 'Brain', 'Kidney'],
      answer: 'Heart',
    },
    {
      id: 6,
      question: 'What is 15% of 200?',
      options: ['20', '25', '30', '35'],
      answer: '30',
    },
    {
      id: 7,
      question: 'Which language is the official language of Karnataka?',
      options: ['Hindi', 'Kannada', 'Tamil', 'Telugu'],
      answer: 'Kannada',
    },
    {
      id: 8,
      question: 'What is the process of water turning into vapour?',
      options: ['Condensation', 'Evaporation', 'Precipitation', 'Sublimation'],
      answer: 'Evaporation',
    },
    {
      id: 9,
      question: 'Who is the author of the drama "Romeo and Juliet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Mark Twain'],
      answer: 'William Shakespeare',
    },
    {
      id: 10,
      question: 'What is the basic unit of life?',
      options: ['Atom', 'Cell', 'Molecule', 'Organ'],
      answer: 'Cell',
    },
  ];

  const examResults = [
    { subject: 'Mathematics', marks: 92, total: 100, percentage: 92, grade: 'A+' },
    { subject: 'Chemistry', marks: 85, total: 100, percentage: 85, grade: 'A' },
    { subject: 'Biology', marks: 78, total: 100, percentage: 78, grade: 'B+' },
    { subject: 'Physics', marks: 88, total: 100, percentage: 88, grade: 'A' },
    { subject: 'Kannada', marks: 95, total: 100, percentage: 95, grade: 'A+' },
    { subject: 'English', marks: 82, total: 100, percentage: 82, grade: 'A-' },
  ];

  const timetable = [
    { time: '9:00 - 10:00', subject: 'Mathematics', room: 'Room 201' },
    { time: '10:00 - 11:00', subject: 'Chemistry', room: 'Room 202' },
    { time: '11:00 - 11:15', subject: 'Break', room: '-' },
    { time: '11:15 - 12:15', subject: 'Physics', room: 'Room 203' },
    { time: '12:15 - 1:15', subject: 'Biology', room: 'Room 204' },
    { time: '1:15 - 4:00', subject: 'Self Study', room: 'Library' },
  ];

  return (
    <div className="space-y-6">
      {!activeTab && (
        <>
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-600/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <img src={LogoImage} alt="" className="w-64 h-64 object-contain" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-black/20">
                <img src={LogoImage} alt="Clazlo" className="h-20 w-20 object-contain" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black tracking-tight">Welcome back, {user?.name || 'Student'}!</h1>
                <p className="text-blue-100 mt-2 text-lg font-medium opacity-90">
                  Grade {user?.grade || '10'} • <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-black uppercase tracking-widest ml-2">Academic Excellence</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!activeTab && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Open a section from the sidebar</h2>
          <p className="text-gray-600 dark:text-gray-400">Use the left sidebar to navigate to Subjects, Homework, Exams, or the Daily Timetable.</p>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subjects & Lessons Navigation</h2>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div 
                key={subject.id} 
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSubject(selectedSubject === subject.name ? null : subject.name)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${subject.color} p-3 rounded-lg`}>
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{subject.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instructor: {subject.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{subject.progress}%</div>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${subject.progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Progress</p>
                </div>
              </div>
            ))}
          </div>
          {selectedSubject && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lessons for {selectedSubject}</h3>
              <div className="space-y-3">
                {lessons[selectedSubject].map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${lesson.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.duration}</p>
                      </div>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${lesson.completed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
                      {lesson.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'homework' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Homework Tracker Usage</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Homework Completion</h3>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">60%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <div className="bg-green-600 dark:bg-green-500 h-4 rounded-full transition-all" style={{ width: '60%' }} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">60% of homework is completed, still 40% remaining</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Completed Homework</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Mathematics Assignment 3</span>
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Chemistry Lab Report</span>
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">English Essay</span>
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Pending Homework</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Physics Problems Set</span>
                    <span className="text-orange-600 dark:text-orange-400">○</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Biology Worksheet</span>
                    <span className="text-orange-600 dark:text-orange-400">○</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Exams & Results Viewing</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examResults.map((exam, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{exam.subject}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Marks:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{exam.marks}/{exam.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{exam.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                      <span className={`font-bold ${
                        exam.grade.startsWith('A') ? 'text-green-600 dark:text-green-400' :
                        exam.grade.startsWith('B') ? 'text-blue-600 dark:text-blue-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`}>{exam.grade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(examResults.reduce((sum, exam) => sum + exam.percentage, 0) / examResults.length)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Percentage</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {examResults.reduce((sum, exam) => sum + exam.marks, 0)}/{examResults.length * 100}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {examResults.filter(exam => exam.grade.startsWith('A')).length}/{examResults.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">A Grades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daily Timetable Access</h2>
          <div className="space-y-4">
            {timetable.map((slot, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                slot.subject === 'Break' 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : slot.subject === 'Self Study'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white min-w-[100px]">
                    {slot.time}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{slot.subject}</p>
                    {slot.room !== '-' && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{slot.room}</p>
                    )}
                  </div>
                </div>
                {slot.subject !== 'Break' && slot.subject !== 'Self Study' && (
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Scheduled
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reminders' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Study Reminder Setup</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Each subject gets 1 hour of focused study. Use the countdown to track your next session.</p>
              </div>
              <div className="text-right">
                <p className="text-sm uppercase text-gray-500 dark:text-gray-400">Next Session Countdown</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{countdown}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reminderSchedule.map((item) => (
                <div key={item.subject} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.subject}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1 hour session</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Starts at {item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Self-Performance <span className="text-blue-600">Tracking</span></h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Test your knowledge with today's specialized 10-question challenge.</p>
            </div>
            {quizSubmitted && (
              <div className="bg-blue-600 px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/20 text-white text-center min-w-[160px]">
                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Final Score</p>
                <p className="text-3xl font-black">{quizScore} / {mcqQuestions.length}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {mcqQuestions.map((question, qIdx) => (
              <div key={question.id} className="group border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-black text-blue-600">
                    {qIdx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-800 dark:text-white leading-relaxed">{question.question}</p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          disabled={quizSubmitted}
                          onClick={() => handleAnswerChange(question.id, option)}
                          className={`text-left rounded-xl border px-5 py-4 text-sm font-bold transition-all relative overflow-hidden ${
                            selectedAnswers[question.id] === option
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 ring-2 ring-blue-600/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                          } ${quizSubmitted && option === question.answer ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : ''}
                            ${quizSubmitted && selectedAnswers[question.id] === option && option !== question.answer ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 pb-10">
            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:-translate-y-1 transition-all active:translate-y-0"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:translate-y-0"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'communication' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Class <span className="text-blue-600">Communication</span> Flow</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Access shared resources and talk to your AI assistant.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PDF Resources */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  Shared Documents
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Syllabus_2027.pdf', size: '2.4 MB', date: 'Mar 15' },
                    { name: 'Weekly_Schedule_v2.pdf', size: '1.1 MB', date: 'Apr 20' },
                    { name: 'Lab_Safety_Guidelines.pdf', size: '850 KB', date: 'Jan 10' },
                    { name: 'Academic_Handbook.pdf', size: '5.2 MB', date: 'Dec 05' },
                  ].map((pdf, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{pdf.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">{pdf.size} • {pdf.date}</p>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-blue-600 hover:text-white transition-all">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-black text-lg mb-2">Need Help?</h4>
                  <p className="text-blue-100 text-sm font-medium">Download the full user manual or contact support for assistance.</p>
                  <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-xs shadow-lg">
                    Contact Support
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <LifeBuoy size={100} />
                </div>
              </div>
            </div>

            {/* AI Chat Box */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white">Clazlo AI Assistant</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Active Now</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <ChatBox botName="Clazlo Assistant" welcomeMessage="Hello! I'm your Clazlo AI Assistant. How can I help you with your studies or schedule today?" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile & Identity Management</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student Name</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Sandeep</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Number</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">12345</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">123456</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">10</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">A</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[2.4fr_1fr]">
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Assignments</h2>
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{assignment.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assignment.course}</p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            assignment.status === 'submitted'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          }`}
                        >
                          {assignment.status === 'submitted' ? 'Submitted' : assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Next Class</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mathematics</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Today at 2 PM</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Room 204</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">💡 Tip: Review your assignments early to finish on time.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{course.grade}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{course.instructor}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Assignments</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Course</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Due Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{assignment.title}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{assignment.course}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{assignment.dueDate}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${assignment.status === 'submitted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <ChatBox botName="Hi buddy" welcomeMessage="Hello! I’m your study buddy. Ask me anything about your schedule or assignments." />
      </div>
    </div>
  );
}
