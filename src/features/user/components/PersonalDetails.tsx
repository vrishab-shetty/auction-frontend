import React from 'react';
import { UserDTO } from '../types';
import { User, Mail, Phone, MapPin, FileText, Edit3 } from 'lucide-react';

interface PersonalDetailsProps {
  user: UserDTO;
  onEdit: () => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ user, onEdit }) => {
  const address = user.homeAddress;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-brand-primary">Account Overview</h3>
            <p className="text-brand-neutral text-sm">Your basic account information and contact details.</p>
          </div>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20 px-4 py-2 rounded-xl font-bold transition-all"
          >
            <Edit3 size={18} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-xl text-brand-neutral">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-brand-primary font-semibold">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-xl text-brand-neutral">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-brand-primary font-semibold">{user.username}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-xl text-brand-neutral">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Number</p>
                <p className="text-brand-primary font-semibold">{user.contact}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Address Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-xl text-brand-neutral">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Primary Address</p>
                <p className="text-brand-primary font-semibold">{address?.street}</p>
                <p className="text-brand-neutral text-sm">{address?.city}, {address?.zipcode}</p>
                <p className="text-brand-neutral text-sm">{address?.country}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-xl text-brand-neutral">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">About / Bio</p>
                <p className="text-brand-primary text-sm leading-relaxed max-w-md">
                  {user.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 px-8 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs font-bold text-gray-500 uppercase">
            Account Status: {user.enabled ? 'Active' : 'Disabled'}
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">User ID: {user.id}</span>
      </div>
    </div>
  );
};
