import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function registerUser(payload) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw { response: { data } };
  }
  return data;
}

const countries = [
  { name: "Nigeria", code: "+234" },
  { name: "Ghana", code: "+233" },
  { name: "Kenya", code: "+254" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
];

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ text: '', color: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      country: "Nigeria",
      countryCode: "+234",
      gender: "male"
    }
  });

  const watchPassword = watch('password', '');
  const watchDob = watch('dob', '');

  // Password strength checker
  useEffect(() => {
    if (watchPassword) {
      let score = 0;
      if (watchPassword.length >= 8) score++;
      if (/[a-z]/.test(watchPassword)) score++;
      if (/[A-Z]/.test(watchPassword)) score++;
      if (/[0-9]/.test(watchPassword)) score++;
      if (/[^A-Za-z0-9]/.test(watchPassword)) score++;

      const levels = [
        { text: 'Very Weak', color: 'text-red-400' },
        { text: 'Weak', color: 'text-orange-400' },
        { text: 'Fair', color: 'text-yellow-400' },
        { text: 'Good', color: 'text-green-400' },
        { text: 'Strong', color: 'text-emerald-400' }
      ];
      setPasswordStrength(levels[Math.min(score, 4)]);
    } else {
      setPasswordStrength({ text: '', color: '' });
    }
  }, [watchPassword]);

  // Auto calculate age from DOB
  useEffect(() => {
    if (watchDob) {
      const birth = new Date(watchDob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      setValue('age', Math.max(age, 18));
    }
  }, [watchDob, setValue]);

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      setError('terms', { type: 'manual', message: 'You must agree to the Terms of Service' });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fullname: data.fullname.trim(),
        username: data.username.trim().toLowerCase(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phone: data.phone.trim(),
        country: data.country,
        countryCode: data.countryCode,
        age: Number(data.age) || 18,
        dob: data.dob,
        gender: data.gender
      };

      const res = await registerUser(payload);
      localStorage.setItem("token", res.token);
      setAuthUser(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: err?.response?.data?.message || 'Registration failed. Please check your details.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-[#0a0d14] via-black to-[#0a0d14] flex items-center justify-center text-yellow-400">
      <div className="w-full max-w-xl bg-[#0f141c]/90 border border-yellow-400/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/assets/images/site-logo.png" alt="CirclePay" className="w-14 h-14 rounded-2xl mx-auto mb-3 shadow-lg border border-yellow-400/30" />
          <h1 className="text-3xl font-black text-yellow-300">Create an Account</h1>
          <p className="text-yellow-200/60 text-xs sm:text-sm mt-1">
            Join CirclePay to save, contribute, and manage Ajo circles
          </p>
        </div>

        {errors.root && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-sm font-semibold">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Okafor"
              {...register('fullname', { required: 'Full name is required' })}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400"
            />
            {errors.fullname && <p className="text-xs text-red-400 mt-1">{errors.fullname.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                placeholder="john_circle"
                {...register('username', { required: 'Username is required' })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400"
              />
              {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                {...register('email', { required: 'Valid email is required' })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Country</label>
              <select
                {...register('country')}
                className="w-full px-3 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400 text-sm"
              >
                {countries.map(c => <option key={c.code} value={c.name} className="bg-black">{c.name}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="tel"
                placeholder="08012345678"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400"
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input
                type="date"
                {...register('dob', { required: 'Date of birth is required' })}
                className="w-full px-3 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400 text-sm"
              />
              {errors.dob && <p className="text-xs text-red-400 mt-1">{errors.dob.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                {...register('gender')}
                className="w-full px-3 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400 text-sm"
              >
                <option value="male" className="bg-black">Male</option>
                <option value="female" className="bg-black">Female</option>
                <option value="other" className="bg-black">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 pr-10 focus:outline-none focus:border-yellow-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-yellow-400/60"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordStrength.text && (
                <span className={`text-[11px] mt-1 font-semibold ${passwordStrength.color}`}>
                  Strength: {passwordStrength.text}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    validate: val => val === watchPassword || 'Passwords do not match'
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 pr-10 focus:outline-none focus:border-yellow-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-yellow-400/60"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-yellow-200/70 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-yellow-400/40 text-yellow-500 focus:ring-0"
              />
              <span>
                I agree to CirclePay's{' '}
                <Link to="/terms" className="text-yellow-300 underline">Terms of Service</Link> &{' '}
                <Link to="/privacy" className="text-yellow-300 underline">Privacy Policy</Link>.
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-400 mt-1">{errors.terms.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-base hover:shadow-xl hover:shadow-yellow-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? "Creating Account..." : <>Create Account <FaArrowRight /></>}
          </button>
        </form>

        <p className="text-center text-xs text-yellow-200/50 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}