
export interface IncomeData {
  annualSalary: number;
  annualCommission: number;
  annualContractorIncome: number;
  bonus: number;
  annualTravelAllowance: number;
  taxPaidAlready: number; // Capture PAYE paid to date
}

export interface DeductionData {
  retirementAnnuity: number;
  medicalAidMembers: number;
  medicalAidDependents: number;
  contractorExpenses: number;
  commissionExpenses: number;
  wfhEnabled: boolean;
  wfhTotalArea: number;
  wfhOfficeArea: number;
  wfhRentInterest: number;
  wfhElectricityWater: number;
  wfhCleaning: number;
  // Travel Allowance specific
  businessKms: number;
  vehicleValue: number;
}

export interface TaxResult {
  taxableIncome: number;
  grossIncome: number;
  taxBeforeRebate: number;
  primaryRebate: number;
  ageRebate: number;
  medicalCredits: number;
  totalRebatesAndCredits: number;
  totalTax: number;
  taxPaidAlready: number;
  taxDifference: number; // Difference between paid and liability
  isRefund: boolean;
  takeHomePay: number;
  monthlyTakeHome: number;
  effectiveTaxRate: number;
  deductionsBreakdown: {
    ra: number;
    wfh: number;
    contractor: number;
    commission: number;
    travel: number;
    total: number;
  };
}

export enum AgeGroup {
  UNDER_65 = 'Under 65',
  AGE_65_TO_74 = '65 to 74',
  AGE_75_PLUS = '75 Plus'
}

export type TaxYear = '2020' | '2021' | '2022' | '2023' | '2024' | '2025' | '2026';
