/**
 * <� RuangTamu - Wedding Check-in System
 * Runner Dashboard - Overview & Statistics
 * by PutuWistika
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  CheckCircle,
  ListChecks,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import Sidebar from '@components/Layout/Sidebar';
import Navbar from '@components/Layout/Navbar';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import { useAuth } from '@hooks/useAuth';
import { getQueue, getRunnerCompleted } from '@services/api';
import { ROUTES, POLL_INTERVALS } from '@utils/constants';
import { formatDateTime } from '@utils/helpers';
import { toast } from 'sonner';

/**
 * Runner Dashboard Component
 * Overview page with queue and completed guests statistics
 */
const RunnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQueue: 0,
    totalCompleted: 0,
  });
  const [queueList, setQueueList] = useState([]);
  const [completedGuests, setCompletedGuests] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [user?.email]);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      // Fetch queue
      const queueResponse = await getQueue();
      const queue = queueResponse.data || [];

      // Fetch completed guests for this runner (by email)
      console.log('🔍 Fetching completed guests for runner email:', user?.email);
      const completedResponse = user?.email
        ? await getRunnerCompleted(user.email)
        : { data: [] };
      const completed = completedResponse.data || [];
      console.log('✅ Completed guests:', completed);

      // Calculate statistics
      const statistics = {
        totalQueue: queue.length,
        totalCompleted: completed.length,
      };

      setStats(statistics);
      setQueueList(queue.slice(0, 5)); // Get 5 most recent
      setCompletedGuests(completed.slice(0, 5)); // Get 5 most recent

      if (!silent) setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (!silent) {
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Guests in Queue',
      value: stats.totalQueue,
      icon: Clock,
      color: 'yellow',
      description: 'Waiting to be seated',
    },
    {
      title: 'My Completed',
      value: stats.totalCompleted,
      icon: CheckCircle,
      color: 'green',
      description: 'Guests you\'ve handled',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Queue List',
      description: 'View and take guests from queue',
      icon: ListChecks,
      color: 'yellow',
      path: ROUTES.RUNNER_QUEUE,
    },
    {
      title: 'My Guests',
      description: 'View all guests you\'ve handled',
      icon: Users,
      color: 'green',
      path: ROUTES.RUNNER_MY_GUESTS,
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
                Welcome, {user?.name}! =K
              </h1>
              <p className="text-gray-600">
                Ready to help guests find their seats today.
              </p>
            </motion.div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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

            {/* Current Queue & Recent Completed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <Card.Header
                    title="Current Queue"
                    subtitle="Guests waiting to be seated"
                    action={
                      <Badge variant="warning" dot>
                        {stats.totalQueue} waiting
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
                            key={guest.uid || index}
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
                                  {guest.phone_number || 'No phone'}
                                </p>
                              </div>
                            </div>
                            <Clock className="w-5 h-5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                  {queueList.length > 0 && (
                    <Card.Footer>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => navigate(ROUTES.RUNNER_QUEUE)}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Take Guest
                      </Button>
                    </Card.Footer>
                  )}
                </Card>
              </motion.div>

              {/* Recently Completed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <Card.Header
                    title="Recently Completed"
                    subtitle="Your recent guest assignments"
                    action={
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(ROUTES.RUNNER_MY_GUESTS)}
                      >
                        View All
                      </Button>
                    }
                  />
                  <Card.Body>
                    {completedGuests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No completed guests yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {completedGuests.map((guest, index) => (
                          <div
                            key={guest.uid || index}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                                {guest.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {guest.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Table {guest.table_number || '-'}
                                </p>
                              </div>
                            </div>
                            <Badge variant="success">
                              <CheckCircle className="w-3 h-3" />
                            </Badge>
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

export default RunnerDashboard;
