import React from 'react';
import { useSearch } from '@/features/search/hooks/useSearch';
import { ItemCard } from '@/components/ItemCard';
import { Search, MapPin, ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ItemDTO } from '@/api/types';

const SearchPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { 
    items, 
    pagination, 
    filters, 
    isLoading, 
    isFetching, 
    isError, 
    updateSearch 
  } = useSearch(12);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10">
        <div className="space-y-10">
          {/* Search Header */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-brand-primary tracking-tight">Discover Items</h1>
              <p className="text-brand-neutral font-medium">Find unique treasures from across the globe.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full border-2 border-gray-50 bg-gray-50 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-medium"
                  value={filters.query}
                  onChange={(e) => updateSearch({ q: e.target.value })}
                />
              </div>
              <div className="md:w-64 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full border-2 border-gray-50 bg-gray-50 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-medium"
                  value={filters.location}
                  onChange={(e) => updateSearch({ loc: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="space-y-8 relative">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
                  {pagination.totalElements} Items Found
                </h3>
                {isFetching && (
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    Updating...
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-50 animate-pulse rounded-3xl border border-gray-100" />
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-12 text-center text-red-700">
                <p className="font-bold">Failed to load search results. Please try again.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center space-y-4">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-gray-400 shadow-sm">
                  <Inbox size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-primary">No Items Found</h3>
                  <p className="text-brand-neutral max-w-xs mx-auto">We couldn't find anything matching your search criteria. Try a different keyword or location.</p>
                </div>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
                {items.map((item: ItemDTO) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-10">
                <button
                  onClick={() => updateSearch({ page: pagination.currentPage - 1 })}
                  disabled={pagination.isFirst || isFetching}
                  className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    if (pagination.totalPages > 7) {
                      if (i > 0 && i < pagination.totalPages - 1 && Math.abs(i - pagination.currentPage) > 1) {
                        if (i === 1 || i === pagination.totalPages - 2) return <span key={i} className="px-1 text-gray-400">...</span>;
                        return null;
                      }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => updateSearch({ page: i })}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${pagination.currentPage === i ? 'bg-brand-primary text-brand-white shadow-lg' : 'bg-white text-brand-primary hover:bg-gray-50 border border-gray-100'}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => updateSearch({ page: pagination.currentPage + 1 })}
                  disabled={pagination.isLast || isFetching}
                  className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
