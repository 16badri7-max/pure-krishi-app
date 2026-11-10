import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  ScrollText, 
  Tractor, 
  MapPin, 
  CalendarRange, 
  Wheat, 
  CheckCircle, 
  Package, 
  Warehouse, 
  Boxes, 
  ShoppingCart, 
  Truck, 
  Bot, 
  GraduationCap, 
  BadgeIndianRupee, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';

export type AdminViewType = 
  | 'overview'
  | 'buyers'
  | 'requirements'
  | 'agreements'
  | 'farmers'
  | 'land'
  | 'crop_planning'
  | 'harvest'
  | 'quality'
  | 'warehouse'
  | 'orders'
  | 'delivery'
  | 'ai_agronomy'
  | 'expert_support'
  | 'finance'
  | 'reports'
  | 'settings';

interface AdminSidebarProps {
  currentView: AdminViewType;
  onSelectView: (view: AdminViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onSelectView,
  isOpen,
  onClose,
}) => {
  const navSections = [
    {
      group: 'MAIN DASHBOARD',
      items: [
        { id: 'overview', label: 'HQ Overview', icon: LayoutDashboard },
      ]
    },
    {
      group: 'DEMAND-FIRST B2B PROCUREMENT',
      items: [
        { id: 'buyers', label: 'Buyer & Supermarkets', icon: Building2 },
        { id: 'requirements', label: 'Buyer Requirements', icon: FileText },
        { id: 'agreements', label: 'Supply Agreements', icon: ScrollText },
      ]
    },
    {
      group: 'FARMERS & CULTIVATION',
      items: [
        { id: 'farmers', label: 'Farmer Management', icon: Tractor },
        { id: 'land', label: 'Land & Farm Discovery', icon: MapPin },
        { id: 'crop_planning', label: 'Demand Crop Planning', icon: CalendarRange, badge: 'CORE' },
      ]
    },
    {
      group: 'HARVEST & QUALITY CONTROL',
      items: [
        { id: 'harvest', label: 'Harvest Batches', icon: Wheat },
        { id: 'quality', label: 'Quality Verification (QC)', icon: CheckCircle },
      ]
    },
    {
      group: 'WAREHOUSE & FULFILLMENT',
      items: [
        { id: 'warehouse', label: 'Warehouses & Inventory', icon: Warehouse },
        { id: 'orders', label: 'B2B Purchase Orders', icon: ShoppingCart },
        { id: 'delivery', label: 'Logistics & Dispatch', icon: Truck },
      ]
    },
    {
      group: 'INTELLIGENCE & SUPPORT',
      items: [
        { id: 'ai_agronomy', label: 'AI Agriculture Engine', icon: Bot, badge: 'AI' },
        { id: 'expert_support', label: 'Agronomist Escalations', icon: GraduationCap },
      ]
    },
    {
      group: 'FINANCE & GOVERNANCE',
      items: [
        { id: 'finance', label: 'Finance & Gross Margin', icon: BadgeIndianRupee },
        { id: 'reports', label: 'Audit & Compliance', icon: BarChart3 },
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    onSelectView(id as AdminViewType);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed md:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-[#176B45]/15 overflow-y-auto transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 space-y-6">
          
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-gray-100">
            <span className="font-bold text-xs text-[#17231C]">NAVIGATION MENU</span>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider px-2 mb-1.5">
                {sec.group}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#176B45] text-white shadow-sm shadow-[#176B45]/30'
                          : 'text-[#17231C] hover:bg-[#F0F7F0] hover:text-[#176B45]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#5BA66B]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-[#F0F7F0] text-[#176B45] border border-[#DCECDC]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick System Status Card */}
          <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15 text-[11px] text-[#17231C] space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-[#104D35]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Demand Engine Active</span>
            </div>
            <p className="text-[#66736A] text-[10px] leading-tight">
              Matching 100% verified organic production directly to supermarket agreements.
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};
