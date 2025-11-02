/**
 * <� RuangTamu - Wedding Check-in System
 * Take Guest Modal - Runner takes guest from queue to table
 * by PutuWistika
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Hash,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Badge from '@components/ui/Badge';
import { takeGuest } from '@services/api';
import { formatDateTime } from '@utils/helpers';
import { toast } from 'sonner';

/**
 * Take Guest Modal Component
 * Modal for runner to take guest from queue to table
 */
const TakeGuestModal = ({ isOpen, onClose, guest, onSuccess, runnerUser }) => {
  // State
  const [loading, setLoading] = useState(false);
  const [runnerNotes, setRunnerNotes] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRunnerNotes('');
    }
  }, [isOpen, guest]);

  // Handle take guest submission
  const handleTakeGuest = async () => {
    try {
      setLoading(true);

      // Prepare runner info from logged-in user
      const runnerInfo = runnerUser
        ? `${runnerUser.name} (${runnerUser.email})`
        : 'Admin';

      // Prepare take data
      const takeData = {
        assigned_runner: runnerInfo,
      };

      // Add runner notes if provided
      if (runnerNotes.trim()) {
        takeData.runner_notes = runnerNotes.trim();
      }

      console.log('<� Taking guest to table:', { uid: guest.uid, takeData });

      // Call API
      const response = await takeGuest(guest.uid, takeData);

      console.log('=� Take guest response:', response);

      // Handle response
      if (response.success && response.statusCode === 200) {
        toast.success(`${guest.name} taken to table ${guest.table_number}! <�`);

        // Notify parent
        if (onSuccess) {
          onSuccess(response.guest);
        }

        // Close modal
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to take guest');
      }
    } catch (error) {
      console.error('L Take guest error:', error);
      toast.error(error.message || 'Failed to take guest to table');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!loading) {
      setRunnerNotes('');
      onClose();
    }
  };

  if (!guest) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
      showClose={!loading}
    >
      <Modal.Header
        title="Take Guest to Table"
        subtitle={`Taking ${guest.name} to table ${guest.table_number}`}
        icon={UserCheck}
      />

      <Modal.Body>
        {/* Guest Info Card */}
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {guest.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {guest.name}
                </h3>
                <p className="text-xs text-gray-600 font-mono">
                  {guest.uid}
                </p>
              </div>
            </div>
            <Badge.Status status={guest.check_in_status} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Table Number */}
            {guest.table_number && (
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Table Number</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {guest.table_number}
                  </p>
                </div>
              </div>
            )}

            {/* Companions */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Companions</p>
                <p className="text-sm font-semibold text-gray-900">
                  {guest.companion_count || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Check-in Time */}
          {guest.check_in_time && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  Checked in: {formatDateTime(guest.check_in_time)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Runner Notes Input (OPTIONAL) */}
        <div>
          <Input
            label="Runner Notes (Optional)"
            type="textarea"
            placeholder="Add any notes... (e.g., 'Guest seated at table', 'Requested window seat', etc.)"
            value={runnerNotes}
            onChange={(e) => setRunnerNotes(e.target.value)}
            rows={3}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            =� Optional: Add any relevant notes about seating this guest
          </p>
        </div>

        {/* Info Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Ready to Take Guest
              </p>
              <p className="text-sm text-green-700 mt-1">
                Click "Take to Table" to confirm that this guest has been seated at table {guest.table_number}. Status will change from "queue" to "done".
              </p>
            </div>
          </div>
        </motion.div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleTakeGuest}
          loading={loading}
          disabled={loading}
          leftIcon={!loading && <ArrowRight className="w-5 h-5" />}
        >
          {loading ? 'Taking Guest...' : 'Take to Table'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TakeGuestModal;
