import React, { useState } from 'react';
import { Save, Settings, Bell, Shield, Truck, Percent } from 'lucide-react';

export default function AppSettings() {
  const [settings, setSettings] = useState({
    appName: 'Pure Krishi',
    tagline: 'Pure Food. Healthy Lives.',
    contactEmail: 'admin@pureakrishi.in',
    contactPhone: '+91 98765 43210',
    commissionRate: '8',
    gstRate: '5',
    minOrderValue: '500',
    freeDeliveryAbove: '1000',
    deliveryCharge: '50',
    lowStockAlert: '20',
    emailNotifications: true,
    smsNotifications: true,
    orderNotifications: true,
    farmerNotifications: true,
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: false,
    twoFactorAdmin: true,
  });

  const update = (key: string, val: string | boolean) => setSettings(prev => ({ ...prev, [key]: val }));

  const Field = ({ label, name, type = 'text', prefix = '' }: { label: string; name: string; type?: string; prefix?: string }) => (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-400">
        {prefix && <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">{prefix}</span>}
        <input type={type} value={(settings as Record<string, string | boolean>)[name] as string}
          onChange={e => update(name, e.target.value)}
          className="flex-1 px-3 py-2 text-sm focus:outline-none" />
      </div>
    </div>
  );

  const Toggle = ({ label, name, desc }: { label: string; name: string; desc?: string }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {desc && <div className="text-xs text-gray-400">{desc}</div>}
      </div>
      <button onClick={() => update(name, !(settings as Record<string, string | boolean>)[name])}
        className={`w-10 h-5 rounded-full transition-all relative ${(settings as Record<string, string | boolean>)[name] ? 'bg-green-500' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${(settings as Record<string, string | boolean>)[name] ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Application Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure global application preferences</p>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-green-600" />
          <h2 className="font-semibold text-gray-800">General Settings</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Application Name" name="appName" />
          <Field label="Tagline" name="tagline" />
          <Field label="Contact Email" name="contactEmail" type="email" />
          <Field label="Contact Phone" name="contactPhone" />
        </div>
      </div>

      {/* Business */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Percent size={18} className="text-blue-600" />
          <h2 className="font-semibold text-gray-800">Business Rules</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Commission Rate (%)" name="commissionRate" prefix="%" />
          <Field label="GST Rate (%)" name="gstRate" prefix="%" />
          <Field label="Minimum Order Value (₹)" name="minOrderValue" prefix="₹" />
          <Field label="Low Stock Alert Threshold (kg)" name="lowStockAlert" />
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-orange-600" />
          <h2 className="font-semibold text-gray-800">Delivery Settings</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Free Delivery Above (₹)" name="freeDeliveryAbove" prefix="₹" />
          <Field label="Standard Delivery Charge (₹)" name="deliveryCharge" prefix="₹" />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-purple-600" />
          <h2 className="font-semibold text-gray-800">Notifications</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <Toggle label="Email Notifications" name="emailNotifications" desc="Send email alerts for key events" />
          <Toggle label="SMS Notifications" name="smsNotifications" desc="Send SMS for order updates" />
          <Toggle label="Order Notifications" name="orderNotifications" desc="Notify admin on new orders" />
          <Toggle label="Farmer Notifications" name="farmerNotifications" desc="Notify on new farmer submissions" />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-red-600" />
          <h2 className="font-semibold text-gray-800">Security & Access</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <Toggle label="Maintenance Mode" name="maintenanceMode" desc="Disable public access to the app" />
          <Toggle label="Allow New Registrations" name="allowNewRegistrations" desc="Let new users sign up" />
          <Toggle label="Require Email Verification" name="requireEmailVerification" desc="Verify email on signup" />
          <Toggle label="2FA for Admin" name="twoFactorAdmin" desc="Require two-factor auth for admin login" />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition font-medium">
          <Save size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
}

export { AppSettings };
