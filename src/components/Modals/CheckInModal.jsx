/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Enhanced Check-In Modal - 3-Step Process with ProfileCard
 * by PutuWistika
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  User,
  Hash,
  Users,
  Gift,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Badge from '@components/ui/Badge';
import GuestProfileCard from '@components/Guest/GuestProfileCard';
import { checkInGuest } from '@services/api';
import { GUEST_STATUS, GIFT_TYPES } from '@utils/constants';
import { toast } from 'sonner';

/**
 * Enhanced Check-In Modal Component
 * 3-Step Process:
 * 1. Preview guest info
 * 2. Optional check-in data form
 * 3. Success with ProfileCard + QR Code
 */
const CheckInModal = ({ isOpen, onClose, guest, onSuccess }) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    companion_count: 0,
    gift_type: '',
    gift_notes: '',
  });

  // Response data
  const [checkedInGuest, setCheckedInGuest] = useState(null);
  const [isAlreadyCheckedIn, setIsAlreadyCheckedIn] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        companion_count: 0,
        gift_type: '',
        gift_notes: '',
      });
      setCheckedInGuest(null);
      setIsAlreadyCheckedIn(false);
    }
  }, [isOpen, guest]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'companion_count' ? Number(value) : value,
    }));
  };

  // Handle check-in submission
  const handleCheckIn = async () => {
    try {
      setLoading(true);

      // Prepare check-in data (only send non-empty values)
      const checkInData = {};
      
      if (formData.companion_count > 0) {
        checkInData.companion_count = formData.companion_count;
      }
      
      if (formData.gift_type) {
        checkInData.gift_type = formData.gift_type;
      }
      
      if (formData.gift_notes?.trim()) {
        checkInData.gift_notes = formData.gift_notes.trim();
      }

      console.log('🎫 Submitting check-in:', { uid: guest.uid, checkInData });

      // Call API
      const response = await checkInGuest(guest.uid, checkInData);

      console.log('📥 Check-in response:', response);

      // Handle response based on status
      if (response.success && response.statusCode === 200) {
        // Success - new check-in
        setCheckedInGuest(response.guest);
        setIsAlreadyCheckedIn(false);
        setCurrentStep(3);
        toast.success('Guest checked in successfully! 🎉');
        
        // Notify parent
        if (onSuccess) {
          onSuccess(response.guest);
        }
      } else if (response.statusCode === 400 && response.message === 'Guest already checked in') {
        // Already checked in
        setCheckedInGuest(response.guest);
        setIsAlreadyCheckedIn(true);
        setCurrentStep(3);
        toast.info('Guest was already checked in');
      } else {
        // Other errors
        throw new Error(response.message || 'Check-in failed');
      }
    } catch (error) {
      console.error('❌ Check-in error:', error);
      toast.error(error.message || 'Failed to check in guest');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      // If guest already checked in, go directly to view details
      if (!canCheckIn) {
        setCheckedInGuest(guest);
        setIsAlreadyCheckedIn(true);
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      handleCheckIn();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Check if guest can be checked in
  const canCheckIn = guest?.check_in_status === GUEST_STATUS.NOT_ARRIVED;

  // Step indicators
  const steps = [
    { number: 1, label: 'Preview', icon: User },
    { number: 2, label: 'Details', icon: FileText },
    { number: 3, label: 'Complete', icon: Check },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
      showClose={!loading}
    >
      {/* Step Indicators */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <React.Fragment key={step.number}>
                {/* Step Circle */}
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted
                        ? '#10b981'
                        : isActive
                        ? '#0ea5e9'
                        : '#e5e7eb',
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted || isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2 mt-5">
                    <motion.div
                      initial={false}
                      animate={{
                        width: currentStep > step.number ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* STEP 1: Preview Guest Info */}
        {currentStep === 1 && guest && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Modal.Header
              title="Preview Guest Information"
              subtitle="Review guest details before check-in"
              icon={User}
            />

            <Modal.Body>
              {/* Guest Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {guest.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {guest.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-mono">
                        {guest.uid}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      guest.check_in_status === GUEST_STATUS.NOT_ARRIVED
                        ? 'default'
                        : guest.check_in_status === GUEST_STATUS.QUEUE
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {guest.check_in_status === GUEST_STATUS.NOT_ARRIVED &&
                      'Not Arrived'}
                    {guest.check_in_status === GUEST_STATUS.QUEUE &&
                      'In Queue'}
                    {guest.check_in_status === GUEST_STATUS.DONE && 'Completed'}
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="space-y-3">
                  {/* Table Number */}
                  {guest.table_number && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 w-full">
                        <Hash className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-purple-600">Nomor Meja</p>
                          <p className="text-sm font-semibold text-purple-900">
                            {guest.table_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invitation Type */}
                  {guest.invitation_type && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 w-full">
                        <Sparkles className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-blue-600">Invitation Type</p>
                          <p className="text-sm font-semibold text-blue-900">
                            {guest.invitation_type}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invitation Details - Group Names or Value */}
                  {(guest.invitation_group_names?.length > 0 || guest.invitation_value) && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 w-full">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-amber-600">Invitation Details</p>
                          <p className="text-sm font-semibold text-amber-900 break-words">
                            {guest.invitation_group_names?.length > 0
                              ? `With: ${guest.invitation_group_names.join(', ')}`
                              : guest.invitation_value === 'alone'
                              ? 'Solo Invitation'
                              : guest.invitation_value === 'group'
                              ? 'Group Invitation'
                              : guest.invitation_value}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Companions */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 w-full">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-green-600">Companions</p>
                        <p className="text-sm font-semibold text-green-900">
                          {guest.companion_count || 0} person(s)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gift Type */}
                  {guest.gift_type && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-700 rounded-lg border border-pink-200 w-full">
                        <Gift className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-pink-600">Gift</p>
                          <p className="text-sm font-semibold text-pink-900">
                            {guest.gift_type}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning if already checked in */}
              {!canCheckIn && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Guest Already Checked In
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      This guest has already been checked in. You can view their
                      details but cannot check in again.
                    </p>
                  </div>
                </div>
              )}

              {/* Info Message */}
              {canCheckIn && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>ℹ️ Next Step:</strong> You can add optional
                    information like companion count and gift details.
                  </p>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {canCheckIn ? 'Continue' : 'View Details'}
              </Button>
            </Modal.Footer>
          </motion.div>
        )}

        {/* STEP 2: Check-in Form */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Modal.Header
              title="Additional Information"
              subtitle="Optional check-in details"
              icon={FileText}
            />

            <Modal.Body>
              <form className="space-y-4">
                {/* Companion Count */}
                <div>
                  <Input
                    label="Number of Companions"
                    type="number"
                    name="companion_count"
                    min="0"
                    max="20"
                    placeholder="0"
                    value={formData.companion_count}
                    onChange={handleChange}
                    leftIcon={<Users className="w-5 h-5" />}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How many people are accompanying this guest? (0-20)
                  </p>
                </div>

                {/* Gift Type */}
                <div>
                  <label className="label">Gift Type</label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      name="gift_type"
                      value={formData.gift_type}
                      onChange={handleChange}
                      disabled={loading}
                      className="select pl-10"
                    >
                      <option value="">-- Select Gift Type --</option>
                      {GIFT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Optional - What type of gift did the guest bring?
                  </p>
                </div>

                {/* Gift Notes */}
                <div>
                  <label className="label">Gift Notes</label>
                  <textarea
                    name="gift_notes"
                    rows="3"
                    placeholder="e.g., Beautiful flower arrangement, Red envelope, etc."
                    value={formData.gift_notes}
                    onChange={handleChange}
                    disabled={loading}
                    className="input resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional - Any additional notes about the gift
                  </p>
                </div>
              </form>

              {/* Info Message */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900">
                  <strong>✅ All Set!</strong> Click "Check In Now" to complete
                  the check-in process. All fields are optional.
                </p>
              </div>
            </Modal.Body>

            <Modal.Footer align="between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                leftIcon={<ArrowLeft className="w-5 h-5" />}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                variant="success"
                onClick={handleNext}
                loading={loading}
                disabled={loading}
                rightIcon={!loading && <UserCheck className="w-5 h-5" />}
              >
                {loading ? 'Checking In...' : 'Check In Now'}
              </Button>
            </Modal.Footer>
          </motion.div>
        )}

        {/* STEP 3: Success - Show ProfileCard */}
        {currentStep === 3 && checkedInGuest && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Modal.Body className="p-0">
              {/* Success Header */}
              <div
                className={`p-6 text-center ${
                  isAlreadyCheckedIn
                    ? 'bg-yellow-50 border-b border-yellow-200'
                    : 'bg-green-50 border-b border-green-200'
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    delay: 0.2,
                  }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    isAlreadyCheckedIn
                      ? 'bg-yellow-400 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {isAlreadyCheckedIn ? (
                    <AlertCircle className="w-8 h-8" />
                  ) : (
                    <Check className="w-8 h-8" />
                  )}
                </motion.div>

                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isAlreadyCheckedIn ? 'text-yellow-900' : 'text-green-900'
                  }`}
                >
                  {isAlreadyCheckedIn
                    ? 'Already Checked In'
                    : 'Check-In Successful! 🎉'}
                </h2>
                <p
                  className={`${
                    isAlreadyCheckedIn ? 'text-yellow-700' : 'text-green-700'
                  }`}
                >
                  {isAlreadyCheckedIn
                    ? 'This guest was already checked in previously'
                    : 'Guest has been successfully checked in'}
                </p>
              </div>

              {/* ProfileCard with QR Code */}
              <div className="p-6">
                <GuestProfileCard
                  guest={checkedInGuest}
                  showQR={true}
                  showActions={false}
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
            </Modal.Footer>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default CheckInModal;