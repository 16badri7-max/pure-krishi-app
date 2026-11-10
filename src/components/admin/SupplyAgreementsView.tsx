import React, { useState } from 'react';
import { 
  ScrollText, 
  Plus, 
  FileCheck2, 
  Download, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Clock, 
  AlertCircle,
  FileSignature
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { SupplyAgreement } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const SupplyAgreementsView: React.FC = () => {
  const { state, store } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [signModalAgreement, setSignModalAgreement] = useState<SupplyAgreement | null>(null);
  const [adminSignName, setAdminSignName] = useState(state.currentUser.name);

  // New Agreement Form State
  const [newAgr, setNewAgr] = useState({
    buyerId: state.buyers[0]?.id || '',
    productsSummary: '',
    agreedQuantityMonthly: 5000,
    unit: 'kg',
    estimatedValueMonthly: 250000,
    deliveryFrequency: 'Weekly on Mondays',
    qualityStandard: 'Pure Krishi Grade A (Zero Synthetic Pesticides)',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentTerms: 'Net 15 Days' as SupplyAgreement['paymentTerms'],
    deliveryLocation: 'Bhiwandi Central Agro-Hub, Mumbai',
    status: 'Sent for Review' as SupplyAgreement['status'],
  });

  const handleCreateAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    const buyer = state.buyers.find(b => b.id === newAgr.buyerId) || state.buyers[0];
    
    store.addSupplyAgreement({
      ...newAgr,
      buyerName: buyer.businessName,
      documentUrl: `https://purekrishi.org/agreements/agr-${Date.now()}.pdf`,
    });

    setIsAddModalOpen(false);
    setNewAgr({
      buyerId: state.buyers[0]?.id || '',
      productsSummary: '',
      agreedQuantityMonthly: 5000,
      unit: 'kg',
      estimatedValueMonthly: 250000,
      deliveryFrequency: 'Weekly on Mondays',
      qualityStandard: 'Pure Krishi Grade A (Zero Synthetic Pesticides)',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentTerms: 'Net 15 Days',
      deliveryLocation: 'Bhiwandi Central Agro-Hub, Mumbai',
      status: 'Sent for Review',
    });
  };

  const handleAuthorizeAgreement = () => {
    if (!signModalAgreement) return;
    store.signSupplyAgreement(signModalAgreement.id, adminSignName);
    setSignModalAgreement(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              B2B Supply Agreements & Contracts
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Binding Supermarket Supply
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Formal supply contracts that guarantee volumes, quality standards, and price protection before crop planning begins.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#176B45] hover:bg-[#104D35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Draft New Supply Agreement</span>
        </button>
      </div>

      {/* Agreements Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {state.agreements.map((agr) => {
          const isSigned = agr.status === 'Authorized & Signed' || agr.status === 'Active';
          return (
            <div 
              key={agr.id}
              className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Agreement ID: {agr.id}</span>
                  <h3 className="text-base font-bold text-[#17231C] font-display mt-0.5">
                    {agr.buyerName}
                  </h3>
                </div>
                <Badge variant={isSigned ? 'green' : 'amber'}>
                  {agr.status}
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F0] border border-[#176B45]/10 space-y-2 text-xs">
                <p className="text-[#17231C]">
                  <strong>Contract Scope:</strong> {agr.productsSummary}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#66736A]">
                  <div>
                    Monthly Committed: <strong className="text-[#104D35]">{agr.agreedQuantityMonthly.toLocaleString()} {agr.unit}</strong>
                  </div>
                  <div>
                    Monthly Value: <strong className="text-[#104D35]">₹{agr.estimatedValueMonthly.toLocaleString()}</strong>
                  </div>
                  <div>
                    Cadence: <strong>{agr.deliveryFrequency}</strong>
                  </div>
                  <div>
                    Payment Terms: <strong>{agr.paymentTerms}</strong>
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-1 text-[#66736A]">
                <p>
                  <strong>Standard:</strong> {agr.qualityStandard}
                </p>
                <p className="flex items-center space-x-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Valid from {agr.startDate} to {agr.endDate}</span>
                </p>
              </div>

              {/* Signature status / Action */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                {isSigned ? (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Authorized by {agr.signedByAdmin || 'Admin'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSignModalAgreement(agr)}
                    className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>Review & Authorize Signature</span>
                  </button>
                )}

                <a
                  href={agr.documentUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#176B45] hover:underline flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View Contract PDF</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sign Authorization Modal */}
      {signModalAgreement && (
        <Modal
          isOpen={Boolean(signModalAgreement)}
          onClose={() => setSignModalAgreement(null)}
          title="Authorize & Confirm Supply Agreement"
          subtitle="Authorized confirmation is mandatory before marking a B2B agreement active."
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15 text-xs space-y-1">
              <p><strong>Supermarket:</strong> {signModalAgreement.buyerName}</p>
              <p><strong>Committed Quantity:</strong> {signModalAgreement.agreedQuantityMonthly.toLocaleString()} {signModalAgreement.unit} / month</p>
              <p><strong>Contract Period:</strong> {signModalAgreement.startDate} to {signModalAgreement.endDate}</p>
              <p><strong>Quality Clause:</strong> {signModalAgreement.qualityStandard}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">
                Authorized Executive Signature Name *
              </label>
              <input
                type="text"
                required
                value={adminSignName}
                onChange={(e) => setAdminSignName(e.target.value)}
                placeholder="e.g. Rajesh Varma, CEO Pure Krishi"
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                By authorizing this agreement, Pure Krishi commits to matching suitable farmers and cultivated land to satisfy these contracted volumes.
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSignModalAgreement(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeAgreement}
                className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
              >
                Authorize & Activate Contract
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Draft New Agreement Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Draft B2B Supermarket Supply Agreement"
        subtitle="Establish contracted volumes, quality grade specifications, and delivery SLA."
      >
        <form onSubmit={handleCreateAgreement} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Supermarket Buyer *</label>
              <select
                value={newAgr.buyerId}
                onChange={(e) => setNewAgr({ ...newAgr, buyerId: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                {state.buyers.map((b) => (
                  <option key={b.id} value={b.id}>{b.businessName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Products Summary *</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Tomatoes (5000 kg), Onions (4000 kg)"
                value={newAgr.productsSummary}
                onChange={(e) => setNewAgr({ ...newAgr, productsSummary: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Monthly Quantity (kg) *</label>
              <input
                type="number"
                required
                value={newAgr.agreedQuantityMonthly}
                onChange={(e) => setNewAgr({ ...newAgr, agreedQuantityMonthly: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Estimated Monthly Value (₹)</label>
              <input
                type="number"
                required
                value={newAgr.estimatedValueMonthly}
                onChange={(e) => setNewAgr({ ...newAgr, estimatedValueMonthly: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Payment Terms</label>
              <select
                value={newAgr.paymentTerms}
                onChange={(e) => setNewAgr({ ...newAgr, paymentTerms: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Net 7 Days">Net 7 Days</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Immediate on Delivery">Immediate on Delivery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Contract Start Date</label>
              <input
                type="date"
                required
                value={newAgr.startDate}
                onChange={(e) => setNewAgr({ ...newAgr, startDate: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Contract End Date</label>
              <input
                type="date"
                required
                value={newAgr.endDate}
                onChange={(e) => setNewAgr({ ...newAgr, endDate: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17231C] mb-1">Quality Standard Clause</label>
            <input
              type="text"
              value={newAgr.qualityStandard}
              onChange={(e) => setNewAgr({ ...newAgr, qualityStandard: e.target.value })}
              className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
            >
              Create Agreement Draft
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
