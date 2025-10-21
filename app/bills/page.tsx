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
  congress?: number;
  summary?: string;
  level?: 'federal' | 'state';
  jurisdiction?: string;
  session?: string;
}

const BILL_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'hr', label: 'House Bills (HR)' },
  { value: 's', label: 'Senate Bills (S)' },
  { value: 'hjres', label: 'House Joint Resolutions' },
  { value: 'sjres', label: 'Senate Joint Resolutions' },
];

const STATE_BILL_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'state-house', label: 'State House Bills' },
  { value: 'state-senate', label: 'State Senate Bills' },
];

const US_STATES = [
  { value: 'all', label: 'All States' },
  { value: 'Alabama', label: 'Alabama' },
  { value: 'Alaska', label: 'Alaska' },
  { value: 'Arizona', label: 'Arizona' },
  { value: 'Arkansas', label: 'Arkansas' },
  { value: 'California', label: 'California' },
  { value: 'Colorado', label: 'Colorado' },
  { value: 'Connecticut', label: 'Connecticut' },
  { value: 'Delaware', label: 'Delaware' },
  { value: 'Florida', label: 'Florida' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Hawaii', label: 'Hawaii' },
  { value: 'Idaho', label: 'Idaho' },
  { value: 'Illinois', label: 'Illinois' },
  { value: 'Indiana', label: 'Indiana' },
  { value: 'Iowa', label: 'Iowa' },
  { value: 'Kansas', label: 'Kansas' },
  { value: 'Kentucky', label: 'Kentucky' },
  { value: 'Louisiana', label: 'Louisiana' },
  { value: 'Maine', label: 'Maine' },
  { value: 'Maryland', label: 'Maryland' },
  { value: 'Massachusetts', label: 'Massachusetts' },
  { value: 'Michigan', label: 'Michigan' },
  { value: 'Minnesota', label: 'Minnesota' },
  { value: 'Mississippi', label: 'Mississippi' },
  { value: 'Missouri', label: 'Missouri' },
  { value: 'Montana', label: 'Montana' },
  { value: 'Nebraska', label: 'Nebraska' },
  { value: 'Nevada', label: 'Nevada' },
  { value: 'New Hampshire', label: 'New Hampshire' },
  { value: 'New Jersey', label: 'New Jersey' },
  { value: 'New Mexico', label: 'New Mexico' },
  { value: 'New York', label: 'New York' },
  { value: 'North Carolina', label: 'North Carolina' },
  { value: 'North Dakota', label: 'North Dakota' },
  { value: 'Ohio', label: 'Ohio' },
  { value: 'Oklahoma', label: 'Oklahoma' },
  { value: 'Oregon', label: 'Oregon' },
  { value: 'Pennsylvania', label: 'Pennsylvania' },
  { value: 'Rhode Island', label: 'Rhode Island' },
  { value: 'South Carolina', label: 'South Carolina' },
  { value: 'South Dakota', label: 'South Dakota' },
  { value: 'Tennessee', label: 'Tennessee' },
  { value: 'Texas', label: 'Texas' },
  { value: 'Utah', label: 'Utah' },
  { value: 'Vermont', label: 'Vermont' },
  { value: 'Virginia', label: 'Virginia' },
  { value: 'Washington', label: 'Washington' },
  { value: 'West Virginia', label: 'West Virginia' },
  { value: 'Wisconsin', label: 'Wisconsin' },
  { value: 'Wyoming', label: 'Wyoming' },
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
  const [billLevel, setBillLevel] = useState<'federal' | 'state'>('federal');
  const [searchQuery, setSearchQuery] = useState('');
  const [billType, setBillType] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active'); // Default to active bills
  const [sortOrder, setSortOrder] = useState('recent');
  const [bills, setBills] = useState<Bill[]>([]);
  const [displayLimit, setDisplayLimit] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedBillNumber, setExpandedBillNumber] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
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
        if (billLevel === 'federal') {
          // Federal bills search
          const params = new URLSearchParams();
          if (searchQuery) params.set('q', searchQuery);
          if (billType !== 'all') params.set('type', billType);
          params.set('sort', sortOrder);
          params.set('limit', '200');

          const res = await fetch(`/api/bills/search?${params.toString()}`);

          if (!res.ok) {
            throw new Error('Failed to fetch federal bills');
          }

          const data = await res.json();
          setBills(data);
        } else {
          // State bills search
          const params = new URLSearchParams();
          if (searchQuery) params.set('q', searchQuery);
          if (selectedState !== 'all') params.set('jurisdiction', selectedState);

          const res = await fetch(`/api/bills/search-state?${params.toString()}`);

          if (!res.ok) {
            throw new Error('Failed to fetch state bills');
          }

          const data = await res.json();

          // Map state bill response to Bill interface
          const mappedBills: Bill[] = (data.bills || []).map((bill: any) => ({
            number: bill.bill,
            title: bill.title,
            status: bill.latestAction || 'Introduced',
            date: bill.introduced || '',
            type: bill.chamber || 'state-bill',
            level: 'state' as const,
            jurisdiction: bill.jurisdiction,
            session: bill.session,
            summary: bill.summary,
          }));

          setBills(mappedBills);
        }
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
  }, [searchQuery, billType, selectedState, sortOrder, billLevel]);

  // Apply status filter and display limit
  const filteredBills = filterByStatus(bills).slice(0, displayLimit);
  const totalFiltered = filterByStatus(bills).length;
  const canLoadMore = totalFiltered > displayLimit;

  const handleUseBill = (bill: Bill) => {
    // Navigate to homepage with bill pre-filled
    const params = new URLSearchParams();
    params.set('bill', bill.number);
    params.set('billTitle', bill.title);

    if (bill.level === 'state' && bill.jurisdiction) {
      // State bill - include jurisdiction
      params.set('billJurisdiction', bill.jurisdiction);
      if (bill.session) params.set('billSession', bill.session);
    } else if (bill.congress) {
      // Federal bill - include congress and type
      params.set('billCongress', bill.congress.toString());
      params.set('billType', bill.type);
    }

    window.location.href = `/?${params.toString()}`;
  };

  const toggleBillSummary = async (bill: Bill) => {
    // If clicking the same bill, collapse it
    if (expandedBillNumber === bill.number) {
      setExpandedBillNumber(null);
      return;
    }

    // If bill already has summary, just expand it
    if (bill.summary) {
      setExpandedBillNumber(bill.number);
      return;
    }

    // Fetch the summary
    setExpandedBillNumber(bill.number);
    setLoadingSummary(bill.number);

    try {
      const billNum = bill.number.split(' ')[1];
      const res = await fetch(`/api/bills/${bill.congress}/${bill.type}/${billNum}`);
      if (res.ok) {
        const details = await res.json();
        if (details.summary) {
          // Update the bill in the bills array with the summary
          setBills(prevBills =>
            prevBills.map(b =>
              b.number === bill.number ? { ...b, summary: details.summary } : b
            )
          );
        }
      }
    } catch (error) {
      console.error('Failed to fetch bill summary:', error);
    } finally {
      setLoadingSummary(null);
    }
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
            Explore Legislation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse federal and state bills. Find legislation you care about and use it as the subject of your letter to representatives.
          </p>

          {/* Tabs for Federal vs State */}
          <div className="mt-6 flex gap-2 border-b border-gray-200">
            <button
              onClick={() => {
                setBillLevel('federal');
                setBills([]);
                setSearchQuery('');
                setBillType('all');
                setStatusFilter('active');
              }}
              className={`px-6 py-3 font-medium transition-colors relative ${
                billLevel === 'federal'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Federal Bills
            </button>
            <button
              onClick={() => {
                setBillLevel('state');
                setBills([]);
                setSearchQuery('');
                setSelectedState('all');
                setStatusFilter('all');
              }}
              className={`px-6 py-3 font-medium transition-colors relative ${
                billLevel === 'state'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              State Bills
            </button>
          </div>
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
                placeholder={
                  billLevel === 'federal'
                    ? "e.g., HR 1234 or climate change"
                    : "e.g., AB 123 or education funding"
                }
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

              {/* Conditional Filter: Bill Type (Federal) or State (State Bills) */}
              {billLevel === 'federal' ? (
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
              ) : (
                <div>
                  <label htmlFor="selectedState" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    id="selectedState"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort Order - only for federal (state bills come pre-sorted by relevance) */}
              {billLevel === 'federal' && (
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
              )}
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {loading ? 'Loading...' : `Showing ${filteredBills.length} of ${totalFiltered} bills`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {billLevel === 'federal' ? (
                    <>
                      Total in 118th Congress: {TOTAL_BILLS_118TH.toLocaleString()} bills
                      {searchQuery && ` • Searching: "${searchQuery}"`}
                    </>
                  ) : (
                    <>
                      {selectedState !== 'all' ? `${selectedState} state bills` : 'All state bills'}
                      {searchQuery && ` • Searching: "${searchQuery}"`}
                    </>
                  )}
                </p>
              </div>
              {!loading && filteredBills.length === 0 && bills.length > 0 && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    if (billLevel === 'federal') {
                      setBillType('all');
                    } else {
                      setSelectedState('all');
                    }
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
                  {/* Bill Number with jurisdiction badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-xl font-bold ${bill.level === 'state' ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {bill.number}
                      </h3>
                      {bill.level === 'state' && bill.jurisdiction && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {bill.jurisdiction}
                        </span>
                      )}
                      {bill.level === 'federal' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Federal
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {bill.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-3">
                    {bill.title}
                  </h4>

                  {/* View Summary Link - Subtle, tertiary action */}
                  <button
                    onClick={() => toggleBillSummary(bill)}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {expandedBillNumber === bill.number ? 'Hide summary' : 'View summary'}
                    <svg
                      className={`w-3 h-3 transition-transform ${expandedBillNumber === bill.number ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Summary Display */}
                  {expandedBillNumber === bill.number && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                      {loadingSummary === bill.number ? (
                        <div className="flex items-center gap-2 text-blue-900">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm font-medium">Loading summary...</span>
                        </div>
                      ) : bill.summary ? (
                        <div className="text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar" style={{ lineHeight: '1.6' }}>
                          {bill.summary}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 italic">No summary available for this bill.</p>
                      )}
                    </div>
                  )}

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
                    onClick={() => handleUseBill(bill)}
                    className={`w-full ${
                      bill.level === 'state'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white font-medium py-2.5 px-4 rounded-xl transition-colors`}
                  >
                    Use this bill
                  </button>

                  {/* Secondary Link - Subtle - Only for federal bills */}
                  {bill.level === 'federal' && bill.congress && (
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
                  )}
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
        <div className={`mt-8 ${
          billLevel === 'federal'
            ? 'bg-blue-50 border-blue-200 text-blue-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        } border rounded-2xl p-6`}>
          <h3 className="font-semibold mb-2">
            How to use the Bill Explorer
          </h3>
          {billLevel === 'federal' ? (
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Search:</strong> Find bills by number (e.g., &quot;HR 1234&quot;) or keywords (e.g., &quot;climate&quot;)</li>
              <li>• <strong>Filter by status:</strong> Focus on active bills, enacted laws, or bills at specific stages</li>
              <li>• <strong>Filter by type:</strong> House bills, Senate bills, or joint resolutions</li>
              <li>• <strong>View Summary:</strong> Click to read the official bill summary from Congress.gov</li>
              <li>• <strong>Select a bill:</strong> Click &quot;Use this bill&quot; to automatically fill it into your letter</li>
              <li>• <strong>Note:</strong> Showing recent bills from 118th Congress ({TOTAL_BILLS_118TH.toLocaleString()} total). Use search to find any specific bill.</li>
            </ul>
          ) : (
            <ul className="text-sm text-emerald-800 space-y-1">
              <li>• <strong>Search:</strong> Find bills by number (e.g., &quot;AB 123&quot;) or keywords (e.g., &quot;education&quot;)</li>
              <li>• <strong>Filter by state:</strong> Select a specific state or view all states</li>
              <li>• <strong>Filter by status:</strong> Focus on active bills, enacted laws, or bills at specific stages</li>
              <li>• <strong>View Summary:</strong> Click to read the official bill summary</li>
              <li>• <strong>Select a bill:</strong> Click &quot;Use this bill&quot; to automatically fill it into your letter to your state legislators</li>
              <li>• <strong>Note:</strong> State bill data powered by Open States API. Coverage includes all 50 states.</li>
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
