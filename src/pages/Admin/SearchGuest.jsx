/**
 * 🎊 RuangTamu - Wedding Check-in System
 * Search Guest Page - Find guests with fuzzy search (UPDATED!)
 * by PutuWistika
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  UserCheck,
  X,
  MapPin,
  Sparkles,
  Eye,
  Clock,
} from 'lucide-react';
import Sidebar from '@components/Layout/Sidebar';
import Navbar from '@components/Layout/Navbar';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import CheckInModal from '@components/Modals/CheckInModal';
import { searchGuests } from '@services/api';
import { GUEST_STATUS } from '@utils/constants';
import { formatDateTime } from '@utils/helpers';
import { toast } from 'sonner';

/**
 * Search Guest Component
 * Search guests by name or phone with fuzzy matching
 */
const SearchGuest = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searching, setSearching] = useState(false);

  // Modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [guestToCheckIn, setGuestToCheckIn] = useState(null);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    try {
      setSearching(true);
      const response = await searchGuests(searchQuery);
      const results = response.data || [];

      setSearchResults(results);

      if (results.length === 0) {
        toast.info('No guests found');
      } else {
        toast.success(`Found ${results.length} guest(s)`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search guests');
    } finally {
      setSearching(false);
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

    // Refresh search results
    try {
      const response = await searchGuests(searchQuery);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error refreshing results:', error);
    }

    // Close detail view if open
    if (selectedGuest?.uid === updatedGuest.uid) {
      setSelectedGuest(null);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedGuest(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        <Navbar title="Search Guest" />
        
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search Guest
              </h1>
              <p className="text-gray-600">
                Find guests by name or phone number using fuzzy search.
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card>
                <form onSubmit={handleSearch}>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Enter guest name or phone number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-5 h-5" />}
                        rightIcon={
                          searchQuery && (
                            <button
                              type="button"
                              onClick={handleClearSearch}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )
                        }
                        disabled={searching}
                        autoFocus
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={searching}
                      disabled={searching || !searchQuery.trim()}
                      leftIcon={!searching && <Search className="w-5 h-5" />}
                    >
                      Search
                    </Button>
                  </div>
                </form>

                {/* Search Tips */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    💡 <strong>Search Tips:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Partial names work (e.g., "feri" finds "Ferry")</li>
                    <li>• Fuzzy matching helps with typos</li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Search Results
                  </h2>
                  <Badge variant="primary">
                    {searchResults.length} found
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((guest, index) => (
                    <motion.div
                      key={guest.uid}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        hover
                        className="cursor-pointer"
                        onClick={() => setSelectedGuest(guest)}
                      >
                        {/* Guest Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                              {guest.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {guest.name}
                              </h3>
                              <p className="text-xs text-gray-500 font-mono truncate">
                                {guest.uid}
                              </p>
                            </div>
                          </div>
                          {/* Status Badge - from check_in_status */}
                          <Badge.Status 
                            status={guest.check_in_status || GUEST_STATUS.NOT_ARRIVED} 
                          />
                        </div>

                        {/* Guest Info - FIXED! */}
                        <div className="space-y-2">
                          {/* Table Number */}
                          {guest.table_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">Table {guest.table_number}</span>
                              </div>
                            </div>
                          )}

                          {/* Invitation Type */}
                          {guest.invitation_type && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                <Sparkles className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">{guest.invitation_type}</span>
                              </div>
                            </div>
                          )}

                          {/* If no table and no invitation type, show placeholder */}
                          {!guest.table_number && !guest.invitation_type && (
                            <div className="text-xs text-gray-400 italic py-2">
                              No additional info
                            </div>
                          )}
                        </div>

                        {/* Quick Action - Only for NOT_ARRIVED */}
                        {(guest.check_in_status === GUEST_STATUS.NOT_ARRIVED || !guest.check_in_status) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Button
                              variant="primary"
                              size="sm"
                              fullWidth
                              leftIcon={<UserCheck className="w-4 h-4" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCheckIn(guest);
                              }}
                            >
                              Check In
                            </Button>
                          </div>
                        )}

                        {/* View Details - For already checked-in guests */}
                        {guest.check_in_status && guest.check_in_status !== GUEST_STATUS.NOT_ARRIVED && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Button
                              variant="outline"
                              size="sm"
                              fullWidth
                              leftIcon={<Eye className="w-4 h-4" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCheckIn(guest);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {searchQuery && !searching && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No guests found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any guests matching "{searchQuery}"
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearSearch}
                  >
                    Clear Search
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Empty State */}
            {!searchQuery && searchResults.length === 0 && !searching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Searching
                  </h3>
                  <p className="text-gray-600">
                    Enter a guest name or phone number to begin searching.
                  </p>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Guest Detail Modal (Simple View) */}
      {selectedGuest && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedGuest(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedGuest(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Guest Detail */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                {selectedGuest.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedGuest.name}
              </h2>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge.Status status={selectedGuest.check_in_status || GUEST_STATUS.NOT_ARRIVED} />
                {selectedGuest.invitation_type && (
                  <Badge variant="primary">
                    {selectedGuest.invitation_type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              {/* UID */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">UID</span>
                <span className="font-medium text-gray-900 font-mono text-sm">
                  {selectedGuest.uid}
                </span>
              </div>

              {/* Table Number */}
              {selectedGuest.table_number && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Table Number
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedGuest.table_number}
                  </span>
                </div>
              )}

              {/* Invitation Type */}
              {selectedGuest.invitation_type && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Invitation Type
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedGuest.invitation_type}
                  </span>
                </div>
              )}

              {/* Check-in Time */}
              {selectedGuest.check_in_time && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Check-in Time
                  </span>
                  <span className="font-medium text-gray-900 text-xs">
                    {formatDateTime(selectedGuest.check_in_time)}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setSelectedGuest(null)}
              >
                Close
              </Button>
              {(selectedGuest.check_in_status === GUEST_STATUS.NOT_ARRIVED || !selectedGuest.check_in_status) && (
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<UserCheck className="w-5 h-5" />}
                  onClick={() => {
                    handleOpenCheckIn(selectedGuest);
                    setSelectedGuest(null);
                  }}
                >
                  Check In
                </Button>
              )}
              {selectedGuest.check_in_status && selectedGuest.check_in_status !== GUEST_STATUS.NOT_ARRIVED && (
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<Eye className="w-5 h-5" />}
                  onClick={() => {
                    handleOpenCheckIn(selectedGuest);
                    setSelectedGuest(null);
                  }}
                >
                  View Details
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

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

export default SearchGuest;