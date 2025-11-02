/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Admin Queue Page - Real-time queue monitoring
 * by PutuWistika
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Users,
  RefreshCw,
  Play,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import Sidebar from '@components/Layout/Sidebar';
import Navbar from '@components/Layout/Navbar';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import TakeGuestModal from '@components/Modals/TakeGuestModal';
import { getQueueList } from '@services/api';
import { POLL_INTERVALS, GUEST_STATUS } from '@utils/constants';
import { formatDateTime, formatTimeAgo } from '@utils/helpers';
import { useAuth } from '@hooks/useAuth';
import { toast } from 'sonner';

/**
 * Admin Queue Component
 * Real-time queue monitoring and guest management
 */
const AdminQueue = () => {
  // Auth
  const { user } = useAuth();

  // State
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showTakeModal, setShowTakeModal] = useState(false);

  // Refs
  const intervalRef = useRef(null);

  // Fetch queue
  useEffect(() => {
    fetchQueue();

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchQueue(true); // Silent refresh
      }, POLL_INTERVALS.QUEUE);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  const fetchQueue = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const response = await getQueueList();
      const queueData = response.data || [];

      setQueue(queueData);
      setLastUpdated(new Date());

      if (!silent && queueData.length > 0) {
        toast.success(`Loaded ${queueData.length} guest(s) in queue`);
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
      if (!silent) {
        toast.error('Failed to load queue');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Handle take guest
  const handleTakeGuest = (guest) => {
    setSelectedGuest(guest);
    setShowTakeModal(true);
  };

  // Handle take guest success
  const handleTakeSuccess = async () => {
    // Close modal
    setShowTakeModal(false);
    setSelectedGuest(null);

    // Refresh queue
    await fetchQueue(true);
  };

  // Calculate statistics
  const stats = {
    total: queue.length,
    waiting: queue.filter((g) => g.check_in_status === 'queue').length,
    avgWaitTime: queue.length > 0 ? '5 min' : '-', // Mock data
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        <Navbar title="Queue Management" />

        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Queue Management
                  </h1>
                  <p className="text-gray-600">
                    Monitor and manage guests waiting in the queue
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Auto Refresh Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoRefresh ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoRefresh ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">Auto Refresh</span>
                  </div>

                  {/* Manual Refresh */}
                  <Button
                    variant="outline"
                    leftIcon={<RefreshCw className="w-5 h-5" />}
                    onClick={() => fetchQueue()}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {formatTimeAgo(lastUpdated)}
                </p>
              )}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {/* Total in Queue */}
              <Card padding="default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">In Queue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              {/* Waiting */}
              <Card padding="default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Waiting</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.waiting}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              {/* Avg Wait Time */}
              <Card padding="default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Wait Time</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.avgWaitTime}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Queue List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card padding="none">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Current Queue
                  </h2>
                </div>

                {loading ? (
                  <div className="p-12">
                    <Loading size="lg" />
                  </div>
                ) : queue.length === 0 ? (
                  <div className="p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Queue is Empty
                    </h3>
                    <p className="text-gray-600">
                      No guests are currently waiting in the queue.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {queue.map((guest, index) => (
                        <motion.div
                          key={guest.uid}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {/* Queue Position */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {index + 1}
                              </div>
                            </div>

                            {/* Guest Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {guest.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {guest.companion_count || 0} companion(s) • Table: {guest.table_number || '-'}
                                  </p>
                                </div>
                                <Badge.Status status={guest.check_in_status} />
                              </div>

                              {/* Check-in Time */}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>
                                  Checked in:{' '}
                                  {guest.check_in_time
                                    ? formatTimeAgo(guest.check_in_time)
                                    : 'Just now'}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0">
                              <Button
                                variant="primary"
                                leftIcon={<Play className="w-5 h-5" />}
                                onClick={() => handleTakeGuest(guest)}
                              >
                                Take to Table
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Info Card */}
            {queue.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Card variant="default" padding="default">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>💡 Tip:</strong> Guests are ordered by check-in
                        time. The first guest in the list has been waiting the
                        longest. Auto-refresh is{' '}
                        {autoRefresh ? (
                          <span className="text-green-600 font-medium">ON</span>
                        ) : (
                          <span className="text-gray-600 font-medium">OFF</span>
                        )}{' '}
                        - queue updates every {POLL_INTERVALS.QUEUE / 1000}{' '}
                        seconds.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Take Guest Modal */}
      <TakeGuestModal
        isOpen={showTakeModal}
        onClose={() => {
          setShowTakeModal(false);
          setSelectedGuest(null);
        }}
        guest={selectedGuest}
        onSuccess={handleTakeSuccess}
        assignedRunner={user?.email || user?.name || 'Admin'}
      />
    </div>
  );
};

export default AdminQueue;