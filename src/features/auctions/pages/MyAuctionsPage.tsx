import React, { useState } from 'react';
import { useMyAuctions } from '../hooks/useMyAuctions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import auctionService from '../api/auctionService';
import { AuctionStatusBadge } from '../components/AuctionStatusBadge';
import { AuctionEditForm } from '../components/AuctionEditForm';
import { AuctionDTO } from '../types';
import { Navbar } from '@/features/core/components/Navbar';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Package, AlertCircle, Plus, Calendar, Gavel } from 'lucide-react';
import { AxiosError } from 'axios';
import { Result } from '@/api/types';

const MyAuctionsPage: React.FC = () => {
  const { data: auctions, isLoading, isError } = useMyAuctions();
  const [editingAuction, setEditingAuction] = useState<AuctionDTO | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => auctionService.deleteAuction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] });
      alert('Auction deleted successfully');
    },
    onError: (err: AxiosError<Result<unknown>>) => {
      alert(err.response?.data?.message || 'Failed to delete auction');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this auction? This will also remove all associated items.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 space-y-8">
        <div className="flex justify-between items-end border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-primary p-3 rounded-2xl text-brand-white shadow-lg shadow-brand-primary/20">
              <Gavel size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-brand-primary tracking-tight">My Auctions</h1>
              <p className="text-brand-neutral font-medium mt-1">Manage and monitor your hosted auction events.</p>
            </div>
          </div>
          <Link 
            to="/my-auctions/create"
            className="flex items-center gap-2 bg-brand-primary text-brand-white px-6 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus size={20} />
            <span>Create New</span>
          </Link>
        </div>

        {isError ? (
          <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-12 text-center text-red-700">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="font-bold text-xl">Failed to load your auctions.</p>
            <p className="opacity-80">Please try refreshing the page or contact support.</p>
          </div>
        ) : auctions?.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center space-y-6">
            <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-gray-400">
              <Package size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-brand-primary">No auctions yet</h3>
              <p className="text-brand-neutral max-w-sm mx-auto">You haven't created any auctions. Start by creating your first event to sell items.</p>
            </div>
            <Link 
              to="/my-auctions/create"
              className="bg-brand-secondary text-brand-primary px-8 py-3 rounded-xl font-black shadow-lg shadow-brand-secondary/20 hover:scale-105 transition-all inline-block"
            >
              Create Your First Auction
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {auctions?.map((auction) => {
              const hasStarted = auction.status !== 'SCHEDULED';

              return (
                <div key={auction.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-brand-secondary/30 transition-colors group">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        to={`/auctions/${auction.id}`}
                        className="text-xl font-bold text-brand-primary hover:text-brand-secondary transition-colors"
                      >
                        {auction.name}
                      </Link>
                      <AuctionStatusBadge status={auction.status} />
                    </div>
                    
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2 text-brand-neutral">
                        <Calendar size={16} className="text-brand-secondary" />
                        <span className="font-medium">
                          {new Date(auction.startTime).toLocaleDateString()} - {new Date(auction.endTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-neutral">
                        <Package size={16} className="text-brand-secondary" />
                        <span className="font-medium">{auction.items.length} Items</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link 
                      to={`/auctions/${auction.id}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-50 text-brand-primary px-4 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <Eye size={18} />
                      <span>View</span>
                    </Link>
                    
                    <button 
                      onClick={() => setEditingAuction(auction)}
                      disabled={hasStarted}
                      title={hasStarted ? "Cannot edit an auction that has already started" : "Edit Auction"}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-secondary/10 text-brand-secondary px-4 py-2.5 rounded-xl font-bold hover:bg-brand-secondary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-brand-secondary/10"
                    >
                      <Edit size={18} />
                      <span>Edit</span>
                    </button>

                    <button 
                      onClick={() => handleDelete(auction.id)}
                      disabled={hasStarted || deleteMutation.isPending}
                      title={hasStarted ? "Cannot delete an auction that has already started" : "Delete Auction"}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-red-100"
                    >
                      {deleteMutation.isPending && deleteMutation.variables === auction.id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {editingAuction && (
          <AuctionEditForm 
            auction={editingAuction} 
            onClose={() => setEditingAuction(null)} 
          />
        )}
      </main>
    </div>
  );
};

// Internal Loader component
const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    className={`animate-spin ${className}`} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default MyAuctionsPage;
