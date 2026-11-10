import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  FlaskConical, 
  Eye, 
  Plus,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { QualityInspection, HarvestBatch } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const QualityVerificationView: React.FC = () => {
  const { state, store } = useStore();
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(state.inspections[0] || null);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [targetBatchForQC, setTargetBatchForQC] = useState<HarvestBatch | null>(null);

  // Inspection Form State
  const [qcForm, setQcForm] = useState({
    assignedGrade: 'Grade A Premium' as QualityInspection['assignedGrade'],
    brixSugarContent: 5.4,
    moisturePercentage: 91.5,
    visualDefectPercentage: 1.0,
    chemicalResidueStatus: 'Zero Detected (Clean Lab)' as QualityInspection['chemicalResidueStatus'],
    observations: 'Uniform size and deep natural pigmentation. Tested clean on multi-residue pesticide screen. Cleared for supermarket shipment.',
    status: 'Approved' as QualityInspection['status'],
    inspectorName: state.currentUser.name,
  });

  const batchesNeedingQC = state.harvestBatches.filter(b => b.status === 'Harvested' || b.status === 'Under Inspection');

  const handleOpenQC = (batch: HarvestBatch) => {
    setTargetBatchForQC(batch);
    setIsQCModalOpen(true);
  };

  const handleSubmitQC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBatchForQC) return;

    const newInsp = store.submitQualityInspection({
      harvestBatchId: targetBatchForQC.id,
      inspectorId: state.currentUser.id,
      inspectorName: qcForm.inspectorName,
      assignedGrade: qcForm.assignedGrade,
      brixSugarContent: Number(qcForm.brixSugarContent),
      moisturePercentage: Number(qcForm.moisturePercentage),
      visualDefectPercentage: Number(qcForm.visualDefectPercentage),
      chemicalResidueStatus: qcForm.chemicalResidueStatus,
      observations: qcForm.observations,
      photos: targetBatchForQC.photos,
      status: qcForm.status,
    });

    setSelectedInspection(newInsp);
    setIsQCModalOpen(false);
    setTargetBatchForQC(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Quality Inspection & Laboratory Verification (QC)
            </h1>
            <span className="bg-[#176B45] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Pesticide Residue Free Protocol
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Every batch undergoes multi-point testing: Brix index, moisture levels, physical grading, and certified pesticide screening.
          </p>
        </div>
      </div>

      {/* Pending Inspection Alert Bar */}
      {batchesNeedingQC.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                {batchesNeedingQC.length} Harvest Batches Awaiting Quality Inspection
              </h4>
              <p className="text-[11px] text-amber-800">
                Produce cannot be allocated to supermarket orders until certified by the QC agronomist.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {batchesNeedingQC.map(b => (
              <button
                key={b.id}
                onClick={() => handleOpenQC(b)}
                className="px-3 py-1.5 bg-[#176B45] hover:bg-[#104D35] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1"
              >
                <span>Inspect {b.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Past Inspections List & Inspection Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inspection Log */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold text-[#17231C] uppercase tracking-wider">
            Completed Quality Audits ({state.inspections.length})
          </h3>

          <div className="space-y-3">
            {state.inspections.map((qc) => {
              const batch = state.harvestBatches.find(b => b.id === qc.harvestBatchId);
              const isSelected = selectedInspection?.id === qc.id;
              const isApproved = qc.status === 'Approved';

              return (
                <div
                  key={qc.id}
                  onClick={() => setSelectedInspection(qc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0F7F0] border-[#176B45] shadow-md ring-1 ring-[#176B45]'
                      : 'bg-white border-[#176B45]/15 hover:border-[#176B45]/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#176B45]">{qc.harvestBatchId}</span>
                        <Badge variant={isApproved ? 'green' : 'red'}>
                          {qc.assignedGrade}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-[#17231C] mt-1">
                        {batch?.cropName || 'Verified Agricultural Produce'}
                      </h4>
                      <p className="text-xs text-[#66736A]">
                        Farmer: {batch?.farmerName} | Inspected by {qc.inspectorName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {qc.chemicalResidueStatus}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {new Date(qc.inspectedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] bg-white/80 p-2 rounded-xl border border-gray-100 text-center">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Brix Sugar</span>
                      <strong className="text-gray-800">{qc.brixSugarContent || 'N/A'}° Bx</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Moisture</span>
                      <strong className="text-gray-800">{qc.moisturePercentage || 'N/A'}%</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Visual Defect</span>
                      <strong className="text-emerald-700">{qc.visualDefectPercentage}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lab Certificate Dossier */}
        <div className="lg:col-span-5 space-y-4">
          {selectedInspection ? (
            <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4 sticky top-20">
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-[#176B45] font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Official Quality Inspection Certificate</span>
                  </div>
                  <h3 className="text-base font-bold text-[#17231C] mt-0.5">
                    Batch: {selectedInspection.harvestBatchId}
                  </h3>
                </div>
                <Badge variant={selectedInspection.status === 'Approved' ? 'green' : 'red'}>
                  {selectedInspection.assignedGrade}
                </Badge>
              </div>

              {/* Lab Parameters */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#17231C] uppercase tracking-wider block">
                  Measured Analytical Metrics
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Refractometer Brix</span>
                    <strong className="text-sm font-bold text-gray-800">{selectedInspection.brixSugarContent}° Brix</strong>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Moisture Analyzer</span>
                    <strong className="text-sm font-bold text-gray-800">{selectedInspection.moisturePercentage}%</strong>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Visual Defect %</span>
                    <strong className="text-sm font-bold text-emerald-700">{selectedInspection.visualDefectPercentage}%</strong>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                    <span className="text-[10px] text-[#66736A] block">Chemical Residue</span>
                    <strong className="text-xs font-bold text-emerald-800">{selectedInspection.chemicalResidueStatus}</strong>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div className="text-xs bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/10 space-y-1">
                <span className="font-bold text-[#17231C]">Inspector Technical Observations:</span>
                <p className="text-[#66736A] leading-relaxed">{selectedInspection.observations}</p>
              </div>

              {/* Timestamp & Responsible Sign-off */}
              <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                <p>Responsible Inspector: <strong className="text-gray-800">{selectedInspection.inspectorName}</strong></p>
                <p className="text-[11px] font-mono text-gray-400">Timestamp: {new Date(selectedInspection.inspectedAt).toISOString()}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Select an inspection audit above to view technical lab findings.</p>
            </div>
          )}
        </div>

      </div>

      {/* Record Quality Inspection Modal */}
      {targetBatchForQC && (
        <Modal
          isOpen={isQCModalOpen}
          onClose={() => setIsQCModalOpen(false)}
          title={`Conduct Quality Inspection: ${targetBatchForQC.id}`}
          subtitle={`Harvest Batch: ${targetBatchForQC.cropName} (${targetBatchForQC.harvestQuantity} ${targetBatchForQC.unit})`}
        >
          <form onSubmit={handleSubmitQC} className="space-y-4">
            <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15 text-xs grid grid-cols-2 gap-2">
              <div><strong>Farmer:</strong> {targetBatchForQC.farmerName}</div>
              <div><strong>Harvest Date:</strong> {targetBatchForQC.harvestDate}</div>
              <div><strong>Quantity:</strong> {targetBatchForQC.harvestQuantity} {targetBatchForQC.unit}</div>
              <div><strong>Expected:</strong> {targetBatchForQC.expectedGrade}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Assigned Final Grade *</label>
                <select
                  value={qcForm.assignedGrade}
                  onChange={(e) => setQcForm({ ...qcForm, assignedGrade: e.target.value as any })}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
                >
                  <option value="Grade A Premium">Grade A Premium</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B Standard">Grade B Standard</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Decision Status *</label>
                <select
                  value={qcForm.status}
                  onChange={(e) => setQcForm({ ...qcForm, status: e.target.value as any })}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
                >
                  <option value="Approved">Approved for Distribution</option>
                  <option value="Rejected">Rejected (Sub-standard)</option>
                  <option value="Needs Re-inspection">Needs Re-inspection</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Brix Content (°Bx)</label>
                <input
                  type="number"
                  step="0.1"
                  value={qcForm.brixSugarContent}
                  onChange={(e) => setQcForm({ ...qcForm, brixSugarContent: Number(e.target.value) })}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Moisture (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={qcForm.moisturePercentage}
                  onChange={(e) => setQcForm({ ...qcForm, moisturePercentage: Number(e.target.value) })}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Visual Defect (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={qcForm.visualDefectPercentage}
                  onChange={(e) => setQcForm({ ...qcForm, visualDefectPercentage: Number(e.target.value) })}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Multi-Residue Chemical Screen *</label>
              <select
                value={qcForm.chemicalResidueStatus}
                onChange={(e) => setQcForm({ ...qcForm, chemicalResidueStatus: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="Zero Detected (Clean Lab)">Zero Detected (Clean Lab - 100% Organic)</option>
                <option value="Within Organic Permissible">Within Organic Permissible Limit</option>
                <option value="Contaminated (Rejected)">Contaminated (Immediate Rejection)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Inspector Notes & Observations *</label>
              <textarea
                rows={3}
                required
                value={qcForm.observations}
                onChange={(e) => setQcForm({ ...qcForm, observations: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsQCModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
              >
                Record Verification Decision
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
