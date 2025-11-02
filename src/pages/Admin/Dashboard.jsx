/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Admin Dashboard - Overview & Statistics
 * by PutuWistika
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Search,
} from 'lucide-react';
import Sidebar from '@components/Layout/Sidebar';
import Navbar from '@components/Layout/Navbar';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import { useAuth } from '@hooks/useAuth';
import { getAllGuests, getQueueList } from '@services/api';
import { ROUTES, GUEST_STATUS } from '@utils/constants';
import { formatDateTime } from '@utils/helpers';
import { toast } from 'sonner';

/**
 * Admin Dashboard Component
 * Overview page with statistics and recent activity
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    waiting: 0,
    completed: 0,
  });
  const [recentGuests, setRecentGuests] = useState([]);
  const [queueList, setQueueList] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all guests
      const guestsResponse = await getAllGuests();
      const guests = guestsResponse.data || [];

      // Fetch queue
      const queueResponse = await getQueueList();
      const queue = queueResponse.data || [];

      // Calculate statistics
      const statistics = {
        total: guests.length,
        checkedIn: guests.filter((g) => g.check_in_status === GUEST_STATUS.QUEUE).length,
        waiting: guests.filter((g) => g.check_in_status === GUEST_STATUS.NOT_ARRIVED).length,
        completed: guests.filter((g) => g.check_in_status === GUEST_STATUS.DONE).length,
      };

      setStats(statistics);
      setRecentGuests(guests.slice(0, 5)); // Get 5 most recent
      setQueueList(queue.slice(0, 5)); // Get 5 from queue

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Guests',
      value: stats.total,
      icon: Users,
      color: 'blue',
      trend: '+12%',
    },
    {
      title: 'Checked In',
      value: stats.checkedIn,
      icon: UserCheck,
      color: 'green',
      trend: '+8%',
    },
    {
      title: 'In Queue',
      value: stats.waiting,
      icon: Clock,
      color: 'yellow',
      trend: '-5%',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'purple',
      trend: '+15%',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Search Guest',
      description: 'Find guest by name or phone',
      icon: Search,
      color: 'blue',
      path: ROUTES.ADMIN_SEARCH,
    },
    {
      title: 'All Guests',
      description: 'View complete guest list',
      icon: Users,
      color: 'purple',
      path: ROUTES.ADMIN_ALL_GUESTS,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center lg:ml-20">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        <Navbar title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your wedding guests today.
              </p>
            </motion.div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    hover
                    onClick={() => navigate(action.path)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-${action.color}-100 text-${action.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity & Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Guests */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <Card.Header
                    title="Recent Guests"
                    subtitle="Latest guest check-ins"
                    action={
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(ROUTES.ADMIN_ALL_GUESTS)}
                      >
                        View All
                      </Button>
                    }
                  />
                  <Card.Body>
                    {recentGuests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No recent guests
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentGuests.map((guest, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                                {guest.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {guest.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {guest.table_number || 'No table'}
                                </p>
                              </div>
                            </div>
                            <Badge.Status status={guest.check_in_status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Current Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <Card.Header
                    title="Current Queue"
                    subtitle="Guests waiting to be seated"
                    action={
                      <Badge variant="warning" dot>
                        {queueList.length} waiting
                      </Badge>
                    }
                  />
                  <Card.Body>
                    {queueList.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Queue is empty
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {queueList.map((guest, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {guest.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {guest.checkInTime
                                    ? formatDateTime(guest.checkInTime)
                                    : 'Just now'}
                                </p>
                              </div>
                            </div>
                            <Clock className="w-5 h-5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;