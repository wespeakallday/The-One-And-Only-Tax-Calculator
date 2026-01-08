
import { IncomeData, DeductionData, TaxResult, AgeGroup, TaxYear } from '../types';
import { YEAR_DATA, TRAVEL_SCALE, MAX_RA_DEDUCTION_PERCENT, MAX_RA_DEDUCTION_CAP } from '../constants';

export const calculateTax = (
  income: IncomeData,
  deductions: DeductionData,
  ageGroup: AgeGroup,
  year: TaxYear
): TaxResult => {
  const config = YEAR_DATA[year];
  
  // Total Gross includes Travel Allowance
  const grossIncome = 
    income.annualSalary + 
    income.annualCommission + 
    income.annualContractorIncome + 
    income.bonus + 
    income.annualTravelAllowance;

  // 1. Calculate Allowable Commission Expenses
  const totalRemuneration = income.annualSalary + income.annualCommission;
  let allowableCommissionExpenses = 0;
  if (income.annualCommission > (totalRemuneration * 0.5)) {
    allowableCommissionExpenses = Math.min(deductions.commissionExpenses, income.annualCommission);
  }

  // 2. Calculate Contractor Expenses
  const allowableContractorExpenses = Math.min(deductions.contractorExpenses, income.annualContractorIncome);

  // 3. Travel Allowance Deduction (Cost Scale Table)
  let allowableTravelDeduction = 0;
  if (income.annualTravelAllowance > 0 && deductions.businessKms > 0) {
    const scale = TRAVEL_SCALE.find(s => deductions.vehicleValue <= s.limit) || TRAVEL_SCALE[TRAVEL_SCALE.length - 1];
    
    // Total cost per KM calculation
    const assumedTotalKm = 32000; 
    const fixedRatePerKm = scale.fixed / assumedTotalKm;
    const totalRatePerKm = fixedRatePerKm + (scale.fuel) + (scale.maint);
    
    const rawTravelDeduction = deductions.businessKms * totalRatePerKm;
    allowableTravelDeduction = Math.min(rawTravelDeduction, income.annualTravelAllowance);
  }

  // 4. WFH Expenses
  let wfhDeduction = 0;
  if (deductions.wfhEnabled && deductions.wfhTotalArea > 0) {
    const ratio = deductions.wfhOfficeArea / deductions.wfhTotalArea;
    const totalWFHCosts = deductions.wfhRentInterest + deductions.wfhElectricityWater + deductions.wfhCleaning;
    wfhDeduction = totalWFHCosts * ratio;
  }

  // 5. Initial Taxable Income for RA calculation
  const incomeForRA = grossIncome - (income.annualTravelAllowance * 0.2);
  const deductionsBeforeRA = allowableCommissionExpenses + allowableContractorExpenses + allowableTravelDeduction + wfhDeduction;
  const incomeBeforeRA = incomeForRA - deductionsBeforeRA;
  
  // 6. RA Deduction
  const raLimit = Math.min(Math.max(0, incomeBeforeRA) * MAX_RA_DEDUCTION_PERCENT, MAX_RA_DEDUCTION_CAP);
  const actualRADeduction = Math.min(deductions.retirementAnnuity, raLimit);

  // 7. Final Taxable Income
  const taxableIncome = Math.max(0, incomeBeforeRA - actualRADeduction);

  // 8. Calculate Tax before rebates
  let taxBeforeRebate = 0;
  for (let i = config.brackets.length - 1; i >= 0; i--) {
    const bracket = config.brackets[i];
    if (taxableIncome > bracket.threshold) {
      taxBeforeRebate = bracket.fixed + (taxableIncome - bracket.threshold) * bracket.rate;
      break;
    }
  }

  // 9. Rebates breakdown
  const primaryRebate = config.rebates.primary;
  let ageRebate = 0;
  if (ageGroup === AgeGroup.AGE_65_TO_74) {
    ageRebate = config.rebates.secondary;
  } else if (ageGroup === AgeGroup.AGE_75_PLUS) {
    ageRebate = config.rebates.secondary + config.rebates.tertiary;
  }

  // 10. Medical Credits
  const monthlyMedicalCredits = 
    (deductions.medicalAidMembers > 0 ? config.medical.main : 0) +
    (deductions.medicalAidMembers > 1 ? config.medical.first : 0) +
    (deductions.medicalAidDependents * config.medical.additional);
  
  const annualMedicalCredits = monthlyMedicalCredits * 12;

  // 11. Final Tax Liability
  const totalRebatesAndCredits = primaryRebate + ageRebate + annualMedicalCredits;
  const totalTax = Math.max(0, taxBeforeRebate - totalRebatesAndCredits);
  
  // 12. Calculate Refund or Amount Due
  const taxPaidAlready = income.taxPaidAlready;
  const taxDifference = taxPaidAlready - totalTax;
  const isRefund = taxDifference > 0;

  const takeHomePay = grossIncome - totalTax;

  return {
    taxableIncome,
    grossIncome,
    taxBeforeRebate,
    primaryRebate,
    ageRebate,
    medicalCredits: annualMedicalCredits,
    totalRebatesAndCredits,
    totalTax,
    taxPaidAlready,
    taxDifference,
    isRefund,
    takeHomePay,
    monthlyTakeHome: takeHomePay / 12,
    effectiveTaxRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
    deductionsBreakdown: {
      ra: actualRADeduction,
      wfh: wfhDeduction,
      contractor: allowableContractorExpenses,
      commission: allowableCommissionExpenses,
      travel: allowableTravelDeduction,
      total: actualRADeduction + wfhDeduction + allowableContractorExpenses + allowableCommissionExpenses + allowableTravelDeduction
    }
  };
};
