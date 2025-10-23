import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function login(payload) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
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

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rootError, setRootError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRootError('');
    clearErrors();

    // Validation: email or phone
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const phonePattern = /^[0-9+\-\s()]{7,}$/;
    if (!emailPattern.test(data.emailOrPhone) && !phonePattern.test(data.emailOrPhone)) {
      setError('emailOrPhone', {
        type: 'manual',
        message: 'Enter a valid email or phone number',
      });
      setIsLoading(false);
      return;
    }
    if (phonePattern.test(data.emailOrPhone) && !data.emailOrPhone.trim().startsWith('+')) {
      setError('emailOrPhone', {
        type: 'manual',
        message: 'Please include your country code (e.g. +234) with your phone number.',
      });
      setIsLoading(false);
      return;
    }

    try {
      let payload = { password: data.password };
      if (emailPattern.test(data.emailOrPhone)) {
        payload.email = data.emailOrPhone;
      } else {
        payload.phone = data.emailOrPhone;
        const match = data.emailOrPhone.match(/^(\+\d{1,4})/);
        payload.countryCode = match ? match[1] : '';
      }

      const response = await login(payload);
      localStorage.setItem("token", response.token);
      setAuthUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      setRootError(
        err?.response?.data?.message ||
        'Invalid email/phone or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="circlepay-login-page">
      <div className="circlepay-login-card">
        <div className="circlepay-login-logo">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" />
        </div>
        <h2 className="circlepay-login-title">Sign in to CirclePay</h2>
        <p className="circlepay-login-subtitle">Access your account and invest in Nigeria’s top stocks.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="circlepay-login-form">
          {rootError && (
            <div className="circlepay-login-error" role="alert">
              {rootError}
            </div>
          )}
          <div className="circlepay-form-group">
            <label>Email or Phone Number</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              {...register('emailOrPhone', {
                required: 'Email or phone number is required',
              })}
              className={errors.emailOrPhone ? 'input-error' : ''}
              autoComplete="username"
            />
            {errors.emailOrPhone && (
              <span className="error-message">{errors.emailOrPhone.message}</span>
            )}
          </div>
          <div className="circlepay-form-group">
            <label>Password</label>
            <div className="circlepay-password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={errors.password ? 'input-error' : ''}
                autoComplete="current-password"
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
          </div>
          <button
            type="submit"
            className="circlepay-btn circlepay-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="circlepay-login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="circlepay-register-link">
              Create one here
            </Link>
          </p>
        </div>
        <div className="circlepay-demo-credentials">
          <p className="circlepay-demo-title">Demo Credentials:</p>
          <p>
            <strong>Email:</strong> demo@example.com<br />
            <strong>Password:</strong> password
          </p>
        </div>
        <div className="circlepay-terms">
          <p>
            By signing in, you agree to our{' '}
            <Link to="/terms" className="circlepay-terms-link">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="circlepay-terms-link">Privacy Policy</Link>
          </p>
        </div>
      </div>
      <style>{`
        .circlepay-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 100%);
          padding: 2rem 0;
        }
        .circlepay-login-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(56,189,248,0.13);
          padding: 2.5rem 2rem 2rem 2rem;
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          border: 1px solid #bae6fd;
        }
        .circlepay-login-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .circlepay-login-logo img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: #38bdf8;
          object-fit: cover;
          box-shadow: 0 2px 12px rgba(56,189,248,0.18);
        }
        .circlepay-login-title {
          text-align: center;
          color: #0ea5e9;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .circlepay-login-subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 1.5rem;
        }
        .circlepay-login-form {
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
        .circlepay-form-group input {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #bae6fd;
          border-radius: 7px;
          padding: 0.7rem 1rem;
          font-size: 1rem;
          transition: border 0.2s;
        }
        .circlepay-form-group input:focus {
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
        .circlepay-login-error {
          background: #fee2e2;
          color: #ef4444;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 0.7rem 1rem;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 1rem;
        }
        .circlepay-btn.circlepay-login-btn {
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
        .circlepay-btn.circlepay-login-btn:disabled {
          background: #bae6fd;
          color: #64748b;
        }
        .circlepay-login-footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        .circlepay-register-link {
          color: #0ea5e9;
          font-weight: 500;
          text-decoration: none;
        }
        .circlepay-register-link:hover {
          color: #38bdf8;
          text-decoration: underline;
        }
        .circlepay-demo-credentials {
          background: #f1f5f9;
          border-radius: 8px;
          padding: 0.7rem 1rem;
          margin-top: 1.5rem;
          text-align: center;
          color: #64748b;
          font-size: 0.98rem;
        }
        .circlepay-demo-title {
          color: #0ea5e9;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }
        .circlepay-terms {
          margin-top: 1.2rem;
          text-align: center;
          font-size: 0.92rem;
          color: #64748b;
        }
        .circlepay-terms-link {
          color: #0ea5e9;
          text-decoration: none;
        }
        .circlepay-terms-link:hover {
          color: #38bdf8;
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .circlepay-login-card {
            padding: 4.2rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;