import React, { useState } from 'react';
import { 
  BadgeIndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Calendar, 
  Building2, 
  Tractor, 
  Truck, 
  Warehouse,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';

export const FinancePaymentsView: React.FC = () => {
  const { state } = useStore();
  const fin = state.financials;

  const [dateFilter, setDateFilter] = useState('current_quarter');

  const transactions = [
    {
      id: 'TXN-9081',
      date: '2025-03-01',
      party: "Nature's Basket Gourmet Supermarkets",
      type: 'Buyer Inbound (PO-2025-881)',
      amount: 105000,
      flow: 'credit',
      status: 'Settled',
      method: 'RTGS / Bank Transfer',
    },
    {
      id: 'TXN-9082',
      date: '2025-03-02',
      party: 'Ramesh Patil (Nashik Organic Co-op)',
      type: 'Farmer Procurement Payout',
      amount: 68000,
      flow: 'debit',
      status: 'Disbursed',
      method: 'DBT Direct UPI / NEFT',
    },
    {
      id: 'TXN-9083',
      date: '2025-03-02',
      party: 'Reliance Fresh Direct Retail',
      type: 'Buyer Inbound (PO-2025-882)',
      amount: 27000,
      flow: 'credit',
      status: 'Settled',
      method: 'Corporate Net Banking',
    },
    {
      id: 'TXN-9084',
      date: '2025-03-03',
      party: 'Basavaraj Gowda (Mandya ZBNF)',
      type: 'Farmer Procurement Payout',
      amount: 32000,
      flow: 'debit',
      status: 'Disbursed',
      method: 'Direct Bank Transfer',
    },
    {
      id: 'TXN-9085',
      date: '2025-03-03',
      party: 'ColdChain Express Logistics',
      type: 'Reefer Truck Transport Expense',
      amount: 14500,
      flow: 'debit',
      status: 'Settled',
      method: 'IMPS Fleet Account',
    }
  ];

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Party', 'Description', 'Amount (INR)', 'Flow', 'Status', 'Method'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      `"${t.party}"`,
      `"${t.type}"`,
      t.amount,
      t.flow,
      t.status,
      t.method
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pure_krishi_financial_ledger_${dateFilter}.csv`);
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
              Financial Ledger & Business Unit Economics
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Strict P&L Integrity
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Separate tracking of gross revenue, farmer procurement disbursement, warehouse logistics, and net operating margin.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white font-semibold text-gray-700"
          >
            <option value="current_quarter">Current Quarter (Q4 FY25)</option>
            <option value="current_month">Current Month</option>
            <option value="annual_fy25">Full Fiscal Year 2024-25</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="bg-[#176B45] hover:bg-[#104D35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176B45]/20 flex items-center space-x-1.5 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Core Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total B2B Buyer Sales"
          value={`₹${(fin.totalBuyerSales / 100000).toFixed(2)} L`}
          subtitle="Contracted Supermarkets"
          icon={Building2}
          badge="B2B Demand"
        />
        <MetricCard
          title="Farmer Procurement Payout"
          value={`₹${(fin.farmerProcurementCost / 100000).toFixed(2)} L`}
          subtitle="Direct Farmer Settlement"
          change="Fair Trade Pricing"
          isPositive={true}
          icon={Tractor}
        />
        <MetricCard
          title="Net Operating Margin"
          value={`₹${(fin.netProfit / 100000).toFixed(2)} L`}
          subtitle={`Gross Margin: ${fin.grossMarginPercentage}%`}
          change="+3.4% MoM"
          isPositive={true}
          icon={TrendingUp}
        />
        <MetricCard
          title="Outstanding Buyer Receivables"
          value={`₹${(fin.outstandingBuyerPayments / 1000).toFixed(0)}k`}
          subtitle="Net 15 Days Payment Terms"
          icon={BadgeIndianRupee}
        />
      </div>

      {/* Cost Breakdown & Revenue Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waterfall P&L Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#17231C] font-display">
            Operating Unit Economics
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 bg-[#FAF8F0] rounded-xl font-bold">
              <span className="text-[#104D35]">Gross B2B + B2C Revenue:</span>
              <span className="text-[#104D35]">₹{fin.grossRevenue.toLocaleString()}</span>
            </div>

            <div className="space-y-1.5 px-2">
              <div className="flex justify-between text-gray-600">
                <span>(-) Farmer Direct Procurement:</span>
                <span className="font-semibold text-rose-600">-₹{fin.farmerProcurementCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>(-) Cold Storage & Agro-Hubs:</span>
                <span className="font-semibold text-rose-600">-₹{(fin.warehouseLogisticsCost * 0.6).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>(-) Reefer Freight Logistics:</span>
                <span className="font-semibold text-rose-600">-₹{(fin.warehouseLogisticsCost * 0.4).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>(-) Quality Lab Screenings:</span>
                <span className="font-semibold text-rose-600">-₹{fin.operationalCosts.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between p-2.5 bg-[#F0F7F0] rounded-xl font-extrabold text-sm text-[#104D35]">
              <span>Pure Krishi Net Operating Profit:</span>
              <span>₹{fin.netProfit.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Pure Krishi ensures farmers receive 65-70% of final supermarket sale price, compared to traditional mandi intermediaries (25-30%).
            </span>
          </div>
        </div>

        {/* Ledger Transaction History */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[#17231C] font-display">
              Recent Settlement Ledger
            </h3>
            <span className="text-xs text-[#66736A]">Direct Bank Transfer Audit Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F0] text-[#66736A] uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Txn ID</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Entity / Account</th>
                  <th className="px-3 py-2.5">Flow</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/70">
                    <td className="px-3 py-2.5 font-mono font-semibold text-[#176B45]">{txn.id}</td>
                    <td className="px-3 py-2.5 font-mono text-gray-500">{txn.date}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-[#17231C]">{txn.party}</div>
                      <div className="text-[10px] text-gray-500">{txn.type}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center space-x-1 font-semibold text-[11px] ${
                        txn.flow === 'credit' ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {txn.flow === 'credit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        <span className="capitalize">{txn.flow}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-extrabold text-[#17231C]">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant="green">{txn.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
