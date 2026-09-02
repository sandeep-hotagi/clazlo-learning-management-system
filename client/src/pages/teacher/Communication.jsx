import ChatBox from '../../components/ChatBox';
import { MessageCircle, FileText, BookOpen, Users } from 'lucide-react';

const discussionThreads = [
  {
    id: 1,
    topic: 'Revision plan for Grade 11 Physics',
    createdBy: 'Mr. Ramesh',
    time: '2 hours ago',
    messages: 18,
  },
  {
    id: 2,
    topic: 'Request for extra Kannada worksheets',
    createdBy: 'Ms. Priya',
    time: '5 hours ago',
    messages: 12,
  },
  {
    id: 3,
    topic: 'Homework follow-up for Mathematics',
    createdBy: 'Mr. John',
    time: 'Yesterday',
    messages: 24,
  },
];

const subjectNotes = [
  {
    id: 1,
    subject: 'Mathematics',
    note: 'Focus on quadratic equations and practise past year exam questions for next week.',
  },
  {
    id: 2,
    subject: 'Physics',
    note: 'Discuss the upcoming mechanics unit with the class and share lab preparation notes.',
  },
  {
    id: 3,
    subject: 'Chemistry',
    note: 'Upload the organic chemistry summary sheet before Friday and add reference links.',
  },
];

export default function TeacherCommunication() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-slate-900 dark:to-slate-700 rounded-3xl p-8 text-white shadow-xl shadow-sky-200/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Teacher Communication</p>
            <h1 className="mt-2 text-3xl font-semibold">Classroom AI Discussion Hub</h1>
            <p className="mt-3 max-w-2xl text-slate-100/90">
              Use the AI assistant to coordinate lessons, share subject notes, and run discussions with other faculty members.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
            <MessageCircle className="h-5 w-5 text-sky-200" />
            Live teacher collaboration
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <ChatBox
            botName="Study Buddy"
            welcomeMessage="Hello! I’m your teaching assistant. Ask me to draft discussion prompts, subject notes, or communication templates."
          />

          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Discussion Threads</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Active subject discussions</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Users className="h-4 w-4 text-sky-500" />
                3 threads
              </span>
            </div>

            <div className="space-y-4">
              {discussionThreads.map((thread) => (
                <div key={thread.id} className="rounded-3xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-950 transition hover:border-sky-400/40">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{thread.topic}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Created by {thread.createdBy}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <FileText className="h-4 w-4" />
                      {thread.messages} messages
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">#discussion</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">#subject-planning</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">#notes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
              <BookOpen className="h-5 w-5 text-sky-500" />
              <h2 className="text-lg font-semibold">Subject Notes</h2>
            </div>
            <div className="space-y-4">
              {subjectNotes.map((note) => (
                <div key={note.id} className="rounded-3xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-sky-500">{note.subject}</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{note.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
              <MessageCircle className="h-5 w-5 text-sky-500" />
              <h2 className="text-lg font-semibold">Teacher Notes</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Keep this section for quick reminders, collaboration points, and follow-up ideas related to each subject.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                • Share revision materials for Physics and Maths by Monday.
              </li>
              <li className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                • Confirm hall booking for the extra Kannada reading session.
              </li>
              <li className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                • Schedule a brief peer review for the Chemistry lab report guidelines.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
