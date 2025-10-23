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

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      navigate('/dashboard');
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

  return (
    <div className="circlepay-register-page">
      <div className="circlepay-register-card">
        <div className="circlepay-register-logo">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" />
        </div>
        <h2 className="circlepay-register-title">Create Your CirclePay Account</h2>
        <p className="circlepay-register-subtitle">Sign up to invest in Nigeria’s top stocks.</p>
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
                  validate: (value) => {
                    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
                      return 'Password must contain uppercase, lowercase, and number';
                    }
                    return true;
                  }
                })}
                className={errors.password ? 'input-error' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="circlepay-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {watchPassword && passwordStrength.text && (
              <span className={passwordStrength.color}>
                Password strength: {passwordStrength.text}
              </span>
            )}
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Confirm Password</label>
            <div className="circlepay-password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watchPassword || 'Passwords do not match'
                })}
                className={errors.confirmPassword ? 'input-error' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="circlepay-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Country</label>
            <input
              type="text"
              placeholder="Search country..."
              value={countrySearch}
              onChange={e => setCountrySearch(e.target.value)}
              className="country-search"
            />
            <select
              {...register('country', { required: 'Country is required' })}
              className={errors.country ? 'input-error' : ''}
              value={watch('country') || ''}
              onChange={e => {
                const selectedCountry = countries.find(c => c.name === e.target.value);
                setCountryCode(selectedCountry?.code || '');
                setValue('country', e.target.value);
                setValue('countryCode', selectedCountry?.code || '');
              }}
            >
              <option value="" disabled>Select your country</option>
              {countries
                .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                .map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>
            {errors.country && (
              <span className="error-message">{errors.country.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Phone Number</label>
            <div className="flex" style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                {...register('countryCode', {
                  required: 'Country code is required'
                })}
                className={errors.countryCode ? 'input-error' : ''}
                style={{ flex: '0 0 auto', minWidth: '100px' }}
              >
                <option value="" disabled>Code</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className={errors.phone ? 'input-error' : ''}
                style={{ flex: '1' }}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\-\s()]{7,15}$/,
                    message: 'Enter a valid phone number (7-15 digits)'
                  }
                })}
              />
            </div>
            {(errors.countryCode || errors.phone) && (
              <span className="error-message">
                {errors.countryCode?.message || errors.phone?.message}
              </span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              {...register('age', { 
                required: 'Age is required', 
                min: { value: 1, message: 'Enter a valid age' },
                max: { value: 120, message: 'Age must be realistic' },
                validate: (value) => {
                  const dob = watch('dob');
                  if (dob) {
                    const calculatedAge = calculateAge(dob);
                    return parseInt(value) === calculatedAge || `Age must match date of birth (should be ${calculatedAge})`;
                  }
                  return true;
                }
              })}
              className={errors.age ? 'input-error' : ''}
            />
            {errors.age && (
              <span className="error-message">{errors.age.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              {...register('dob', { 
                required: 'Date of birth is required',
                validate: (value) => {
                  const age = watch('age');
                  if (age) {
                    const calculatedAge = calculateAge(value);
                    return parseInt(age) === calculatedAge || `Date of birth must match age (calculated age: ${calculatedAge})`;
                  }
                  return true;
                }
              })}
              className={errors.dob ? 'input-error' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dob && (
              <span className="error-message">{errors.dob.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Gender</label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className={errors.gender ? 'input-error' : ''}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <span className="error-message">{errors.gender.message}</span>
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
          background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 100%);
          padding: 2rem 0;
        }
        .circlepay-register-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(56,189,248,0.13);
          padding: 2.5rem 2rem 2rem 2rem;
          max-width: 440px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          border: 1px solid #bae6fd;
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
          background: #38bdf8;
          object-fit: cover;
          box-shadow: 0 2px 12px rgba(56,189,248,0.18);
        }
        .circlepay-register-title {
          text-align: center;
          color: #0ea5e9;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .circlepay-register-subtitle {
          text-align: center;
          color: #64748b;
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
          color: #0ea5e9;
          margin-bottom: 0.3rem;
          font-size: 1rem;
          font-weight: 500;
        }
        .circlepay-form-group input,
        .circlepay-form-group select,
        .country-search {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #bae6fd;
          border-radius: 7px;
          padding: 0.7rem 1rem;
          font-size: 1rem;
          transition: border 0.2s;
        }
        .circlepay-form-group input:focus,
        .circlepay-form-group select:focus,
        .country-search:focus {
          border-color: #0ea5e9;
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
          color: #38bdf8;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .circlepay-password-toggle:hover {
          color: #0ea5e9;
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
          background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
          color: #fff;
          border: none;
          box-shadow: 0 2px 12px rgba(56,189,248,0.10);
          transition: background 0.2s, color 0.2s;
        }
        .circlepay-btn.circlepay-register-btn:disabled {
          background: #bae6fd;
          color: #64748b;
        }
        .circlepay-register-footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        .circlepay-login-link {
          color: #0ea5e9;
          font-weight: 500;
          text-decoration: none;
        }
        .circlepay-login-link:hover {
          color: #38bdf8;
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
          color: #64748b;
        }
        .terms-checkbox {
          margin-top: 0.2rem;
        }
        .terms-link {
          color: #0ea5e9;
          text-decoration: none;
        }
        .terms-link:hover {
          color: #38bdf8;
          text-decoration: underline;
        }
        .text-success { color: #00e676; }
        .text-error { color: #ef4444; }
        .text-warning { color: #ffb300; }
        .text-info { color: #29b6f6; }
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