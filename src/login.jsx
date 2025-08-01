import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';
import AuthRequired from './components/AuthRequired';
import LiveBackgroundDark from './components/livebackground/LiveBackgroundDark';
import LiveBackgroundLight from './components/livebackground/LiveBackgroundLight';

import API_BASE_URL from './config/api';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', email: '', password: '' });
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cleanUrlOfTokens = () => {
    const currentUrl = window.location.toString();
    const hasSensitiveData =
      currentUrl.includes('access_token') ||
      currentUrl.includes('refresh_token') ||
      currentUrl.includes('id_token') ||
      currentUrl.includes('token=') ||
      currentUrl.includes('authorization=') ||
      currentUrl.includes('auth=');

    if (window.location.pathname.includes('/auth/')) {
      window.history.replaceState(null, document.title, '/logindashboard');
      return;
    }

    if (hasSensitiveData || window.location.hash || window.location.search) {
      window.history.replaceState(null, document.title, window.location.pathname);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    cleanUrlOfTokens();

    console.log('🔍 Login attempt:', { loginMethod, formData });

    // Validate based on login method
    if (loginMethod === 'phone') {
      const validIndianNumber = /^[6-9]\d{9}$/;
      const allowedTestPhones = ['4444444444', '1212122121', '1234567890', '0987654321'];

      if (!validIndianNumber.test(formData.phone) && !allowedTestPhones.includes(formData.phone)) {
        toast.error('⚠️ Enter a valid phone number');
        setIsLoading(false);
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('⚠️ Enter a valid email address');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Prepare login data based on method
      const loginData = {
        password: formData.password,
        ...(loginMethod === 'phone' ? { phone: formData.phone } : { email: formData.email })
      };

      console.log('📤 Sending login data:', loginData);
      console.log('🔗 API URL:', `${API_BASE_URL}/api/login`);

      const response = await axios.post(`${API_BASE_URL}/api/login`, loginData, {
        withCredentials: true
      });

      const { user, message } = response.data;

      if (user) {
        const safeUserData = {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role
        };

        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(safeUserData));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('authChange', { detail: { isAuthenticated: true, user: safeUserData } }));
        window.dispatchEvent(new Event('login'));

        toast.success(`🎉 ${message}`, {
          toastId: 'login-success',
          position: 'top-center',
          autoClose: 1500,
          style: {
            backgroundColor: '#28a745',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '12px',
            textAlign: 'center',
          },
        });

        setTimeout(() => {
          setIsLoading(false);
          cleanUrlOfTokens();

          // 👇 Route based on credentials
          let redirectPath = '/logindashboard';
          if (loginMethod === 'phone' && formData.phone === '1234567890' && formData.password === '1212') {
            redirectPath = '/driver';
          } else if (loginMethod === 'phone' && formData.phone === '0987654321' && formData.password === '1212') {
            redirectPath = '/admin';
          } else {
            redirectPath = location.state?.from || '/logindashboard';
          }

          navigate(redirectPath, { replace: true });
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('⚠️ Login failed! Please try again.', {
        toastId: 'login-error',
        position: 'top-center',
        autoClose: 3000,
        style: {
          backgroundColor: '#e60023',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      });
    }
  };



  const isDisabled = loginMethod === 'phone' 
    ? (!formData.phone || !formData.password)
    : (!formData.email || !formData.password);
  const redirectFrom = location.state?.from;

  return (
    <>
      <PageMeta />
      <Navbar />
      {redirectFrom && <AuthRequired redirectPath={redirectFrom} />}

      <div className={`relative min-h-screen bg-cover bg-center transition-all duration-300 ${isDark ? 'brightness-75' : 'brightness-100'}`}>
        <div className="absolute inset-0 w-full h-full z-0">
          {isDark ? <LiveBackgroundDark /> : <LiveBackgroundLight />}
        </div>

        <div className="relative z-20 min-h-screen flex flex-col lg:flex-row">
          {/* Left Section */}
          <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 px-8 py-16 lg:pl-24">
            <img src="/logo.png" alt="Vipreshana Logo" className="w-32 h-32 mb-6 drop-shadow-lg animate-bounce-slow" />
            <h2 className={`text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Welcome to Vipreshana</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Your trusted logistics partner.<br/>Sign in to continue!</p>
          </div>

          {/* Right Section */}
          <div className="flex flex-1 flex-col items-center justify-center w-full lg:w-1/2 px-4 py-16 lg:mt-24 mt-8">
            <div className={`max-w-xl w-full p-12 shadow-2xl shadow-white/30 backdrop-blur-lg bg-white/20 ${isDark ? 'text-white' : 'text-gray-900'} mb-12 relative`}>
              {/* Corners */}
              <span className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />
              <span className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />
              <span className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />
              <span className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />

              <h1 className={`text-4xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Sign In</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Login Method Selector */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      loginMethod === 'phone'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📞 Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      loginMethod === 'email'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📧 Email
                  </button>
                </div>

                {/* Phone Input */}
                {loginMethod === 'phone' && (
                  <div>
                    <label htmlFor="phone" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>📞 Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: isDark ? '#fff' : '#1a202c' }}
                      className="mt-1 block w-full border rounded-xl shadow-sm p-3 backdrop-blur-sm border-white/40"
                      placeholder="Enter your phone number"
                    />
                  </div>
                )}

                {/* Email Input */}
                {loginMethod === 'email' && (
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>📧 Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: isDark ? '#fff' : '#1a202c' }}
                      className="mt-1 block w-full border rounded-xl shadow-sm p-3 backdrop-blur-sm border-white/40"
                      placeholder="Enter your email address"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>🔒 Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: isDark ? '#fff' : '#1a202c' }}
                      className="block w-full border rounded-xl shadow-sm p-3 backdrop-blur-sm border-white/40"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-5 top-1/2 transform -translate-y-1/2 text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isDisabled || isLoading}
                  className={`w-full font-semibold py-3 rounded-xl ${
                    isDisabled || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isDark
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </button>
              </form>

              <p className={`text-center text-sm mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <Link to="/register" className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Register
                </Link>
              </p>
              <p className={`text-center text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Link to="/forgot-password" className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Forgot Password?
                </Link>
              </p>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default Login;
