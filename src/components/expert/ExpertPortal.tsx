import React, { useState } from 'react';
import { 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Bot, 
  MessageSquare, 
  Phone, 
  Wheat, 
  Send,
  ShieldCheck,
  FileText,
  Search,
  BookOpen,
  UserCheck,
  Bell,
  Sparkles,
  ArrowRight,
  Filter,
  HelpCircle,
  ExternalLink,
  Award
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { ExpertReviewCase, Farmer } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MetricCard } from '../common/MetricCard';

export type ExpertSection = 
  | 'dashboard'
  | 'farmer_questions'
  | 'ai_reviews'
  | 'crop_health'
  | 'recommendations'
  | 'farmer_records'
  | 'knowledge'
  | 'notifications'
  | 'profile';

export const ExpertPortal: React.FC = () => {
  const { state, store } = useStore();
  const [activeSection, setActiveSection] = useState<ExpertSection>('dashboard');
  const [selectedCase, setSelectedCase] = useState<ExpertReviewCase | null>(state.expertReviews[0] || null);
  
  // Modals state
  const [responseModalCase, setResponseModalCase] = useState<ExpertReviewCase | null>(null);
  const [expertText, setExpertText] = useState('');
  const [commentModalCase, setCommentModalCase] = useState<ExpertReviewCase | null>(null);
  const [commentText, setCommentText] = useState('');
  const [infoRequestModalCase, setInfoRequestModalCase] = useState<ExpertReviewCase | null>(null);
  const [infoRequestText, setInfoRequestText] = useState('');
  const [newRecommendationModal, setNewRecommendationModal] = useState(false);
  const [recFarmerId, setRecFarmerId] = useState(state.farmers[0]?.id || '');
  const [recCropName, setRecCropName] = useState('Desi Organic Tomatoes');
  const [recText, setRecText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCases = state.expertReviews.filter(c => c.status === 'Pending Review');
  const inProgressCases = state.expertReviews.filter(c => c.status === 'In Progress');
  const resolvedCases = state.expertReviews.filter(c => c.status === 'Resolved');
  const lowConfidenceAICases = state.expertReviews.filter(c => c.confidenceScore < 75);

  const expertNotifications = state.notifications.filter(
    n => n.recipientRole === 'expert' || n.recipientRole === 'all'
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'farmer_questions', label: 'Farmer Questions', icon: MessageSquare, badge: pendingCases.length },
    { id: 'ai_reviews', label: 'AI Review Requests', icon: Bot, badge: lowConfidenceAICases.length },
    { id: 'crop_health', label: 'Crop Health Support', icon: Wheat },
    { id: 'recommendations', label: 'Expert Recommendations', icon: FileText },
    { id: 'farmer_records', label: 'Farmer Records', icon: UserCheck },
    { id: 'knowledge', label: 'Knowledge Resources', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: expertNotifications.filter(n => !n.isRead).length },
    { id: 'profile', label: 'My Credentials', icon: Award },
  ];

  // Actions
  const handleOpenRespond = (reviewCase: ExpertReviewCase) => {
    setResponseModalCase(reviewCase);
    setExpertText(`Approved ICAR Bio-Prescription: Apply Trichoderma viride (5g/L) combined with 10,000 PPM cold-pressed Neem Oil at 3ml/L. Install 12 yellow sticky traps per acre immediately to disrupt insect vectors.`);
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseModalCase) return;

    store.resolveExpertCase(responseModalCase.id, state.currentUser.name, expertText);
    setResponseModalCase(null);
  };

  const handleOpenAddComment = (reviewCase: ExpertReviewCase) => {
    setCommentModalCase(reviewCase);
    setCommentText(reviewCase.expertComments || '');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentModalCase) return;
    store.addExpertComment(commentModalCase.id, commentText);
    setCommentModalCase(null);
  };

  const handleOpenRequestInfo = (reviewCase: ExpertReviewCase) => {
    setInfoRequestModalCase(reviewCase);
    setInfoRequestText('Please share clear close-up photos of the underside of leaves and note if whiteflies or aphids are seen upon shaking the foliage.');
  };

  const handleSubmitRequestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoRequestModalCase) return;
    store.requestAdditionalExpertInfo(infoRequestModalCase.id, infoRequestText);
    setInfoRequestModalCase(null);
  };

  const handleCreateDirectRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const farmer = state.farmers.find(f => f.id === recFarmerId);
    if (!farmer || !recText.trim()) return;

    store.submitExpertRecommendation(farmer.id, farmer.name, recCropName, recText);
    setNewRecommendationModal(false);
    setRecText('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      
      {/* Expert Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm space-y-4 shrink-0 h-fit">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs text-[#104D35] uppercase tracking-wider font-display">
              Agronomy Board
            </span>
            <span className="bg-[#F0F7F0] text-[#176B45] text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#DCECDC]">
              ICAR Verified
            </span>
          </div>
          <p className="text-[11px] text-[#66736A] mt-0.5">
            Dr. M. S. Swaminathan (Lead)
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as ExpertSection)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#104D35] text-white shadow-sm'
                    : 'text-[#66736A] hover:bg-[#F0F7F0] hover:text-[#17231C]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#176B45]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-stone-900' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Prescription Dispatch Action */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => setNewRecommendationModal(true)}
            className="w-full py-2.5 px-3 bg-[#F0F7F0] hover:bg-[#DCECDC] text-[#104D35] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-[#176B45]/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Send Prescription</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6">
        
        {/* SECTION 1: DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white rounded-3xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#F0F7F0] text-[#176B45] flex items-center justify-center font-bold text-xl border border-[#DCECDC] shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
                      Chief Agronomist & Expert Console
                    </h1>
                    <Badge variant="green">ICAR Certified</Badge>
                  </div>
                  <p className="text-xs text-[#66736A] mt-0.5">
                    Human oversight of AI agronomy decisions, bio-prescriptions, and farmer symptom reviews.
                  </p>
                </div>
              </div>

              {/* 5 KPI metrics requested in Prompt 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 text-center">
                  <span className="text-[11px] text-[#66736A] block">Assigned Farmers</span>
                  <span className="text-lg font-extrabold text-[#104D35]">{state.farmers.length}</span>
                </div>
                <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 text-center">
                  <span className="text-[11px] text-[#66736A] block">Pending Questions</span>
                  <span className="text-lg font-extrabold text-amber-700">{pendingCases.length}</span>
                </div>
                <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 text-center">
                  <span className="text-[11px] text-[#66736A] block">AI Reviews (&lt;75%)</span>
                  <span className="text-lg font-extrabold text-red-600">{lowConfidenceAICases.length}</span>
                </div>
                <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 text-center">
                  <span className="text-[11px] text-[#66736A] block">Open Support Cases</span>
                  <span className="text-lg font-extrabold text-blue-600">{inProgressCases.length}</span>
                </div>
                <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 text-center">
                  <span className="text-[11px] text-[#66736A] block">Resolved Prescriptions</span>
                  <span className="text-lg font-extrabold text-[#176B45]">{resolvedCases.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Priority Queue */}
            <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#17231C]">Priority Escalation Queue</h3>
                  <p className="text-xs text-[#66736A]">High urgency cases flagged for human agronomy validation.</p>
                </div>
                <button
                  onClick={() => setActiveSection('ai_reviews')}
                  className="text-xs font-bold text-[#176B45] hover:underline flex items-center space-x-1"
                >
                  <span>View All Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.expertReviews.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-[#176B45]/10 bg-[#FAF8F0] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#176B45]">{c.id}</span>
                        <h4 className="font-bold text-sm text-[#17231C]">{c.cropName}</h4>
                        <p className="text-xs text-gray-500">Farmer: <strong>{c.farmerName}</strong> ({c.farmerPhone})</p>
                      </div>
                      <Badge variant={c.status === 'Resolved' ? 'green' : c.status === 'In Progress' ? 'blue' : 'amber'}>
                        {c.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100">
                      <strong>Query:</strong> "{c.question}"
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Bot className="w-3.5 h-3.5 text-[#176B45]" />
                        <span>AI Confidence: <strong>{c.confidenceScore}%</strong></span>
                      </div>
                      <button
                        onClick={() => handleOpenRespond(c)}
                        className="px-3 py-1 bg-[#104D35] hover:bg-[#176B45] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        {c.status === 'Resolved' ? 'Update Advice' : 'Review & Prescribe'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: FARMER QUESTIONS */}
        {activeSection === 'farmer_questions' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display">Farmer Inquiries & Symptom Queries</h2>
                <p className="text-xs text-[#66736A]">Direct questions escalated from registered cooperative farmers.</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search farmer or crop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#176B45]"
                />
              </div>
            </div>

            <div className="space-y-4">
              {state.expertReviews
                .filter(c => c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) || c.cropName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-gray-200 hover:border-[#176B45]/40 transition-all space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-[#176B45]">{item.id}</span>
                          <span className="text-xs font-bold text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#17231C]">{item.farmerName} — {item.cropName}</h4>
                        <p className="text-xs text-gray-500">Phone: {item.farmerPhone}</p>
                      </div>
                      <Badge variant={item.status === 'Resolved' ? 'green' : item.status === 'In Progress' ? 'blue' : 'amber'}>
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#17231C] bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/10">
                      <strong>Farmer's Query:</strong> {item.question}
                    </p>

                    {item.additionalInfoRequested && (
                      <div className="text-xs text-blue-800 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                        <strong>Requested Details from Farmer:</strong> {item.additionalInfoRequested}
                      </div>
                    )}

                    {item.expertResponse && (
                      <div className="text-xs text-[#104D35] bg-[#F0F7F0] p-2.5 rounded-lg border border-[#DCECDC]">
                        <strong>Certified Prescription:</strong> {item.expertResponse}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleOpenAddComment(item)}
                        className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
                      >
                        Internal Note
                      </button>
                      <button
                        onClick={() => handleOpenRequestInfo(item)}
                        className="px-3 py-1.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 font-semibold"
                      >
                        Request More Info
                      </button>
                      <button
                        onClick={() => handleOpenRespond(item)}
                        className="px-3 py-1.5 text-xs bg-[#104D35] hover:bg-[#176B45] text-white rounded-lg font-bold transition-colors"
                      >
                        {item.status === 'Resolved' ? 'Edit Prescription' : 'Prescribe & Resolve'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SECTION 3: AI REVIEW REQUESTS (CONFIDENCE < 75%) */}
        {activeSection === 'ai_reviews' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-amber-600" />
                  <span>AI Responses Awaiting Expert Validation</span>
                </h2>
                <p className="text-xs text-[#66736A]">AI confidence score below threshold (&lt;75%). Requires certified agronomist sign-off before farmer dispatch.</p>
              </div>
              <Badge variant="amber">{lowConfidenceAICases.length} Pending</Badge>
            </div>

            <div className="space-y-4">
              {state.expertReviews.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#176B45]">{c.id}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="font-bold text-xs text-[#17231C]">{c.farmerName}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#17231C] mt-0.5">{c.cropName}</h4>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-extrabold px-2 py-0.5 rounded-full inline-block ${
                        c.confidenceScore >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        AI Confidence: {c.confidenceScore}%
                      </div>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{c.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                      <span className="font-bold text-gray-700 block">Farmer Description:</span>
                      <p className="text-gray-800">{c.question}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                      <span className="font-bold text-[#104D35] flex items-center space-x-1">
                        <Bot className="w-3 h-3 text-[#176B45]" />
                        <span>AI Preliminary Diagnostic:</span>
                      </span>
                      <p className="text-gray-800">{c.aiSuggestedAnswer}</p>
                    </div>
                  </div>

                  {c.expertResponse && (
                    <div className="text-xs bg-[#F0F7F0] p-3 rounded-xl border border-[#DCECDC] text-[#104D35]">
                      <strong>Official Human Prescription:</strong> {c.expertResponse}
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-amber-200/60">
                    <button
                      onClick={() => handleOpenRequestInfo(c)}
                      className="px-3 py-1.5 text-xs text-blue-700 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 font-semibold"
                    >
                      Ask Farmer for Photos
                    </button>
                    <button
                      onClick={() => handleOpenRespond(c)}
                      className="px-4 py-1.5 text-xs bg-[#104D35] hover:bg-[#176B45] text-white rounded-lg font-bold shadow-sm"
                    >
                      {c.status === 'Resolved' ? 'Update Official Sign-off' : 'Certify & Send Prescription'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: CROP HEALTH SUPPORT */}
        {activeSection === 'crop_health' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Crop Health Surveillance & Common Diseases</h2>
              <p className="text-xs text-[#66736A]">Active disease and pest pressure across partner clusters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-red-800">High Alert</span>
                  <span className="text-[10px] text-red-600">Nashik Cluster</span>
                </div>
                <h4 className="font-bold text-sm text-[#17231C]">Early Blight (Alternaria solani)</h4>
                <p className="text-xs text-gray-600">Affecting tomato foliage during dew periods. Recommended copper hydroxide or Trichoderma bio-spray.</p>
                <div className="text-[11px] font-semibold text-red-700 pt-1">
                  12 farms reporting mild symptoms
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-800">Moderate Alert</span>
                  <span className="text-[10px] text-amber-600">Guntur Delta</span>
                </div>
                <h4 className="font-bold text-sm text-[#17231C]">Chilli Thrips & Yellow Mite</h4>
                <p className="text-xs text-gray-600">Leaf curling upwards and bronzing. Prescribe 10,000 ppm Neem oil and blue sticky traps.</p>
                <div className="text-[11px] font-semibold text-amber-700 pt-1">
                  6 farms under bio-treatment
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-800">Normal / Safe</span>
                  <span className="text-[10px] text-emerald-600">Mandya Valley</span>
                </div>
                <h4 className="font-bold text-sm text-[#17231C]">Spinach Downy Mildew Free</h4>
                <p className="text-xs text-gray-600">Excellent aeration in polyhouse structures. Foliar health index at 98%.</p>
                <div className="text-[11px] font-semibold text-emerald-700 pt-1">
                  All 4 polyhouse blocks cleared
                </div>
              </div>
            </div>

            {/* Prescriptive Action Guidelines */}
            <div className="bg-[#FAF8F0] p-4 rounded-xl border border-[#176B45]/15 space-y-2 text-xs">
              <span className="font-bold text-[#104D35] block">Pure Krishi Organic Treatment Protocol (ICAR Aligned)</span>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                <li>No synthetic organophosphates or chlorpyrifos permitted under any circumstance.</li>
                <li>Bio-control agents: Trichoderma harzianum, Pseudomonas fluorescens, Bacillus subtilis.</li>
                <li>Botanical extracts: Agniastra, Dashaparni Kashayam, cold-pressed Neem Oil (minimum 10,000 PPM azadirachtin).</li>
              </ul>
            </div>
          </div>
        )}

        {/* SECTION 5: EXPERT RECOMMENDATIONS */}
        {activeSection === 'recommendations' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display">Certified Expert Prescriptions History</h2>
                <p className="text-xs text-[#66736A]">Permanent archive of all official agronomist recommendations issued to farmers.</p>
              </div>
              <button
                onClick={() => setNewRecommendationModal(true)}
                className="px-3.5 py-1.5 bg-[#104D35] hover:bg-[#176B45] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>New Advisory</span>
              </button>
            </div>

            <div className="space-y-3">
              {state.expertReviews.filter(c => c.expertResponse).map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#176B45]">{c.id}</span>
                      <h4 className="font-bold text-sm text-[#17231C]">{c.cropName} • {c.farmerName}</h4>
                      <p className="text-xs text-gray-500">Issued by: <strong>{c.assignedExpertName || state.currentUser.name}</strong> on {new Date(c.resolvedAt || c.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <Badge variant="green">Official Prescription</Badge>
                  </div>

                  <div className="text-xs bg-[#F0F7F0] p-3 rounded-xl border border-[#DCECDC] text-[#104D35] font-sans">
                    {c.expertResponse}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: FARMER RECORDS */}
        {activeSection === 'farmer_records' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Farmer Agronomy Records & Soil Health</h2>
              <p className="text-xs text-[#66736A]">Comprehensive profiles of farmers and registered land parcels for expert reference.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.farmers.map((farmer) => (
                <div key={farmer.id} className="p-4 rounded-xl border border-gray-200 bg-[#FAF8F0] space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#17231C]">{farmer.name}</h4>
                      <p className="text-xs text-gray-600">{farmer.village}, {farmer.district}, {farmer.state}</p>
                    </div>
                    <Badge variant="green">{farmer.farmingPractices}</Badge>
                  </div>

                  <div className="text-xs text-gray-700 grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-gray-100">
                    <div>Total Land: <strong>{farmer.totalAcres} Acres</strong></div>
                    <div>Phone: <strong>{farmer.phone}</strong></div>
                    <div className="col-span-2">Main Crops: <strong>{farmer.mainCrops.join(', ')}</strong></div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#176B45] font-semibold">{farmer.farms.length} Verified Parcels</span>
                    <button
                      onClick={() => {
                        setRecFarmerId(farmer.id);
                        setRecCropName(farmer.mainCrops[0] || 'Vegetables');
                        setNewRecommendationModal(true);
                      }}
                      className="px-2.5 py-1 bg-[#104D35] text-white rounded-lg text-xs font-semibold hover:bg-[#176B45]"
                    >
                      Send Advisory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: KNOWLEDGE RESOURCES */}
        {activeSection === 'knowledge' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">ICAR Agronomy Guidelines & Organic Repository</h2>
              <p className="text-xs text-[#66736A]">Standard operating procedures and zero chemical residue crop protocols.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#176B45] transition-all space-y-2">
                <div className="flex items-center space-x-2 text-[#104D35]">
                  <BookOpen className="w-4 h-4 text-[#176B45]" />
                  <h4 className="font-bold text-xs">Tomato IPM Protocol 2025</h4>
                </div>
                <p className="text-xs text-gray-600">Integrated pest management for Tuta absoluta and fruit borer using pheromone traps and Bt sprays.</p>
                <span className="text-[10px] text-[#176B45] font-bold">Standard ICAR Guidelines v3.2</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#176B45] transition-all space-y-2">
                <div className="flex items-center space-x-2 text-[#104D35]">
                  <BookOpen className="w-4 h-4 text-[#176B45]" />
                  <h4 className="font-bold text-xs">ZBNF Bio-Fertilizer Schedule</h4>
                </div>
                <p className="text-xs text-gray-600">Dosage recommendations for Ghanjeevamrit, Beejamrit seed coating, and Jeevamrit fertigation intervals.</p>
                <span className="text-[10px] text-[#176B45] font-bold">Natural Farming Council Certified</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#176B45] transition-all space-y-2">
                <div className="flex items-center space-x-2 text-[#104D35]">
                  <BookOpen className="w-4 h-4 text-[#176B45]" />
                  <h4 className="font-bold text-xs">Pesticide Residue Limits (APEDA & FSSAI)</h4>
                </div>
                <p className="text-xs text-gray-600">Maximum Residue Limits (MRL) checklist for retail supermarket compliance in India.</p>
                <span className="text-[10px] text-[#176B45] font-bold">Zero Tolerance Table</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#176B45] transition-all space-y-2">
                <div className="flex items-center space-x-2 text-[#104D35]">
                  <BookOpen className="w-4 h-4 text-[#176B45]" />
                  <h4 className="font-bold text-xs">Post-Harvest Pre-Cooling Standards</h4>
                </div>
                <p className="text-xs text-gray-600">Optimal temperature pulping and reefer humidity parameters from farm gate to supermarket shelf.</p>
                <span className="text-[10px] text-[#176B45] font-bold">Cold Chain Operations Manual</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: NOTIFICATIONS */}
        {activeSection === 'notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display">Agronomy Alerts & Escalations</h2>
                <p className="text-xs text-[#66736A]">Real-time system alerts triggered by AI models and farmer support tickets.</p>
              </div>
              <button
                onClick={() => store.markAllNotificationsAsRead('expert')}
                className="text-xs font-bold text-[#176B45] hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-2">
              {expertNotifications.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No notifications for the expert team.
                </div>
              ) : (
                expertNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      n.isRead ? 'bg-gray-50/50 border-gray-100' : 'bg-emerald-50/30 border-emerald-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#17231C]">{n.title}</span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => store.markNotificationAsRead(n.id)}
                        className="text-[11px] text-[#176B45] font-semibold hover:underline shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 9: PROFILE & CREDENTIALS */}
        {activeSection === 'profile' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Chief Agronomist Credentials</h2>
              <p className="text-xs text-[#66736A]">Professional accreditation, certification seals, and authority signature.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-[#104D35] text-white flex items-center justify-center text-2xl font-bold font-display">
                  SW
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#17231C]">Dr. M. S. Swaminathan, Ph.D.</h3>
                  <p className="text-xs text-[#66736A]">Chief Agronomist & Organic Certifications Director</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="green">ICAR ID: ICAR-AGR-88912</Badge>
                    <Badge variant="blue">NPOP Inspector</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-[#176B45]/10">
                <div>Specialization: <strong>Plant Pathology & Soil Microbiome</strong></div>
                <div>Affiliation: <strong>Indian Agricultural Research Institute (IARI)</strong></div>
                <div>Contact: <strong>expert@purekrishi.org</strong></div>
                <div>Official Seal: <strong>Digitally Signed (PK-AGR-CERT-2025)</strong></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: PRESCRIBE / RESOLVE CASE */}
      <Modal
        isOpen={!!responseModalCase}
        onClose={() => setResponseModalCase(null)}
        title={`Official Prescription for ${responseModalCase?.cropName || ''}`}
      >
        {responseModalCase && (
          <form onSubmit={handleSubmitResponse} className="space-y-4 text-xs">
            <div className="bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/15 space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-[#104D35]">{responseModalCase.farmerName}</span>
                <span className="text-gray-500">{responseModalCase.farmerPhone}</span>
              </div>
              <p className="text-gray-700 italic">"{responseModalCase.question}"</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">
                Official Agronomic Prescription & Application Instructions:
              </label>
              <textarea
                rows={5}
                required
                value={expertText}
                onChange={(e) => setExpertText(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#176B45] text-xs font-mono"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setResponseModalCase(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold shadow-sm flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Sign & Dispatch to Farmer</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 2: REQUEST ADDITIONAL INFO */}
      <Modal
        isOpen={!!infoRequestModalCase}
        onClose={() => setInfoRequestModalCase(null)}
        title="Request Additional Information from Farmer"
      >
        {infoRequestModalCase && (
          <form onSubmit={handleSubmitRequestInfo} className="space-y-4 text-xs">
            <p className="text-gray-600">
              Ask farmer <strong>{infoRequestModalCase.farmerName}</strong> for specific additional photographs or observations before issuing diagnosis.
            </p>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">Question / Photo Request Details:</label>
              <textarea
                rows={4}
                required
                value={infoRequestText}
                onChange={(e) => setInfoRequestText(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#176B45] text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setInfoRequestModalCase(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              >
                Send Request via SMS / App
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 3: INTERNAL COMMENT */}
      <Modal
        isOpen={!!commentModalCase}
        onClose={() => setCommentModalCase(null)}
        title="Add Expert Internal Comments"
      >
        {commentModalCase && (
          <form onSubmit={handleSubmitComment} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">Internal Case Notes (Agronomist Team Only):</label>
              <textarea
                rows={4}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#176B45] text-xs"
                placeholder="Add observations about soil condition, weather patterns, or vector lifecycle..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCommentModalCase(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold"
              >
                Save Notes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 4: PROACTIVE EXPERT RECOMMENDATION */}
      <Modal
        isOpen={newRecommendationModal}
        onClose={() => setNewRecommendationModal(false)}
        title="Draft Official Seasonal Recommendation"
      >
        <form onSubmit={handleCreateDirectRecommendation} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Target Farmer:</label>
              <select
                value={recFarmerId}
                onChange={(e) => setRecFarmerId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              >
                {state.farmers.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.district})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Crop Name:</label>
              <input
                type="text"
                required
                value={recCropName}
                onChange={(e) => setRecCropName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 block">Certified Recommendation & Timing:</label>
            <textarea
              rows={4}
              required
              value={recText}
              onChange={(e) => setRecText(e.target.value)}
              placeholder="e.g. Due to sudden night temperature drop below 12°C, apply wood ash mulch and light evening drip fertigation with Jeevamrit..."
              className="w-full p-3 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setNewRecommendationModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold"
            >
              Issue Recommendation
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
