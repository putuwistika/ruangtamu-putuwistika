/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Create Guest Page - Add new guest to system
 * by PutuWistika
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  User,
  Phone,
  Users,
  Gift,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Sidebar from '@components/Layout/Sidebar';
import Navbar from '@components/Layout/Navbar';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { createGuest } from '@services/api';
import { ROUTES, VALIDATION } from '@utils/constants';
import { isValidPhone } from '@utils/helpers';
import { toast } from 'sonner';

/**
 * Create Guest Component
 * Form to create new guest
 */
const CreateGuest = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pax: 1,
    angpao: 0,
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert to number for numeric fields
    const finalValue = name === 'pax' || name === 'angpao' 
      ? (value === '' ? '' : Number(value))
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
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

    // Validate name
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate phone (optional but must be valid if provided)
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = VALIDATION.PHONE.MESSAGE;
    }

    // Validate pax
    if (!formData.pax || formData.pax < 1) {
      newErrors.pax = 'Pax must be at least 1';
    } else if (formData.pax > 20) {
      newErrors.pax = 'Pax cannot exceed 20';
    }

    // Validate angpao (must be non-negative)
    if (formData.angpao < 0) {
      newErrors.angpao = 'Angpao cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      // Prepare data
      const guestData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        pax: Number(formData.pax),
        angpao: Number(formData.angpao) || 0,
      };

      // Create guest
      const response = await createGuest(guestData);

      toast.success(`Guest "${formData.name}" created successfully!`);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        pax: 1,
        angpao: 0,
      });

      // Navigate to all guests or show success message
      setTimeout(() => {
        navigate(ROUTES.ADMIN_ALL_GUESTS);
      }, 1000);
    } catch (error) {
      console.error('Create guest error:', error);
      toast.error(error.message || 'Failed to create guest');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      pax: 1,
      angpao: 0,
    });
    setErrors({});
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        <Navbar title="Create Guest" />

        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-4 sm:p-6 max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate(-1)}
                className="mb-4"
              >
                Back
              </Button>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create New Guest
              </h1>
              <p className="text-gray-600">
                Add a new guest to the wedding guest list.
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <form onSubmit={handleSubmit}>
                  {/* Form Header */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Guest Information
                      </h2>
                      <p className="text-sm text-gray-600">
                        Fill in the details below
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <Input
                        label="Guest Name"
                        name="name"
                        type="text"
                        placeholder="Enter guest name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                        leftIcon={<User className="w-5 h-5" />}
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Full name of the guest
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="081234567890"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        leftIcon={<Phone className="w-5 h-5" />}
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Optional - Phone number for contact
                      </p>
                    </div>

                    {/* Pax */}
                    <div>
                      <Input
                        label="Number of Guests (Pax)"
                        name="pax"
                        type="number"
                        min="1"
                        max="20"
                        placeholder="1"
                        value={formData.pax}
                        onChange={handleChange}
                        error={errors.pax}
                        required
                        leftIcon={<Users className="w-5 h-5" />}
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Number of people in this guest's party (1-20)
                      </p>
                    </div>

                    {/* Angpao */}
                    <div>
                      <Input
                        label="Angpao Amount"
                        name="angpao"
                        type="number"
                        min="0"
                        step="10000"
                        placeholder="0"
                        value={formData.angpao}
                        onChange={handleChange}
                        error={errors.angpao}
                        leftIcon={<Gift className="w-5 h-5" />}
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Optional - Gift amount in Rupiah
                      </p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>ℹ️ Note:</strong> The guest will be created with{' '}
                      <span className="font-semibold">WAITING</span> status.
                      You can check them in later from the search page or all
                      guests page.
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Reset Form
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      disabled={loading}
                      leftIcon={!loading && <Check className="w-5 h-5" />}
                      className="flex-1"
                    >
                      {loading ? 'Creating Guest...' : 'Create Guest'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card variant="default" padding="default">
                <h3 className="font-semibold text-gray-900 mb-3">
                  💡 Tips for Creating Guests
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>
                      Make sure the guest name is spelled correctly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>
                      Phone number is optional but helpful for communication
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>
                      Pax represents the total number of people in the party
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>
                      Angpao can be recorded now or updated later during check-in
                    </span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateGuest;