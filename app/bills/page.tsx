'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TopNav from '@/app/components/TopNav';
import Footer from '@/app/components/Footer';

interface Bill {
  number: string;
  title: string;
  status: string;
  date: string;
  type: string;
  congress: number;
}

const BILL_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'hr', label: 'House Bills (HR)' },
  { value: 's', label: 'Senate Bills (S)' },
  { value: 'hjres', label: 'House Joint Resolutions' },
  { value: 'sjres', label: 'Senate Joint Resolutions' },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses', description: 'Show all bills regardless of status' },
  { value: 'active', label: 'Active & In Progress', description: 'Bills moving through Congress' },
  { value: 'enacted', label: 'Became Law', description: 'Successfully enacted into law' },
  { value: 'passed_house', label: 'Passed House', description: 'Passed House, pending Senate' },
  { value: 'passed_senate', label: 'Passed Senate', description: 'Passed Senate, pending House' },
  { value: 'introduced', label: 'Recently Introduced', description: 'Newly introduced bills' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
];

const TOTAL_BILLS_118TH = 19315; // Total bills in 118th Congress

export default function BillExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [billType, setBillType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active'); // Default to active bills
  const [sortOrder, setSortOrder] = useState('recent');
  const [bills, setBills] = useState<Bill[]>([]);
  const [displayLimit, setDisplayLimit] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Filter bills by status on client side
  const filterByStatus = (billsList: Bill[]) => {
    if (statusFilter === 'all') return billsList;

    return billsList.filter((bill) => {
      const status = bill.status.toLowerCase();

      switch (statusFilter) {
        case 'active':
          // Bills that are moving (not just introduced, not yet enacted)
          return !status.includes('became law') &&
                 !status.includes('became public law') &&
                 (status.includes('passed') ||
                  status.includes('reported') ||
                  status.includes('committee') ||
                  status.includes('amendment') ||
                  status.includes('conference'));
        case 'enacted':
          return status.includes('became law') || status.includes('became public law');
        case 'passed_house':
          return status.includes('passed house') && !status.includes('passed senate');
        case 'passed_senate':
          return status.includes('passed senate') && !status.includes('passed house');
        case 'introduced':
          return status.includes('introduced') || status.includes('referred to');
        default:
          return true;
      }
    });
  };

  // Fetch bills with current filters
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (billType !== 'all') params.set('type', billType);
        params.set('sort', sortOrder);
        // Fetch more bills to allow better filtering
        params.set('limit', '200');

        const res = await fetch(`/api/bills/search?${params.toString()}`);

        if (!res.ok) {
          throw new Error('Failed to fetch bills');
        }

        const data = await res.json();
        setBills(data);
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('Failed to load bills. Please try again.');
        setBills([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, billType, sortOrder]);

  // Apply status filter and display limit
  const filteredBills = filterByStatus(bills).slice(0, displayLimit);
  const totalFiltered = filterByStatus(bills).length;
  const canLoadMore = totalFiltered > displayLimit;

  const handleUseBill = (billNumber: string, billTitle: string) => {
    // Navigate to homepage with bill number and title pre-filled
    const params = new URLSearchParams();
    params.set('bill', billNumber);
    params.set('billTitle', billTitle);
    window.location.href = `/?${params.toString()}`;
  };

  const getCongressUrl = (bill: Bill) => {
    // Extract number from full bill string (e.g., "HR 5572" → "5572")
    const billNum = bill.number.split(' ')[1];
    const congress = bill.congress;

    const typeMap: { [key: string]: string } = {
      'hr': 'house-bill',
      's': 'senate-bill',
      'hjres': 'house-joint-resolution',
      'sjres': 'senate-joint-resolution',
      'hconres': 'house-concurrent-resolution',
      'sconres': 'senate-concurrent-resolution',
      'hres': 'house-resolution',
      'sres': 'senate-resolution',
    };

    const billType = typeMap[bill.type.toLowerCase()] || 'house-bill';
    return `https://www.congress.gov/bill/${congress}th-congress/${billType}/${billNum}`;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('enacted') || statusLower.includes('became law')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (statusLower.includes('passed')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (statusLower.includes('introduced')) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    if (statusLower.includes('vetoed')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <TopNav />

      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Bill Explorer</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Explore Federal Legislation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse current bills in the 118th Congress. Find legislation you care about and use it as the subject of your letter to representatives.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by bill number or keywords
              </label>
              <input
                id="search"
                type="text"
                placeholder="e.g., HR 1234 or climate change"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setDisplayLimit(50); // Reset display limit when changing filter
                  }}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {STATUS_FILTERS.map((status) => (
                    <option key={status.value} value={status.value} title={status.description}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bill Type Filter */}
              <div>
                <label htmlFor="billType" className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Type
                </label>
                <select
                  id="billType"
                  value={billType}
                  onChange={(e) => setBillType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {BILL_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {loading ? 'Loading...' : `Showing ${filteredBills.length} of ${totalFiltered} bills`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Total in 118th Congress: {TOTAL_BILLS_118TH.toLocaleString()} bills
                  {searchQuery && ` • Searching: "${searchQuery}"`}
                </p>
              </div>
              {!loading && filteredBills.length === 0 && bills.length > 0 && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setBillType('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && bills.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading bills...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBills.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No bills match your search "${searchQuery}" with the selected filters.`
                : 'No bills match your selected filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setBillType('all');
                setStatusFilter('all');
                setSortOrder('recent');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Bills Grid */}
        {!loading && filteredBills.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBills.map((bill) => (
                <div
                  key={bill.number}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Bill Number */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-blue-600">
                      {bill.number}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {bill.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-3">
                    {bill.title}
                  </h4>

                  {/* Status */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Latest Action</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {bill.status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(bill.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    onClick={() => handleUseBill(bill.number, bill.title)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
                  >
                    Use this bill
                  </button>

                  {/* Secondary Link - Subtle */}
                  <a
                    href={getCongressUrl(bill)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    View on Congress.gov
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {canLoadMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 50)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-medium px-6 py-3 rounded-xl border border-gray-300 transition-colors shadow-sm hover:shadow"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Load More Bills ({totalFiltered - displayLimit} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            How to use the Bill Explorer
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Search:</strong> Find bills by number (e.g., &quot;HR 1234&quot;) or keywords (e.g., &quot;climate&quot;)</li>
            <li>• <strong>Filter by status:</strong> Focus on active bills, enacted laws, or bills at specific stages</li>
            <li>• <strong>Filter by type:</strong> House bills, Senate bills, or joint resolutions</li>
            <li>• <strong>Select a bill:</strong> Click &quot;Use this bill&quot; to automatically fill it into your letter</li>
            <li>• <strong>Note:</strong> Showing recent bills from 118th Congress ({TOTAL_BILLS_118TH.toLocaleString()} total). Use search to find any specific bill.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
