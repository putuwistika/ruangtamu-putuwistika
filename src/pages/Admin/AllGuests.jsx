/**
 * 🎊 RuangTamu - Wedding Check-in System
 * All Guests Page - View and manage all guests (UPDATED WITH CHECKIN MODAL!)
 * by PutuWistika
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Download,
  RefreshCw,
  UserCheck,
  Eye,
} from 'lucide-react';
import Sidebar from '@components/Layout/Sidebar';
import Navbar from '@components/Layout/Navbar';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Table from '@components/ui/Table';
import CheckInModal from '@components/Modals/CheckInModal';
import { getAllGuests } from '@services/api';
import { ROUTES, GUEST_STATUS } from '@utils/constants';
import { formatCurrency, formatDateTime } from '@utils/helpers';
import { toast } from 'sonner';

/**
 * All Guests Component
 * Display all guests in a table with pagination
 */
const AllGuests = () => {
  const navigate = useNavigate();

  // State
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [guestToCheckIn, setGuestToCheckIn] = useState(null);

  // Fetch guests
  useEffect(() => {
    fetchGuests();
  }, []);

  // Filter guests when search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGuests(guests);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = guests.filter(
        (guest) =>
          guest.name?.toLowerCase().includes(query) ||
          guest.table_number?.toLowerCase().includes(query) ||
          guest.uid?.toLowerCase().includes(query)
      );
      setFilteredGuests(filtered);
      setCurrentPage(1); // Reset to first page on search
    }
  }, [searchQuery, guests]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await getAllGuests();
      const guestList = response.data || [];
      
      setGuests(guestList);
      setFilteredGuests(guestList);
      
      toast.success(`Loaded ${guestList.length} guests`);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  // Handle open check-in modal
  const handleOpenCheckIn = (guest) => {
    setGuestToCheckIn(guest);
    setShowCheckInModal(true);
  };

  // Handle check-in success
  const handleCheckInSuccess = async (updatedGuest) => {
    console.log('✅ Check-in successful:', updatedGuest);
    
    // Refresh guest list
    await fetchGuests();
  };

  // Handle export (placeholder)
  const handleExport = () => {
    toast.info('Export feature coming soon!');
    // TODO: Implement CSV/Excel export
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {value?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{value}</p>
            <p className="text-xs text-gray-500 truncate">{row.uid}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'table_number',
      label: 'Table Number',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          {value || <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      key: 'invitation_type',
      label: 'Invitation Type',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">
          {value || <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      key: 'check_in_status',
      label: 'Status',
      sortable: true,
      width: '120px',
      render: (value) => <Badge.Status status={value} />,
    },
    {
      key: 'check_in_time',
      label: 'Check-in Time',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {value ? formatDateTime(value) : <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      width: '140px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.check_in_status === GUEST_STATUS.NOT_ARRIVED && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserCheck className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCheckIn(row);
              }}
            >
              Check In
            </Button>
          )}
          {row.check_in_status !== GUEST_STATUS.NOT_ARRIVED && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Eye className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                // Open in check-in modal (view mode)
                handleOpenCheckIn(row);
              }}
            >
              View
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / pageSize);
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistics
  const stats = {
    total: guests.length,
    checkedIn: guests.filter((g) => g.check_in_status === GUEST_STATUS.QUEUE).length,
    waiting: guests.filter((g) => g.check_in_status === GUEST_STATUS.NOT_ARRIVED).length,
    completed: guests.filter((g) => g.check_in_status === GUEST_STATUS.DONE).length,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        <Navbar title="All Guests" />

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
                    All Guests
                  </h1>
                  <p className="text-gray-600">
                    Manage and view all wedding guests
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    leftIcon={<RefreshCw className="w-5 h-5" />}
                    onClick={fetchGuests}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<Download className="w-5 h-5" />}
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<UserPlus className="w-5 h-5" />}
                    onClick={() => navigate(ROUTES.ADMIN_CREATE_GUEST)}
                  >
                    Add Guest
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>
              </Card>

              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.checkedIn}
                    </p>
                    <p className="text-xs text-gray-600">Checked In</p>
                  </div>
                </div>
              </Card>

              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.waiting}
                    </p>
                    <p className="text-xs text-gray-600">Not Arrived</p>
                  </div>
                </div>
              </Card>

              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completed}
                    </p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Guests Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card padding="none">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Guest List
                  </h2>
                </div>

                <div className="p-6">
                  <Table
                    columns={columns}
                    data={paginatedGuests}
                    loading={loading}
                    searchable
                    searchPlaceholder="Search by name, table number, or UID..."
                    onSearch={setSearchQuery}
                    emptyMessage="No guests found"
                  />

                  {/* Pagination */}
                  {filteredGuests.length > 0 && (
                    <Table.Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredGuests.length}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={(size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      pageSizeOptions={[10, 25, 50, 100]}
                    />
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => {
          setShowCheckInModal(false);
          setGuestToCheckIn(null);
        }}
        guest={guestToCheckIn}
        onSuccess={handleCheckInSuccess}
      />
    </div>
  );
};

export default AllGuests;