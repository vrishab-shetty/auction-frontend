import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBillingDetails } from '../api/billing';
import { BillingDetails } from '../types';
import { extractFieldErrors } from '@/utils/errorUtils';

export const PaymentMethodEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<'creditCard' | 'bankAccount'>('creditCard');
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
    mutationFn: (data: BillingDetails) => updateBillingDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billingDetails'] });
      alert('Billing details updated successfully');
    },
  });

  // Automatically scroll to the first error message when a submission error occurs
  useEffect(() => {
    if (mutation.isError && formRef.current) {
      // Look for field errors first, then the general error banner
      const firstError = formRef.current.querySelector('[class*="text-red-500"], .error-banner');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [mutation.isError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let payload: BillingDetails;
    if (type === 'creditCard') {
      payload = { type, owner, cardNumber, expMonth, expYear };
    } else {
      payload = { type, owner, account, bankname, swift };
    }
    
    mutation.mutate(payload);
  };

  const errors = extractFieldErrors(mutation.error);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full mt-6">
      <h3 className="text-xl font-bold mb-4 text-brand-primary">Update Payment Method</h3>
      {errors.general && (
        <div className="error-banner bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
          <p className="text-red-700 font-medium">{errors.general}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-semibold text-sm">Owner Name</label>
        <input
          type="text"
          className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.owner ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          value={owner}
          onChange={e => setOwner(e.target.value)}
          required
        />
        {errors.owner && <p className="text-red-500 text-xs font-medium mt-1">{errors.owner}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-3 font-semibold text-sm">Payment Type</label>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary cursor-pointer"
              checked={type === 'creditCard'}
              onChange={() => setType('creditCard')}
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-brand-primary transition-colors">Credit Card</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary cursor-pointer"
              checked={type === 'bankAccount'}
              onChange={() => setType('bankAccount')}
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-brand-primary transition-colors">Bank Account</span>
          </label>
        </div>
      </div>

      {type === 'creditCard' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">Card Number</label>
            <input
              type="text"
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="Enter card number"
              required
            />
            {errors.cardNumber && <p className="text-red-500 text-xs font-medium mt-1">{errors.cardNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1">Exp. Month (MM)</label>
              <input
                type="text"
                className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.expMonth ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                value={expMonth}
                onChange={e => setExpMonth(e.target.value)}
                placeholder="MM"
                required
              />
              {errors.expMonth && <p className="text-red-500 text-xs font-medium mt-1">{errors.expMonth}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1">Exp. Year (YYYY)</label>
              <input
                type="text"
                className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.expYear ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                value={expYear}
                onChange={e => setExpYear(e.target.value)}
                placeholder="YYYY"
                required
              />
              {errors.expYear && <p className="text-red-500 text-xs font-medium mt-1">{errors.expYear}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">Account Number</label>
            <input
              type="text"
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.account ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={account}
              onChange={e => setAccount(e.target.value)}
              required
            />
            {errors.account && <p className="text-red-500 text-xs font-medium mt-1">{errors.account}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">Bank Name</label>
            <input
              type="text"
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.bankname ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={bankname}
              onChange={e => setBankname(e.target.value)}
              required
            />
            {errors.bankname && <p className="text-red-500 text-xs font-medium mt-1">{errors.bankname}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">SWIFT/BIC</label>
            <input
              type="text"
              className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all ${errors.swift ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              value={swift}
              onChange={e => setSwift(e.target.value)}
              required
            />
            {errors.swift && <p className="text-red-500 text-xs font-medium mt-1">{errors.swift}</p>}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-8 w-full bg-brand-secondary text-brand-primary p-4 rounded-xl font-bold shadow-lg shadow-brand-secondary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:hover:scale-100"
      >
        {mutation.isPending ? 'Saving...' : 'Save Payment Method'}
      </button>
    </form>
  );
};
