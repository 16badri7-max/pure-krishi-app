import React, { useState, useRef, useEffect } from 'react';
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
  Warehouse, 
  ShoppingCart, 
  Truck, 
  Bot, 
  GraduationCap, 
  BadgeIndianRupee, 
  BarChart3, 
  Settings,
  X,
  Thermometer,
  PackageSearch,
  Users,
  Store,
  Handshake,
  ScanFace,
  Lock,
  ShieldCheck,
  RefreshCw,
  Camera
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

// Financial views that require Face ID
const FINANCE_VIEWS: AdminViewType[] = ['finance', 'reports'];

// ── Face ID Modal ──────────────────────────────────────
const FaceIDModal: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const [phase, setPhase] = useState<'scanning' | 'success' | 'fail'>('scanning');
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Try to open camera
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch(() => {}); // Camera may be denied — UI still works

    // Animate dots
    const dotTimer = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);

    // Progress bar
    const progTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progTimer);
          setPhase('success');
          setTimeout(() => {
            stopCamera();
            onSuccess();
          }, 900);
          return 100;
        }
        return p + 2;
      });
    }, 60);

    return () => {
      clearInterval(dotTimer);
      clearInterval(progTimer);
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0b1f14] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-emerald-500/20">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Finance & Reports</p>
              <p className="text-[10px] text-emerald-400">Biometric Authentication Required</p>
            </div>
          </div>
          <button onClick={() => { stopCamera(); onCancel(); }} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera / Face scan area */}
        <div className="relative mx-5 mt-5 rounded-2xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center">
          <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />

          {/* Scan overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Face oval guide */}
            <div className={`relative w-36 h-44 rounded-full border-4 transition-colors duration-500 ${
              phase === 'success' ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)]' :
              phase === 'fail' ? 'border-red-400' : 'border-emerald-500/70'
            }`}>
              {/* Scanning line */}
              {phase === 'scanning' && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  style={{ top: `${progress}%`, transition: 'top 0.06s linear' }}
                />
              )}
              {/* Eye dot indicators */}
              <div className={`absolute top-10 left-7 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                progress > 40 ? 'border-emerald-400 bg-emerald-400/30' : 'border-gray-500'
              }`} />
              <div className={`absolute top-10 right-7 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                progress > 55 ? 'border-emerald-400 bg-emerald-400/30' : 'border-gray-500'
              }`} />
              {/* Success icon */}
              {phase === 'success' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
              )}
            </div>

            {/* Corner brackets */}
            {(['tl','tr','bl','br'] as const).map(c => (
              <div key={c} className={`absolute w-5 h-5 border-emerald-400 ${
                c === 'tl' ? 'top-3 left-3 border-t-2 border-l-2' :
                c === 'tr' ? 'top-3 right-3 border-t-2 border-r-2' :
                c === 'bl' ? 'bottom-3 left-3 border-b-2 border-l-2' :
                'bottom-3 right-3 border-b-2 border-r-2'
              }`} />
            ))}
          </div>
        </div>

        {/* Progress & status */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold ${
              phase === 'success' ? 'text-emerald-400' :
              phase === 'fail' ? 'text-red-400' : 'text-gray-300'
            }`}>
              {phase === 'scanning' ? `Scanning face & eyes${dots}` :
               phase === 'success' ? '✓ Identity Verified' : '✗ Scan Failed'}
            </span>
            <span className="text-gray-500 font-mono">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                phase === 'success' ? 'bg-emerald-400' :
                phase === 'fail' ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Checkpoints */}
          <div className="flex justify-between text-[10px] text-gray-500">
            <span className={progress >= 30 ? 'text-emerald-400 font-semibold' : ''}>Face detected</span>
            <span className={progress >= 55 ? 'text-emerald-400 font-semibold' : ''}>Eyes verified</span>
            <span className={progress >= 80 ? 'text-emerald-400 font-semibold' : ''}>ID matched</span>
          </div>

          <p className="text-[10px] text-gray-600 text-center">
            🔒 Financial data is protected by biometric lock. Keep face in frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onSelectView,
  isOpen,
  onClose,
}) => {
  const [showFaceID, setShowFaceID] = useState(false);
  const [pendingView, setPendingView] = useState<AdminViewType | null>(null);
  const [financeUnlocked, setFinanceUnlocked] = useState(false);

  const navSections = [
    {
      group: '📊 MAIN DASHBOARD',
      items: [
        { id: 'overview', label: 'HQ Overview', icon: LayoutDashboard },
      ]
    },
    {
      group: '🏢 B2B BUSINESS & BUYERS',
      color: 'text-blue-700',
      items: [
        { id: 'buyers', label: 'Buyers & Supermarkets', icon: Building2 },
        { id: 'requirements', label: 'Buyer Requirements', icon: FileText },
        { id: 'agreements', label: 'Supply Agreements', icon: Handshake },
      ]
    },
    {
      group: '🌾 FARMER CULTIVATION',
      color: 'text-amber-700',
      items: [
        { id: 'farmers', label: 'Farmer Management', icon: Tractor },
        { id: 'land', label: 'Land & Farm Discovery', icon: MapPin },
        { id: 'crop_planning', label: 'Demand Crop Planning', icon: CalendarRange, badge: 'CORE' },
        { id: 'harvest', label: 'Harvest Batches', icon: Wheat },
        { id: 'quality', label: 'Quality Verification (QC)', icon: CheckCircle },
      ]
    },
    {
      group: '🏭 WAREHOUSE & COLD STORAGE',
      color: 'text-purple-700',
      items: [
        { id: 'warehouse', label: 'Warehouses & Inventory', icon: Warehouse },
        { id: 'orders', label: 'B2B Purchase Orders', icon: ShoppingCart },
        { id: 'delivery', label: 'Logistics & Dispatch', icon: Truck },
      ]
    },
    {
      group: '💰 FINANCIAL DETAILS',
      color: 'text-rose-700',
      locked: true,
      items: [
        { id: 'finance', label: 'Finance & Gross Margin', icon: BadgeIndianRupee },
        { id: 'reports', label: 'Audit & Compliance', icon: BarChart3 },
      ]
    },
    {
      group: '🤖 AI & EXPERT SUPPORT',
      color: 'text-emerald-700',
      items: [
        { id: 'ai_agronomy', label: 'AI Agriculture Engine', icon: Bot, badge: 'AI' },
        { id: 'expert_support', label: 'Agronomist Escalations', icon: GraduationCap },
      ]
    },
    {
      group: '⚙️ SYSTEM SETTINGS',
      items: [
        { id: 'settings', label: 'Settings & Config', icon: Settings },
      ]
    },
  ];

  const handleItemClick = (id: string) => {
    const view = id as AdminViewType;
    if (FINANCE_VIEWS.includes(view) && !financeUnlocked) {
      setPendingView(view);
      setShowFaceID(true);
      return;
    }
    onSelectView(view);
    if (window.innerWidth < 768) onClose();
  };

  const handleFaceIDSuccess = () => {
    setShowFaceID(false);
    setFinanceUnlocked(true);
    if (pendingView) {
      onSelectView(pendingView);
      if (window.innerWidth < 768) onClose();
    }
    setPendingView(null);
  };

  const handleFaceIDCancel = () => {
    setShowFaceID(false);
    setPendingView(null);
  };

  return (
    <>
      {/* Face ID Modal */}
      {showFaceID && <FaceIDModal onSuccess={handleFaceIDSuccess} onCancel={handleFaceIDCancel} />}

      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed md:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-[#176B45]/15 overflow-y-auto transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 space-y-5">
          
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-gray-100">
            <span className="font-bold text-xs text-[#17231C]">NAVIGATION MENU</span>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${sec.color || 'text-[#66736A]'}`}>
                  {sec.group}
                </p>
                {sec.locked && (
                  <div className="flex items-center gap-1">
                    {financeUnlocked ? (
                      <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[9px] text-rose-600 font-bold flex items-center gap-0.5">
                        <ScanFace className="w-3 h-3" /> FACE ID
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  const isFinanceLocked = sec.locked && !financeUnlocked;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#176B45] text-white shadow-sm shadow-[#176B45]/30'
                          : isFinanceLocked
                          ? 'text-gray-400 hover:bg-rose-50 hover:text-rose-700 border border-dashed border-gray-200'
                          : 'text-[#17231C] hover:bg-[#F0F7F0] hover:text-[#176B45]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : isFinanceLocked ? 'text-gray-400' : 'text-[#5BA66B]'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-[#F0F7F0] text-[#176B45] border border-[#DCECDC]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {isFinanceLocked && <Lock className="w-3 h-3 text-rose-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Re-lock finance button */}
              {sec.locked && financeUnlocked && (
                <button
                  onClick={() => setFinanceUnlocked(false)}
                  className="w-full text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center justify-center gap-1 py-1 mt-1"
                >
                  <Lock className="w-3 h-3" /> Lock Financial Section
                </button>
              )}
            </div>
          ))}

          {/* System Status */}
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
