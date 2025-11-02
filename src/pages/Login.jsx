/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Login Page
 * by PutuWistika
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import {
  APP_NAME,
  APP_TAGLINE,
  ROUTES,
  VALIDATION,
} from '@utils/constants';
import { isValidEmail, isValidPassword } from '@utils/helpers';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = VALIDATION.EMAIL.MESSAGE;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = VALIDATION.PASSWORD.MESSAGE;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Call login from AuthContext
      const result = await login(formData.email, formData.password);

      // Login success is handled by AuthContext (redirect)
      if (!result.success) {
        setErrors({ general: result.error || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message || 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(ROUTES.HOME)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </motion.button>

        {/* Login Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card shadow-xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="inline-block mb-4"
            >
              <img
                src="/images/logo.png"
                alt={`${APP_NAME} Logo`}
                className="h-20 w-auto mx-auto drop-shadow-lg"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-gray-600">Sign in to manage your wedding guests</p>
            <p className="text-xs text-gray-500 mt-1">{APP_TAGLINE}</p>
          </motion.div>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert-error mb-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{errors.general}</p>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="admin@wedding.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                disabled={loading}
                leftIcon={<Mail className="w-5 h-5" />}
                autoComplete="email"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                disabled={loading}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                autoComplete="current-password"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
                rightIcon={!loading && <LogIn className="w-5 h-5" />}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>
          </form>


          {/* Footer Links */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => {
                  // Could open a help modal or redirect to support
                  alert('Contact support at: support@ruangtamu.com');
                }}
              >
                Contact Support
              </button>
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <button className="text-primary-600 hover:underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-primary-600 hover:underline">
              Privacy Policy
            </button>
          </p>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Login;