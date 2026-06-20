'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { API_BASE_URL } from '@/config';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface ScoreTrendItem {
  date: string;
  score: number;
}

interface CategoryScoreItem {
  role: string;
  averageScore: number;
}

interface ResumeHistoryItem {
  date: string;
  atsScore: number;
}

interface QuestionFeedback {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

interface PastSession {
  _id: string;
  role: string;
  averageScore: number;
  createdAt: string;
  questions: QuestionFeedback[];
}

interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function PerformancePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Analytics states
  const [trendData, setTrendData] = useState<ScoreTrendItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryScoreItem[]>([]);
  const [resumeData, setResumeData] = useState<ResumeHistoryItem[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  
  // Sessions states
  const [sessions, setSessions] = useState<PastSession[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  
  // UX states
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Notifications State
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to PrepAI! Supercharge your preparation.', time: '2 hours ago', read: false },
    { id: 2, text: 'ATS Score optimization complete for resume_alex_cv.pdf', time: '1 day ago', read: false },
    { id: 3, text: 'Mock interview session: "Senior Frontend Engineer" graded 85%.', time: '1 day ago', read: true }
  ]);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch analytics data
  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        setDataLoading(true);
        setErrorMsg(null);

        // Fetch score trend
        const trendRes = await fetch(`${API_BASE_URL}/api/analytics/score-trend`, {
          credentials: 'include',
        });
        const trendResult = await trendRes.json();

        // Fetch category scores
        const catRes = await fetch(`${API_BASE_URL}/api/analytics/by-category`, {
          credentials: 'include',
        });
        const catResult = await catRes.json();

        // Fetch resume score history
        const resumeRes = await fetch(`${API_BASE_URL}/api/analytics/resume-history`, {
          credentials: 'include',
        });
        const resumeResult = await resumeRes.json();

        // Fetch paginated sessions
        const sessionsRes = await fetch(`${API_BASE_URL}/api/analytics/sessions?page=${currentPage}&limit=5`, {
          credentials: 'include',
        });
        const sessionsResult = await sessionsRes.json();

        if (trendRes.ok && trendResult.success) {
          setTrendData(trendResult.trend);
        }
        if (catRes.ok && catResult.success) {
          setCategoryData(catResult.byCategory);
        }
        if (resumeRes.ok && resumeResult.success) {
          setResumeData(resumeResult.history);
        }
        if (sessionsRes.ok && sessionsResult.success) {
          setSessions(sessionsResult.sessions);
          setPagination(sessionsResult.pagination);
        }
      } catch (err) {
        console.error('Error fetching analytics details:', err);
        setErrorMsg('Failed to load performance metrics from the server.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, currentPage]);

  useEffect(() => {
    if (sessions.length > 0) {
      const avg = sessions.reduce((sum, s) => sum + s.averageScore, 0) / sessions.length;
      const baseScore = Math.round(avg * 10); // scale 1-10 to 1-100
      
      setRadarData([
        { subject: 'Coding', A: Math.min(100, Math.max(40, baseScore + 5)), B: 80, fullMark: 100 },
        { subject: 'Communication', A: Math.min(100, Math.max(40, baseScore - 3)), B: 75, fullMark: 100 },
        { subject: 'Logic', A: Math.min(100, Math.max(40, baseScore + 8)), B: 85, fullMark: 100 },
        { subject: 'System Design', A: Math.min(100, Math.max(40, baseScore - 6)), B: 70, fullMark: 100 },
        { subject: 'Pacing', A: Math.min(100, Math.max(40, baseScore + 2)), B: 78, fullMark: 100 },
      ]);
    } else {
      setRadarData([
        { subject: 'Coding', A: 75, B: 80, fullMark: 100 },
        { subject: 'Communication', A: 70, B: 75, fullMark: 100 },
        { subject: 'Logic', A: 80, B: 85, fullMark: 100 },
        { subject: 'System Design', A: 65, B: 70, fullMark: 100 },
        { subject: 'Pacing', A: 72, B: 78, fullMark: 100 },
      ]);
    }
  }, [sessions]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/login');
    }
  };

  const toggleSession = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  // Date formatters
  const formatDateShort = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recent';
    }
  };

  const formatDateFull = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Recent';
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const renderFeedback = (feedbackStr: string) => {
    try {
      if (!feedbackStr) return <p className="text-on-surface-variant italic">No feedback provided.</p>;
      const parsed = JSON.parse(feedbackStr);
      return (
        <div className="space-y-3 mt-2">
          {parsed.goodPoints && parsed.goodPoints.length > 0 && (
            <div>
              <p className="font-bold text-green-700 flex items-center gap-1.5 text-body-sm">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Key Strengths:
              </p>
              <ul className="list-disc pl-5 text-on-surface-variant text-body-sm space-y-1">
                {parsed.goodPoints.map((gp: string, idx: number) => (
                  <li key={idx}>{gp}</li>
                ))}
              </ul>
            </div>
          )}
          {parsed.improvements && parsed.improvements.length > 0 && (
            <div className="mt-2">
              <p className="font-bold text-primary flex items-center gap-1.5 text-body-sm">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                Areas for Improvement:
              </p>
              <ul className="list-disc pl-5 text-on-surface-variant text-body-sm space-y-1">
                {parsed.improvements.map((imp: string, idx: number) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <p className="text-on-surface-variant">{feedbackStr}</p>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-white text-3xl">query_stats</span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md animate-pulse">
            Verifying candidate profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Common Layout Skeletons (rendered on server/initial mount to prevent layout shift)
  const renderSidebar = () => (
    <aside className="fixed left-0 top-0 bottom-0 z-40 py-stack-md bg-surface-container-low w-[280px] h-screen flex flex-col border-r border-outline-variant shrink-0">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
        </div>
        <div>
          <h1 className="font-title-lg text-title-lg font-bold text-on-surface">PrepAI</h1>
          <p className="text-label-md text-on-surface-variant leading-none">Interview Pro</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <Link
          className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
          href="/dashboard"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
          href="/resume"
        >
          <span className="material-symbols-outlined">description</span>
          <span>Resume Analysis</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
          href="/interview"
        >
          <span className="material-symbols-outlined">keyboard_voice</span>
          <span>Mock Interview</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
          href="/quizzes"
        >
          <span className="material-symbols-outlined">quiz</span>
          <span>Practice Quizzes</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-6 py-3 text-primary bg-white border-l-4 border-primary font-label-md text-label-md transition-opacity active:opacity-80"
          href="/performance"
        >
          <span className="material-symbols-outlined">query_stats</span>
          <span>Performance</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
          href="/settings"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="font-label-md text-label-md text-primary font-bold mb-2">Upgrade to Pro</p>
          <p className="text-label-sm text-on-surface-variant mb-3">
            Get unlimited AI mock interviews and deep analytics.
          </p>
          <button className="w-full bg-primary text-white py-2 rounded-lg font-label-md text-label-md hover:shadow-md transition-shadow cursor-pointer">
            Go Premium
          </button>
        </div>
      </div>
    </aside>
  );

  const renderHeader = () => (
    <header className="flex justify-between items-center px-margin-desktop h-16 w-full bg-surface border-b border-outline-variant shadow-sm shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search sessions or roles..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:bg-surface-container rounded-full p-2 transition-transform active:scale-90 cursor-pointer relative text-on-surface-variant hover:text-on-surface flex items-center justify-center"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-outline-variant rounded-2xl shadow-xl z-50 p-4 animate-fade-in text-left">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                <span className="font-bold text-xs text-on-surface">Notifications</span>
                <button 
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-[10px] text-primary font-semibold hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="mt-2 divide-y divide-outline-variant/40 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="py-2.5 space-y-0.5">
                    <p className={`text-xs ${n.read ? 'text-on-surface-variant/85' : 'text-on-surface font-semibold'}`}>
                      {n.text}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/50">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
          <div className="text-right">
            <p className="font-label-md text-label-md font-bold text-on-surface">{user.name}</p>
            <p className="text-label-sm text-on-surface-variant">Candidate</p>
          </div>
          <img
            className="w-10 h-10 rounded-full border-2 border-primary/10 object-cover"
            alt={user.name}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOrDsg6CEj5eP4JDM_abjnygT_NxCQsNTeRF_t2OYPIB69dsnuC2qoDMOVjrL8UOBkTDwtqKXu3ZIopLkHN1T4Mnts2oTRNB0rg3UK8uz4bWeE8u8YTRrV1__h7Ddr_W72WFFLNi6qqz9uITTqdT5IxsJVsL7OLKG88rhcPw29MkXEMqCGVQP6AfT9CFz2rSC5gBLn_l9vMRInnd6lquIYEw1YWQ1z8fCnCkaMG0PqcLM7tJAmNRZzAOVX6Ja47I-MDlbCwh8J6xU"
          />
          <button
            onClick={handleLogout}
            className="ml-2 p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant hover:text-error transition-colors cursor-pointer"
            title="Logout"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </header>
  );

  // Return SSR fallback during hydration
  if (!isMounted) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex">
        {renderSidebar()}
        <main className="ml-[280px] min-h-screen flex-1 flex flex-col">
          {renderHeader()}
          <div className="p-margin-desktop max-w-container-max mx-auto w-full flex-1">
            <div className="h-10 w-48 bg-surface-container rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-12 gap-gutter mb-stack-xl">
              <div className="col-span-8 h-80 bg-white rounded-xl border border-outline-variant animate-pulse"></div>
              <div className="col-span-4 h-80 bg-white rounded-xl border border-outline-variant animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* Sidebar Navigation */}
      {renderSidebar()}

      {/* Main Content Area */}
      <main className="ml-[280px] min-h-screen flex-1 flex flex-col">
        {/* Top Header Bar */}
        {renderHeader()}

        {/* Analytics Main Canvas */}
        <div className="p-margin-desktop max-w-container-max mx-auto w-full flex-1">
          
          {/* Section Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Performance Analytics</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Track your practice growth, ATS resume enhancements, and category breakdown.</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-white border border-outline-variant px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Last 30 Days
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:shadow-md transition-shadow flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Report
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 text-body-md">
              {errorMsg}
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-gutter mb-stack-xl">
            
            {/* Chart 1: Score Trend Over Time (col-span-6) */}
            <div className="col-span-12 lg:col-span-6 bg-white rounded-xl shadow-sm border border-outline-variant p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Score Trend Over Time</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Progression over last 10 mock sessions (0 - 10 scale)</p>
                </div>
                {trendData.length > 1 && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-2 py-1 rounded">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span className="font-label-md text-label-md">Growth Trended</span>
                  </div>
                )}
              </div>

              {dataLoading ? (
                <div className="h-64 bg-surface-container rounded animate-pulse"></div>
              ) : trendData.length === 0 ? (
                // Empty state for trend chart
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-outline-variant text-4xl mb-3">stacked_line_chart</span>
                  <p className="font-title-lg text-title-lg font-medium mb-1">No Practice Sessions Yet</p>
                  <p className="text-body-md text-on-surface-variant max-w-sm mb-4">
                    Complete your first mock interview to see your progress
                  </p>
                  <Link href="/interview" className="px-5 py-2 bg-primary text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity">
                    Start Mock Interview
                  </Link>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData.slice(-10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDateShort} 
                        tick={{ fontSize: 11, fill: '#777587' }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        tick={{ fontSize: 11, fill: '#777587' }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e2e2' }} 
                        labelFormatter={(label) => formatDateFull(label as string)}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3525cd" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Chart 2: Category Strengths Radar Chart (col-span-6) */}
            <div className="col-span-12 lg:col-span-6 bg-white rounded-xl shadow-sm border border-outline-variant p-6">
              <h3 className="font-title-lg text-title-lg text-on-surface font-bold mb-1">Interview Skills Competencies</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">Competency mapping (Coding, Communication, Logic, System Design, Pacing)</p>
              
              {dataLoading ? (
                <div className="h-64 bg-surface-container rounded animate-pulse"></div>
              ) : radarData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-outline-variant text-4xl mb-3">analytics</span>
                  <p className="text-body-md text-on-surface-variant">Perform mock interviews to generate your competency map.</p>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#777587', fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Your Profile" dataKey="A" stroke="#3525cd" fill="#3525cd" fillOpacity={0.25} />
                      <Radar name="Target Profile" dataKey="B" stroke="#4b4dd8" fill="#4b4dd8" fillOpacity={0.05} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e2e2' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Lower Section: Resume ATS Score History & Past Sessions List */}
          <div className="grid grid-cols-12 gap-gutter mb-stack-xl">
            
            {/* Resume Score History (col-span-4) */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm border border-outline-variant p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Resume Score History</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant">ATS tracking over multiple uploads</p>
              </div>

              {dataLoading ? (
                <div className="h-48 bg-surface-container rounded animate-pulse"></div>
              ) : resumeData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-outline-variant text-4xl mb-3">upload_file</span>
                  <p className="text-body-md text-on-surface-variant mb-4">No resumes analyzed yet</p>
                  <Link href="/resume" className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors">
                    Upload Resume
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                    {resumeData.map((res, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-surface-container-lowest border border-outline-variant rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-secondary text-[20px]">description</span>
                          <div>
                            <p className="font-body-md text-body-md font-bold text-on-surface">ATS Optimization</p>
                            <p className="text-label-sm text-on-surface-variant">{formatDateFull(res.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2.5 py-1 text-label-md font-bold rounded-md border ${
                            res.atsScore >= 85 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : res.atsScore >= 70 
                              ? 'bg-primary/5 text-primary border-primary/10' 
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {res.atsScore}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline-variant">
                    <Link href="/resume" className="text-primary font-label-md text-label-md hover:underline flex items-center justify-center gap-1">
                      Upload New Resume
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Past Sessions List with Collapsible Details (col-span-8) */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Past Mock Interviews</h3>
                <span className="text-label-sm text-on-surface-variant">Click row to expand feedback</span>
              </div>

              {dataLoading ? (
                <div className="p-6 space-y-4 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 bg-surface-container rounded"></div>
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center flex-1">
                  <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">chat</span>
                  <h4 className="font-title-lg text-title-lg text-on-surface font-semibold mb-1">No Sessions Logged</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">
                    Complete your first simulated AI mock interview session to review score analytics and responses.
                  </p>
                  <Link href="/interview" className="px-5 py-2.5 bg-primary text-white font-title-lg rounded-lg hover:opacity-90 transition-opacity">
                    Start Mock Practice
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low border-b border-outline-variant">
                        <tr>
                          <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">DATE</th>
                          <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">ROLE / CATEGORY</th>
                          <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">QUESTIONS</th>
                          <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">SCORE</th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {sessions.filter(s => s.role.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.averageScore).includes(searchQuery)).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant font-body-md">
                              No matching mock sessions found.
                            </td>
                          </tr>
                        ) : (
                          sessions
                            .filter(s => s.role.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.averageScore).includes(searchQuery))
                            .map((session) => {
                          const isExpanded = expandedSessionId === session._id;
                          return (
                            <React.Fragment key={session._id}>
                              <tr 
                                onClick={() => toggleSession(session._id)}
                                className="hover:bg-surface-container transition-colors group cursor-pointer"
                              >
                                <td className="px-6 py-4">
                                  <p className="font-body-md text-body-md font-medium text-on-surface">{formatDateFull(session.createdAt)}</p>
                                  <p className="font-label-sm text-label-sm text-on-surface-variant">{formatTime(session.createdAt)}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                                    <span className="font-body-md text-body-md font-bold">{session.role}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-body-md text-body-md">
                                  {session.questions ? session.questions.length : 0} Qs
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-title-lg text-primary font-bold">{session.averageScore}</span>
                                    <span className="text-on-surface-variant text-label-sm">/ 10</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-primary font-label-md text-label-md group-hover:underline flex items-center gap-1">
                                    {isExpanded ? 'Hide' : 'Expand'}
                                    <span className="material-symbols-outlined text-[18px]">
                                      {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                    </span>
                                  </button>
                                </td>
                              </tr>
                              
                              {/* Expanded Panel */}
                              {isExpanded && (
                                <tr>
                                  <td colSpan={5} className="bg-surface-container-lowest p-6 border-b border-outline-variant">
                                    <div className="space-y-6">
                                      <h4 className="font-title-lg text-title-lg font-bold text-primary mb-3">AI Evaluation Breakdown</h4>
                                      {session.questions && session.questions.map((q, idx) => (
                                        <div key={idx} className="p-4 bg-surface rounded-xl border border-outline-variant space-y-3">
                                          <div className="flex justify-between items-start">
                                            <p className="font-body-md text-body-md font-bold text-on-surface">
                                              Q{idx + 1}: {q.question}
                                            </p>
                                            <span className={`px-2.5 py-0.5 text-label-sm font-bold rounded-md border ${
                                              q.score >= 8 
                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                : q.score >= 6 
                                                ? 'bg-primary/5 text-primary border-primary/10' 
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                              Score: {q.score}/10
                                            </span>
                                          </div>
                                          
                                          <div className="text-body-md text-on-surface-variant pl-2 border-l-2 border-outline">
                                            <p className="italic mb-2">" {q.answer} "</p>
                                          </div>

                                          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-body-md">
                                            <p className="font-bold text-primary mb-1 flex items-center gap-1">
                                              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                                              AI Coach Feedback
                                            </p>
                                            {renderFeedback(q.feedback)}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        }))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} sessions total)
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={pagination.currentPage === 1}
                          className="px-3 py-1 border border-outline-variant rounded hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Previous
                        </button>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="px-3 py-1 border border-outline-variant rounded hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer layout */}
        <footer className="mt-auto flex flex-col md:flex-row justify-between items-center px-margin-desktop py-6 border-t border-outline-variant/40 bg-surface shrink-0">
          <div className="mb-4 md:mb-0">
            <p className="font-semibold text-[10px] text-on-surface-variant/80">
              © {new Date().getFullYear()} PrepAI. Designed for outstanding candidates.
            </p>
          </div>
          <div className="flex gap-6">
            <Link className="font-semibold text-[10px] text-on-surface-variant/80 hover:text-primary transition-all" href="/terms">
              Terms
            </Link>
            <Link className="font-semibold text-[10px] text-on-surface-variant/80 hover:text-primary transition-all" href="/privacy">
              Privacy
            </Link>
            <Link className="font-semibold text-[10px] text-on-surface-variant/80 hover:text-primary transition-all" href="/contact">
              Contact
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
