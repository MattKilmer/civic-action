type LocationStatusProps = {
  address: string | null;
  loading: boolean;
  location?: { city?: string; state?: string; district?: string };
  onEdit: () => void;
};

export default function LocationStatus({ address, loading, location, onEdit }: LocationStatusProps) {
  if (!address) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent flex-shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Finding your representatives...
                </p>
                <p className="text-sm text-blue-700 mt-1 break-words">
                  {address}
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {!loading && location && (
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Showing officials for your location
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {location.city && location.state ? (
                    <>
                      <span className="font-medium">{location.city}, {location.state}</span>
                      {location.district && (
                        <span className="text-blue-600"> • District {location.district}</span>
                      )}
                    </>
                  ) : (
                    <span className="break-words">{address}</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Error State (no results but not loading) */}
          {!loading && !location && (
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  No officials found
                </p>
                <p className="text-sm text-amber-700 mt-1 break-words">
                  Searched for: {address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded px-2 py-1 transition-colors flex-shrink-0"
        >
          Change
        </button>
      </div>
    </div>
  );
}
