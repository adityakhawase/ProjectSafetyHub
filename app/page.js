'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertCircle, UserCircle, Lock, Mail, User, Building2, FileText, Send, CheckCircle, Clock, AlertTriangle, MessageSquare, LogOut, Plus, Filter, BarChart3, TrendingUp, Users, UserCheck, UserX, Crown, CheckSquare, GraduationCap, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRole, setSelectedRole] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [publicStats, setPublicStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '', name: '', branch: '', role: 'student', enrollmentNumber: '' });
  const [complaintForm, setComplaintForm] = useState({ title: '', description: '', category: '', branch: '', keepAnonymous: false, enrollmentNumber: '' });
  const [responseForm, setResponseForm] = useState({ response: '', status: '' });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [showCreatorsModal, setShowCreatorsModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  // Modern Auth states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [authTab, setAuthTab] = useState('login');
  const [regErrors, setRegErrors] = useState({});

  const [settings, setSettings] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    return saved ? JSON.parse(saved) : { backgroundColor: 'default', fontSize: 'medium', theme: 'light' };
  });

  const dashGradient = {
    default: 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
    warm: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
    cool: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50'
  }[settings.backgroundColor] || 'bg-gradient-to-br from-slate-50 via-white to-blue-50';

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }[settings.fontSize] || 'text-base';

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(fontSizeClass);
  }, [fontSizeClass]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (parsedUser.role === 'student') {
        setCurrentView('student-dashboard');
      } else if (parsedUser.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else if (parsedUser.role === 'principal') {
        setCurrentView('principal-dashboard');
      } else if (parsedUser.role === 'teacher') {
        setCurrentView('teacher-dashboard');
      }
    }
    
    fetchBranches();
    fetchCategories();
    fetchPublicStats();
  }, []);

  useEffect(() => {
    if (token && ['student-dashboard', 'admin-dashboard', 'principal-dashboard', 'analytics'].includes(currentView)) {
      fetchComplaints();
      fetchAnalytics();
    }
  }, [token, currentView]);

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();
      setBranches(data.branches || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch complaints');
      
      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message);
    }
  };

  const fetchPublicStats = async () => {
    try {
      const response = await fetch('/api/public/stats');
      const data = await response.json();
      setPublicStats(data);
    } catch (err) {
      console.error('Error fetching public stats:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...loginForm, role: selectedRole })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setToken(data.token);
      setUser(data.user);
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
      
      if (data.user.role === 'student') {
        setCurrentView('student-dashboard');
      } else if (data.user.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else if (data.user.role === 'principal') {
        setCurrentView('principal-dashboard');
      } else if (data.user.role === 'teacher') {
        setCurrentView('teacher-dashboard');
      }
      
      setSuccess('Login successful!');
      setLoginForm({ email: '', password: '', role: '' });
      setShowLoginPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { confirmPassword, ...registerData } = registerForm;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registerData, role: selectedRole })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'student') {
        setCurrentView('student-dashboard');
      } else if (data.user.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else if (data.user.role === 'principal') {
        setCurrentView('principal-dashboard');
      }
      
      setSuccess('Registration successful!');
      setRegisterForm({ email: '', password: '', confirmPassword: '', name: '', branch: '', role: 'student' });
      setPasswordStrength(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check if media is required for this category
      const MEDIA_REQUIRED = ['Bullying', 'Ragging', 'Infrastructure Issue'];
      if (MEDIA_REQUIRED.includes(complaintForm.category) && !mediaFile) {
        setError(`Media (photo/video) is required for ${complaintForm.category} complaints`);
        setLoading(false);
        return;
      }

      // Prepare complaint data
      const complaintData = { ...complaintForm };

      // Convert media to base64 if present
      if (mediaFile) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          complaintData.mediaBase64 = event.target.result;
          complaintData.mediaType = mediaFile.type;

          // Send complaint with media
          const response = await fetch('/api/complaints', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(complaintData)
          });
          
          const data = await response.json();
          
          if (!response.ok) throw new Error(data.error);
          
          setSuccess('Complaint submitted successfully!');
          setComplaintForm({ title: '', description: '', category: '', branch: '', keepAnonymous: false });
          setMediaFile(null);
          setMediaPreview(null);
          
          if (token && currentView === 'student-dashboard') {
            fetchComplaints();
            fetchAnalytics();
          }
          setLoading(false);
        };
        reader.readAsDataURL(mediaFile);
      } else {
        // Send complaint without media
        const response = await fetch('/api/complaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(complaintData)
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);
        
        setSuccess('Complaint submitted successfully!');
        setComplaintForm({ title: '', description: '', category: '', branch: '', keepAnonymous: false });
        setMediaFile(null);
        setMediaPreview(null);
        
        if (token && currentView === 'student-dashboard') {
          fetchComplaints();
          fetchAnalytics();
        }
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, MP4, WebM, MOV');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size: 50MB');
      return;
    }

    setMediaFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview({
        type: file.type,
        data: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleUpdateComplaint = async (complaintId) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(responseForm)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setSuccess('Complaint updated successfully!');
      setResponseForm({ response: '', status: '' });
      setSelectedComplaint(null);
      fetchComplaints();
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setSuccess('Complaint deleted successfully!');
      setSelectedComplaint(null);
      fetchComplaints();
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setCurrentView('home');
    setComplaints([]);
    setAnalytics(null);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (searchQuery && !complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) && !complaint.description?.toLowerCase().includes(searchQuery.toLowerCase()) && !complaint.category?.toLowerCase().includes(searchQuery.toLowerCase()) && !complaint.branch?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== 'all' && complaint.status !== filterStatus) return false;
    if (filterCategory !== 'all' && complaint.category !== filterCategory) return false;
    return true;
  });

  // Function to get relative time
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  };

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 15;
    if (password.length >= 8) strength += 15;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const getStrengthLabel = (strength) => {
    if (strength === 0) return '';
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    if (strength < 100) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (strength) => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    if (strength < 100) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getStrengthTextColor = (strength) => {
    if (strength < 25) return 'text-red-600';
    if (strength < 50) return 'text-orange-600';
    if (strength < 75) return 'text-yellow-600';
    if (strength < 100) return 'text-green-600';
    return 'text-emerald-600';
  };

  const validateRegistration = (form) => {
    const errors = {};
    if (!form.name || form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!form.password || form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (calculatePasswordStrength(form.password) < 30) {
      errors.password = 'Password too weak. Use uppercase, lowercase, numbers, and special characters.';
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (selectedRole === 'student' && !form.enrollmentNumber) {
      errors.enrollmentNumber = 'Enrollment number is required for students';
    }
    if (selectedRole !== 'principal' && selectedRole !== 'teacher' && !form.branch) {
      errors.branch = 'Please select your branch';
    }
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Shared dashboard styles
  const dashHeaderGrads = {
    student: 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600',
    teacher: 'bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600',
    admin: 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600',
    principal: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
  };
  const dashHeaderColors = {
    student: { text: 'text-blue-600', bg: 'bg-blue-100', light: 'bg-blue-50' },
    teacher: { text: 'text-emerald-600', bg: 'bg-emerald-100', light: 'bg-emerald-50' },
    admin: { text: 'text-purple-600', bg: 'bg-purple-100', light: 'bg-purple-50' },
    principal: { text: 'text-amber-600', bg: 'bg-amber-100', light: 'bg-amber-50' }
  };
  const statCardClass = 'relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer';
  const statCardIconWrap = 'p-3 rounded-xl shadow-lg';

  // Home Page with Role Selection
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        {/* Edge Ambience Light */}
        <div className="edge-ambience">
          <div className="edge-top"></div>
          <div className="edge-bottom"></div>
          <div className="edge-left"></div>
          <div className="edge-right"></div>
          <div className="corner-accent corner-top-left"></div>
          <div className="corner-accent corner-top-right"></div>
          <div className="corner-accent corner-bottom-left"></div>
          <div className="corner-accent corner-bottom-right"></div>
        </div>

        {/* Edge Wobbling Shapes */}
        <div className="edge-shapes">
          <div className="wobble-shape-tl"></div>
          <div className="wobble-shape-tr"></div>
          <div className="wobble-shape-bl"></div>
          <div className="wobble-shape-br"></div>
          <div className="wobble-shape-tc"></div>
          <div className="wobble-shape-bc"></div>
        </div>

        {/* Desktop Sidebar - Hidden on Mobile */}
        <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg z-50 flex-col py-6 px-3">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3 px-2">
            <Shield className="h-10 w-10 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900">SafetyHub</h2>
              <p className="text-xs text-gray-600">Portal</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gray-300 mb-4"></div>
          
          {/* Primary CTA */}
          <button
            onClick={() => { setCurrentView('login'); setAuthTab('login'); }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:scale-105 transition-all group mb-2"
          >
            <FileText className="h-5 w-5" />
            <span className="text-sm font-semibold">Register a Complaint</span>
          </button>

          <div className="w-full h-px bg-gray-300 mb-3"></div>

          {/* Unified Sign In */}
          <button
            onClick={() => { setCurrentView('login'); setAuthTab('login'); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 group"
          >
            <LogOut className="h-5 w-5 text-gray-500 rotate-180" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Sign In</span>
          </button>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-300 mb-4"></div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 group"
          >
            <UserCheck className="h-7 w-7 text-gray-600" />
            <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">Settings</span>
          </button>

          {/* Admin & Principal Login - Contact Admin for Access */}
          <button
            onClick={() => { setError('Admin/Principal accounts are created by existing administrators only. Contact your institution admin for access.'); setTimeout(() => setError(''), 5000); }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 group cursor-not-allowed opacity-60"
            disabled
          >
            <Shield className="h-7 w-7 text-gray-400" />
            <span className="text-base font-medium text-gray-500 group-hover:text-gray-400">Admin / Principal (Admin Only)</span>
          </button>

          {/* Analytics Button */}
          <button
            onClick={() => setCurrentView('public-analytics')}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-blue-100 transition-all hover:scale-105 group"
          >
            <BarChart3 className="h-7 w-7 text-blue-600" />
            <span className="text-base font-medium text-gray-700 group-hover:text-blue-700">Analytics</span>
          </button>

          {/* Creators Button */}
          <button
            onClick={() => setShowCreatorsModal(true)}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all hover:scale-105 group"
          >
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-base font-medium text-gray-700 group-hover:text-purple-700">Creators</span>
          </button>
        </aside>

        {/* Mobile Bottom Navigation - Visible only on Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50 pb-safe">
          <div className="grid grid-cols-5 gap-1 px-2 py-2 transition-all">
            <button
              onClick={() => { setCurrentView('login'); setAuthTab('login'); }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-gradient-to-b from-blue-600 to-purple-600 text-white active:scale-95 transition-all"
            >
              <FileText className="h-5 w-5 mb-0.5" />
              <span className="text-[9px] font-semibold">Register</span>
            </button>

            <button
              onClick={() => { setCurrentView('login'); setAuthTab('login'); }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              <LogOut className="h-5 w-5 text-gray-600 mb-0.5 rotate-180" />
              <span className="text-[10px] font-medium text-gray-700">Sign In</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              <UserCheck className="h-5 w-5 text-gray-600 mb-0.5" />
              <span className="text-[10px] font-medium text-gray-700">Settings</span>
            </button>

            <button
              onClick={() => setCurrentView('public-analytics')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-blue-100 active:scale-95 transition-all"
            >
              <BarChart3 className="h-5 w-5 text-blue-600 mb-0.5" />
              <span className="text-[10px] font-medium text-gray-700">Stats</span>
            </button>

            <button
              onClick={() => setShowCreatorsModal(true)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-purple-100 active:scale-95 transition-all"
            >
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-[10px] font-medium text-gray-700">Team</span>
            </button>
          </div>
        </nav>
        
        {/* Main Content with Proper Margins */}
        <div className="flex-1 md:ml-56 pb-20 md:pb-0">
          {/* Top Header */}
          <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-40 shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:hidden">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <h1 className="text-base font-bold text-gray-900">SafetyHub</h1>
                    <p className="text-[10px] text-gray-600">Safety Portal</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold text-gray-900">SafetyHub</h1>
                  <p className="text-sm text-gray-600">Student Safety & Complaint Management</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Badge variant="outline" className="text-xs md:text-sm">
                    <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Public Portal
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="pt-8 md:pt-12 pb-8 md:pb-12 relative z-10">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
                <Shield className="h-16 w-16 md:h-24 md:w-24 text-blue-600 mx-auto mb-4 md:mb-6 animate-pulse" />
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                  Your Safety, Our Priority
                </h2>
                <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
                  A Strong And Secure Complaint Registry Web Application Where You Can Register Your Complaints.
                </p>
              </div>

              {/* Public Stats Dashboard */}
              {publicStats && (
                <div className="max-w-5xl mx-auto mb-8 md:mb-12">
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-gray-900">Live Complaint Tracker</h3>
                  
                  {/* Status Indicators + Last Complaint */}
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
                    <Card className="border-2 border-red-200 bg-red-50 hover:shadow-lg hover:scale-105 transition-all cursor-pointer active:scale-95 min-w-[180px] flex-1 max-w-[220px]">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                            <span className="text-sm md:text-base font-medium text-gray-700">Pending</span>
                          </div>
                          <span className="text-2xl md:text-3xl font-bold text-red-600">{publicStats.pending || 0}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-yellow-200 bg-yellow-50 hover:shadow-lg hover:scale-105 transition-all cursor-pointer active:scale-95 min-w-[180px] flex-1 max-w-[220px]">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                            <span className="text-sm md:text-base font-medium text-gray-700">In Progress</span>
                          </div>
                          <span className="text-2xl md:text-3xl font-bold text-yellow-600">{publicStats.inProgress || 0}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-green-200 bg-green-50 hover:shadow-lg hover:scale-105 transition-all cursor-pointer active:scale-95 min-w-[180px] flex-1 max-w-[220px]">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            <span className="text-sm md:text-base font-medium text-gray-700">Resolved</span>
                          </div>
                          <span className="text-2xl md:text-3xl font-bold text-green-600">{publicStats.resolved || 0}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Last Complaint Card */}
                    {publicStats.lastComplaintAt && (
                      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg hover:scale-105 transition-all cursor-pointer active:scale-95 min-w-[180px] flex-1 max-w-[220px]">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
                              <span className="text-xs md:text-sm font-medium text-gray-600">Last Registered</span>
                            </div>
                            <span className="text-base md:text-lg font-bold text-gray-900">{getRelativeTime(publicStats.lastComplaintAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Total Stats + Register CTA */}
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    <Card 
                      className="border-2 border-blue-200 hover:shadow-xl transition-all cursor-pointer hover:scale-105 min-w-[180px] flex-1 max-w-[240px]" 
                      onClick={() => setCurrentView('public-analytics')}
                    >
                      <CardContent className="text-center py-4">
                        <FileText className="h-6 w-6 md:h-7 md:w-7 text-blue-600 mx-auto mb-1.5" />
                        <p className="text-[11px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Submitted</p>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">{publicStats.total}</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className="border-2 border-purple-200 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-white to-purple-50 min-w-[180px] flex-1 max-w-[240px]" 
                      onClick={() => { setCurrentView('login'); setAuthTab('login'); }}
                    >
                      <CardContent className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-md mx-auto mb-1.5">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-[11px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Register</p>
                        <p className="text-sm md:text-base font-bold text-gray-900">a Complaint</p>
                        <p className="text-[10px] text-gray-400 mt-1">Click to get started</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className="border-2 border-green-200 hover:shadow-xl transition-all cursor-pointer hover:scale-105 min-w-[180px] flex-1 max-w-[240px]" 
                      onClick={() => setCurrentView('public-analytics')}
                    >
                      <CardContent className="text-center py-4">
                        <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-green-600 mx-auto mb-1.5" />
                        <p className="text-[11px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Resolved</p>
                        <p className="text-2xl md:text-3xl font-bold text-green-600">{publicStats.resolved}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <p className="text-center text-xs text-gray-400 mt-3">
                    Already have an account? <button onClick={() => { setCurrentView('login'); setAuthTab('login'); }} className="text-blue-600 hover:underline font-medium">Sign in</button>
                  </p>
                </div>
              )}
            </div>
          </section>
          {/* Footer */}
          <footer className="border-t bg-white mt-12 md:mt-20 relative z-10">
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 text-center text-gray-600">
              <p className="text-xs md:text-sm">© 2024 SafetyHub - Student Safety & Complaint Management System
                <br />
                Hosted With Node.js
              </p>
            </div>
          </footer>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-8 w-8" />
                      <h2 className="text-3xl font-bold">Settings</h2>
                    </div>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>
                  <p className="text-gray-300 mt-2">Customize your experience</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Profile Section */}
                  {user && (
                    <Card className="border-2 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-blue-600" />
                          Profile Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">Name:</span>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">Role:</span>
                          <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </div>
                        {user.branch && (
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">Branch:</span>
                            <span className="font-medium">{user.branch}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Appearance Settings */}
                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-xl">🎨</span>
                        Appearance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Background Color */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Background Theme</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSettings({...settings, backgroundColor: 'default'})}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              settings.backgroundColor === 'default'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <div className="w-full h-8 rounded bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
                            <span className="text-xs mt-1 block">Default</span>
                          </button>
                          <button
                            onClick={() => setSettings({...settings, backgroundColor: 'warm'})}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              settings.backgroundColor === 'warm'
                                ? 'border-orange-600 bg-orange-50'
                                : 'border-gray-300 hover:border-orange-400'
                            }`}
                          >
                            <div className="w-full h-8 rounded bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50"></div>
                            <span className="text-xs mt-1 block">Warm</span>
                          </button>
                          <button
                            onClick={() => setSettings({...settings, backgroundColor: 'cool'})}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              settings.backgroundColor === 'cool'
                                ? 'border-cyan-600 bg-cyan-50'
                                : 'border-gray-300 hover:border-cyan-400'
                            }`}
                          >
                            <div className="w-full h-8 rounded bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50"></div>
                            <span className="text-xs mt-1 block">Cool</span>
                          </button>
                        </div>
                      </div>

                      {/* Font Size */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Font Size</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSettings({...settings, fontSize: 'small'})}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              settings.fontSize === 'small'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-xs">Small</span>
                          </button>
                          <button
                            onClick={() => setSettings({...settings, fontSize: 'medium'})}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              settings.fontSize === 'medium'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-sm">Medium</span>
                          </button>
                          <button
                            onClick={() => setSettings({...settings, fontSize: 'large'})}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              settings.fontSize === 'large'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-base">Large</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Management */}
                  {user && (
                    <Card className="border-2 border-red-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-red-600" />
                          Account Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setShowChangePassword(!showChangePassword)}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        {showChangePassword && (
                          <div className="mt-3 p-4 border border-blue-200 rounded-xl bg-blue-50 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700">Update Password</h4>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-gray-600">Current Password</Label>
                              <Input type="password" placeholder="Enter current password" className="bg-white" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-gray-600">New Password</Label>
                              <Input type="password" placeholder="Enter new password" className="bg-white" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-gray-600">Confirm New Password</Label>
                              <Input type="password" placeholder="Confirm new password" className="bg-white" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setShowChangePassword(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}>Cancel</Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                                if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) { setError('Please fill all fields'); return; }
                                if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError('New passwords do not match'); return; }
                                setError(''); setSuccess('Password updated successfully! (Demo)');
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setShowChangePassword(false);
                                setTimeout(() => setSuccess(''), 3000);
                              }}>Update</Button>
                            </div>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm('Are you sure you want to logout?')) {
                              handleLogout();
                              setShowSettings(false);
                            }
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Guest Message */}
                  {!user && (
                    <Card className="border-2 border-gray-200">
                      <CardContent className="pt-6 text-center">
                        <UserCircle className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">Login to access profile and account settings</p>
                        <Button
                          onClick={() => {
                            setShowSettings(false);
                            setCurrentView('login');
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Login Now
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSettings(false);
                      setSuccess('Settings saved successfully!');
                      setTimeout(() => setSuccess(''), 3000);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Creators Modal with Message Box Design */}
        {showCreatorsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4" style={{ zIndex: 9999 }}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Message Box Container */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Meet Our Creators</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100">The Super Talented Team Behind SafetyHub.</p>
                  <p className="text-xs sm:text-sm text-blue-100 mt-2">Made By: Students Of AI&ML First Year @CSMSS College Of Polytechnic.</p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8 flex flex-wrap gap-3 sm:gap-4 justify-center">
                    {/* Creator 1 */}
                    <div className="inline-block p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl border-2 border-blue-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">AK</div>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-gray-900">Aditya Khawase</p>
                          <p className="text-xs sm:text-sm text-blue-700 font-semibold">Lead Developer</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">Full-Stack Development</p>
                    </div>

                    {/* Creator 2 */}
                    <div className="inline-block p-4 sm:p-5 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl border-2 border-purple-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">YT</div>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-gray-900">Yuvraj Tapre</p>
                          <p className="text-xs sm:text-sm text-purple-700 font-semibold">Backend Developer</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">Database/API Manager</p>
                    </div>

                    {/* Creator 3 */}
                    <div className="inline-block p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl border-2 border-green-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">SD</div>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-gray-900">Sumit Dhaywar</p>
                          <p className="text-xs sm:text-sm text-green-700 font-semibold">Frontend Developer</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">UI/UX Creator</p>
                    </div>

                    {/* Creator 4 */}
                    <div className="inline-block p-4 sm:p-5 md:p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl border-2 border-amber-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">SG</div>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-gray-900">Siddhant Gaikwad</p>
                          <p className="text-xs sm:text-sm text-amber-700 font-semibold">Designer</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">Imagination to Implementation</p>
                    </div>

                    {/* Creator 5 */}
                    <div className="inline-block p-4 sm:p-5 md:p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg sm:rounded-xl border-2 border-pink-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">CW</div>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-gray-900">Chaitanya Wadgaonkar</p>
                          <p className="text-xs sm:text-sm text-pink-700 font-semibold">DB Specialist</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">Database Design</p>
                    </div>

                    {/* Creator 6 - Kiro */}
                    <div className="inline-block p-4 sm:p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg sm:rounded-xl border-2 border-indigo-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 6v2"/><path d="M12 12v6"/><path d="M8 10h8"/><path d="M8 14h6"/></svg>
                        </div>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-gray-900">Kiro</p>
                          <p className="text-xs sm:text-sm text-indigo-700 font-semibold">AI Assistant</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">Development Support</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-end gap-2 sm:gap-3 border-t">
                  <Button 
                    onClick={() => setShowCreatorsModal(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Public Analytics Page (No login required)
  if (currentView === 'public-analytics' && publicStats) {
    return (
      <div className={`min-h-screen ${dashGradient}`}>
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Public Analytics</h1>
                <p className="text-xs text-gray-500">Branch-wise complaint statistics</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back
            </button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Submitted</p>
                <p className="text-5xl font-bold text-blue-600">{publicStats.total}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                  <CheckSquare className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Resolved</p>
                <p className="text-5xl font-bold text-green-600">{publicStats.resolved}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Resolution Rate</p>
                <p className="text-5xl font-bold text-purple-600">
                  {publicStats.total > 0 ? Math.round((publicStats.resolved / publicStats.total) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Branch-wise Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Branch-wise Statistics
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publicStats.byBranch.map((branch) => {
                    const rate = branch.submitted > 0 ? Math.round((branch.resolved / branch.submitted) * 100) : 0;
                    return (
                      <div key={branch.branch} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                        <h4 className="font-bold text-gray-900 text-sm mb-4 text-center pb-3 border-b border-gray-100">{branch.branch}</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Submitted</span>
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{branch.submitted}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Resolved</span>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{branch.resolved}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Rate</span>
                              <span className={`text-sm font-bold ${rate >= 50 ? 'text-green-600' : rate >= 25 ? 'text-yellow-600' : 'text-red-600'}`}>{rate}%</span>
                            </div>
                            <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${rate >= 50 ? 'bg-green-500' : rate >= 25 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${rate}%`}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student & Teacher Auth Page
  if (currentView === 'login' || currentView === 'register') {
    const normalRoles = [
      { id: 'student', label: 'Student', icon: UserCircle, gradient: 'from-blue-600 to-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', tab: 'border-blue-600 text-blue-600', iconColor: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' },
      { id: 'teacher', label: 'Teacher', icon: GraduationCap, gradient: 'from-green-600 to-emerald-700', bg: 'bg-green-50', border: 'border-green-200', tab: 'border-green-600 text-green-600', iconColor: 'text-green-600', btn: 'bg-green-600 hover:bg-green-700' }
    ];
    const currentRole = normalRoles.find(r => r.id === selectedRole) || normalRoles[0];
    const c = currentRole;
    const isLogin = currentView === 'login';

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="w-full max-w-md relative animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-200/50 mb-3">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SafetyHub</h1>
            <p className="text-sm text-gray-500 mt-0.5">Campus Complaint Management Portal</p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 mx-5 mt-4">
              <button
                onClick={() => { setAuthTab('login'); setCurrentView('login'); setError(''); }}
                className={`flex-1 py-3 font-medium text-sm transition-all relative ${authTab === 'login' && isLogin ? c.tab : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign In
                {authTab === 'login' && isLogin && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-blue-600" />
                )}
              </button>
              <button
                onClick={() => { setAuthTab('register'); setCurrentView('register'); setError(''); setRegErrors({}); }}
                className={`flex-1 py-3 font-medium text-sm transition-all relative ${authTab === 'register' && !isLogin ? c.tab : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign Up
                {authTab === 'register' && !isLogin && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-blue-600" />
                )}
              </button>
            </div>

            <CardContent className="p-5">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">{success}</p>
                </div>
              )}

              {/* LOGIN FORM */}
              {isLogin && (
                <form onSubmit={(e) => { setAuthTab('login'); handleLogin(e); }} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">I am a</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {normalRoles.map(role => {
                        const Icon = role.icon;
                        const active = selectedRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => { setSelectedRole(role.id); setError(''); }}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                              active
                                ? `bg-gradient-to-r ${role.gradient} text-white shadow-md scale-105`
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${active ? 'text-white' : role.iconColor}`} />
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@college.edu"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked)} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                      <label htmlFor="remember-me" className="text-sm text-gray-500 cursor-pointer select-none font-medium">Remember me</label>
                    </div>
                    <button type="button" className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">Forgot?</button>
                  </div>

                  <Button type="submit" className={`w-full ${c.btn} text-white shadow-lg shadow-black/10 transition-all active:scale-[0.98] h-11`} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <LogOut className="h-4 w-4 rotate-180" />
                        Sign In
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* REGISTER FORM */}
              {!isLogin && (
                <form onSubmit={(e) => {
                  setAuthTab('register');
                  if (!validateRegistration(registerForm)) { e.preventDefault(); return; }
                  handleRegister(e);
                }} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Register as</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {normalRoles.map(role => {
                        const Icon = role.icon;
                        const active = selectedRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => { setSelectedRole(role.id); setError(''); setRegErrors({}); }}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                              active
                                ? `bg-gradient-to-r ${role.gradient} text-white shadow-md scale-105`
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${active ? 'text-white' : role.iconColor}`} />
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="reg-name" type="text" placeholder="Your full name" className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white ${regErrors.name ? 'border-red-400 ring-1 ring-red-400' : ''}`} value={registerForm.name} onChange={(e) => { setRegisterForm({...registerForm, name: e.target.value}); if (regErrors.name) setRegErrors({...regErrors, name: ''}); }} required autoFocus />
                    </div>
                    {regErrors.name && <p className="text-xs text-red-500 mt-1">{regErrors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="reg-email" type="email" placeholder="your.email@college.edu" className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white ${regErrors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`} value={registerForm.email} onChange={(e) => { setRegisterForm({...registerForm, email: e.target.value}); if (regErrors.email) setRegErrors({...regErrors, email: ''}); }} required />
                    </div>
                    {regErrors.email && <p className="text-xs text-red-500 mt-1">{regErrors.email}</p>}
                  </div>

                  {selectedRole === 'student' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-enrollment" className="text-sm font-medium text-gray-700">Enrollment Number</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="reg-enrollment" type="text" placeholder="e.g., 2024CS001" className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white ${regErrors.enrollmentNumber ? 'border-red-400 ring-1 ring-red-400' : ''}`} value={registerForm.enrollmentNumber} onChange={(e) => { setRegisterForm({...registerForm, enrollmentNumber: e.target.value}); if (regErrors.enrollmentNumber) setRegErrors({...regErrors, enrollmentNumber: ''}); }} required />
                      </div>
                      {regErrors.enrollmentNumber && <p className="text-xs text-red-500 mt-1">{regErrors.enrollmentNumber}</p>}
                      {!regErrors.enrollmentNumber && <p className="text-xs text-gray-400">Your college enrollment / roll number</p>}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-branch" className="text-sm font-medium text-gray-700">
                      Branch
                      {selectedRole === 'teacher' && <span className="text-gray-400 font-normal"> (Auto-assigned)</span>}
                    </Label>
                    <Select value={registerForm.branch} onValueChange={(value) => { setRegisterForm({...registerForm, branch: value}); if (regErrors.branch) setRegErrors({...regErrors, branch: ''}); }} disabled={selectedRole === 'teacher'}>
                      <SelectTrigger id="reg-branch" className={`bg-gray-50/50 ${regErrors.branch ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'}`}>
                        <SelectValue placeholder={selectedRole === 'teacher' ? 'All Branches (Cross-branch)' : 'Select your branch'} />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (<SelectItem key={branch} value={branch}>{branch}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    {regErrors.branch && <p className="text-xs text-red-500 mt-1">{regErrors.branch}</p>}
                    {selectedRole === 'teacher' && <p className="text-xs text-gray-400">Teachers can teach across all branches</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="reg-password" type={showRegPassword ? 'text' : 'password'} placeholder="Create a strong password" className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white ${regErrors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`} value={registerForm.password} onChange={(e) => { setRegisterForm({...registerForm, password: e.target.value}); setPasswordStrength(calculatePasswordStrength(e.target.value)); if (regErrors.password) setRegErrors({...regErrors, password: ''}); }} required />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                        {showRegPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {regErrors.password && <p className="text-xs text-red-500 mt-1">{regErrors.password}</p>}
                    {registerForm.password.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((seg) => (
                            <div key={seg} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= seg * 20 ? getStrengthColor(passwordStrength) : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${getStrengthTextColor(passwordStrength)}`}>{getStrengthLabel(passwordStrength)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="reg-confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white" value={registerForm.confirmPassword || ''} onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})} required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {regErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{regErrors.confirmPassword}</p>}
                    {!regErrors.confirmPassword && registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                    {!regErrors.confirmPassword && registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword && registerForm.password.length > 0 && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Passwords match</p>
                    )}
                  </div>

                  <Button type="submit" className={`w-full ${c.btn} text-white shadow-lg shadow-black/10 transition-all active:scale-[0.98] h-11`} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2"><User className="h-4 w-4" /> Create Account</span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>

            <div className="px-5 pb-4 pt-0">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />
              <button onClick={() => { setCurrentView('admin-login'); setError(''); setSuccess(''); }} className="text-sm text-gray-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-1.5 w-full py-2 group">
                <Shield className="h-3.5 w-3.5" />
                <span>Admin / Principal Login</span>
              </button>
              <button onClick={() => { setCurrentView('home'); setSelectedRole(null); setError(''); setSuccess(''); setAuthTab('login'); }} className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1.5 w-full py-1 group mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Home
              </button>
            </div>
          </Card>

          <p className="text-center text-[11px] text-gray-400 mt-5 tracking-wide">
            &copy; {new Date().getFullYear()} SafetyHub. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Admin & Principal Auth Page (Sign In + Sign Up)
  const [adminSecret, setAdminSecret] = useState('');
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  if (currentView === 'admin-login') {
    // Admin/Principal access requires secret code
    const [adminSecret, setAdminSecret] = useState('');
    const [verifiedAdmin, setVerifiedAdmin] = useState(false);
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'CHANGE_ME';
    
    const handleAdminSecretSubmit = () => {
      if (adminSecret === ADMIN_SECRET) {
        setVerifiedAdmin(true);
        setError('');
      } else {
        setError('Invalid access code. Contact an administrator.');
        setTimeout(() => setError(''), 3000);
      }
    };
    
    const adminRoles = [
      { id: 'admin', label: 'Admin', icon: Shield, gradient: 'from-purple-600 to-purple-700', iconColor: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700', tab: 'border-purple-600 text-purple-600' },
      { id: 'principal', label: 'Principal', icon: Crown, gradient: 'from-amber-500 to-orange-600', iconColor: 'text-amber-600', btn: 'bg-amber-600 hover:bg-amber-700', tab: 'border-amber-600 text-amber-600' }
    ];
    const currentAdminRole = adminRoles.find(r => r.id === selectedRole) || adminRoles[0];
    const isAdminLogin = authTab === 'login';

    if (!verifiedAdmin) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <div className="w-full max-w-sm relative animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-amber-600 shadow-lg shadow-purple-200/50 mb-3">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
              <p className="text-sm text-gray-500 mt-0.5">Authorized personnel only</p>
            </div>
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm ring-1 ring-gray-200 overflow-hidden">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-secret" className="text-sm font-medium text-gray-700">Admin Access Code</Label>
                    <Input id="admin-secret" type="password" placeholder="Enter admin access code" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} className="border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" required />
                  </div>
                  <Button onClick={handleAdminSecretSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg">Verify Access</Button>
                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 text-center">Contact your institution administrator for the access code.</p>
                </div>
              </CardContent>
            </Card>
            <button onClick={() => { setCurrentView('home'); setError(''); }} className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1.5 w-full py-1 group mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="w-full max-w-sm relative animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-amber-600 shadow-lg shadow-purple-200/50 mb-3">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-sm text-gray-500 mt-0.5">Authorized personnel only</p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm ring-1 ring-gray-200 overflow-hidden">
            {/* Auth Tabs */}
            <div className="flex border-b border-gray-200 mx-5 mt-4">
              <button
                onClick={() => { setAuthTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-3 font-medium text-sm transition-all relative ${isAdminLogin ? currentAdminRole.tab : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign In
                {isAdminLogin && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-purple-600" />}
              </button>
              <button
                onClick={() => { setAuthTab('register'); setError(''); setSuccess(''); setRegErrors({}); }}
                className={`flex-1 py-3 font-medium text-sm transition-all relative ${!isAdminLogin ? currentAdminRole.tab : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign Up
                {!isAdminLogin && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-purple-600" />}
              </button>
            </div>

            <CardContent className="p-5">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">{success}</p>
                </div>
              )}

              {/* SIGN IN */}
              {isAdminLogin && (
                <form onSubmit={(e) => { setAuthTab('login'); handleLogin(e); }} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">I am an</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {adminRoles.map(role => {
                        const Icon = role.icon;
                        const active = selectedRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => { setSelectedRole(role.id); setError(''); }}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                              active ? `bg-gradient-to-r ${role.gradient} text-white shadow-md scale-105` : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${active ? 'text-white' : role.iconColor}`} />
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="admin-email" type="email" placeholder="admin@college.edu" className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-gray-50/50 focus:bg-white" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} required autoFocus />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <button type="button" className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">Forgot?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="admin-password" type={showLoginPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-gray-50/50 focus:bg-white" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} required />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                        {showLoginPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="admin-remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked)} className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                    <label htmlFor="admin-remember" className="text-sm text-gray-500 cursor-pointer select-none font-medium">Remember me</label>
                  </div>

                  <Button type="submit" className={`w-full ${currentAdminRole.btn} text-white shadow-lg shadow-black/10 transition-all active:scale-[0.98] h-11`} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2"><LogOut className="h-4 w-4 rotate-180" /> Sign In</span>
                    )}
                  </Button>
                </form>
              )}

              {/* SIGN UP */}
              {!isAdminLogin && (
                <form onSubmit={(e) => {
                  if (!validateRegistration(registerForm)) { e.preventDefault(); return; }
                  handleRegister(e);
                }} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Register as</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {adminRoles.map(role => {
                        const Icon = role.icon;
                        const active = selectedRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => { setSelectedRole(role.id); setError(''); setRegErrors({}); }}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                              active ? `bg-gradient-to-r ${role.gradient} text-white shadow-md scale-105` : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${active ? 'text-white' : role.iconColor}`} />
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-reg-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="admin-reg-name" type="text" placeholder="Your full name" className={`pl-10 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-gray-50/50 focus:bg-white ${regErrors.name ? 'border-red-400 ring-1 ring-red-400' : ''}`} value={registerForm.name} onChange={(e) => { setRegisterForm({...registerForm, name: e.target.value}); if (regErrors.name) setRegErrors({...regErrors, name: ''}); }} required autoFocus />
                    </div>
                    {regErrors.name && <p className="text-xs text-red-500 mt-1">{regErrors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-reg-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="admin-reg-email" type="email" placeholder="admin@college.edu" className={`pl-10 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-gray-50/50 focus:bg-white ${regErrors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`} value={registerForm.email} onChange={(e) => { setRegisterForm({...registerForm, email: e.target.value}); if (regErrors.email) setRegErrors({...regErrors, email: ''}); }} required />
                    </div>
                    {regErrors.email && <p className="text-xs text-red-500 mt-1">{regErrors.email}</p>}
                  </div>

                  {selectedRole === 'admin' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="admin-reg-branch" className="text-sm font-medium text-gray-700">Branch</Label>
                      <Select value={registerForm.branch} onValueChange={(value) => { setRegisterForm({...registerForm, branch: value}); if (regErrors.branch) setRegErrors({...regErrors, branch: ''}); }}>
                        <SelectTrigger id="admin-reg-branch" className={`bg-gray-50/50 ${regErrors.branch ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'}`}>
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (<SelectItem key={branch} value={branch}>{branch}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      {regErrors.branch && <p className="text-xs text-red-500 mt-1">{regErrors.branch}</p>}
                    </div>
                  )}

                  {selectedRole === 'principal' && (
                    <div className="text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      Principal accounts have system-wide access across all branches.
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-reg-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="admin-reg-password" type={showRegPassword ? 'text' : 'password'} placeholder="Create a strong password" className={`pl-10 pr-10 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-gray-50/50 focus:bg-white ${regErrors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`} value={registerForm.password} onChange={(e) => { setRegisterForm({...registerForm, password: e.target.value}); setPasswordStrength(calculatePasswordStrength(e.target.value)); if (regErrors.password) setRegErrors({...regErrors, password: ''}); }} required />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                        {showRegPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {regErrors.password && <p className="text-xs text-red-500 mt-1">{regErrors.password}</p>}
                    {registerForm.password.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((seg) => (<div key={seg} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= seg * 20 ? getStrengthColor(passwordStrength) : 'bg-gray-200'}`} />))}
                        </div>
                        <p className={`text-xs font-medium ${getStrengthTextColor(passwordStrength)}`}>{getStrengthLabel(passwordStrength)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-reg-confirm" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="admin-reg-confirm" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className="pl-10 pr-10 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-gray-50/50 focus:bg-white" value={registerForm.confirmPassword || ''} onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})} required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {regErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{regErrors.confirmPassword}</p>}
                    {!regErrors.confirmPassword && registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                    {!regErrors.confirmPassword && registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword && registerForm.password.length > 0 && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Passwords match</p>
                    )}
                  </div>

                  <Button type="submit" className={`w-full ${currentAdminRole.btn} text-white shadow-lg shadow-black/10 transition-all active:scale-[0.98] h-11`} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2"><User className="h-4 w-4" /> Create Account</span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>

            <div className="px-5 pb-4 pt-0">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />
              <button onClick={() => { setCurrentView('login'); setSelectedRole(null); setError(''); setSuccess(''); setAuthTab('login'); }} className="text-sm text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5 w-full py-1.5 group">
                <UserCircle className="h-3.5 w-3.5" />
                <span>Student / Teacher Login</span>
              </button>
              <button onClick={() => { setCurrentView('home'); setSelectedRole(null); setError(''); setSuccess(''); setAuthTab('login'); }} className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1.5 w-full py-1 group mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Home
              </button>
            </div>
          </Card>

          <p className="text-center text-[11px] text-gray-400 mt-5 tracking-wide">
            &copy; {new Date().getFullYear()} SafetyHub. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Analytics Page
  if (currentView === 'analytics' && analytics) {
    const roleColor = user?.role === 'admin' ? 'purple' : user?.role === 'principal' ? 'amber' : user?.role === 'teacher' ? 'emerald' : 'blue';
    const backView = user?.role === 'student' ? 'student-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : user?.role === 'principal' ? 'principal-dashboard' : 'teacher-dashboard';
    return (
      <div className={`min-h-screen ${dashGradient}`}>
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-br from-${roleColor}-500 to-${roleColor}-600 rounded-xl shadow-md`}>
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-xs text-gray-500">Detailed complaint statistics</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView(backView)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* By Type */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Complaints by Submitter Type
                </h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-600 rounded-xl shadow-md">
                        <UserCheck className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">Student Submissions</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white/80 rounded-xl px-4 py-3">
                        <span className="text-sm text-gray-600">Submitted</span>
                        <span className="font-bold text-lg text-blue-600">{analytics.byType.student.submitted}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/80 rounded-xl px-4 py-3">
                        <span className="text-sm text-gray-600">Resolved</span>
                        <span className="font-bold text-lg text-green-600">{analytics.byType.student.resolved}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-5 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-600 rounded-xl shadow-md">
                        <UserX className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">Anonymous Submissions</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white/80 rounded-xl px-4 py-3">
                        <span className="text-sm text-gray-600">Submitted</span>
                        <span className="font-bold text-lg text-purple-600">{analytics.byType.anonymous.submitted}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/80 rounded-xl px-4 py-3">
                        <span className="text-sm text-gray-600">Resolved</span>
                        <span className="font-bold text-lg text-green-600">{analytics.byType.anonymous.resolved}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* By Branch */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Complaints by Branch
                </h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.byBranch.map((branch) => (
                    <div key={branch.branch} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
                      <h4 className="font-bold text-sm text-gray-900 mb-3">{branch.branch}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Submitted</span>
                          <span className="text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{branch.submitted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Resolved</span>
                          <span className="text-sm font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full">{branch.resolved}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By Category */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Complaints by Category
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {analytics.byCategory.map((category) => (
                    <div key={category.category} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="font-semibold text-xs text-gray-700 mb-3 text-center">{category.category}</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Sub:</span>
                          <span className="font-bold text-blue-600">{category.submitted}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Res:</span>
                          <span className="font-bold text-green-600">{category.resolved}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Complaints by Status
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[{ status: 'Pending', count: analytics.overview.pending }, { status: 'In Progress', count: analytics.overview.inProgress }, { status: 'Resolved', count: analytics.overview.resolved }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Complaints by Category
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={analytics.byCategory.map(c => ({ name: c.category, value: c.submitted }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {analytics.byCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16'][index % 8]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Resolution Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[{ name: 'Pending', value: analytics.overview.pending }, { name: 'In Progress', value: analytics.overview.inProgress }, { name: 'Resolved', value: analytics.overview.resolved }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                Branch Submission vs Resolution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.byBranch}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="submitted" fill="#3B82F6" name="Submitted" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  if (currentView === 'student-dashboard' && user?.role === 'student') {
    const c = dashHeaderColors.student;
    return (
      <div className={`min-h-screen ${dashGradient}`}>
        <header className={`${dashHeaderGrads.student} sticky top-0 z-50 shadow-lg`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Student Dashboard</h1>
                <p className="text-sm text-white/80">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg flex items-center gap-1.5 text-xs text-white">
                <Building2 className="h-3.5 w-3.5" />
                {user.branch}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg text-sm text-white font-medium transition-all flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}
          
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-blue-500 to-blue-600 text-white`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">All time</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Submitted</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.total}</p>
              </div>

              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-green-500 to-emerald-600 text-white`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Resolved</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{analytics.overview.resolved}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-yellow-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-yellow-500 to-amber-600 text-white`}>
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{analytics.overview.pending}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-blue-500 to-indigo-600 text-white`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.overview.inProgress}</p>
              </div>
            </div>
          )}
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* New Complaint Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    New Complaint
                  </h3>
                  <p className="text-blue-100 text-xs mt-0.5">Submit a new safety concern</p>
                </div>
                <div className="p-5">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmitComplaint} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={complaintForm.category} onValueChange={(value) => setComplaintForm({...complaintForm, category: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select value={complaintForm.branch} onValueChange={(value) => setComplaintForm({...complaintForm, branch: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Brief title"
                        value={complaintForm.title}
                        onChange={(e) => setComplaintForm({...complaintForm, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your complaint..."
                        rows={4}
                        value={complaintForm.description}
                        onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="keepAnonymous" 
                        checked={complaintForm.keepAnonymous}
                        onCheckedChange={(checked) => setComplaintForm({...complaintForm, keepAnonymous: checked})}
                      />
                      <label
                        htmlFor="keepAnonymous"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Keep my identity anonymous
                      </label>
                    </div>
                    
                    
                    {/* Media Upload Section */}
                    <div className="space-y-2">
                      <Label htmlFor="media">
                        {['Bullying', 'Ragging', 'Infrastructure Issue'].includes(complaintForm.category) 
                          ? 'Photo/Video (Required)' 
                          : 'Photo/Video (Optional)'}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <input
                          id="media"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaChange}
                          className="hidden"
                        />
                        <label htmlFor="media" className="cursor-pointer">
                          {mediaPreview ? (
                            <div className="space-y-2">
                              {mediaPreview.type.startsWith('image/') ? (
                                <img src={mediaPreview.data} alt="Preview" className="h-32 mx-auto rounded" />
                              ) : (
                                <video src={mediaPreview.data} className="h-32 mx-auto rounded" controls />
                              )}
                              <p className="text-sm text-gray-600">{mediaFile?.name}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeMedia();
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-gray-600">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, WebM, MOV (Max 50MB)</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">My Complaints</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Track the status of your submitted complaints</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Search">
                      <Search className={`h-4 w-4 ${showSearch ? 'text-blue-600' : 'text-gray-500'}`} />
                    </button>
                    <Button variant="outline" size="sm" onClick={() => { const csv = filteredComplaints.map(c => `"${c.title}","${c.category}","${c.status}","${c.branch}","${c.createdAt}"`).join('\n'); const blob = new Blob([['Title,Category,Status,Branch,Created At'].join(',') + '\n' + csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'my_complaints.csv'; a.click(); URL.revokeObjectURL(url); }} className="flex items-center gap-1.5 text-xs">
                      <Download className="h-3 w-3" /> Export
                    </Button>
                  </div>
                </div>
                {showSearch && (
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                      {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">✕</button>}
                    </div>
                  </div>
                )}
                <div className="p-5">
                  {complaints.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-600">No complaints submitted yet</p>
                      <p className="text-sm text-gray-400 mt-1">Use the form on the left to submit your first complaint</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {complaints.map((complaint) => (
                        <div key={complaint.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                          <div className="flex items-start gap-4 p-5">
                            <div className={`w-1.5 shrink-0 self-stretch rounded-full ${complaint.status === 'resolved' ? 'bg-green-500' : complaint.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{complaint.category}</span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{complaint.branch}</span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                      {getStatusIcon(complaint.status)}
                                      <span>{complaint.status}</span>
                                    </span>
                                    {complaint.studentName === 'Anonymous' && (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Anonymous</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{complaint.description}</p>
                              
                              {/* Display Media if present */}
                              {complaint.media && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                                  {complaint.media.type.startsWith('image/') ? (
                                    <img src={complaint.media.base64} alt="Complaint media" className="max-h-48 rounded-lg" />
                                  ) : (
                                    <video src={complaint.media.base64} className="max-h-48 rounded-lg" controls />
                                  )}
                                </div>
                              )}
                              
                              {complaint.responses && complaint.responses.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Responses ({complaint.responses.length})
                                  </p>
                                  {complaint.responses.slice(-2).map((response) => (
                                    <div key={response.id} className="bg-emerald-50/80 p-3 rounded-xl mb-2 last:mb-0">
                                      <p className="text-sm text-gray-700">{response.message}</p>
                                      <p className="text-xs text-gray-400 mt-1.5">— {response.adminName}, {new Date(response.timestamp).toLocaleString()}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-xs text-gray-400 mt-3">{new Date(complaint.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (currentView === 'admin-dashboard' && user?.role === 'admin') {
    const c = dashHeaderColors.admin;
    return (
      <div className={`min-h-screen ${dashGradient}`}>
        <header className={`${dashHeaderGrads.admin} sticky top-0 z-50 shadow-lg`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-white/80">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg flex items-center gap-1.5 text-xs text-white">
                <Building2 className="h-3.5 w-3.5" />
                {user.branch}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg text-sm text-white font-medium transition-all flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}
          
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-purple-500 to-purple-600 text-white`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">All</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.total}</p>
              </div>

              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-green-500 to-emerald-600 text-white`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Resolved</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{analytics.overview.resolved}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-yellow-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-yellow-500 to-amber-600 text-white`}>
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{analytics.overview.pending}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-blue-500 to-indigo-600 text-white`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.overview.inProgress}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Filters</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs text-gray-500 mb-1 block">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs text-gray-500 mb-1 block">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Branch Complaints</h3>
              <p className="text-sm text-gray-500 mt-0.5">Managing complaints from <strong>{user.branch}</strong></p>
            </div>
            <div className="p-5">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-600">No complaints found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="flex items-start gap-4 p-5">
                        <div className={`w-1.5 shrink-0 self-stretch rounded-full ${complaint.status === 'resolved' ? 'bg-green-500' : complaint.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">By: {complaint.studentName} {complaint.studentName === 'Anonymous' && <span className="text-purple-600 font-medium">(Anonymous)</span>}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{complaint.category}</span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {getStatusIcon(complaint.status)}
                                  <span>{complaint.status}</span>
                                </span>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button onClick={() => setSelectedComplaint(complaint)} className="shrink-0 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  Respond
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl rounded-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl">{complaint.title}</DialogTitle>
                                  <DialogDescription>
                                    Submitted by {complaint.studentName} on {new Date(complaint.createdAt).toLocaleString()}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Description:</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">{complaint.description}</p>
                                  </div>
                                  
                                  {/* Media Attachment Display */}
                                  {complaint.media && complaint.media.base64 && (
                                    <div className="bg-blue-50 rounded-xl p-4">
                                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Attached Media:</h4>
                                      {complaint.media.type?.startsWith('image/') ? (
                                        <img 
                                          src={complaint.media.base64} 
                                          alt="Complaint evidence" 
                                          className="w-full max-h-96 object-contain rounded-lg border-2 border-blue-200"
                                        />
                                      ) : complaint.media.type?.startsWith('video/') ? (
                                        <video 
                                          src={complaint.media.base64} 
                                          controls 
                                          className="w-full max-h-96 rounded-lg border-2 border-blue-200"
                                        >
                                          Your browser does not support video playback.
                                        </video>
                                      ) : null}
                                      <p className="text-xs text-gray-500 mt-2">Uploaded on {new Date(complaint.media.uploadedAt).toLocaleString()}</p>
                                    </div>
                                  )}
                                  
                                  {complaint.responses && complaint.responses.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Previous Responses ({complaint.responses.length})</h4>
                                      <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {complaint.responses.map((response) => (
                                          <div key={response.id} className="bg-purple-50 p-3 rounded-xl">
                                            <p className="text-sm text-gray-700">{response.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">By {response.adminName} • {new Date(response.timestamp).toLocaleString()}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <Separator />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Update Status</Label>
                                      <Select value={responseForm.status} onValueChange={(value) => setResponseForm({...responseForm, status: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">🟡 Pending</SelectItem>
                                          <SelectItem value="in-progress">🔵 In Progress</SelectItem>
                                          <SelectItem value="resolved">🟢 Resolved</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Add Response</Label>
                                      <Textarea
                                        placeholder="Write your response..."
                                        rows={3}
                                        value={responseForm.response}
                                        onChange={(e) => setResponseForm({...responseForm, response: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <DialogFooter className="gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleDeleteComplaint(complaint.id)}
                                    disabled={loading}
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    onClick={() => handleUpdateComplaint(complaint.id)}
                                    disabled={loading || (!responseForm.status && !responseForm.response)}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                  >
                                    {loading ? 'Updating...' : 'Update & Respond'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{complaint.description}</p>
                          
                          {complaint.responses && complaint.responses.length > 0 && (
                            <div className="mt-3 bg-purple-50/60 rounded-xl p-3">
                              <p className="text-xs font-semibold text-purple-700 mb-1">Latest Response:</p>
                              <p className="text-sm text-gray-700">{complaint.responses[complaint.responses.length - 1].message}</p>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-400 mt-3">{new Date(complaint.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Principal Dashboard
  if (currentView === 'principal-dashboard' && user?.role === 'principal') {
    const c = dashHeaderColors.principal;
    return (
      <div className={`min-h-screen ${dashGradient}`}>
        <header className={`${dashHeaderGrads.principal} sticky top-0 z-50 shadow-lg`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Principal Dashboard</h1>
                <p className="text-sm text-white/80">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg flex items-center gap-1.5 text-xs text-white">
                <Crown className="h-3.5 w-3.5" />
                System-Wide Access
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg text-sm text-white font-medium transition-all flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}
          
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-amber-500 to-orange-600 text-white`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">System</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.total}</p>
              </div>

              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-green-500 to-emerald-600 text-white`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Resolved</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{analytics.overview.resolved}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-yellow-500 to-amber-600 text-white`}>
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{analytics.overview.pending}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-blue-500 to-indigo-600 text-white`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.overview.inProgress}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Filters</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs text-gray-500 mb-1 block">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs text-gray-500 mb-1 block">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">All Complaints</h3>
              <p className="text-sm text-gray-500 mt-0.5">System-wide view of all branches</p>
            </div>
            <div className="p-5">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-600">No complaints found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="flex items-start gap-4 p-5">
                        <div className={`w-1.5 shrink-0 self-stretch rounded-full ${complaint.status === 'resolved' ? 'bg-green-500' : complaint.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">By: {complaint.studentName} {complaint.studentName === 'Anonymous' && <span className="text-purple-600 font-medium">(Anonymous)</span>} — <span className="font-medium text-amber-600">{complaint.branch}</span></p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{complaint.category}</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{complaint.branch}</span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {getStatusIcon(complaint.status)}
                                  <span>{complaint.status}</span>
                                </span>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button onClick={() => setSelectedComplaint(complaint)} className="shrink-0 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  Respond
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl rounded-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl">{complaint.title}</DialogTitle>
                                  <DialogDescription>
                                    Submitted by {complaint.studentName} on {new Date(complaint.createdAt).toLocaleString()} — {complaint.branch}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Description:</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">{complaint.description}</p>
                                  </div>
                                  
                                  {/* Media Attachment Display */}
                                  {complaint.media && complaint.media.base64 && (
                                    <div className="bg-amber-50 rounded-xl p-4">
                                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Attached Media:</h4>
                                      {complaint.media.type?.startsWith('image/') ? (
                                        <img 
                                          src={complaint.media.base64} 
                                          alt="Complaint evidence" 
                                          className="w-full max-h-96 object-contain rounded-lg border-2 border-amber-200"
                                        />
                                      ) : complaint.media.type?.startsWith('video/') ? (
                                        <video 
                                          src={complaint.media.base64} 
                                          controls 
                                          className="w-full max-h-96 rounded-lg border-2 border-amber-200"
                                        >
                                          Your browser does not support video playback.
                                        </video>
                                      ) : null}
                                      <p className="text-xs text-gray-500 mt-2">Uploaded on {new Date(complaint.media.uploadedAt).toLocaleString()}</p>
                                    </div>
                                  )}
                                  
                                  {complaint.responses && complaint.responses.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Previous Responses ({complaint.responses.length})</h4>
                                      <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {complaint.responses.map((response) => (
                                          <div key={response.id} className="bg-amber-50 p-3 rounded-xl">
                                            <p className="text-sm text-gray-700">{response.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">By {response.adminName} • {new Date(response.timestamp).toLocaleString()}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <Separator />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Update Status</Label>
                                      <Select value={responseForm.status} onValueChange={(value) => setResponseForm({...responseForm, status: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">🟡 Pending</SelectItem>
                                          <SelectItem value="in-progress">🔵 In Progress</SelectItem>
                                          <SelectItem value="resolved">🟢 Resolved</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Add Response</Label>
                                      <Textarea
                                        placeholder="Write your response..."
                                        rows={3}
                                        value={responseForm.response}
                                        onChange={(e) => setResponseForm({...responseForm, response: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <DialogFooter className="gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleDeleteComplaint(complaint.id)}
                                    disabled={loading}
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    onClick={() => handleUpdateComplaint(complaint.id)}
                                    disabled={loading || (!responseForm.status && !responseForm.response)}
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                                  >
                                    {loading ? 'Updating...' : 'Update & Respond'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{complaint.description}</p>
                          
                          {complaint.responses && complaint.responses.length > 0 && (
                            <div className="mt-3 bg-amber-50/60 rounded-xl p-3">
                              <p className="text-xs font-semibold text-amber-700 mb-1">Latest Response:</p>
                              <p className="text-sm text-gray-700">{complaint.responses[complaint.responses.length - 1].message}</p>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-400 mt-3">{new Date(complaint.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Dashboard
  if (currentView === 'teacher-dashboard' && user?.role === 'teacher') {
    const c = dashHeaderColors.teacher;
    return (
      <div className={`min-h-screen ${dashGradient}`}>
        <header className={`${dashHeaderGrads.teacher} sticky top-0 z-50 shadow-lg`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>
                <p className="text-sm text-white/80">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg flex items-center gap-1.5 text-xs text-white">
                <Building2 className="h-3.5 w-3.5" />
                {user.branch}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg text-sm text-white font-medium transition-all flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}
          
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-emerald-500 to-emerald-600 text-white`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">All time</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Submitted</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.total}</p>
              </div>

              <div onClick={() => setCurrentView('analytics')} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-green-500 to-emerald-600 text-white`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Resolved</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{analytics.overview.resolved}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-yellow-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-yellow-500 to-amber-600 text-white`}>
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{analytics.overview.pending}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${statCardIconWrap} bg-gradient-to-br from-blue-500 to-indigo-600 text-white`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.overview.inProgress}</p>
              </div>
            </div>
          )}
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* New Complaint Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    New Complaint
                  </h3>
                  <p className="text-emerald-100 text-xs mt-0.5">Submit a new concern</p>
                </div>
                <div className="p-5">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmitComplaint} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={complaintForm.category} onValueChange={(value) => setComplaintForm({...complaintForm, category: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select value={complaintForm.branch} onValueChange={(value) => setComplaintForm({...complaintForm, branch: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Brief title"
                        value={complaintForm.title}
                        onChange={(e) => setComplaintForm({...complaintForm, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your complaint..."
                        rows={4}
                        value={complaintForm.description}
                        onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="keepAnonymous" 
                        checked={complaintForm.keepAnonymous}
                        onCheckedChange={(checked) => setComplaintForm({...complaintForm, keepAnonymous: checked})}
                      />
                      <label
                        htmlFor="keepAnonymous"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Keep my identity anonymous
                      </label>
                    </div>
                    
                    {/* Media Upload Section */}
                    <div className="space-y-2">
                      <Label htmlFor="media">
                        {['Bullying', 'Ragging', 'Infrastructure Issue'].includes(complaintForm.category) 
                          ? 'Photo/Video (Required)' 
                          : 'Photo/Video (Optional)'}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                        <input
                          id="media"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaChange}
                          className="hidden"
                        />
                        <label htmlFor="media" className="cursor-pointer">
                          {mediaPreview ? (
                            <div className="space-y-2">
                              {mediaPreview.type.startsWith('image/') ? (
                                <img src={mediaPreview.data} alt="Preview" className="h-32 mx-auto rounded" />
                              ) : (
                                <video src={mediaPreview.data} className="h-32 mx-auto rounded" controls />
                              )}
                              <p className="text-sm text-gray-600">{mediaFile?.name}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.preventDefault(); removeMedia(); }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-gray-600">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, WebM, MOV (Max 50MB)</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white" disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">My Complaints</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Track the status of your submitted complaints</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Search">
                      <Search className={`h-4 w-4 ${showSearch ? 'text-blue-600' : 'text-gray-500'}`} />
                    </button>
                    <Button variant="outline" size="sm" onClick={() => { const csv = filteredComplaints.map(c => `"${c.title}","${c.category}","${c.status}","${c.branch}","${c.createdAt}"`).join('\n'); const blob = new Blob([['Title,Category,Status,Branch,Created At'].join(',') + '\n' + csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'my_complaints.csv'; a.click(); URL.revokeObjectURL(url); }} className="flex items-center gap-1.5 text-xs">
                      <Download className="h-3 w-3" /> Export
                    </Button>
                  </div>
                </div>
                {showSearch && (
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                      {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">✕</button>}
                    </div>
                  </div>
                )}
                <div className="p-5">
                  {complaints.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-600">No complaints submitted yet</p>
                      <p className="text-sm text-gray-400 mt-1">Use the form on the left to submit your first complaint</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {complaints.map((complaint) => (
                        <div key={complaint.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                          <div className="flex items-start gap-4 p-5">
                            <div className={`w-1.5 shrink-0 self-stretch rounded-full ${complaint.status === 'resolved' ? 'bg-green-500' : complaint.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{complaint.category}</span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{complaint.branch}</span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                      {getStatusIcon(complaint.status)}
                                      <span>{complaint.status}</span>
                                    </span>
                                    {complaint.studentName === 'Anonymous' && (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Anonymous</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{complaint.description}</p>
                              
                              {complaint.responses && complaint.responses.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Responses ({complaint.responses.length})
                                  </p>
                                  {complaint.responses.slice(-2).map((response) => (
                                    <div key={response.id} className="bg-emerald-50/80 p-3 rounded-xl mb-2 last:mb-0">
                                      <p className="text-sm text-gray-700">{response.message}</p>
                                      <p className="text-xs text-gray-400 mt-1.5">— {response.adminName}, {new Date(response.timestamp).toLocaleString()}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-xs text-gray-400 mt-3">{new Date(complaint.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Creators Icon - Global */}
      <div className="creators-icon" onClick={() => setShowCreatorsModal(true)}>
        <Users className="w-6 h-6 text-white" />
        <div className="creators-tooltip">
          <b>Creators/Founders</b>
        </div>
      </div>

      {/* Creators Modal - Global */}
      {showCreatorsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4" style={{ zIndex: 9999 }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Message Box Container */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Meet Our Creators</h2>
                </div>
                <p className="text-xs sm:text-sm text-blue-100">The Super Talented Team Behind SafetyHub.</p>
                <p className="text-xs sm:text-sm text-blue-100 mt-2">Made By: Students Of AI&ML First Year @CSMSS College Of Polytechnic.</p>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Creator Cards */}
                {[
                  { name: 'Shardul Thakur', role: 'Lead Developer & Designer', bio: 'Full-stack wizard who brings ideas to life with code and creativity.', avatar: 'ST', color: 'from-blue-500 to-purple-500' },
                  { name: 'Prathmesh Jadhav', role: 'Backend Developer', bio: 'Database architect and API master ensuring everything runs smoothly.', avatar: 'PJ', color: 'from-purple-500 to-pink-500' },
                  { name: 'Harshal Kadam', role: 'Frontend Developer', bio: 'UI/UX enthusiast crafting beautiful and intuitive interfaces.', avatar: 'HK', color: 'from-pink-500 to-red-500' },
                  { name: 'Prathamesh Patil', role: 'Quality Assurance', bio: 'Testing expert who ensures every feature works perfectly.', avatar: 'PP', color: 'from-red-500 to-orange-500' }
                ].map((creator, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0`}>
                      {creator.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">{creator.name}</h3>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">{creator.role}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{creator.bio}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-end gap-2 sm:gap-3 border-t">
                <Button 
                  onClick={() => setShowCreatorsModal(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {null}
    </>
  );
}


