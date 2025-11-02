/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Landing Page
 * by PutuWistika
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import Button from '@components/ui/Button';
import {
  APP_NAME,
  APP_TAGLINE,
  ROUTES,
  LOTTIE_ANIMATIONS,
  ANIMATION_VARIANTS,
} from '@utils/constants';

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Features data
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Quick QR scanning and instant guest verification',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multi-Role Support',
      description: 'Separate dashboards for Admin and Runner roles',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Real-time Queue',
      description: 'Live updates on guest queue and check-in status',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Reliable',
      description: 'Built with security and data integrity in mind',
    },
  ];

  // Benefits data
  const benefits = [
    'Streamlined guest check-in process',
    'Eliminate long waiting queues',
    'Track gift contributions easily',
    'Professional guest management',
    'Real-time coordination between team',
    'Detailed analytics and reporting',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      {/* Navbar with Logo */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/images/logo.png"
                alt={`${APP_NAME} Logo`}
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h2 className="text-xl font-bold gradient-text">
                  {APP_NAME}
                </h2>
                <p className="text-xs text-gray-600">{APP_TAGLINE}</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(ROUTES.LOGIN)}
                className="gradient-gemini hover:gradient-gemini-hover transition-all duration-300 shadow-md shadow-gemini"
              >
                Login
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-cyan-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left relative z-10"
            >
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-gemini backdrop-blur-sm border border-blue-200/50"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Modern Wedding Management</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Welcome to{' '}
                <span className="gradient-text animate-pulse-slow">
                  {APP_NAME}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-gray-700 mb-4 leading-relaxed"
              >
                Professional wedding guest check-in system with real-time queue
                management and seamless coordination.
              </motion.p>

              {/* Tagline */}
              <motion.p
                variants={itemVariants}
                className="text-base text-blue-600 font-medium mb-10"
              >
                {APP_TAGLINE}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="shadow-xl shadow-gemini gradient-gemini hover:gradient-gemini-hover transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({
                        behavior: 'smooth',
                      });
                    }}
                    className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-6 mt-16 pt-10 border-t-2 border-blue-200/50"
              >
                <motion.div
                  className="text-center lg:text-left"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold gradient-text">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Accurate</div>
                </motion.div>
                <motion.div
                  className="text-center lg:text-left"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold gradient-text">
                    Real-time
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Updates</div>
                </motion.div>
                <motion.div
                  className="text-center lg:text-left"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold gradient-text">
                    Easy
                  </div>
                  <div className="text-sm text-gray-600 font-medium">To Use</div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Content - Lottie Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <DotLottieReact
                  src={LOTTIE_ANIMATIONS.HERO}
                  loop
                  autoplay
                  className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
                />
              </motion.div>

              {/* Background Decoration */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-blue-400/30 to-purple-400/30 rounded-full blur-3xl -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Additional floating elements */}
              <motion.div
                className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-xl opacity-60"
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-xl opacity-60"
                animate={{
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-40" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>Features</span>
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage your wedding guests efficiently and
              professionally.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-blue-100/50 p-8 text-center group hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 gradient-gemini text-white rounded-2xl mb-6 shadow-lg shadow-gemini group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-purple-200/30 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="aspect-square gradient-gemini rounded-3xl p-10 text-white shadow-2xl shadow-gemini relative overflow-hidden"
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                </div>

                <div className="flex flex-col justify-center h-full relative z-10">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Users className="w-24 h-24 mb-8 drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-4xl font-bold mb-6 leading-tight">
                    Manage Hundreds of Guests
                  </h3>
                  <p className="text-lg leading-relaxed opacity-95">
                    Handle large wedding events with ease using our intuitive
                    queue management system.
                  </p>
                </div>
              </motion.div>

              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -right-8 w-48 h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl -z-10 shadow-xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full -z-10 blur-xl"
              />
            </motion.div>

            {/* Right - Benefits List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-6"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Benefits</span>
              </motion.div>

              <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
                Why Choose {APP_NAME}?
              </h2>
              <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                Our system is designed specifically for modern weddings, making
                guest management a breeze.
              </p>

              <div className="space-y-5">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100/50"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-gray-800 font-semibold text-lg pt-0.5">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 gradient-gemini text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>

        {/* Sparkle decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-yellow-300" />
            </motion.div>

            <h2 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join us and experience the future of wedding guest management.
              Simple, fast, and professional.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => navigate(ROUTES.LOGIN)}
                className="shadow-2xl bg-white text-blue-700 hover:bg-gray-50 px-8 py-4 text-lg font-bold transition-all duration-300"
              >
                Start Managing Guests
              </Button>
            </motion.div>

            {/* Small Note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.85 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-base mt-8 flex items-center justify-center gap-6 flex-wrap"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Free trial available
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Easy setup
              </span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-400 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-gemini" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold gradient-text">
                {APP_NAME}
              </h3>
            </div>
            <p className="text-sm mb-3">
              © 2025 {APP_NAME} • {APP_TAGLINE}
            </p>
            <p className="text-xs opacity-75">
              Modern Wedding Guest Check-in System
            </p>

            {/* Social or links could go here */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;