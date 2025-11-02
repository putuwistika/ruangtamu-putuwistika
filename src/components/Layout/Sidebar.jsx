/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Sidebar Navigation Component (UPDATED)
 * by PutuWistika
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  UserPlus,
  Users,
  List,
  Clock,
  CheckCircle,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@utils/helpers';
import { APP_NAME, ROUTES, USER_ROLES } from '@utils/constants';

/**
 * Sidebar Component
 * Main navigation sidebar for Admin and Runner
 */
const Sidebar = ({ collapsed = false, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Desktop sidebar is collapsed by default, expands on hover
  const isExpanded = isHovered;

  // Admin menu items
  const adminMenuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: ROUTES.ADMIN_DASHBOARD,
    },
    {
      label: 'Search Guest',
      icon: Search,
      path: ROUTES.ADMIN_SEARCH,
    },
    {
      label: 'Create Guest',
      icon: UserPlus,
      path: ROUTES.ADMIN_CREATE_GUEST, // ← Updated
    },
    {
      label: 'All Guests',
      icon: Users,
      path: ROUTES.ADMIN_ALL_GUESTS,
    },
    {
      label: 'Queue',
      icon: Clock,
      path: ROUTES.ADMIN_QUEUE,
    },
  ];

  // Runner menu items
  const runnerMenuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: ROUTES.RUNNER_DASHBOARD,
    },
    {
      label: 'Search Guest',
      icon: Search,
      path: ROUTES.RUNNER_SEARCH,
    },
    {
      label: 'Queue List',
      icon: List,
      path: ROUTES.RUNNER_QUEUE,
    },
    {
      label: 'My Guests',
      icon: CheckCircle,
      path: ROUTES.RUNNER_MY_GUESTS, // ← Updated
    },
  ];

  // Get menu items based on user role
  const menuItems = user?.role === USER_ROLES.ADMIN ? adminMenuItems : runnerMenuItems;

  // Check if path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  // Menu Item Component
  const MenuItem = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <Link
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          'hover:bg-gray-100',
          active && 'bg-primary-50 text-primary-700 font-medium',
          !active && 'text-gray-700'
        )}
        onClick={() => setMobileOpen(false)}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {(isMobile || isExpanded) && <span>{item.label}</span>}
      </Link>
    );
  };

  // Sidebar content
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          {(isMobile || isExpanded) ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{APP_NAME}</h1>
                <p className="text-xs text-gray-500 capitalize">{user?.role} Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto">
              R
            </div>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} isMobile={isMobile} />
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {(isMobile || isExpanded) && (
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-lg',
            'text-red-600 hover:bg-red-50 transition-all duration-200',
            !isMobile && !isExpanded && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(isMobile || isExpanded) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 transition-all duration-300',
          'hidden lg:block shadow-lg',
          isExpanded ? 'w-64' : 'w-20'
        )}
      >
        <SidebarContent isMobile={false} />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 shadow-xl',
          'lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent isMobile={true} />
      </aside>
    </>
  );
};

export default Sidebar;