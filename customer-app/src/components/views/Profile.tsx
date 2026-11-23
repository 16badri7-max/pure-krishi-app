import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, Package, Heart, LogOut } from 'lucide-react';

interface ProfileProps {
  customer: { name: string; email: string } | null;
}

export default function Profile({ customer }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: customer?.name || 'Customer',
    email: customer?.email || '',
    phone: '+91 9876543210',
    address: '123 MG Road, Dharwad – 580001',
    city: 'Dharwad',
    state: 'Karnataka',
    type: 'Individual',
  });

  const update = (k: string, v: string) => setProfile(p => ({ ...p, [k]: v }));

  const Field = ({ label, name, icon: Icon }: { label: string; name: string; icon: React.ElementType }) => (
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-gray-400 flex-shrink-0" />
      <div className="flex-1">
        <label className="text-xs text-gray-400 block">{label}</label>
        {editing ? (
          <input value={(profile as Record<string, string>)[name]} onChange={e => update(name, e.target.value)}
            className="w-full border-b border-green-300 py-1 text-sm text-gray-800 focus:outline-none" />
        ) : (
          <div className="text-sm text-gray-800 font-medium">{(profile as Record<string, string>)[name]}</div>
        )}
      </div>
    </div>
  );

  const stats = [
    { label: 'Total Orders', value: '12', icon: Package },
    { label: 'Wishlist', value: '5', icon: Heart },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <button onClick={() => setEditing(e => !e)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${editing ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          {editing ? <><Save size={14} /> Save</> : <><Edit size={14} /> Edit</>}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl p-5 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
          {profile.name[0]}
        </div>
        <div>
          <div className="text-xl font-bold">{profile.name}</div>
          <div className="text-green-200 text-sm">{profile.type} Customer</div>
          <div className="mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full inline-block">🌱 Organic Buyer</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <s.icon size={20} className="text-green-600" />
            <div>
              <div className="text-xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Personal Information</h2>
        <Field label="Full Name" name="name" icon={User} />
        <Field label="Email Address" name="email" icon={Mail} />
        <Field label="Phone Number" name="phone" icon={Phone} />
        <Field label="Delivery Address" name="address" icon={MapPin} />
        <Field label="City" name="city" icon={MapPin} />
        <Field label="State" name="state" icon={MapPin} />
      </div>

      {/* Account type */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Account Type</h2>
        <div className="flex gap-3">
          {['Individual', 'Hotel/B2B', 'Restaurant/B2B', 'Supermarket/B2B'].map(t => (
            <button key={t} onClick={() => editing && update('type', t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${profile.type === t ? 'bg-green-50 border-green-400 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium">
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
