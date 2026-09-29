import { useState, useEffect } from 'react';

const App = () => {
  
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || 'login';
  });

  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [recoveryMail, setRecoveryMail] = useState('');
  const [resetMail, setResetMail] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Show/Hide password
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  // Toast notification 
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setToast({ show: true, text, type });
    setTimeout(() => {
      setToast({ show: false, text: '', type: 'success' });
    }, 3000);
  };

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('app_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Rishi',
      mail: 'rishi@gmail.com',
      password: '123456789',
      designation: 'Software Developer',
      bio: "I'm a full stack developer fresher",
    };
  });

  // Sync user data to localStorage
  useEffect(() => {
    localStorage.setItem('app_user', JSON.stringify(user));
  }, [user]);

  // Sync active page
  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  // dashboard
  const [profileTab, setProfileTab] = useState('profile');
  const [editName, setEditName] = useState(user.name);
  const [editDesignation, setEditDesignation] = useState(user.designation);
  const [editBio, setEditBio] = useState(user.bio);

  // password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Submit Handlers

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mail === user.mail) {
        if (password === user.password) {
          setLoginSuccess(true);
          if (rememberMe) {
            localStorage.setItem('remembered_mail', mail);
          } else {
            localStorage.removeItem('remembered_mail');
          }
          setMail('');
          setPassword('');

          setTimeout(() => {
            setLoginSuccess(false);
            setActivePage('profile');
            showToast('Welcome back, ' + user.name + '!');
          }, 1500);
          return;
        } else {
          setErrorMsg('Password incorrect');
        }
      } else {
        setErrorMsg('Invalid mail');
      }
      setMail('');
      setPassword('');
    }, 800);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Password mismatch');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        name,
        mail,
        password,
        designation: 'Software Developer',
        bio: "I'm a full stack developer fresher",
      };
      setUser(newUser);
      setActivePage('profile');
      setName('');
      setMail('');
      setPassword('');
      setConfirmPassword('');
      showToast('Account created successfully!');
    }, 800);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (recoveryMail !== user.mail) {
      setErrorMsg('No account found with this email');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetMail(recoveryMail);
      setRecoveryMail('');
      setActivePage('reset');
      showToast('Reset link sent to your email.');
    }, 800);
  };

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name: editName,
      designation: editDesignation,
      bio: editBio,
    });
    setProfileTab('profile');
    showToast('Profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (currentPassword !== user.password) {
      setPasswordMsg({ type: 'error', text: 'Current password is incorrect' });
      return;
    }

    if (newPassword === user.password) {
      setPasswordMsg({
        type: 'error',
        text: 'New password must be different from current',
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({
        type: 'error',
        text: 'New password must be at least 6 characters',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setUser({ ...user, password: newPassword });
    setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
    showToast('Password changed successfully!');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirmNew(false);

    setTimeout(() => setPasswordMsg({ type: '', text: '' }), 3000);
  };

  const goToLogin = () => {
    setErrorMsg('');
    setName('');
    setMail('');
    setPassword('');
    setConfirmPassword('');
    setRecoveryMail('');
    setResetMail('');
    setProfileTab('profile');
    setPasswordMsg({ type: '', text: '' });
    setLoginSuccess(false);
    setActivePage('login');
  };

  // Reusable class styles
  const pageBg =
    'min-h-screen flex flex-col items-center justify-center bg-orange-100/20 px-4';
  const card =
    'w-full max-w-sm bg-orange-100/80 hover:bg-orange-100/50 rounded-2xl shadow-md hover:shadow-lg hover:shadow-black/20 p-8 transition-shadow';
  const cardCenter = `${card} text-center`;
  const heading = 'text-2xl font-bold text-center text-orange-800 mb-6';
  const label = 'text-sm font-medium text-gray-700';
  const input =
    'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';
  const primaryBtn =
    'mt-2 bg-orange-600/80 hover:bg-orange-700 disabled:opacity-50 text-white font-medium rounded-lg py-2 transition-colors flex items-center justify-center gap-2';
  const primaryBtnFull =
    'w-full bg-orange-600/80 hover:bg-orange-700 text-white font-medium rounded-lg py-2 transition-colors';
  const linkBtn = 'text-sm text-orange-600 hover:text-orange-800 hover:underline';
  const mutedLinkBtn = 'text-sm text-gray-500 hover:text-gray-700 hover:underline';

  // Pages

  const renderPage = () => {
    //Login success
    if (loginSuccess) {
      return (
        <div className={pageBg}>
          <div className={cardCenter}>
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4 animate-bounce">
              <span className="text-3xl text-green-600">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-orange-800 mb-2">
              Login Successful
            </h2>
            <p className="text-sm text-gray-500">Redirecting to your dashboard…</p>
          </div>
        </div>
      );
    }

    if (activePage === 'login') {
      return (
        <div className={pageBg}>
          <div className={card}>
            <h2 className={heading}>Login</h2>

            {errorMsg && (
              <p className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-md py-2 px-3">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className={label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your mail id"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                  className={input}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className={label}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${input} w-full pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-orange-700 hover:text-orange-900"
                  >
                    {showLoginPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  Remember Me
                </label>
              </div>

              <button type="submit" disabled={isLoading} className={primaryBtn}>
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                )}
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setActivePage('signup')}
                className={linkBtn}
              >
                Go to Sign Up
              </button>
              <button
                type="button"
                onClick={() => setActivePage('forgot')}
                className={mutedLinkBtn}
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activePage === 'signup') {
      return (
        <div className={pageBg}>
          <div className={card}>
            <h2 className={heading}>Sign Up</h2>

            {errorMsg && (
              <p className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-md py-2 px-3">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="signup-name" className={label}>
                  Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your Name"
                  required
                  className={input}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="signup-mail" className={label}>
                  Email
                </label>
                <input
                  id="signup-mail"
                  type="email"
                  placeholder="Enter your mail"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                  className={input}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="signup-password" className={label}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showSignupPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${input} w-full pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-orange-700 hover:text-orange-900"
                  >
                    {showSignupPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="signup-confirm" className={label}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm"
                    type={showSignupConfirm ? 'text' : 'password'}
                    placeholder="Enter Password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`${input} w-full pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-orange-700 hover:text-orange-900"
                  >
                    {showSignupConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className={primaryBtn}>
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                )}
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button type="button" onClick={goToLogin} className={linkBtn}>
                Already have an account? Log In
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activePage === 'forgot') {
      return (
        <div className={pageBg}>
          <div className={cardCenter}>
            <h2 className={heading}>Forgot Password</h2>

            {errorMsg && (
              <p className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-md py-2 px-3">
                {errorMsg}
              </p>
            )}

            <p className="text-sm text-gray-500 mb-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your mail id"
                value={recoveryMail}
                onChange={(e) => setRecoveryMail(e.target.value)}
                required
                className={input}
              />

              <button type="submit" disabled={isLoading} className={primaryBtn}>
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                )}
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="flex flex-col gap-3 mt-6">
              <button type="button" onClick={goToLogin} className={mutedLinkBtn}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activePage === 'reset') {
      return (
        <div className={pageBg}>
          <div className={cardCenter}>
            <h2 className={heading}>Reset Password</h2>
            <p className="text-sm text-gray-500 mb-2">
              A reset link was sent to{' '}
              <span className="font-semibold text-gray-700">
                {resetMail || user.mail}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Choose a new password for your account.
            </p>

            <button type="button" onClick={goToLogin} className={primaryBtnFull}>
              Update Password &amp; Go to Login
            </button>
          </div>
        </div>
      );
    }

    if (activePage === 'profile') {
      return (
        <div className="min-h-screen bg-orange-50/40">
          {/* Top Navbar */}
          <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-600/80 flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <h1 className="text-lg font-bold text-orange-800">User Dashboard</h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {user.mail}
                </span>
                <div className="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-700">
                    {user.name[0]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="text-sm text-red-600 hover:text-red-800 hover:underline"
                >
                  Log Out
                </button>
              </div>
            </div>
          </header>

          {/* Body: sidebar + content */}
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full md:w-56 shrink-0">
              <nav className="bg-orange-100/80 rounded-2xl shadow-md p-4 flex md:flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setProfileTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    profileTab === 'profile'
                      ? 'bg-orange-600/80 text-white'
                      : 'text-orange-800 hover:bg-orange-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    profileTab === 'settings'
                      ? 'bg-orange-600/80 text-white'
                      : 'text-orange-800 hover:bg-orange-200'
                  }`}
                >
                  Edit Profile
                </button>
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              {/* Welcome banner */}
              <div className="bg-orange-100/80 rounded-2xl shadow-md p-6 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-orange-700">
                    {user.name[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-orange-800 truncate">
                    Welcome back, {user.name}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">
                    {user.designation}
                  </p>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Projects
                  </p>
                  <p className="text-2xl font-bold text-orange-800">12</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Tasks Done
                  </p>
                  <p className="text-2xl font-bold text-orange-800">48</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Messages
                  </p>
                  <p className="text-2xl font-bold text-orange-800">3</p>
                </div>
              </div>

              {/* Tab content card */}
              <div className="bg-orange-100/80 rounded-2xl shadow-md p-6">
                {profileTab === 'profile' && (
                  <div>
                    <h3 className="text-lg font-bold text-orange-800 mb-4">
                      Profile Overview
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-orange-100">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Name
                        </p>
                        <p className="text-gray-800 font-medium mt-1">
                          {user.name}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-100">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Email
                        </p>
                        <p className="text-gray-800 font-medium mt-1 truncate">
                          {user.mail}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-100">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Designation
                        </p>
                        <p className="text-gray-800 font-medium mt-1">
                          {user.designation}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-100 sm:col-span-2">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Bio
                        </p>
                        <p className="text-gray-700 text-sm mt-1">{user.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === 'settings' && (
                  <div className="flex flex-col gap-8">
                    {/* --- Profile details --- */}
                    <div>
                      <h3 className="text-lg font-bold text-orange-800 mb-4">
                        Edit Profile
                      </h3>
                      <div className="flex flex-col gap-4 max-w-md">
                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-name" className={label}>
                            Name
                          </label>
                          <input
                            id="edit-name"
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className={input}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-designation" className={label}>
                            Designation
                          </label>
                          <input
                            id="edit-designation"
                            type="text"
                            value={editDesignation}
                            onChange={(e) =>
                              setEditDesignation(e.target.value)
                            }
                            placeholder="Designation"
                            className={input}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-bio" className={label}>
                            Bio
                          </label>
                          <textarea
                            id="edit-bio"
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            placeholder="Bio"
                            rows={3}
                            className={`${input} resize-none`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className={primaryBtn}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-orange-200" />

                    {/* --- Change password --- */}
                    <div>
                      <h3 className="text-lg font-bold text-orange-800 mb-4">
                        Change Password
                      </h3>

                      {passwordMsg.text && (
                        <p
                          className={`text-sm text-center mb-4 rounded-md py-2 px-3 border ${
                            passwordMsg.type === 'error'
                              ? 'text-red-600 bg-red-50 border-red-200'
                              : 'text-green-700 bg-green-50 border-green-200'
                          }`}
                        >
                          {passwordMsg.text}
                        </p>
                      )}

                      <form
                        onSubmit={handleChangePassword}
                        className="flex flex-col gap-4 max-w-md"
                      >
                        {/* Current password */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="current-password" className={label}>
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              id="current-password"
                              type={showCurrent ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                              placeholder="Enter current password"
                              required
                              className={`${input} w-full pr-12`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrent((v) => !v)}
                              className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-orange-700 hover:text-orange-900"
                            >
                              {showCurrent ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>

                        {/* New password */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="new-password" className={label}>
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              id="new-password"
                              type={showNew ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                              required
                              className={`${input} w-full pr-12`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNew((v) => !v)}
                              className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-orange-700 hover:text-orange-900"
                            >
                              {showNew ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>

                        {/* Confirm new password */}
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="confirm-new-password"
                            className={label}
                          >
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              id="confirm-new-password"
                              type={showConfirmNew ? 'text' : 'password'}
                              value={confirmNewPassword}
                              onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                              }
                              placeholder="Re-enter new password"
                              required
                              className={`${input} w-full pr-12`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmNew((v) => !v)}
                              className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-orange-700 hover:text-orange-900"
                            >
                              {showConfirmNew ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>

                        <button type="submit" className={primaryBtn}>
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="antialiased relative">
      {renderPage()}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-gray-700">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      )}
    </div>
  );
};

export default App;