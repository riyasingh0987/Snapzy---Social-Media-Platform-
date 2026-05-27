import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const response = await userAPI.getSuggestedUsers();
        setSuggestedUsers(response.data);
      } catch (error) {
        console.error('Failed to load suggested users:', error);
      }
    };

    fetchSuggested();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const response = await userAPI.searchUsers(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Explore</h2>
        <p className="mt-2 text-slate-600">Find new creators and explore profiles.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Search Users</h2>
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or name..."
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
          {searchResults.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-lg border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Clear
            </button>
          )}
        </form>

        {searchResults.length > 0 ? (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-medium text-slate-900">Search Results</h3>
            <div className="space-y-3">
              {searchResults.map(user => (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={user.profilePicture || '/profile-photo.jpg'}
                      alt={user.username}
                      className="h-12 w-12 rounded-full border-2 border-blue-500 object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-slate-600 text-sm">@{user.username}</p>
                      {user.bio && (
                        <p className="text-slate-500 text-xs mt-1 truncate">{user.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white flex-shrink-0">
                    View
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-medium text-slate-900">Suggested accounts</h3>
            <div className="space-y-3">
              {suggestedUsers.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-slate-500">
                  No suggested users available yet. Try searching for someone by name.
                </div>
              ) : (
                suggestedUsers.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user.username}`}
                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.profilePicture || '/profile-photo.jpg'}
                        alt={user.username}
                        className="h-12 w-12 rounded-full border-2 border-blue-500 object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{user.fullName}</p>
                        <p className="text-slate-600 text-sm">@{user.username}</p>
                        {user.bio && (
                          <p className="text-slate-500 text-xs mt-1 truncate">{user.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white flex-shrink-0">
                      View
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>        )}
      </div>
    </div>
  );
};

export default Explore;