import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  MessageSquare, 
  X,
  GraduationCap,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { askGeminiAgronomy, AIResponseResult } from '../../services/gemini';
import { AIMessage } from '../../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: {
    cropName?: string;
    growthStage?: string;
  };
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialContext,
}) => {
  const { state, store } = useStore();
  const [inputText, setInputText] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(initialContext?.cropName || 'Desi Organic Tomatoes');
  const [isLoading, setIsLoading] = useState(false);
  const [recentEscalationMsg, setRecentEscalationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userQuestion = inputText.trim();
    setInputText('');

    // Append farmer message
    store.addAIMessage({
      sender: 'farmer',
      senderName: state.currentUser.name,
      content: userQuestion,
    });

    setIsLoading(true);
    setRecentEscalationMsg(null);

    try {
      const result: AIResponseResult = await askGeminiAgronomy({
        cropName: selectedCrop,
        farmLocation: state.currentUser.location || 'Nashik, Maharashtra',
        soilType: 'Black Cotton Soil',
        growthStage: initialContext?.growthStage || 'Vegetative / Fruit Formation',
        question: userQuestion,
      });

      // Append AI response
      store.addAIMessage({
        sender: 'ai',
        content: result.reply,
        confidenceScore: result.confidenceScore,
        needsExpertReview: result.needsExpertReview,
      });

      // If uncertain or flagged for review, escalate to Human Agronomist
      if (result.needsExpertReview) {
        store.escalateToExpert(
          state.currentUser.id,
          state.currentUser.name,
          state.currentUser.phone || '+91 94220 54321',
          selectedCrop,
          userQuestion,
          result.reply,
          result.confidenceScore
        );
        setRecentEscalationMsg(`Confidence evaluated at ${result.confidenceScore}%. This consultation has been automatically escalated to Dr. M. S. Swaminathan (Chief Agronomist) for human secondary review.`);
      }
    } catch (err) {
      console.error('Error invoking Agronomy Assistant:', err);
      store.addAIMessage({
        sender: 'ai',
        content: 'Unable to reach the agronomy engine right now. Please submit this directly to the Agriculture Expert portal.',
        confidenceScore: 50,
        needsExpertReview: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    `How to treat early leaf curl and yellowing organically without synthetic pesticides?`,
    `What is the recommended drip irrigation interval during the flowering stage?`,
    `How to prepare Jeevamrit and Trichoderma foliar spray for Grade A fruit size?`,
    `Visible small boreholes near tomato calyx. Could this be fruit borer?`
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#104D35]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div 
          className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-[#176B45]/20 flex flex-col h-[650px] relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#176B45] to-[#104D35] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-300">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm sm:text-base font-display">
                    Pure Krishi AI Agronomy Assistant
                  </h3>
                  <span className="bg-amber-400 text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    ICAR & Gemini
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100">
                  Precision organic diagnostics with automatic Chief Agronomist escalation.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Selector Bar */}
          <div className="px-4 py-2 bg-[#FAF8F0] border-b border-[#176B45]/15 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-[#66736A] font-semibold text-[11px]">Crop Context:</span>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-[#104D35] focus:ring-1 focus:ring-[#176B45]"
              >
                <option value="Desi Organic Tomatoes">Desi Organic Tomatoes</option>
                <option value="Nashik Red Onions">Nashik Red Onions</option>
                <option value="English Cucumbers">English Cucumbers</option>
                <option value="Organic Baby Spinach">Organic Baby Spinach</option>
                <option value="G4 Green Chillies">G4 Green Chillies</option>
                <option value="Shimla Bell Peppers">Shimla Bell Peppers</option>
              </select>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold bg-[#F0F7F0] px-2 py-0.5 rounded border border-[#DCECDC]">
              Confidence Meter Active
            </span>
          </div>

          {/* Escalation notification banner if just triggered */}
          {recentEscalationMsg && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start space-x-2 shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{recentEscalationMsg}</span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {state.aiChatHistory.map((msg) => {
              const isFarmer = msg.sender === 'farmer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isFarmer ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-gray-400">
                    <span>{isFarmer ? msg.senderName || 'Farmer' : 'Pure Krishi AI Agronomist'}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.confidenceScore && (
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        msg.confidenceScore < 75 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {msg.confidenceScore}% Certainty
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isFarmer
                        ? 'bg-[#176B45] text-white rounded-tr-xs'
                        : 'bg-[#FAF8F0] text-gray-800 border border-[#176B45]/15 rounded-tl-xs space-y-2'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.needsExpertReview && (
                      <div className="mt-2 pt-2 border-t border-amber-200 text-[11px] text-amber-900 flex items-center space-x-1 font-semibold">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Escalated for validation to Pure Krishi Agricultural Extension Team.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-2xl max-w-sm">
                <Sparkles className="w-4 h-4 text-[#176B45] animate-spin" />
                <span>Cross-referencing symptoms with ICAR and organic protocols...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto text-[11px] shrink-0 bg-white">
            <span className="text-gray-400 shrink-0">Try asking:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p)}
                className="whitespace-nowrap px-2.5 py-1 bg-gray-100 hover:bg-[#F0F7F0] hover:text-[#176B45] rounded-lg transition-colors text-gray-700"
              >
                {p.slice(0, 36)}...
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2 shrink-0">
            <input
              type="text"
              placeholder={`Ask any question about ${selectedCrop} disease, organic NPK, or irrigation...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs rounded-xl border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-50 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
