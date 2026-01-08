
import React, { useState, useMemo } from 'react';
import { IncomeData, DeductionData, AgeGroup, TaxYear } from './types';
import { TAX_YEARS } from './constants';
import { calculateTax } from './utils/taxLogic';
import NumberInput from './components/NumberInput';
import ResultCard from './components/ResultCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import * as XLSX from 'xlsx';

const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<TaxYear>('2024');
  const [income, setIncome] = useState<IncomeData>({
    annualSalary: 0,
    annualCommission: 0,
    annualContractorIncome: 0,
    bonus: 0,
    annualTravelAllowance: 0,
    taxPaidAlready: 0,
    rentalIncome: 0,
    tradingIncome: 0,
  });

  const [deductions, setDeductions] = useState<DeductionData>({
    retirementAnnuity: 0,
    medicalAidMembers: 0,
    medicalAidDependents: 0,
    medicalAidMonthlyPremium: 0,
    medicalExpensesUncovered: 0,
    contractorExpenses: 0,
    commissionExpenses: 0,
    wfhEnabled: false,
    wfhTotalArea: 0,
    wfhOfficeArea: 0,
    wfhRentInterest: 0,
    wfhElectricityWater: 0,
    wfhCleaning: 0,
    additionalActivityEnabled: false,
    rentalExpenses: 0,
    tradingExpenses: 0,
    businessKms: 0,
    vehicleValue: 0,
  });

  const [ageGroup, setAgeGroup] = useState<AgeGroup>(AgeGroup.UNDER_65);

  const results = useMemo(() => 
    calculateTax(income, deductions, ageGroup, selectedYear), 
    [income, deductions, ageGroup, selectedYear]
  );

  const chartData = [
    { name: 'Net Pay', value: results.takeHomePay, color: '#ff4d29' }, // PayLess Orange
    { name: 'Income Tax', value: results.totalTax, color: '#1a1a1a' }, // PayLess Black
    { name: 'Allowable Relief', value: results.deductionsBreakdown.total, color: '#f59e0b' }, // Amber
  ];

  const exportToExcel = () => {
    const data = [
      ["PayLessTax Consultants - Individual Calculation", ""],
      ["Tax Year", selectedYear],
      ["Age Group", ageGroup],
      ["", ""],
      ["INCOME", ""],
      ["Salary", income.annualSalary],
      ["Commission", income.annualCommission],
      ["Contractor Fees", income.annualContractorIncome],
      ["Travel Allowance", income.annualTravelAllowance],
      ["Bonus", income.bonus],
      ["Rental Income", deductions.additionalActivityEnabled ? income.rentalIncome : 0],
      ["Trading Income", deductions.additionalActivityEnabled ? income.tradingIncome : 0],
      ["TOTAL GROSS", results.grossIncome],
      ["", ""],
      ["TAX PAID TO DATE", income.taxPaidAlready],
      ["", ""],
      ["TAX RELIEF APPLIED", ""],
      ["Retirement Annuity", results.deductionsBreakdown.ra],
      ["Travel Expenses", results.deductionsBreakdown.travel],
      ["WFH Deduction", results.deductionsBreakdown.wfh],
      ["Contractor Expenses", results.deductionsBreakdown.contractor],
      ["Commission Expenses", results.deductionsBreakdown.commission],
      ["Additional Activity Expenses", results.deductionsBreakdown.additionalActivities],
      ["TOTAL DEDUCTIONS", results.deductionsBreakdown.total],
      ["", ""],
      ["SUMMARY", ""],
      ["Taxable Income", results.taxableIncome],
      ["Tax Before Rebates", results.taxBeforeRebate],
      ["Primary Rebate", results.primaryRebate],
      ["Age Rebates", results.ageRebate],
      ["Medical Scheme Credits", results.medicalCredits],
      ["Additional Medical Credits", results.additionalMedicalCredits],
      ["Annual Liability", results.totalTax],
      ["PAYE Paid", results.taxPaidAlready],
      [results.isRefund ? "ESTIMATED REFUND" : "AMOUNT OWED", Math.abs(results.taxDifference)],
      ["", ""],
      ["NET ANNUAL INCOME", results.takeHomePay],
      ["MONTHLY DISPOSABLE", results.monthlyTakeHome],
      ["EFFECTIVE TAX RATE (%)", results.effectiveTaxRate.toFixed(2)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tax Assessment");
    XLSX.writeFile(wb, `PayLessTax_Report_${selectedYear}.xlsx`);
  };

  const exportToPdf = () => window.print();
  const currencyFormat = (val: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val);

  return (
    <div className="min-h-screen pb-20 bg-slate-50 flex flex-col">
      <nav className="bg-[#1a1a1a] text-white py-3 px-6 border-b border-orange-500/30 no-print flex justify-center">
        <a 
          href="https://www.paylesstax.co.za" 
          className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] bg-[#ff4d29] px-8 py-3 rounded-full shadow-2xl shadow-orange-900/40 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go to www.paylesstax.co.za
        </a>
      </nav>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center border-4 border-[#ff4d29] shadow-xl overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent"></div>
               <div className="relative text-center leading-none">
                  <div className="text-[10px] font-black text-white tracking-tighter mb-0.5">PAY</div>
                  <div className="text-[8px] font-medium text-orange-400 opacity-80 uppercase tracking-[0.2em]">LESS</div>
               </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                <span className="opacity-40" style={{ WebkitTextStroke: '1px #1a1a1a', color: 'transparent' }}>PAY</span>
                <span className="text-[#1a1a1a]">LESSTAX</span>
              </h1>
              <p className="text-[10px] font-black text-[#ff4d29] uppercase tracking-[0.4em] mt-1">Tax Consultants</p>
            </div>
          </div>

          <div className="relative w-full md:w-48 no-print">
            <label htmlFor="tax-year-select" className="absolute -top-2 left-3 px-1 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">
              Tax Year
            </label>
            <select
              id="tax-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as TaxYear)}
              className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 py-3 px-5 pr-10 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff4d29] focus:border-transparent transition-all shadow-sm"
            >
              {TAX_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year} Assessment
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 main-content flex-grow">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 no-print">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Professional Assessment Tool</h2>
            <p className="text-slate-400 text-sm font-medium">Verify your tax optimization strategy</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportToPdf} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              PDF Report
            </button>
            <button onClick={exportToExcel} className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Excel Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* INPUT COLUMN */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6">Assessee Profile</h2>
              <div className="print-only mb-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assessment Period</span>
                <span className="text-sm font-black text-orange-600 block mb-3 uppercase tracking-tighter">{selectedYear} Year of Assessment</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Selected Age Category</span>
                <span className="text-sm font-black text-[#1a1a1a] uppercase">{ageGroup}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-200 no-print">
                {Object.values(AgeGroup).map((group) => (
                  <button
                    key={group}
                    onClick={() => setAgeGroup(group)}
                    className={`py-3 px-4 rounded-xl text-xs font-black transition-all uppercase tracking-widest text-left flex justify-between items-center ${
                      ageGroup === group 
                        ? 'bg-[#1a1a1a] text-white shadow-xl shadow-slate-900/30 ring-1 ring-slate-800' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {group}
                    {ageGroup === group && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6">Revenue Streams</h2>
              <div className="grid grid-cols-1 gap-x-6">
                <NumberInput label="Primary Salary" value={income.annualSalary} onChange={(val) => setIncome({...income, annualSalary: val})} placeholder="0.00" />
                <NumberInput label="Commission Earnings" value={income.annualCommission} onChange={(val) => setIncome({...income, annualCommission: val})} placeholder="0.00" />
                <NumberInput label="Contractor Fees" value={income.annualContractorIncome} onChange={(val) => setIncome({...income, annualContractorIncome: val})} placeholder="0.00" />
                <NumberInput label="Travel Allowance" value={income.annualTravelAllowance} onChange={(val) => setIncome({...income, annualTravelAllowance: val})} placeholder="0.00" />
                <NumberInput label="Bonus Payouts" value={income.bonus} onChange={(val) => setIncome({...income, bonus: val})} placeholder="0.00" />
                <NumberInput label="PAYE Contributions" value={income.taxPaidAlready} onChange={(val) => setIncome({...income, taxPaidAlready: val})} helpText="Cumulative tax paid to date" placeholder="0.00" />
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 space-y-8">
              <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6">Optimization & Relief</h2>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6 border-l-4 border-orange-500 pl-3">Statutory Relief</h3>
                  <div className="grid grid-cols-1 gap-5">
                    <NumberInput label="Retirement Annuity Contributions" value={deductions.retirementAnnuity} onChange={(val) => setDeductions({...deductions, retirementAnnuity: val})} placeholder="0.00" />
                    <NumberInput label="Monthly Medical Aid Premium" value={deductions.medicalAidMonthlyPremium} onChange={(val) => setDeductions({...deductions, medicalAidMonthlyPremium: val})} placeholder="0.00" helpText="Total monthly scheme contributions" />
                    <NumberInput label="Main Member/Spouse" prefix="#" value={deductions.medicalAidMembers} onChange={(val) => setDeductions({...deductions, medicalAidMembers: val})} placeholder="0" />
                    <NumberInput label="Dependents" prefix="#" value={deductions.medicalAidDependents} onChange={(val) => setDeductions({...deductions, medicalAidDependents: val})} placeholder="0" />
                    <NumberInput label="Medical Aid Expenses (Uncovered)" value={deductions.medicalExpensesUncovered} onChange={(val) => setDeductions({...deductions, medicalExpensesUncovered: val})} placeholder="0.00" helpText="Expenses NOT covered by medical aid" />
                  </div>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-orange-500">
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6">Business Operations</h3>
                  <div className="grid grid-cols-1 gap-x-5">
                    <NumberInput label="Contractor Costs" value={deductions.contractorExpenses} onChange={(val) => setDeductions({...deductions, contractorExpenses: val})} placeholder="0.00" />
                    <NumberInput label="Commission Expenses" value={deductions.commissionExpenses} onChange={(val) => setDeductions({...deductions, commissionExpenses: val})} placeholder="0.00" />
                    <NumberInput label="Travel Log Business Kms" prefix="#" value={deductions.businessKms} onChange={(val) => setDeductions({...deductions, businessKms: val})} placeholder="0" />
                    <NumberInput label="Vehicle Purchase Value" value={deductions.vehicleValue} onChange={(val) => setDeductions({...deductions, vehicleValue: val})} helpText="Total value incl. VAT" placeholder="0.00" />
                  </div>
                </div>

                {/* ADDITIONAL BUSINESS ACTIVITIES BOX - Forced to Page 3 in print via container */}
                <div className="print-page-break space-y-8">
                  <div className="p-6 bg-[#1a1a1a] rounded-3xl border border-slate-800 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Additional Business Activities</h3>
                        <p className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tight">Rental & Trading (Non-PAYE)</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer no-print">
                        <input type="checkbox" checked={deductions.additionalActivityEnabled} onChange={(e) => setDeductions({...deductions, additionalActivityEnabled: e.target.checked})} className="sr-only peer" />
                        <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    {deductions.additionalActivityEnabled && (
                      <div className="grid grid-cols-1 gap-x-5 animate-fadeIn">
                        <div className="mb-4 pt-4 border-t border-slate-800">
                          <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Rental Portfolio</h4>
                          <NumberInput label="Annual Rental Revenue" value={income.rentalIncome} onChange={(val) => setIncome({...income, rentalIncome: val})} placeholder="0.00" />
                          <NumberInput label="Operating Expenditure" value={deductions.rentalExpenses} onChange={(val) => setDeductions({...deductions, rentalExpenses: val})} placeholder="0.00" />
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                          <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Trading / Side Hustle</h4>
                          <NumberInput label="Side-Hustle Revenue" value={income.tradingIncome} onChange={(val) => setIncome({...income, tradingIncome: val})} placeholder="0.00" />
                          <NumberInput label="Direct Business Costs" value={deductions.tradingExpenses} onChange={(val) => setDeductions({...deductions, tradingExpenses: val})} placeholder="0.00" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-[#1a1a1a] rounded-3xl border border-slate-800 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Home Office Deduction</h3>
                        <p className="text-[9px] text-slate-400 font-medium uppercase mt-1">Section 11(a) / 23(b) Claims</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer no-print">
                        <input type="checkbox" checked={deductions.wfhEnabled} onChange={(e) => setDeductions({...deductions, wfhEnabled: e.target.checked})} className="sr-only peer" />
                        <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    {deductions.wfhEnabled && (
                      <div className="grid grid-cols-1 gap-x-5 animate-fadeIn">
                        <NumberInput label="Total Home m²" prefix="#" value={deductions.wfhTotalArea} onChange={(val) => setDeductions({...deductions, wfhTotalArea: val})} placeholder="0" />
                        <NumberInput label="Dedicated Office m²" prefix="#" value={deductions.wfhOfficeArea} onChange={(val) => setDeductions({...deductions, wfhOfficeArea: val})} placeholder="0" />
                        <div className="grid grid-cols-1 gap-x-5 mt-2">
                          <NumberInput label="Rent / Interest" value={deductions.wfhRentInterest} onChange={(val) => setDeductions({...deductions, wfhRentInterest: val})} placeholder="0.00" />
                          <NumberInput label="Utilities / Cleaning" value={deductions.wfhElectricityWater + deductions.wfhCleaning} onChange={(val) => setDeductions({...deductions, wfhElectricityWater: val})} placeholder="0.00" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RESULTS COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard label="Monthly Net Pay" value={results.monthlyTakeHome} highlight={true} subText="Total monthly disposable income" />
              <ResultCard label="Tax Efficiency" value={100 - results.effectiveTaxRate} isCurrency={false} isPercentage={true} subText="Percentage of revenue retained" />
              <ResultCard label="Assessment Liability" value={results.totalTax} subText="Total SARS obligation" />
              <ResultCard label="Optimization Gain" value={results.deductionsBreakdown.total} subText="Gross revenue reduction" />
            </div>

            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">Fund Allocation Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '800' }}
                        formatter={(value: number) => currencyFormat(value)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STATEMENT SECTION */}
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative statement-section">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <svg className="w-32 h-32 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>

              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-[12px] font-black text-[#1a1a1a] uppercase tracking-[0.4em]">Official Statement of Account</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Client Ref: Assessment_{selectedYear}</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl">
                   <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Confidential Analysis</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between text-sm py-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Client Age Category</span>
                  <span className="text-slate-900 font-black uppercase text-[10px]">{ageGroup}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Annual Gross Remuneration</span>
                  <span className="text-slate-900 font-black">{currencyFormat(results.grossIncome)}</span>
                </div>
                <div className="flex justify-between text-sm p-6 bg-orange-50/30 rounded-3xl border border-orange-100/50">
                  <span className="text-orange-900 font-black uppercase text-[10px] tracking-[0.2em]">Validated Tax Relief Deductions</span>
                  <span className="text-orange-600 font-black">- {currencyFormat(results.deductionsBreakdown.total)}</span>
                </div>
                <div className="flex justify-between text-sm py-5 px-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-900/10">
                  <span className="font-bold uppercase text-[10px] tracking-widest opacity-60">Optimized Taxable Base</span>
                  <span className="font-black text-orange-400">{currencyFormat(results.taxableIncome)}</span>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-3">
                  <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                    <span className="uppercase tracking-widest">SARS Primary Rebate</span>
                    <span className="text-slate-900">+ {currencyFormat(results.primaryRebate)}</span>
                  </div>
                  {results.ageRebate > 0 && (
                    <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                      <span className="uppercase tracking-widest">SARS Secondary/Tertiary Rebates</span>
                      <span className="text-slate-900">+ {currencyFormat(results.ageRebate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                    <span className="uppercase tracking-widest">Section 6A Medical Credits</span>
                    <span className="text-slate-900">+ {currencyFormat(results.medicalCredits)}</span>
                  </div>
                  {results.additionalMedicalCredits > 0 && (
                    <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                      <span className="uppercase tracking-widest">Section 6B Medical Credits</span>
                      <span className="text-slate-900">+ {currencyFormat(results.additionalMedicalCredits)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-slate-200 flex justify-between text-xs text-[#1a1a1a]">
                    <span className="font-black uppercase tracking-[0.2em]">Total Statutory Relief</span>
                    <span className="font-black">+ {currencyFormat(results.totalRebatesAndCredits)}</span>
                  </div>
                </div>
                
                <div className="my-8 h-[1px] bg-slate-100"></div>

                <div className="flex justify-between text-sm px-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Final Net Liability</span>
                  <span className="text-slate-900 font-black">{currencyFormat(results.totalTax)}</span>
                </div>
                <div className="flex justify-between text-sm px-1 mb-8">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Contributions Received (PAYE)</span>
                  <span className="text-slate-900 font-black">{currencyFormat(results.taxPaidAlready)}</span>
                </div>

                <div className={`p-8 rounded-[2.5rem] border-2 flex flex-col md:flex-row justify-between items-center gap-6 transition-all ${results.isRefund ? 'bg-[#ff4d29] border-[#ff4d29] text-white shadow-2xl shadow-orange-500/30' : 'bg-white border-slate-900 shadow-sm'}`}>
                   <div>
                     <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${results.isRefund ? 'text-white/70' : 'text-slate-400'}`}>
                        {results.isRefund ? 'Estimated Refund Due' : 'Balance Owed to Revenue'}
                     </p>
                     <p className={`text-4xl font-black ${results.isRefund ? 'text-white' : 'text-slate-900'}`}>
                        {currencyFormat(Math.abs(results.taxDifference))}
                     </p>
                   </div>
                   <div className={`${results.isRefund ? 'text-white' : 'text-orange-600'}`}>
                      {results.isRefund ? (
                        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-18c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-18v18m-5-9h10" /></svg>
                      ) : (
                        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      )}
                   </div>
                </div>

                <div className="pt-10 mt-8 border-t-2 border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-3">Annual Net Disposable</p>
                    <p className="text-5xl font-black text-[#1a1a1a] tracking-tighter">{currencyFormat(results.takeHomePay)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-3">Monthly Cashflow</p>
                    <p className="text-2xl font-black text-[#ff4d29]">{currencyFormat(results.monthlyTakeHome)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
