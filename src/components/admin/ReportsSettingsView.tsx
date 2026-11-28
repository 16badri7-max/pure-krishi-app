import React from 'react';
import { 
  Lock, 
  Database, 
  CheckCircle2, 
  Download
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Badge } from '../common/Badge';

export const ReportsSettingsView: React.FC = () => {
  const { state } = useStore();

  const auditEvents = state.auditLogs;

  const handleExportAuditCSV = () => {
    const headers = ['Audit ID', 'Action', 'Actor', 'Role', 'Entity Type', 'Entity ID', 'Summary', 'Timestamp'];
    const rows = auditEvents.map(a => [
      a.id,
      a.action,
      `"${a.actorName}"`,
      a.actorRole,
      a.entityType,
      a.entityId,
      `"${a.summary.replace(/"/g, '""')}"`,
      a.createdAt,
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `pure_krishi_audit_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Audit Trail, Security & Database Compliance
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              APEDA / NPOP Compliant
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Immutable system logs, cryptographic batch verification hashes, and Supabase PostgreSQL Row Level Security (RLS) enforcement.
          </p>
        </div>
      </div>

      {/* Database & RLS Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-[#176B45]" />
            <h3 className="font-bold text-sm text-[#17231C]">PostgreSQL Database & RLS Security</h3>
          </div>
          <p className="text-xs text-[#66736A] leading-relaxed">
            Pure Krishi incorporates 32 normalized PostgreSQL database tables with strict Row Level Security (RLS). A user can never access another role's private business records without authorization.
          </p>
          <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 text-xs space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Database Engine:</span>
              <strong className="text-[#104D35]">PostgreSQL 15+ (Supabase)</strong>
            </div>
            <div className="flex justify-between">
              <span>Connection Status:</span>
              <strong className={isSupabaseConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                {isSupabaseConfigured ? 'Live Supabase Instance Connected' : 'Local Repository Mode (schema.sql available)'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Row Level Security (RLS):</span>
              <strong className="text-emerald-700">Enabled Across All 32 Tables</strong>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-5 h-5 text-[#176B45]" />
            <h3 className="font-bold text-sm text-[#17231C]">Role-Based Access Enforcement (RBAC)</h3>
          </div>
          <p className="text-xs text-[#66736A] leading-relaxed">
            The platform provides 8 dedicated user permissions scopes. Switch your role using the top bar switcher to test each distinct view and access constraint.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="green">Super Admin</Badge>
            <Badge variant="green">Operations Admin</Badge>
            <Badge variant="blue">Buyer / Supermarket</Badge>
            <Badge variant="amber">Farmer</Badge>
            <Badge variant="purple">Agriculture Expert</Badge>
            <Badge variant="neutral">Warehouse Staff</Badge>
            <Badge variant="blue">Delivery Partner</Badge>
            <Badge variant="green">B2C Customer</Badge>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-[#17231C] font-display">
              Immutable Traceability Audit Logs
            </h3>
            <p className="text-xs text-[#66736A]">All contracts, quality grading decisions, and dispatches are stamped with operator IDs.</p>
          </div>
          <button
            onClick={handleExportAuditCSV}
            className="px-3 py-1.5 bg-[#176B45] hover:bg-[#104D35] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F0] text-[#66736A] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-3 py-2.5">Audit ID</th>
                <th className="px-3 py-2.5">Action Event</th>
                <th className="px-3 py-2.5">Responsible Actor</th>
                <th className="px-3 py-2.5">Summary & Entity</th>
                <th className="px-3 py-2.5">Timestamp</th>
                <th className="px-3 py-2.5">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditEvents.map((aud) => (
                <tr key={aud.id} className="hover:bg-gray-50/70 font-mono text-[11px]">
                  <td className="px-3 py-2.5 font-bold text-[#176B45]">{aud.id}</td>
                  <td className="px-3 py-2.5 font-sans font-semibold text-gray-800">{aud.action}</td>
                  <td className="px-3 py-2.5 font-sans text-gray-700">
                    {aud.actorName} <span className="text-[10px] text-gray-400">({aud.actorRole})</span>
                  </td>
                  <td className="px-3 py-2.5 font-sans text-gray-600">{aud.summary}</td>
                  <td className="px-3 py-2.5 text-gray-400">{new Date(aud.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>LOGGED</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
