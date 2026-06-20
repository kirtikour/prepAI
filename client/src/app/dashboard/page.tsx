'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface DashboardStats {
  resumeScore: number | null;
  interviewCount: number;
  averageScore: number;
}

interface ActivityItem {
  id: string;
  type: 'resume' | 'interview';
  title: string;
  timestamp: string;
  score: number;
  scoreText: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Search & Notifications State
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to PrepAI! Supercharge your preparation.', time: '2 hours ago', read: false },
    { id: 2, text: 'ATS Score optimization complete for resume_alex_cv.pdf', time: '1 day ago', read: false },
    { id: 3, text: 'Mock interview session: "Senior Frontend Engineer" graded 85%.', time: '1 day ago', read: true }
  ]);

  // Authentication protection redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);
        setStatsError(null);

        // Fetch stats
        const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
          credentials: 'include',
        });
        const statsData = await statsRes.json();

        // Fetch activity
        const activityRes = await fetch('http://localhost:5000/api/dashboard/activity', {
          credentials: 'include',
        });
        const activityData = await activityRes.json();

        if (statsRes.ok && statsData.success) {
          setStats(statsData.stats);
        } else {
          setStatsError(statsData.message || 'Failed to load stats');
        }

        if (activityRes.ok && activityData.success) {
          setActivities(activityData.activities);
        }
      } catch (err) {
        console.error('Error fetching dashboard details:', err);
        setStatsError('Failed to connect to backend server for statistics.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/login');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md animate-pulse">
            Verifying candidate profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting in useEffect
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHrs < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins}m ago`;
      }
      if (diffHrs < 24) {
        return `${diffHrs} hours ago`;
      }
      if (diffHrs < 48) {
        return 'Yesterday';
      }
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  const filteredActivities = activities.filter((act) =>
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.scoreText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 py-stack-md bg-surface-container-low w-[280px] h-screen flex flex-col border-r border-outline-variant">
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
          {/* Dashboard (Active) */}
          <Link
            className="flex items-center gap-3 px-6 py-3 text-primary bg-white border-l-4 border-primary font-label-md text-label-md transition-opacity active:opacity-80"
            href="/dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          {/* Inactive Links */}
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
            className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
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

      {/* Main Content Wrapper */}
      <main className="ml-[280px] min-h-screen flex-1 flex flex-col">
        {/* TopAppBar */}
        <header className="flex justify-between items-center px-margin-desktop h-16 w-full bg-surface border-b border-outline-variant shadow-sm shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search recent activity..."
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
                className="hover:bg-surface-container rounded-full p-2 transition-transform active:scale-90 cursor-pointer relative text-on-surface-variant hover:text-on-surface"
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

        {/* Dashboard Content */}
        <div className="p-margin-desktop max-w-container-max mx-auto w-full flex-1">
          {/* Welcome Hero */}
          <section className="mb-stack-xl">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl">
              <div className="relative z-10">
                <h2 className="font-headline-lg text-headline-lg mb-2">Welcome back, {user.name}!</h2>
                <p className="text-body-lg text-white/80 max-w-xl">
                  {stats && stats.interviewCount > 0
                    ? `You've completed ${stats.interviewCount} practice sessions. Your performance is trending up! Ready for your next mock interview?`
                    : 'Get started by uploading your resume or practicing your first mock interview with our AI Coach.'}
                </p>
                <Link
                  href="/interview"
                  className="mt-6 px-6 py-3 bg-white text-primary rounded-lg font-title-lg transition-transform active:scale-95 inline-flex items-center gap-2 hover:opacity-90"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Start New Interview
                </Link>
              </div>
              {/* Decorative Abstract AI Pattern */}
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
            </div>
          </section>

          {/* Quick Stats Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-xl">
            {/* Card 1 - Interviews Completed */}
            <div className="glass-card p-6 rounded-xl stat-card-glow shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    fact_check
                  </span>
                </div>
                {stats && stats.interviewCount > 0 && (
                  <span className="text-label-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                Interviews Completed
              </h3>
              {dataLoading ? (
                <div className="h-14 w-24 bg-surface-container-high rounded animate-pulse mt-2"></div>
              ) : (
                <p className="font-display-lg text-display-lg text-on-surface">
                  {stats ? stats.interviewCount : 0}
                </p>
              )}
            </div>

            {/* Card 2 - Average Score */}
            <div className="glass-card p-6 rounded-xl stat-card-glow shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    equalizer
                  </span>
                </div>
                {stats && stats.averageScore > 0 && (
                  <span className="text-label-sm text-primary bg-primary/5 px-2 py-1 rounded-full font-bold">
                    {stats.averageScore >= 85 ? 'Top 10%' : 'Good Progress'}
                  </span>
                )}
              </div>
              <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                Avg Score
              </h3>
              {dataLoading ? (
                <div className="h-14 w-24 bg-surface-container-high rounded animate-pulse mt-2"></div>
              ) : (
                <p className="font-display-lg text-display-lg text-on-surface">
                  {stats && stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}
                </p>
              )}
            </div>

            {/* Card 3 - Resume Score */}
            <div className="glass-card p-6 rounded-xl stat-card-glow shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    description
                  </span>
                </div>
                {stats && stats.resumeScore !== null && (
                  <span
                    className={`text-label-sm px-2 py-1 rounded-full font-bold ${
                      stats.resumeScore >= 80
                        ? 'text-green-600 bg-green-50'
                        : 'text-orange-600 bg-orange-50'
                    }`}
                  >
                    {stats.resumeScore >= 80 ? 'Optimized' : 'Needs Review'}
                  </span>
                )}
              </div>
              <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                Resume Score
              </h3>
              {dataLoading ? (
                <div className="h-14 w-24 bg-surface-container-high rounded animate-pulse mt-2"></div>
              ) : (
                <p className="font-display-lg text-display-lg text-on-surface">
                  {stats && stats.resumeScore !== null ? stats.resumeScore : 'N/A'}
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity & AI Insights */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Recent Activity Feed */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-xl shadow-md border border-outline-variant overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-title-lg text-title-lg text-on-surface">Recent Activity</h3>
                  {activities.length > 0 && (
                    <button className="text-primary font-label-md text-label-md hover:underline cursor-pointer">
                      View All History
                    </button>
                  )}
                </div>
                <div className="divide-y divide-outline-variant">
                  {dataLoading ? (
                    // Skeletons
                    [1, 2, 3].map((n) => (
                      <div key={n} className="px-6 py-5 flex items-center animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-surface-container mr-4"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-surface-container-high rounded w-2/3"></div>
                          <div className="h-3 bg-surface-container-high rounded w-1/3"></div>
                        </div>
                        <div className="h-8 w-12 bg-surface-container-high rounded"></div>
                      </div>
                    ))
                  ) : activities.length === 0 ? (
                    // Empty State
                    <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">
                        history
                      </span>
                      <h4 className="font-title-lg text-title-lg text-on-surface font-semibold mb-1">
                        No activity yet
                      </h4>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                        Analyze your resume or take a mock interview session to see your recent activities here.
                      </p>
                      <div className="flex gap-4 mt-6">
                        <Link
                          href="/resume"
                          className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors"
                        >
                          Upload CV
                        </Link>
                        <Link
                          href="/interview"
                          className="px-4 py-2 bg-primary text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Mock Interview
                        </Link>
                      </div>
                    </div>
                  ) : filteredActivities.length === 0 ? (
                    // Filtered Empty State
                    <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">
                        search_off
                      </span>
                      <h4 className="font-title-lg text-title-lg text-on-surface font-semibold mb-1">
                        No results found
                      </h4>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                        No activities match your search query "{searchQuery}".
                      </p>
                    </div>
                  ) : (
                    // Dynamic Items
                    filteredActivities.map((act) => (
                      <div
                        key={act.id}
                        className="px-6 py-4 flex items-center hover:bg-surface-container-low transition-colors group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-4">
                          <span
                            className={`material-symbols-outlined ${
                              act.type === 'interview' ? 'text-primary' : 'text-secondary'
                            }`}
                          >
                            {act.type === 'interview' ? 'keyboard_voice' : 'description'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-body-md font-bold text-on-surface">
                            {act.title}
                          </p>
                          <p className="text-label-md text-on-surface-variant">
                            {formatDate(act.timestamp)} • {act.type === 'interview' ? 'Duration: 45m' : 'AI Analysis'}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p
                              className={`font-body-md text-body-md font-bold ${
                                act.score >= 85
                                  ? 'text-green-600'
                                  : act.score >= 70
                                  ? 'text-primary'
                                  : 'text-orange-500'
                              }`}
                            >
                              {act.score}%
                            </p>
                            <p className="text-label-sm text-on-surface-variant">{act.scoreText}</p>
                          </div>
                          <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
                            chevron_right
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-surface-container-lowest rounded-xl shadow-md border border-primary/20 p-6 relative overflow-hidden">
                {/* AI Sparkle Icon */}
                <div className="absolute -right-4 -top-4 text-primary/10 select-none">
                  <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    <h3 className="font-title-lg text-title-lg font-bold">AI Insight</h3>
                  </div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
                    {stats && stats.interviewCount > 0 ? (
                      <>
                        Your communication scores in technical interviews are strong, but you tend to rush through{' '}
                        <span className="font-bold text-on-surface">Edge Case Analysis</span>.
                        <br />
                        <br />
                        <span className="italic text-on-surface">
                          "Try pausing for 10 seconds after hearing a prompt to structure your 'failure mode' response."
                        </span>
                      </>
                    ) : (
                      <>
                        We don't have enough data to generate communication insights yet. 
                        <br /><br />
                        Take a mock interview or run a quiz to let the AI analyze your answers, pace, and clarity.
                      </>
                    )}
                  </p>
                  <div className="space-y-3">
                    <p className="font-label-md text-label-md text-on-surface uppercase font-bold">
                      Next Recommended Step
                    </p>
                    <Link
                      href={stats && stats.interviewCount > 0 ? '/interview' : '/resume'}
                      className="bg-surface rounded-lg p-3 border border-outline-variant hover:border-primary transition-colors cursor-pointer group flex items-center justify-between"
                    >
                      <span className="text-body-md font-medium text-on-surface">
                        {stats && stats.interviewCount > 0 ? 'Practice Edge Case Drill' : 'Analyze First Resume'}
                      </span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="mt-6 bg-white rounded-xl shadow-md border border-outline-variant p-6 h-64 flex flex-col items-center justify-center text-center">
                <p className="text-label-md text-on-surface-variant font-bold uppercase mb-4">Score Trends</p>
                <div className="w-full flex-1 flex items-end gap-2 px-2">
                  <div className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary" style={{ height: '40%' }}></div>
                  <div className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary" style={{ height: '65%' }}></div>
                  <div className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary" style={{ height: '55%' }}></div>
                  <div className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary" style={{ height: '85%' }}></div>
                  <div className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary" style={{ height: '70%' }}></div>
                  <div className="flex-1 bg-primary rounded-t-sm shadow-lg" style={{ height: stats && stats.interviewCount > 0 ? '92%' : '20%' }}></div>
                </div>
                <p className="mt-4 text-label-sm text-on-surface-variant">Progress over last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
