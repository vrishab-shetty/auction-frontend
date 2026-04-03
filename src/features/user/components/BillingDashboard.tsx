import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBillingDetails } from '../api/billing';
import { CreditCard, BankAccount } from '../types';
import { CreditCard as CardIcon, Landmark, User } from 'lucide-react';

export const BillingDashboard: React.FC = () => {
  const { data: billing, isLoading, error } = useQuery({
    queryKey: ['billingDetails'],
    queryFn: getBillingDetails,
  });

  if (isLoading) return <div className="p-4">Loading billing details...</div>;
  
  if (error || !billing) return (
    <div className="bg-gray-50 p-6 rounded border border-dashed border-gray-300 text-center">
      <p className="text-gray-500">No billing details found. Please add a payment method.</p>
    </div>
  );

  const isCreditCard = billing.type === 'creditCard';

  return (
    <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-primary p-2 rounded-full text-brand-white">
          {isCreditCard ? <CardIcon size={20} /> : <Landmark size={20} />}
        </div>
        <h3 className="text-xl font-bold text-brand-primary">
          Current {isCreditCard ? 'Credit Card' : 'Bank Account'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <User className="text-brand-neutral mt-1" size={18} />
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Owner</p>
            <p className="font-medium text-gray-900">{billing.owner}</p>
          </div>
        </div>

        {isCreditCard ? (
          <>
            <div className="flex items-start gap-3">
              <CardIcon className="text-brand-neutral mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Card Number</p>
                <p className="font-medium text-gray-900">
                  **** **** **** {(billing as CreditCard).cardNumber.slice(-4)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-[18px]" /> {/* Spacer for alignment */}
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Expiration</p>
                <p className="font-medium text-gray-900">
                  {(billing as CreditCard).expMonth}/{(billing as CreditCard).expYear}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <Landmark className="text-brand-neutral mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Bank Name</p>
                <p className="font-medium text-gray-900">{(billing as BankAccount).bankname}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-[18px]" />
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Account Number</p>
                <p className="font-medium text-gray-900">{(billing as BankAccount).account}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 col-span-full">
              <div className="w-[18px]" />
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">SWIFT/BIC</p>
                <p className="font-medium text-gray-900">{(billing as BankAccount).swift}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
