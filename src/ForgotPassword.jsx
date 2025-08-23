import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';
import LiveBackgroundDark from './components/livebackground/LiveBackgroundDark';
import LiveBackgroundLight from './components/livebackground/LiveBackgroundLight';
import { Link } from 'react-router-dom';
import API_BASE_URL from './config/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, { email });
      toast.success(response.data.message || '✅ Reset link sent!', {
        position: "top-center",
        autoClose: 3000,
        style: {
          backgroundColor: '#28a745',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || '❌ Failed to send reset link.', {
        position: "top-center",
        autoClose: 3000,
        style: {
          backgroundColor: '#dc3545',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <PageMeta />
      <Navbar />

      <div className={`relative min-h-screen bg-cover bg-center transition-all duration-300 ${isDark ? 'brightness-75' : 'brightness-100'}`}>
        <div className="absolute inset-0 w-full h-full z-0">
          {isDark ? <LiveBackgroundDark /> : <LiveBackgroundLight />}
        </div>

        <div className="relative z-20 min-h-screen flex flex-col lg:flex-row">
          {/* Left Section */}
          <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 px-8 py-16 lg:pl-24">
            <img src="/logo.png" alt="Vipreshana Logo" className="w-32 h-32 mb-6 drop-shadow-lg animate-bounce-slow" />
            <h2 className={`text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Forgot Password?</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Don’t worry! Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-1 flex-col items-center justify-center w-full lg:w-1/2 px-4 py-16 lg:mt-24 mt-8">
            <div className={`max-w-xl w-full p-12 shadow-2xl shadow-white/30 backdrop-blur-lg bg-white/20 ${isDark ? 'text-white' : 'text-gray-900'} mb-12 relative`}>
              {/* Corner Borders */}
              <span className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />
              <span className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />
              <span className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />
              <span className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${isDark ? 'border-white' : 'border-gray-800'}`} />

              <h1 className={`text-4xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                Reset Your Password
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>📧 Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={handleChange}
                    style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: isDark ? '#fff' : '#1a202c' }}
                    className="mt-1 block w-full border rounded-xl shadow-sm p-3 backdrop-blur-sm border-white/40"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email || isLoading}
                  className={`w-full font-semibold py-3 rounded-xl ${
                    !email || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isDark
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className={`text-center text-sm mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Remember your password?{' '}
                <Link to="/login" className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Back to Login
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

export default ForgotPassword;
