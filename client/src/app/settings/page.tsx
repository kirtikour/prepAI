'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { API_BASE_URL } from '@/config';

export default function SettingsPage() {
  const { user, loading: authLoading, logout, checkUserStatus } = useAuth();
  const router = useRouter();

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference Form State
  const [defaultRole, setDefaultRole] = useState('Software Engineer');
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [geminiKeyOverride, setGeminiKeyOverride] = useState('');
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);

  // Status indicators
  const [profileLoading, setProfileLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [prefsLoading, setPrefsLoading] = useState(false);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to PrepAI! Supercharge your preparation.', time: '2 hours ago', read: false },
    { id: 2, text: 'ATS Score optimization complete for resume_alex_cv.pdf', time: '1 day ago', read: false },
    { id: 3, text: 'Mock interview session: "Senior Frontend Engineer" graded 85%.', time: '1 day ago', read: true }
  ]);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/login');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Profile details updated successfully!');
        await checkUserStatus(); // Refresh global auth context
      } else {
        showToast(data.message || 'Failed to update profile details.', 'error');
      }
    } catch (err) {
      showToast('Connection to server failed. Please try again.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast('Current password is required to verify changes.', 'error');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setSecurityLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.message || 'Failed to update password.', 'error');
      }
    } catch (err) {
      showToast('Connection to server failed.', 'error');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsLoading(true);

    // Save preferences to localStorage for this browser instance
    setTimeout(() => {
      localStorage.setItem('prepai_default_role', defaultRole);
      localStorage.setItem('prepai_webcam_enabled', String(webcamEnabled));
      localStorage.setItem('prepai_gemini_override', geminiKeyOverride);
      localStorage.setItem('prepai_newsletter_enabled', String(newsletterEnabled));
      
      showToast('Application preferences saved successfully!');
      setPrefsLoading(false);
    }, 800);
  };

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('prepai_default_role');
      const webcam = localStorage.getItem('prepai_webcam_enabled');
      const overrideKey = localStorage.getItem('prepai_gemini_override');
      const newsletter = localStorage.getItem('prepai_newsletter_enabled');

      if (role) setDefaultRole(role);
      if (webcam !== null) setWebcamEnabled(webcam === 'true');
      if (overrideKey) setGeminiKeyOverride(overrideKey);
      if (newsletter !== null) setNewsletterEnabled(newsletter === 'true');
    }
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md animate-pulse">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-error/5 text-error border-error/20'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <p className="font-semibold text-xs leading-relaxed">{toast.message}</p>
        </div>
      )}

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
            className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
            href="/performance"
          >
            <span className="material-symbols-outlined">query_stats</span>
            <span>Performance</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-6 py-3 text-primary bg-white border-l-4 border-primary font-label-md text-label-md transition-opacity active:opacity-80"
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
                placeholder="Search sessions, topics, or insights..."
                type="text"
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

        {/* Main Settings Canvas */}
        <div className="flex-1 p-8 lg:p-12 space-y-8 max-w-4xl mx-auto w-full py-10">
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight leading-none mb-2">Account Settings</h2>
            <p className="text-body-md text-on-surface-variant">
              Manage your personal credentials, communication preferences, and application settings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            
            {/* Card 1: Profile Settings */}
            <section className="bg-white rounded-3xl border border-outline-variant/60 p-8 shadow-sm space-y-6">
              <div className="border-b border-outline-variant/40 pb-4">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">person_outline</span>
                  Profile Details
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Update your public profile name and communication email.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
                <div>
                  <label className="block font-semibold text-xs text-on-surface mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md"
                    placeholder="Alex Johnson"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-xs text-on-surface mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md"
                    placeholder="alex@company.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {profileLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  Update Details
                </button>
              </form>
            </section>

            {/* Card 2: Security Settings */}
            <section className="bg-white rounded-3xl border border-outline-variant/60 p-8 shadow-sm space-y-6">
              <div className="border-b border-outline-variant/40 pb-4">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">lock_open</span>
                  Update Password
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Ensure your account uses a secure password.</p>
              </div>

              <form onSubmit={handleUpdateSecurity} className="space-y-5 max-w-lg">
                <div>
                  <label className="block font-semibold text-xs text-on-surface mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-xs text-on-surface mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-xs text-on-surface mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {securityLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  Update Password
                </button>
              </form>
            </section>

            {/* Card 3: App Preferences (Extra options) */}
            <section className="bg-white rounded-3xl border border-outline-variant/60 p-8 shadow-sm space-y-6">
              <div className="border-b border-outline-variant/40 pb-4">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  Application Preferences
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Tailor your default mock interview parameters and API settings.</p>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-6 max-w-lg">
                <div>
                  <label className="block font-semibold text-xs text-on-surface mb-2">Default Job Role</label>
                  <div className="relative">
                    <select
                      value={defaultRole}
                      onChange={(e) => setDefaultRole(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md appearance-none cursor-pointer"
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="AI/ML Engineer">AI/ML Engineer</option>
                      <option value="Product Manager">Product Manager</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                      arrow_drop_down
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
                  <div>
                    <span className="block font-bold text-xs text-on-surface">Enable Webcam by Default</span>
                    <span className="block text-[11px] text-on-surface-variant/90 mt-1 max-w-[280px] sm:max-w-[360px] leading-relaxed">
                      Turn on camera stream automatically when a mock session starts.
                    </span>
                  </div>
                  {/* Custom Toggle Switch Widget */}
                  <button
                    type="button"
                    onClick={() => setWebcamEnabled(!webcamEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      webcamEnabled ? 'bg-primary' : 'bg-outline-variant/60'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        webcamEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-xs text-on-surface mb-2">Gemini API Key Override (Optional)</label>
                  <input
                    type="password"
                    value={geminiKeyOverride}
                    onChange={(e) => setGeminiKeyOverride(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md"
                    placeholder="Enter custom GEMINI_API_KEY to override server key"
                  />
                  <span className="text-[10px] text-on-surface-variant/80 block mt-1.5 leading-normal">
                    Leave blank to use the secure, server-configured API key (recommended).
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
                  <div>
                    <span className="block font-bold text-xs text-on-surface">Email Newsletters</span>
                    <span className="block text-[11px] text-on-surface-variant/90 mt-1 max-w-[280px] sm:max-w-[360px] leading-relaxed">
                      Receive weekly interview prep hints and industry reports.
                    </span>
                  </div>
                  {/* Custom Toggle Switch Widget */}
                  <button
                    type="button"
                    onClick={() => setNewsletterEnabled(!newsletterEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      newsletterEnabled ? 'bg-primary' : 'bg-outline-variant/60'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        newsletterEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={prefsLoading}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {prefsLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  Save Preferences
                </button>
              </form>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between items-center px-8 py-6 border-t border-outline-variant/40 mt-auto w-full bg-white">
          <p className="font-semibold text-[10px] text-on-surface-variant/80">
            © {new Date().getFullYear()} PrepAI. Designed for outstanding candidates.
          </p>
          <div className="flex gap-6 mt-3 sm:mt-0">
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
