/**
 * <� RuangTamu - Wedding Check-in System
 * Runner Completed Page - View all guests handled by runner
 * by PutuWistika
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  RefreshCw,
  CheckCircle,
  Search,
} from 'lucide-react';
import Sidebar from '@components/Layout/Sidebar';
import Navbar from '@components/Layout/Navbar';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Table from '@components/ui/Table';
import { getRunnerCompleted } from '@services/api';
import { POLL_INTERVALS } from '@utils/constants';
import { formatDateTime } from '@utils/helpers';
import { useAuth } from '@hooks/useAuth';
import { toast } from 'sonner';

/**
 * Runner Completed Component
 * Display all guests that the runner has handled
 */
const RunnerCompleted = () => {
  const { user } = useAuth();

  // State
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch guests
  useEffect(() => {
    if (user?.email) {
      fetchGuests();

      // Auto refresh
      const interval = setInterval(() => {
        fetchGuests(true);
      }, POLL_INTERVALS.COMPLETED);

      return () => clearInterval(interval);
    }
  }, [user?.email]);

  // Filter guests when search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGuests(guests);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = guests.filter(
        (guest) =>
          guest.name?.toLowerCase().includes(query) ||
          guest.table_number?.toString().includes(query) ||
          guest.uid?.toLowerCase().includes(query)
      );
      setFilteredGuests(filtered);
      setCurrentPage(1); // Reset to first page on search
    }
  }, [searchQuery, guests]);

  const fetchGuests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      console.log('🔍 Fetching guests for runner email:', user.email);
      const response = await getRunnerCompleted(user.email);
      const guestList = response.data || [];

      console.log('✅ Runner completed guests:', guestList);
      setGuests(guestList);
      setFilteredGuests(guestList);

      if (!silent) {
        toast.success(`Loaded ${guestList.length} guest(s)`);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      if (!silent) {
        toast.error('Failed to load guests');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Guest Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {value?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{value}</p>
            <p className="text-xs text-gray-500 truncate font-mono">{row.uid}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'table_number',
      label: 'Table',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          {value || <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      key: 'companion_count',
      label: 'Companions',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'check_in_status',
      label: 'Status',
      sortable: true,
      render: (value) => <Badge.Status status={value} />,
    },
    {
      key: 'check_in_time',
      label: 'Check-in Time',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? formatDateTime(value) : '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        <Navbar title="My Guests" />

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
                    My Guests
                  </h1>
                  <p className="text-gray-600">
                    All guests you have handled and seated
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    leftIcon={<RefreshCw className="w-5 h-5" />}
                    onClick={() => fetchGuests()}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card padding="default">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Guests</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {guests.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </Card>

                <Card padding="default">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completed</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {guests.filter(g => g.check_in_status === 'done').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                </Card>

                <Card padding="default">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Companions</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {guests.reduce((sum, g) => sum + (g.companion_count || 0), 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Guests Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card padding="none">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      All Guests
                    </h2>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, table, or UID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Table
                  columns={columns}
                  data={filteredGuests}
                  loading={loading}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  emptyMessage="No guests found"
                  emptyIcon={Users}
                />
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RunnerCompleted;
