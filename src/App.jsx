import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Mail, User, Eye, EyeOff, LogIn, UserPlus, ArrowLeft, 
  Settings as SettingsIcon, LogOut, Edit3, Briefcase, Sparkles, 
  ShieldCheck, Activity, Users, Bell, Search, Filter, CheckCircle2
} from 'lucide-react';
import { animate } from 'animejs';

/* ==========================================
   1. STORAGE & DATABASE HELPERS
   ================================ */
const USERS_DB_KEY = 'm3_pro_dashboard_users_v1';
const SESSION_KEY = 'm3_pro_dashboard_session_v1';

const defaultUser = {
  name: 'Rishi M.',
  email: 'rishi@gmail.com',
  password: 'Password@123',
  role: 'Software Developer',
  bio: 'Building advanced React web applications with robust dashboard features.',
  status: 'Active',
  lastLogin: 'Today, 10:42 AM'
};

function getUsers() {
  try {
    const data = localStorage.getItem(USERS_DB_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify([defaultUser]));
    return [defaultUser];
  } catch {
    return [defaultUser];
  }
}

function saveUsers(usersArray) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersArray));
  } catch {}
}

/* ==========================================
   2. REUSABLE UI COMPONENTS (Solid Colors)
   ================================ */

function Toast({ message, type, onClose }) {
  const toastRef = useRef(null);

  useEffect(() => {
    animate(toastRef.current, {
      translateY: [80, 0],
      scale: [0.8, 1],
      opacity: [0, 1],
      ease: 'spring(1, 80, 10, 0)',
      duration: 600
    });
  }, []);

  let style = 'bg-slate-900 text-emerald-400 border border-slate-700';
  if (type === 'error') style = 'bg-red-950 text-red-200 border border-red-800';
  if (type === 'info') style = 'bg-blue-950 text-blue-200 border border-blue-800';

  return (
    <div ref={toastRef} className={`fixed bottom-8 right-8 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl ${style} font-semibold text-sm shadow-xl`}>
      <Sparkles className="w-5 h-5 animate-pulse text-emerald-400" />
      <span className="text-white">{message}</span>
      <button onClick={onClose} className="ml-2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold hover:bg-white/20 text-white transition-colors">✕</button>
    </div>
  );
}

function InputField({ label, icon: Icon, error, type = "text", ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleRef = useRef(null);
  const isPasswordType = type === "password";
  const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

  const handleToggleClick = () => {
    setShowPassword(!showPassword);
    animate(toggleRef.current, {
      scale: [0.85, 1.15, 1],
      rotate: [0, showPassword ? -15 : 15, 0],
      duration: 400,
      ease: 'spring(1, 100, 12, 0)'
    });
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase ml-2">{label}</label>}
      <div className="relative flex items-center group">
        {Icon && (
          <div className="absolute left-4 p-2 rounded-xl bg-slate-100 text-slate-700 group-focus-within:bg-slate-900 group-focus-within:text-white transition-all duration-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input 
          type={inputType}
          className={`w-full py-4 rounded-2xl bg-white border-2 text-slate-900 placeholder-slate-400 text-sm font-medium outline-none transition-all duration-300 focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 ${
            Icon ? 'pl-16' : 'pl-6'
          } ${isPasswordType ? 'pr-16' : 'pr-6'} ${
            error ? 'border-red-500 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
          }`}
          {...props}
        />
        {isPasswordType && (
          <div className="absolute right-3.5 flex items-center">
            <button 
              ref={toggleRef}
              type="button" 
              onClick={handleToggleClick}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors focus:outline-none flex items-center justify-center"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 ml-4 font-bold tracking-wide">{error}</p>}
    </div>
  );
}

function Button({ children, loading, variant = 'primary', ...props }) {
  const btnRef = useRef(null);

  const handleMouseEnter = () => {
    animate(btnRef.current, { scale: 1.02, duration: 250, ease: 'outQuad' });
  };

  const handleMouseLeave = () => {
    animate(btnRef.current, { scale: 1, duration: 250, ease: 'outQuad' });
  };

  let style = 'bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md';
  if (variant === 'secondary') style = 'bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold border border-slate-300';
  if (variant === 'danger') style = 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-md';

  return (
    <button 
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={loading} 
      className={`w-full py-4 px-8 rounded-2xl text-sm tracking-wide flex items-center justify-center gap-3 transition-all ${style} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
      {...props}
    >
      {loading ? <span className="animate-spin text-lg">✦</span> : children}
    </button>
  );
}

/* ==========================================
   3. SCREENS & NEW DASHBOARD FEATURES
   ================================ */

function M3Card({ children }) {
  const cardRef = useRef(null);

  useEffect(() => {
    animate(cardRef.current, {
      scale: [0.92, 1],
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
      ease: 'outExpo'
    });
  }, []);

  return (
    <div ref={cardRef} className="w-full max-w-lg bg-white border border-slate-200 p-10 rounded-3xl shadow-xl text-slate-900">
      {children}
    </div>
  );
}

// Login Screen
function LoginScreen({ onLogin, onSwitchToRegister, onSwitchToForgot }) {
  const [email, setEmail] = useState(defaultUser.email);
  const [password, setPassword] = useState(defaultUser.password);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('All fields are required');
      animate(formRef.current, { translateX: [-12, 12, -12, 12, 0], duration: 400 });
      return;
    }
    setErrorMsg('');
    onLogin(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 text-slate-900">
      <M3Card>
        <div className="text-center mb-8">
          <div className="inline-flex p-5 bg-slate-900 text-white rounded-2xl mb-4 shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Sign In</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Access your secure user management console</p>
        </div>

        {errorMsg && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-extrabold tracking-wider text-center">{errorMsg}</div>}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Email Address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="flex items-center justify-between text-sm px-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300" />
              <span className="text-slate-700 font-bold group-hover:text-slate-900">Remember me</span>
            </label>
            <button type="button" onClick={onSwitchToForgot} className="text-slate-900 font-extrabold hover:underline">Forgot password?</button>
          </div>

          <div className="pt-2">
            <Button type="submit"><LogIn className="w-5 h-5 text-white" /> Sign In</Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-semibold text-slate-500">
          Don't have an account? <button onClick={onSwitchToRegister} className="text-slate-900 font-black hover:underline">Create account</button>
        </div>
      </M3Card>
    </div>
  );
}

// Register Screen
function RegisterScreen({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('All fields are required');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    onRegister(name, email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 text-slate-900">
      <M3Card>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Create Account</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Register for a new user account</p>
        </div>

        {errorMsg && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-extrabold tracking-wider text-center">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          <InputField label="Email Address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          <InputField label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
          <InputField label="Confirm Password" type="password" icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********" />

          <div className="pt-2">
            <Button type="submit"><UserPlus className="w-5 h-5 text-white" /> Sign Up</Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-semibold text-slate-500">
          Already have an account? <button onClick={onSwitchToLogin} className="text-slate-900 font-black hover:underline">Sign in</button>
        </div>
      </M3Card>
    </div>
  );
}

// Forgot Password Screen
function ForgotPasswordScreen({ onSwitchToLogin, onProceedToReset, setResetEmail }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setResetEmail(email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 text-slate-900">
      <M3Card>
        <button onClick={onSwitchToLogin} className="text-sm font-extrabold text-slate-500 hover:text-slate-900 mb-6 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-2">Forgot Password</h1>
        <p className="text-sm font-semibold text-slate-500 mb-8">Enter your account email to receive secure recovery instructions.</p>

        {submitted ? (
          <div className="space-y-6">
            <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl font-bold">
              Recovery link sent successfully to <b>{email}</b>.
            </div>
            <Button onClick={onProceedToReset}>Proceed to Reset Password</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Email Address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit">Send Reset Link</Button>
          </form>
        )}
      </M3Card>
    </div>
  );
}

// Reset Password Screen
function ResetPasswordScreen({ onFinishReset, resetEmail }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    onFinishReset(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 text-slate-900">
      <M3Card>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Set New Password</h1>
        <p className="text-sm font-semibold text-slate-500 mb-8">Create a secure password for {resetEmail || 'your account'}.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="New Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputField label="Confirm Password" type="password" icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={error} />
          <div className="pt-2">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </M3Card>
    </div>
  );
}

// NEW FEATURE: User Directory & Activity Log Dashboard Tab
function ActivityDirectoryScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const allUsers = getUsers();

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Directory & Activity</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor registered platform accounts and user sessions.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Total Accounts</span>
            <Users className="w-5 h-5 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{allUsers.length}</div>
          <div className="text-xs font-medium text-emerald-600 mt-1">100% Operational status</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Security Audit</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">Secured</div>
          <div className="text-xs font-medium text-slate-500 mt-1">All tokens active & hashed</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">System Activity</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">Normal</div>
          <div className="text-xs font-medium text-blue-600 mt-1">Zero throttle warnings</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Registered User Records</h3>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
              <th className="pb-3 px-4">User Name</th>
              <th className="pb-3 px-4">Email Address</th>
              <th className="pb-3 px-4">Role</th>
              <th className="pb-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                    {u.name[0]}
                  </div>
                  {u.name}
                </td>
                <td className="py-4 px-4 text-slate-600">{u.email}</td>
                <td className="py-4 px-4 font-semibold text-slate-700">{u.role || 'Member'}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Profile Screen Component
function ProfileScreen({ user, onUpdateProfile, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [bio, setBio] = useState(user.bio);
  const sectionRef = useRef(null);

  useEffect(() => {
    animate(sectionRef.current, { opacity: [0, 1], translateY: [15, 0], duration: 400, ease: 'outExpo' });
  }, [isEditing]);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile({ name, role, bio });
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">User Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage personal account details and public persona.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-full text-sm font-extrabold flex items-center gap-2 transition-all">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-5">
            <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField label="Role / Title" icon={Briefcase} value={role} onChange={(e) => setRole(e.target.value)} />
            <div className="space-y-1.5">
              <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase ml-2">Bio</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 text-sm font-medium outline-none focus:border-slate-900 transition-all" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-md">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                <p className="text-sm font-extrabold text-slate-700 mt-0.5">{user.role}</p>
                <p className="text-xs font-bold text-slate-400 mt-1">{user.email}</p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">About Me</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">{user.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Screen Component
function SettingsScreen({ user, onUpdatePassword, showToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const settingsRef = useRef(null);

  useEffect(() => {
    animate(settingsRef.current, { opacity: [0, 1], translateY: [15, 0], duration: 400, ease: 'outExpo' });
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (currentPassword !== user.password) {
      showToast('Incorrect current password!', 'error');
      animate(settingsRef.current, { translateX: [-10, 10, -10, 10, 0], duration: 300 });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      showToast('New password must be at least 8 characters long', 'error');
      return;
    }

    onUpdatePassword(newPassword);
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password changed successfully!', 'success');
  };

  return (
    <div ref={settingsRef} className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Update security credentials and access protocols.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm max-w-lg">
        <h3 className="text-base font-black text-slate-900 mb-5 flex items-center gap-2.5">
          <div className="p-2.5 bg-slate-100 text-slate-900 rounded-xl"><Lock className="w-4 h-4" /></div> Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-5">
          <InputField label="Current Password" type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <InputField label="New Password" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <div className="pt-2">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================
   4. MAIN APP ROUTER CONTAINER
   ================================ */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset' | 'profile' | 'settings' | 'directory'
  const [resetEmail, setResetEmail] = useState('');
  const [toastInfo, setToastInfo] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastInfo({ message, type });
    setTimeout(() => setToastInfo(null), 4000);
  };

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        setCurrentUser(JSON.parse(savedSession));
        setCurrentView('profile');
      }
    } catch {}
  }, []);

  const handleLogin = (email, password, rememberMe) => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setCurrentUser(foundUser);
      if (rememberMe) localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
      setCurrentView('profile');
      showToast(`Welcome back, ${foundUser.name}!`, 'success');
    } else {
      showToast('Invalid email or password (Try rishi@gmail.com / Password@123)', 'error');
    }
  };

  const handleRegister = (name, email, password) => {
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      showToast('Email already registered!', 'error');
      return;
    }

    const newUser = { name, email, password, role: 'New Member', bio: 'Ready to explore full dashboard features!' };
    users.push(newUser);
    saveUsers(users);

    setCurrentUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setCurrentView('profile');
    showToast('Account created successfully!', 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
    setCurrentView('login');
    showToast('Logged out securely.', 'info');
  };

  const handleUpdateProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    const users = getUsers();
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
    }
  };

  const handleUpdatePassword = (newPassword) => {
    handleUpdateProfile({ password: newPassword });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} onClose={() => setToastInfo(null)} />}

      {currentView === 'login' && (
        <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} onSwitchToForgot={() => setCurrentView('forgot')} />
      )}
      {currentView === 'register' && (
        <RegisterScreen onRegister={handleRegister} onSwitchToLogin={() => setCurrentView('login')} />
      )}
      {currentView === 'forgot' && (
        <ForgotPasswordScreen setResetEmail={setResetEmail} onSwitchToLogin={() => setCurrentView('login')} onProceedToReset={() => setCurrentView('reset')} />
      )}
      {currentView === 'reset' && (
        <ResetPasswordScreen resetEmail={resetEmail} onFinishReset={(newPass) => { handleUpdatePassword(newPass); showToast('Password reset successfully!', 'success'); setCurrentView('login'); }} />
      )}

      {currentUser && (currentView === 'profile' || currentView === 'settings' || currentView === 'directory') && (
        <div className="min-h-screen flex flex-col md:flex-row">
          <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-8 p-3 bg-slate-100 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                  {currentUser.name[0]}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{currentUser.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button onClick={() => setCurrentView('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'profile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <User className="w-4 h-4" /> Profile
                </button>
                <button onClick={() => setCurrentView('directory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'directory' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Users className="w-4 h-4" /> Directory & Logs
                </button>
                <button onClick={() => setCurrentView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <SettingsIcon className="w-4 h-4" /> Settings
                </button>
              </nav>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>

          <main className="flex-1 p-8 md:p-12 max-w-5xl mx-auto w-full">
            {currentView === 'profile' && <ProfileScreen user={currentUser} onUpdateProfile={handleUpdateProfile} showToast={showToast} />}
            {currentView === 'directory' && <ActivityDirectoryScreen />}
            {currentView === 'settings' && <SettingsScreen user={currentUser} onUpdatePassword={handleUpdatePassword} showToast={showToast} />}
          </main>
        </div>
      )}
    </div>
  );
}