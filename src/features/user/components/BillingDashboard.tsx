import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBillingDetails, deleteBillingDetails } from '../api/billing';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PlusCircle, Loader2 } from 'lucide-react';

interface BillingDashboardProps {
  onAddClick?: () => void;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({ onAddClick }) => {
  const queryClient = useQueryClient();
  const { data: billingMethods, isLoading, error } = useQuery({
    queryKey: ['billingDetails'],
    queryFn: getBillingDetails,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBillingDetails(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billingDetails'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to delete payment method');
    }
  });

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-2xl border-2 border-gray-100" />
        ))}
      </div>
    );
  }

  if (error || !billingMethods || billingMethods.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-4">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <PlusCircle size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-brand-primary">No Payment Methods</h3>
          <p className="text-brand-neutral max-w-xs mx-auto">Add a bank account or credit card to start participating in auctions.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-brand-primary text-brand-white px-8 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20"
        >
          Add First Method
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Saved Methods</h3>
          {deleteMutation.isPending && (
            <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary animate-pulse">
              <Loader2 size={14} className="animate-spin" />
              Updating...
            </div>
          )}
        </div>
        <button 
          onClick={onAddClick}
          className="text-brand-secondary hover:text-brand-primary font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={18} />
          Add New
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {billingMethods.map((method, index) => (
          <PaymentMethodCard 
            key={method.id} 
            method={method} 
            isDefault={index === 0}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};
