import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBillingDetails } from '../api/billing';
import { BillingDetails } from '../types';
import { extractFieldErrors } from '@/utils/errorUtils';
import { CreditCard as CardIcon, Landmark, User, Calendar, ShieldCheck, X } from 'lucide-react';

interface PaymentMethodEditorProps {
  onClose?: () => void;
}

export const PaymentMethodEditor: React.FC<PaymentMethodEditorProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<'CARD' | 'BANK_ACCOUNT'>('CARD');
  const [owner, setOwner] = useState('');
  
  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');

  // Bank Account fields
  const [account, setAccount] = useState('');
  const [bankname, setBankname] = useState('');
  const [swift, setSwift] = useState('');

  const mutation = useMutation({
    mutationFn: (data: Omit<BillingDetails, 'id'>) => updateBillingDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billingDetails'] });
      alert('Payment method added successfully');
      if (onClose) onClose();
    },
  });

  useEffect(() => {
    if (mutation.isError && formRef.current) {
      const firstError = formRef.current.querySelector('[class*="text-red-500"], .error-banner');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [mutation.isError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = type === 'CARD' 
      ? { type, owner, cardNumber, expMonth, expYear }
      : { type, owner, account, bankname, swift };
    
    mutation.mutate(payload as any);
  };

  const errors = extractFieldErrors(mutation.error);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-brand-primary p-6 text-brand-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Add Payment Method</h3>
            <p className="text-brand-white/60 text-xs font-medium">Your data is encrypted and secure</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {errors.general && (
          <div className="error-banner bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <p className="text-red-700 font-medium text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Method Selector */}
          <div className="grid grid-cols-2 gap-4 p-1 bg-gray-50 rounded-2xl border border-gray-100">
            <button
              type="button"
              onClick={() => setType('CARD')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${type === 'CARD' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <CardIcon size={18} />
              <span>Credit Card</span>
            </button>
            <button
              type="button"
              onClick={() => setType('BANK_ACCOUNT')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${type === 'BANK_ACCOUNT' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Landmark size={18} />
              <span>Bank Account</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Common Field */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Account Owner</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-medium ${errors.owner ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50'}`}
                  value={owner}
                  onChange={e => setOwner(e.target.value)}
                  required
                />
              </div>
              {errors.owner && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.owner}</p>}
            </div>

            {type === 'CARD' ? (
              <>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                  <div className="relative">
                    <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className={`w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-mono ${errors.cardNumber ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50'}`}
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Exp. Month</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="MM"
                        className={`w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all ${errors.expMonth ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50'}`}
                        value={expMonth}
                        onChange={e => setExpMonth(e.target.value)}
                        required
                      />
                    </div>
                    {errors.expMonth && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.expMonth}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Exp. Year</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="YYYY"
                        className={`w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all ${errors.expYear ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50'}`}
                        value={expYear}
                        onChange={e => setExpYear(e.target.value)}
                        required
                      />
                    </div>
                    {errors.expYear && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.expYear}</p>}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
                  <div className="relative">
                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter IBAN or Account Number"
                      className={`w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-mono ${errors.account ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50'}`}
                      value={account}
                      onChange={e => setAccount(e.target.value)}
                      required
                    />
                  </div>
                  {errors.account && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.account}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
                    <input
                      type="text"
                      placeholder="Chase, HSBC, etc."
                      className={`w-full border-2 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all ${errors.bankname ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50/50'}`}
                      value={bankname}
                      onChange={e => setBankname(e.target.value)}
                      required
                    />
                    {errors.bankname && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.bankname}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">SWIFT / BIC</label>
                    <input
                      type="text"
                      placeholder="ABCDEF123"
                      className={`w-full border-2 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-mono ${errors.swift ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50/50'}`}
                      value={swift}
                      onChange={e => setSwift(e.target.value)}
                      required
                    />
                    {errors.swift && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.swift}</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-brand-primary text-brand-white p-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {mutation.isPending ? 'Processing...' : 'Securely Save Method'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors border border-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
