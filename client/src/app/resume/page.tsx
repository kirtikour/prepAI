'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { API_BASE_URL } from '@/config';

const JOB_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'AI/ML Engineer',
  'Product Manager',
  'DevOps Engineer',
  'UI/UX Designer',
  'Data Engineer',
  'Mobile Developer',
  'QA Engineer',
  'Security Engineer',
  'Cloud Architect',
  'Systems Administrator'
];

interface ResumeAnalysis {
  _id: string;
  fileUrl: string;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
}

export default function ResumePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState(JOB_ROLES[0]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Fix Modal States
  const [activeFix, setActiveFix] = useState<{ weakness: string; suggestion: string } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [applyingFix, setApplyingFix] = useState(false);

  // Search & Notifications State
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to PrepAI! Supercharge your preparation.', time: '2 hours ago', read: false },
    { id: 2, text: 'ATS Score optimization complete for resume_alex_cv.pdf', time: '1 day ago', read: false },
    { id: 3, text: 'Mock interview session: "Senior Frontend Engineer" graded 85%.', time: '1 day ago', read: true }
  ]);

  const handleApplyFix = (weakness: string) => {
    let suggestion = "Optimized application structure and resolved performance bottlenecks.";
    const lowerWeak = weakness.toLowerCase();
    if (lowerWeak.includes("quantifiable") || lowerWeak.includes("outcomes") || lowerWeak.includes("percentages")) {
      suggestion = "Redesigned SQL database indexing and query patterns, reducing API search latency by 35% and supporting 5,000+ concurrent requests.";
    } else if (lowerWeak.includes("format") || lowerWeak.includes("month") || lowerWeak.includes("consistent")) {
      suggestion = "Standardized date formats to 'MMM YYYY' (e.g. Jun 2025) across all work history entries for visual consistency.";
    } else if (lowerWeak.includes("generic") || lowerWeak.includes("summary")) {
      suggestion = "Highly motivated Full-Stack Developer with 3+ years of experience building scalable MERN web applications, co-authoring published AI research, and optimizing database performance.";
    } else if (lowerWeak.includes("skills") || lowerWeak.includes("keywords") || lowerWeak.includes("match")) {
      suggestion = "Acquired hands-on experience in React.js, Next.js, Node.js, Express.js, MongoDB, TypeScript, Docker, and PyTorch.";
    }

    setActiveFix({
      weakness,
      suggestion,
    });
  };

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch latest resume on mount to show historical results if any
  useEffect(() => {
    if (!user) return;
    const fetchLatestResume = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resume/latest`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAnalysisResult(data.resume);
        }
      } catch (err) {
        console.error('Failed to load latest resume:', err);
      }
    };
    fetchLatestResume();
  }, [user]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/login');
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndUploadFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndUploadFile(file);
    }
  };

  const validateAndUploadFile = (file: File) => {
    setError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Unsupported file type. Please upload a PDF or DOCX file only.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Max allowed size is 10MB.');
      return;
    }

    uploadAndAnalyze(file);
  };

  const uploadAndAnalyze = (file: File) => {
    setAnalyzing(true);
    setUploadProgress(10); // Start progress bar

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobTitle', jobTitle);

    // Simulate progress increments during upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/resume/upload`, true);
    xhr.withCredentials = true;

    xhr.onload = () => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(async () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status === 201 && response.success) {
            setAnalysisResult(response.resume);
          } else {
            setError(response.message || 'AI resume analysis failed.');
          }
        } catch (e) {
          setError('Failed to parse analysis response from backend.');
        } finally {
          setAnalyzing(false);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }, 500);
    };

    xhr.onerror = () => {
      clearInterval(progressInterval);
      setError('Network communication failed. Please verify the backend is running.');
      setAnalyzing(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    xhr.send(formData);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md animate-pulse">
            Loading candidate details...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Circular progress math
  // Total circumference: 2 * PI * 88 = 552.92
  const score = analysisResult ? analysisResult.atsScore : 0;
  const strokeDashoffset = 552.92 - (552.92 * score) / 100;

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
          <Link
            className="flex items-center gap-3 px-6 py-3 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors active:opacity-80"
            href="/dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-6 py-3 text-primary bg-white border-l-4 border-primary font-label-md text-label-md transition-opacity active:opacity-80"
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
        <header className="flex justify-between items-center px-margin-desktop h-16 w-full bg-surface border-b border-outline-variant sticky top-0 z-30 shrink-0">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-body-md transition-all"
                placeholder="Search improvements or action items..."
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

        {/* Main Content Canvas */}
        <div className="flex-1 p-margin-desktop space-y-stack-lg max-w-container-max mx-auto w-full">
          {/* Target Job Title Input before uploading */}
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-title-lg text-title-lg text-on-surface mb-1">Target Job Information</h3>
              <p className="text-body-md text-on-surface-variant">
                Enter your targeted role so the AI tailors the ATS scan parameters and keywords.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
              <div className="w-full md:w-64">
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  disabled={analyzing}
                >
                  {JOB_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              {analysisResult && (
                <button
                  onClick={() => {
                    setAnalysisResult(null);
                    setError(null);
                  }}
                  className="w-full md:w-auto px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg font-label-md hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0 animate-fade-in"
                >
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                  Upload New
                </button>
              )}
            </div>
          </div>

          {/* Hero Upload Zone */}
          {!analysisResult && (
            <section
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`bg-white rounded-xl border-2 border-dashed p-stack-xl flex flex-col items-center text-center space-y-4 hover:border-primary transition-colors cursor-pointer group relative overflow-hidden ${
                dragActive ? 'border-primary bg-primary/5' : 'border-outline-variant'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                disabled={analyzing}
              />

              <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
              </div>

              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Upload Your Resume</h2>
                <p className="text-on-surface-variant max-w-md mx-auto mt-2">
                  Drag and drop your PDF or DOCX file here to receive an instant AI-powered ATS analysis and improvement suggestions.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md hover:shadow-md transition-all cursor-pointer"
                >
                  Select File
                </button>
              </div>
              <p className="font-label-sm text-label-sm text-outline">Supported formats: PDF, DOCX (Max 10MB)</p>
            </section>
          )}

          {/* Uploading / Analyzing progress indicator */}
          {analyzing && (
            <div className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm flex flex-col items-center justify-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center space-y-1">
                <h3 className="font-title-lg text-title-lg font-semibold text-on-surface">
                  {uploadProgress < 100 ? 'Uploading resume...' : 'Analyzing resume with AI...'}
                </h3>
                <p className="text-body-md text-on-surface-variant max-w-xs mx-auto">
                  Extracting text structure and matching keywords for the {jobTitle} role. This may take up to a minute.
                </p>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full max-w-md bg-surface-container rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {/* Error Message Display */}
          {error && (
            <div className="p-stack-md bg-error/5 rounded-xl border border-error/20 flex gap-3 items-start animate-fade-in">
              <span className="material-symbols-outlined text-error text-xl">error</span>
              <p className="font-body-md text-body-md text-error leading-relaxed">{error}</p>
            </div>
          )}

          {/* Analysis Dashboard Section */}
          {analysisResult && !analyzing && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Left Column: PDF Resume Visualizer (col-span-5) */}
              <div className="xl:col-span-5 bg-white rounded-xl border border-outline-variant p-4 shadow-sm flex flex-col h-[750px] xl:sticky xl:top-20">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">picture_as_pdf</span>
                    <span className="font-bold text-sm text-on-surface">Resume Preview</span>
                  </div>
                  <a
                    href={analysisResult.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    Open Fullscreen
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
                <div className="flex-1 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/60 relative min-h-[400px]">
                  {analysisResult.fileUrl.toLowerCase().includes('.pdf') ? (
                    <iframe
                      src={`${analysisResult.fileUrl}#toolbar=0&navpanes=0`}
                      className="w-full h-full border-none"
                      title="Uploaded Resume PDF"
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-on-surface-variant gap-3">
                      <span className="material-symbols-outlined text-4xl text-outline-variant">draft</span>
                      <p className="font-bold text-sm">DOCX Document Uploaded</p>
                      <p className="text-xs max-w-xs leading-relaxed">
                        Visual preview is optimized for PDF format. You can still download and view the document using the button below.
                      </p>
                      <a
                        href={analysisResult.fileUrl}
                        download
                        className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm animate-fade-in"
                      >
                        <span className="material-symbols-outlined text-xs">download</span>
                        Download Document
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Analysis Metrics (col-span-7) */}
              <div className="xl:col-span-7 space-y-6">
                {/* Row 1: ATS Score & Keywords (Horizontal Alignment) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Card 1: ATS Score */}
                  <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col justify-between min-h-[280px]">
                    <div>
                      <div className="flex items-center gap-2 border-b border-outline-variant pb-2 mb-4 w-full">
                        <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                        <span className="font-label-md uppercase tracking-wider text-primary font-bold text-sm flex-1">ATS Score</span>
                        <span className="material-symbols-outlined text-on-surface-variant cursor-help text-[20px]" title="ATS compatibility score out of 100">info</span>
                      </div>
                      
                      <div className="relative flex items-center justify-center py-2">
                        <svg className="w-32 h-32" viewBox="0 0 144 144" width="144" height="144">
                          <circle
                            className="text-gray-200"
                            cx="72"
                            cy="72"
                            fill="transparent"
                            r="64"
                            stroke="currentColor"
                            strokeWidth="8"
                          ></circle>
                          <circle
                            className="text-primary"
                            cx="72"
                            cy="72"
                            fill="transparent"
                            r="64"
                            stroke="currentColor"
                            strokeDasharray="402.12"
                            strokeDashoffset={402.12 - (402.12 * score) / 100}
                            strokeLinecap="round"
                            strokeWidth="8"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-display-md text-display-md text-primary font-bold text-3xl">{score}</span>
                          <span className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-widest mt-0.5">
                            Out of 100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-2 pt-2 border-t border-outline-variant/30">
                      <p className="font-body-md text-on-surface-variant text-sm">
                        Resume is{' '}
                        <span className="text-primary font-bold">{score >= 80 ? 'Strong' : 'Needs Review'}</span>.
                        <span className="block text-[11px] mt-0.5 text-on-surface-variant/80">
                          {score >= 80 ? 'High compatibility!' : 'Fix weaknesses next.'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Keywords */}
                  <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col min-h-[280px]">
                    <div className="flex items-center gap-2 text-tertiary font-bold mb-4 border-b border-outline-variant pb-2 shrink-0">
                      <span className="material-symbols-outlined text-purple-600">key</span>
                      <span className="font-label-md uppercase tracking-wider text-purple-700 text-sm">Missing Keywords</span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1">
                      {analysisResult.missingKeywords.length === 0 ? (
                        <p className="text-body-md text-green-600 font-semibold text-sm">
                          All targeted keywords present! Outstanding match for {jobTitle}.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-body-md text-on-surface-variant text-sm">
                            Incorporate these keywords into your experience section to boost match rate:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.missingKeywords.map((kw, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-label-md text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
                              >
                                + {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Strengths (Full Width, Horizontal List) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary font-bold border-b border-outline-variant pb-2 shrink-0">
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                    <span className="font-label-md uppercase tracking-wider text-green-700 text-sm">Strengths</span>
                  </div>
                  <div className="w-full">
                    {analysisResult.strengths.length === 0 ? (
                      <p className="text-body-md text-on-surface-variant text-sm">No distinct strengths identified.</p>
                    ) : (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.strengths.map((str, idx) => (
                          <li key={idx} className="flex gap-3 p-3.5 bg-green-50/30 border border-green-100/70 rounded-xl hover:shadow-sm transition-shadow">
                            <span className="text-green-600 font-bold text-base mt-0.5">•</span>
                            <p className="text-body-md text-green-950 text-sm leading-relaxed">{str}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Row 3: Weaknesses (Full Width, Horizontal List) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-error font-bold border-b border-outline-variant pb-2 shrink-0">
                    <span className="material-symbols-outlined text-red-600">warning</span>
                    <span className="font-label-md uppercase tracking-wider text-red-700 text-sm">Weaknesses</span>
                  </div>
                  <div className="w-full">
                    {analysisResult.weaknesses.length === 0 ? (
                      <p className="text-body-md text-green-600 font-semibold text-sm">
                        No critical weaknesses found! Excellent structure.
                      </p>
                    ) : (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.weaknesses.map((weak, idx) => (
                          <li key={idx} className="flex flex-col justify-between p-3.5 bg-red-50/30 border border-red-100/70 rounded-xl hover:shadow-sm transition-shadow min-h-[140px]">
                            <div className="flex gap-3">
                              <span className="text-red-600 font-bold text-base mt-0.5">•</span>
                              <p className="text-body-md text-red-950 text-sm leading-relaxed mb-4">{weak}</p>
                            </div>
                            <button 
                              onClick={() => handleApplyFix(weak)}
                              className="self-end text-xs text-primary font-semibold hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-outline-variant shadow-sm hover:bg-primary/5 active:scale-95 transition-all"
                            >
                              <span className="material-symbols-outlined text-xs">auto_awesome</span>
                              Auto-Fix
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Actionable Suggestions */}
                <section className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                  <div className="p-stack-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
                    <div>
                      <h3 className="font-title-lg text-title-lg">Improve Resume</h3>
                      <p className="text-body-md text-on-surface-variant">
                        Recommended steps to boost your ATS score to 90+ for {jobTitle}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        if (analysisResult.weaknesses.length > 0) {
                          handleApplyFix(analysisResult.weaknesses[0]);
                        }
                      }}
                      className="flex items-center gap-2 text-primary font-label-md hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      AI Auto-Fix
                    </button>
                  </div>
                  <div className="divide-y divide-outline-variant">
                    {analysisResult.weaknesses.filter(w => w.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                      <div className="p-stack-lg text-center text-on-surface-variant">
                        {searchQuery ? 'No matching action items found.' : 'Your resume matches formatting targets. No urgent action items.'}
                      </div>
                    ) : (
                      analysisResult.weaknesses
                        .filter(w => w.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((weakness, idx) => {
                        const icons = ['trending_up', 'format_list_bulleted', 'school', 'edit_note'];
                        const icon = icons[idx % icons.length];

                        return (
                          <div
                            key={idx}
                            className="p-stack-md flex items-start gap-4 hover:bg-surface-container-low transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-label-md text-on-surface font-semibold">
                                {idx === 0
                                  ? 'Quantify Experience Impact'
                                  : idx === 1
                                  ? 'Structure Formatting Consistency'
                                  : 'Include Core Certifications'}
                              </h4>
                              <p className="text-body-md text-on-surface-variant">{weakness}</p>
                            </div>
                            <button 
                              onClick={() => handleApplyFix(weakness)}
                              className="px-4 py-2 border border-outline-variant rounded-lg text-label-md group-hover:bg-white group-hover:shadow-sm cursor-pointer active:scale-95 transition-transform"
                            >
                              Apply Fix
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between items-center px-8 py-6 border-t border-outline-variant/40 mt-auto w-full">
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
      {/* AI Suggestion Fix Modal */}
      {activeFix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={() => !applyingFix && setActiveFix(null)}></div>
          <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl p-6 max-w-lg w-full relative z-10 space-y-4 animate-scale-up">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                <h3 className="font-title-lg text-title-lg font-bold">AI Suggested Fix</h3>
              </div>
              <button 
                onClick={() => !applyingFix && setActiveFix(null)}
                className="text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer"
                disabled={applyingFix}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            <div className="space-y-1">
              <span className="text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Identified Issue</span>
              <p className="text-body-md text-on-surface-variant font-medium">{activeFix.weakness}</p>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-label-sm text-primary uppercase font-bold tracking-wider">Recommended Revision</span>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-body-md relative group font-body-md">
                <p className="leading-relaxed">"{activeFix.suggestion}"</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => setActiveFix(null)}
                className="px-5 py-2.5 border border-outline-variant rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors"
                disabled={applyingFix}
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeFix.suggestion);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                className="px-5 py-2.5 border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors flex items-center gap-1.5"
                disabled={applyingFix}
              >
                <span className="material-symbols-outlined text-base">
                  {copySuccess ? 'check' : 'content_copy'}
                </span>
                {copySuccess ? 'Copied!' : 'Copy Suggestion'}
              </button>
              <button
                onClick={async () => {
                  if (!analysisResult) return;
                  setApplyingFix(true);
                  setError(null);
                  try {
                    const res = await fetch(`${API_BASE_URL}/api/resume/apply-fix`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        resumeId: analysisResult._id,
                        weakness: activeFix.weakness,
                        jobTitle,
                      }),
                      credentials: 'include',
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      setAnalysisResult(data.resume);
                      setActiveFix(null);
                    } else {
                      setError(data.message || 'Failed to apply fix.');
                    }
                  } catch (err) {
                    setError('Connection to server failed while applying fix.');
                  } finally {
                    setApplyingFix(false);
                  }
                }}
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-label-md hover:opacity-90 cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
                disabled={applyingFix}
              >
                {applyingFix ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Applying...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    Apply Fix
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
