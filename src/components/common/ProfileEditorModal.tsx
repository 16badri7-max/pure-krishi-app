import React, { useState, useRef } from 'react';
import { X, User, Mail, Phone, MapPin, Building2, Camera, Save, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../services/useStore';

interface ProfileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({ isOpen, onClose }) => {
  const { state, store } = useStore();
  const user = state.currentUser;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [organization, setOrganization] = useState(user.organization || '');
  const [location, setLocation] = useState(user.location || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    operations_admin: 'Operations Admin',
    buyer: 'Buyer / Supermarket',
    farmer: 'Farmer',
    expert: 'Agriculture Expert',
    warehouse_staff: 'Warehouse Staff',
    delivery_partner: 'Delivery Partner',
    customer: 'Customer',
  };

  const roleBadgeColor: Record<string, string> = {
    super_admin: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    operations_admin: 'bg-blue-100 text-blue-800 border-blue-200',
    buyer: 'bg-purple-100 text-purple-800 border-purple-200',
    farmer: 'bg-amber-100 text-amber-800 border-amber-200',
    expert: 'bg-sky-100 text-sky-800 border-sky-200',
    warehouse_staff: 'bg-orange-100 text-orange-800 border-orange-200',
    delivery_partner: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    customer: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    store.setCurrentUser({
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      phone: phone.trim() || user.phone,
      organization: organization.trim() || user.organization,
      location: location.trim() || user.location,
      avatar: avatarPreview || user.avatar,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#104D35] to-[#176B45] px-6 pt-6 pb-14 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-white font-bold text-lg">Edit Profile</h2>
          <p className="text-emerald-200 text-xs mt-0.5">Update your personal information</p>
        </div>

        {/* Avatar — overlaps the banner */}
        <div className="flex justify-center -mt-10 mb-3 relative z-10">
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden cursor-pointer bg-[#104D35] flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-black">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-[#176B45] hover:bg-[#104D35] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Role Badge */}
        <div className="flex justify-center mb-4">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${roleBadgeColor[user.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {roleLabel[user.role] || user.role}
          </span>
        </div>

        {/* Form Fields */}
        <div className="px-6 pb-6 space-y-3">
          {/* Name */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name</label>
            <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#176B45] focus-within:bg-white transition-all">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
            <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#176B45] focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone</label>
            <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#176B45] focus-within:bg-white transition-all">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 00000 00000"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Organization</label>
            <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#176B45] focus-within:bg-white transition-all">
              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="Your organization"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Location</label>
            <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#176B45] focus-within:bg-white transition-all">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City, State"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none font-medium placeholder-gray-400"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full mt-2 py-3 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 ${
              saved
                ? 'bg-emerald-500 text-white scale-[0.98]'
                : 'bg-gradient-to-r from-[#104D35] to-[#176B45] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

