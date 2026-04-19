import React from 'react';
import { CreditCard, BankAccount } from '../types';
import { CreditCard as CardIcon, Landmark, Trash2, CheckCircle2, User } from 'lucide-react';

interface PaymentMethodCardProps {
  method: CreditCard | BankAccount;
  isDefault?: boolean;
  onRemove?: (id: string) => void;
  onEdit?: (method: CreditCard | BankAccount) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  method, 
  isDefault = false,
  onRemove
}) => {
  const isCard = method.type === 'CARD';

  return (
    <div className={`relative bg-white border-2 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md ${isDefault ? 'border-brand-secondary ring-1 ring-brand-secondary/20' : 'border-gray-100 hover:border-gray-200'}`}>
      {isDefault && (
        <div className="absolute -top-3 left-6 bg-brand-secondary text-brand-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm">
          <CheckCircle2 size={12} />
          Primary Method
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${isCard ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
          {isCard ? <CardIcon size={24} /> : <Landmark size={24} />}
        </div>
        <button 
          onClick={() => onRemove?.(method.id)}
          className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove method"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {isCard ? 'Cardholder Name' : 'Account Owner'}
          </p>
          <div className="flex items-center gap-2 text-brand-primary font-bold">
            <User size={14} className="text-gray-400" />
            {method.owner}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              {isCard ? 'Card Number' : 'Account Details'}
            </p>
            <p className="text-brand-primary font-mono font-medium">
              {isCard 
                ? `•••• ${(method as CreditCard).cardNumber.slice(-4)}`
                : (method as BankAccount).account
              }
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              {isCard ? 'Expiration' : 'Bank/Swift'}
            </p>
            <p className="text-brand-primary font-medium">
              {isCard 
                ? `${(method as CreditCard).expMonth}/${(method as CreditCard).expYear}`
                : (method as BankAccount).bankname
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
