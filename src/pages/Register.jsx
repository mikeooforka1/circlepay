import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function registerUser(payload) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw { response: { data: error } };
  }
  return res.json();
}

const countries = [
  { name: "Nigeria", code: "+234" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "India", code: "+91" },
];

// Loading/Redirect Component
const LoadingRedirect = ({ userName }) => {
  return (
    <div className="loading-redirect-container">
      <div className="loading-redirect-content">
        {/* Logo */}
        <div className="loading-redirect-logo">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" />
        </div>

        {/* Spinner */}
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
        </div>

        {/* Loading Text */}
        <h2 className="loading-title">Welcome to CirclePay</h2>
        <p className="loading-subtitle">
          {userName ? `Welcome, ${userName}!` : 'Setting up your account...'}
        </p>

        {/* Progress Bar */}
        <div className="loading-progress-bar">
          <div className="progress-fill"></div>
        </div>

        {/* Additional Info */}
        <p className="loading-info">Preparing your dashboard...</p>
      </div>

      <style>{`
        .loading-redirect-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, #000 0%, #222 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-redirect-content {
          text-align: center;
          max-width: 300px;
        }

        .loading-redirect-logo {
          margin-bottom: 2rem;
          animation: fadeInScale 0.6s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-redirect-logo img {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: #FFD700;
          object-fit: cover;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .loading-spinner {
          margin-bottom: 2rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner-circle {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(212, 175, 55, 0.2);
          border-top: 4px solid #FFD700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-title {
          color: #FFD700;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .loading-subtitle {
          color: #ffe066;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .loading-progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(212, 175, 55, 0.2);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700 0%, #ffe066 100%);
          border-radius: 2px;
          animation: progressExpand 2s ease-in-out;
        }

        @keyframes progressExpand {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        .loading-info {
          color: #ffe066;
          font-size: 0.95rem;
          animation: fadeInUp 0.8s ease-out 0.8s both;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectUserName, setRedirectUserName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [countrySearch, setCountrySearch] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue
  } = useForm();

  const watchPassword = watch('password', '');
  const watchUsername = watch('username', '');

  useEffect(() => {
    if (watchUsername && watchUsername.length >= 3) {
      const timer = setTimeout(() => {
        const unavailableUsernames = ['admin', 'user', 'test', 'demo'];
        if (unavailableUsernames.includes(watchUsername.toLowerCase())) {
          setUsernameAvailable(false);
        } else {
          setUsernameAvailable(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameAvailable(null);
    }
  }, [watchUsername]);

  useEffect(() => {
    if (watchPassword) {
      let score = 0;
      let text = '';
      let color = '';
      if (watchPassword.length >= 8) score++;
      if (/[a-z]/.test(watchPassword)) score++;
      if (/[A-Z]/.test(watchPassword)) score++;
      if (/[0-9]/.test(watchPassword)) score++;
      if (/[^A-Za-z0-9]/.test(watchPassword)) score++;
      switch (score) {
        case 0:
        case 1: text = 'Very Weak'; color = 'text-error'; break;
        case 2: text = 'Weak'; color = 'text-warning'; break;
        case 3: text = 'Fair'; color = 'text-info'; break;
        case 4: text = 'Good'; color = 'text-success'; break;
        case 5: text = 'Strong'; color = 'text-success'; break;
        default: text = ''; color = '';
      }
      setPasswordStrength({ score, text, color });
    } else {
      setPasswordStrength({ score: 0, text: '', color: '' });
    }
  }, [watchPassword]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    const dob = watch('dob');
    if (dob) {
      const calculatedAge = calculateAge(dob);
      setValue('age', calculatedAge);
    }
  }, [watch('dob'), setValue]);

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      setError('terms', {
        type: 'manual',
        message: 'You must agree to the Terms of Service',
      });
      return;
    }
    setIsLoading(true);

    const payload = {
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
      country: data.country,
      countryCode: data.countryCode,
      age: data.age,
      dob: data.dob,
      gender: data.gender,
      referralCode: data.referralCode || undefined,
    };

    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === "string" && value.trim() === "") {
        setError('root', {
          type: 'manual',
          message: `Field "${key}" cannot be empty.`,
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await registerUser(payload);
      localStorage.setItem("token", response.token);
      setAuthUser(response.user);

      // Show redirect screen
      setRedirectUserName(response.user?.fullname?.split(' ')[0] || 'User');
      setIsRedirecting(true);

      // Navigate after animation completes
      setTimeout(() => {
        navigate('/dashboard');
      }, 3500);
    } catch (error) {
      setError('root', {
        type: 'manual',
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading redirect screen
  if (isRedirecting) {
    return <LoadingRedirect userName={redirectUserName} />;
  }

  return (
    <div className="circlepay-register-page">
      <div className="circlepay-register-card">
        <div className="circlepay-register-logo">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" />
        </div>
        <h2 className="circlepay-register-title">Create Your CirclePay Account</h2>
        <p className="circlepay-register-subtitle">Sign up to Cirlepay best Ajo platform</p>
        <form onSubmit={handleSubmit(onSubmit)} className="circlepay-register-form">
          {errors.root && (
            <div className="circlepay-register-error" role="alert">
              {errors.root.message}
            </div>
          )}
          <div className="circlepay-form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register('fullname', { required: 'Full name is required' })}
              className={errors.fullname ? 'input-error' : ''}
            />
            {errors.fullname && (
              <span className="error-message">{errors.fullname.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                }
              })}
              className={errors.username ? 'input-error' : ''}
              autoComplete="username"
            />
            {watchUsername && watchUsername.length >= 3 ? (
              usernameAvailable === true ? (
                <span className="text-success">Username is available</span>
              ) : usernameAvailable === false ? (
                <span className="text-error">Username is not available</span>
              ) : null
            ) : (
              <span className="text-info">Choose a unique username (3+ characters)</span>
            )}
            {errors.username && (
              <span className="error-message">{errors.username.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Password</label>
            <div className="circlepay-password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  validate: {
                    hasUpperCase: (value) => /[A-Z]/.test(value) || 'Must contain at least one uppercase letter',
                    hasNumber: (value) => /[0-9]/.test(value) || 'Must contain at least one number',
                  }
                })}
                className={errors.password ? 'input-error' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="circlepay-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
            {watchPassword && (
              <span className={`password-strength ${passwordStrength.color}`}>
                Strength: {passwordStrength.text}
              </span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Confirm Password</label>
            <div className="circlepay-password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watchPassword || 'Passwords do not match'
                })}
                className={errors.confirmPassword ? 'input-error' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="circlepay-password-toggle"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+\-\s()]{7,}$/,
                  message: 'Invalid phone number'
                }
              })}
              className={errors.phone ? 'input-error' : ''}
              autoComplete="tel"
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Country</label>
            <select
              {...register('country', { required: 'Country is required' })}
              className={errors.country ? 'input-error' : ''}
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <span className="error-message">{errors.country.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Country Code</label>
            <select
              {...register('countryCode', { required: 'Country code is required' })}
              className={errors.countryCode ? 'input-error' : ''}
            >
              <option value="">Select country code</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code}
                </option>
              ))}
            </select>
            {errors.countryCode && (
              <span className="error-message">{errors.countryCode.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              {...register('dob', { required: 'Date of birth is required' })}
              className={errors.dob ? 'input-error' : ''}
            />
            {errors.dob && (
              <span className="error-message">{errors.dob.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="Age (auto-calculated)"
              {...register('age', { required: 'Age is required' })}
              className={errors.age ? 'input-error' : ''}
              disabled
            />
          </div>
          <div className="circlepay-form-group">
            <label>Gender</label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className={errors.gender ? 'input-error' : ''}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <span className="error-message">{errors.gender.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>
              Referral Code <span className="text-info">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Enter referral code (if any)"
              {...register('referralCode')}
              className={errors.referralCode ? 'input-error' : ''}
              maxLength={6}
            />
            {errors.referralCode && (
              <span className="error-message">{errors.referralCode.message}</span>
            )}
          </div>
          <div className="circlepay-form-group terms-group">
            <label className="terms-label">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="terms-checkbox"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="terms-link" target="_blank">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="terms-link" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <span className="error-message">{errors.terms.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="circlepay-btn circlepay-register-btn"
            disabled={
              isLoading ||
              !agreedToTerms ||
              !watchUsername ||
              !watchPassword ||
              !watch('email') ||
              !watch('phone') ||
              !watch('country')
            }
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="circlepay-register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="circlepay-login-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        .circlepay-register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #000 0%, #222 100%);
          padding: 2rem 0;
        }
        .circlepay-register-card {
          background: #111;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(212,175,55,0.13);
          padding: 2.5rem 2rem 2rem 2rem;
          max-width: 440px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          border: 1px solid #FFD700;
        }
        .circlepay-register-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .circlepay-register-logo img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: #FFD700;
          object-fit: cover;
          box-shadow: 0 2px 12px rgba(212,175,55,0.18);
        }
        .circlepay-register-title {
          text-align: center;
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .circlepay-register-subtitle {
          text-align: center;
          color: #ffe066;
          margin-bottom: 1.5rem;
        }
        .circlepay-register-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .circlepay-form-group {
          display: flex;
          flex-direction: column;
        }
        .circlepay-form-group label {
          color: #FFD700;
          margin-bottom: 0.3rem;
          font-size: 1rem;
          font-weight: 500;
        }
        .circlepay-form-group input,
        .circlepay-form-group select,
        .country-search {
          background: #222;
          color: #FFD700;
          border: 1px solid #FFD700;
          border-radius: 7px;
          padding: 0.7rem 1rem;
          font-size: 1rem;
          transition: border 0.2s;
        }
        .circlepay-form-group input:focus,
        .circlepay-form-group select:focus,
        .country-search:focus {
          border-color: #ffe066;
          outline: none;
        }
        .circlepay-password-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .circlepay-password-input-container input {
          width: 100%;
          padding-right: 2.5rem;
        }
        .circlepay-password-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: #FFD700;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .circlepay-password-toggle:hover {
          color: #ffe066;
        }
        .input-error {
          border-color: #ef4444;
        }
        .error-message {
          color: #ef4444;
          font-size: 0.95rem;
          margin-top: 0.2rem;
        }
        .circlepay-register-error {
          background: #fee2e2;
          color: #ef4444;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 0.7rem 1rem;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 1rem;
        }
        .circlepay-btn.circlepay-register-btn {
          width: 100%;
          padding: 0.9rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 0.5rem;
          border-radius: 12px;
          background: linear-gradient(90deg, #FFD700 0%, #ffe066 100%);
          color: #111;
          border: none;
          box-shadow: 0 2px 12px rgba(212,175,55,0.10);
          transition: background 0.2s, color 0.2s;
        }
        .circlepay-btn.circlepay-register-btn:disabled {
          background: #ffe066;
          color: #FFD700;
        }
        .circlepay-register-footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        .circlepay-login-link {
          color: #FFD700;
          font-weight: 500;
          text-decoration: none;
        }
        .circlepay-login-link:hover {
          color: #ffe066;
          text-decoration: underline;
        }
        .terms-group {
          margin-top: 0.5rem;
        }
        .terms-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.98rem;
          color: #ffe066;
        }
        .terms-checkbox {
          margin-top: 0.2rem;
        }
        .terms-link {
          color: #FFD700;
          text-decoration: none;
        }
        .terms-link:hover {
          color: #ffe066;
          text-decoration: underline;
        }
        .password-strength {
          font-size: 0.95rem;
          margin-top: 0.2rem;
          font-weight: 500;
        }
        .text-success { color: #00e676; }
        .text-error { color: #ef4444; }
        .text-warning { color: #ffb300; }
        .text-info { color: #ffe066; }
        @media (max-width: 600px) {
          .circlepay-register-card {
            padding: 4.2rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;