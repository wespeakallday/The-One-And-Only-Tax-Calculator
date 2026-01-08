
import { TaxYear } from './types';

export const TAX_YEARS: TaxYear[] = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

export interface TaxBracket {
  threshold: number;
  rate: number;
  fixed: number;
}

export interface YearConfig {
  brackets: TaxBracket[];
  rebates: {
    primary: number;
    secondary: number;
    tertiary: number;
  };
  medical: {
    main: number;
    first: number;
    additional: number;
  };
}

// 2026 values are projected as 2025 + slight adjustment or same as 2025 if not announced
export const YEAR_DATA: Record<TaxYear, YearConfig> = {
  '2020': {
    brackets: [
      { threshold: 0, rate: 0.18, fixed: 0 },
      { threshold: 195850, rate: 0.26, fixed: 35253 },
      { threshold: 305850, rate: 0.31, fixed: 63853 },
      { threshold: 423300, rate: 0.36, fixed: 100263 },
      { threshold: 555600, rate: 0.39, fixed: 147891 },
      { threshold: 708310, rate: 0.41, fixed: 207448 },
      { threshold: 1500000, rate: 0.45, fixed: 532041 }
    ],
    rebates: { primary: 14220, secondary: 7794, tertiary: 2601 },
    medical: { main: 310, first: 310, additional: 209 }
  },
  '2021': {
    brackets: [
      { threshold: 0, rate: 0.18, fixed: 0 },
      { threshold: 205900, rate: 0.26, fixed: 37062 },
      { threshold: 321600, rate: 0.31, fixed: 67144 },
      { threshold: 445100, rate: 0.36, fixed: 105429 },
      { threshold: 584100, rate: 0.39, fixed: 155469 },
      { threshold: 744800, rate: 0.41, fixed: 218142 },
      { threshold: 1577300, rate: 0.45, fixed: 559467 }
    ],
    rebates: { primary: 14958, secondary: 8199, tertiary: 2736 },
    medical: { main: 319, first: 319, additional: 215 }
  },
  '2022': {
    brackets: [
      { threshold: 0, rate: 0.18, fixed: 0 },
      { threshold: 216200, rate: 0.26, fixed: 38916 },
      { threshold: 337800, rate: 0.31, fixed: 70532 },
      { threshold: 467500, rate: 0.36, fixed: 110739 },
      { threshold: 613600, rate: 0.39, fixed: 163335 },
      { threshold: 782200, rate: 0.41, fixed: 229089 },
      { threshold: 1656600, rate: 0.45, fixed: 587593 }
    ],
    rebates: { primary: 15714, secondary: 8613, tertiary: 2871 },
    medical: { main: 332, first: 332, additional: 224 }
  },
  '2023': {
    brackets: [
      { threshold: 0, rate: 0.18, fixed: 0 },
      { threshold: 226000, rate: 0.26, fixed: 40680 },
      { threshold: 353100, rate: 0.31, fixed: 73726 },
      { threshold: 488700, rate: 0.36, fixed: 115762 },
      { threshold: 641400, rate: 0.39, fixed: 170734 },
      { threshold: 817600, rate: 0.41, fixed: 239452 },
      { threshold: 1731600, rate: 0.45, fixed: 614192 }
    ],
    rebates: { primary: 16425, secondary: 9000, tertiary: 2997 },
    medical: { main: 347, first: 347, additional: 234 }
  },
  '2024': {
    brackets: [
      { threshold: 0, rate: 0.18, fixed: 0 },
      { threshold: 237100, rate: 0.26, fixed: 42678 },
      { threshold: 370500, rate: 0.31, fixed: 77362 },
      { threshold: 512800, rate: 0.36, fixed: 121475 },
      { threshold: 673000, rate: 0.39, fixed: 179147 },
      { threshold: 857900, rate: 0.41, fixed: 251258 },
      { threshold: 1817000, rate: 0.45, fixed: 644489 }
    ],
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    medical: { main: 364, first: 364, additional: 246 }
  },
  '2025': {
    brackets: [
      { threshold: 0, rate: 0.18, fixed: 0 },
      { threshold: 237100, rate: 0.26, fixed: 42678 },
      { threshold: 370500, rate: 0.31, fixed: 77362 },
      { threshold: 512800, rate: 0.36, fixed: 121475 },
      { threshold: 673000, rate: 0.39, fixed: 179147 },
      { threshold: 857900, rate: 0.41, fixed: 251258 },
      { threshold: 1817000, rate: 0.45, fixed: 644489 }
    ],
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    medical: { main: 364, first: 364, additional: 246 }
  },
  '2026': {
    brackets: [
      { threshold: 0, rate: 0.18, fixed: 0 },
      { threshold: 245000, rate: 0.26, fixed: 44100 },
      { threshold: 385000, rate: 0.31, fixed: 80500 },
      { threshold: 535000, rate: 0.36, fixed: 127000 },
      { threshold: 700000, rate: 0.39, fixed: 186400 },
      { threshold: 895000, rate: 0.41, fixed: 262450 },
      { threshold: 1900000, rate: 0.45, fixed: 674500 }
    ],
    rebates: { primary: 18000, secondary: 9800, tertiary: 3300 },
    medical: { main: 375, first: 375, additional: 255 }
  }
};

// Travel Rates Table (Fixed, Fuel, Maint) - Based on 2024 values as proxy for simple calc
export const TRAVEL_SCALE = [
  { limit: 100000, fixed: 33760, fuel: 1.615, maint: 0.597 },
  { limit: 200000, fixed: 60329, fuel: 1.803, maint: 0.748 },
  { limit: 300000, fixed: 86427, fuel: 1.958, maint: 0.821 },
  { limit: 400000, fixed: 110054, fuel: 2.103, maint: 0.895 },
  { limit: 500000, fixed: 133747, fuel: 2.411, maint: 1.053 },
  { limit: 600000, fixed: 158423, fuel: 2.493, maint: 1.238 },
  { limit: 700000, fixed: 183182, fuel: 2.846, maint: 1.341 },
  { limit: 800000, fixed: 209586, fuel: 2.942, maint: 1.566 },
  { limit: Infinity, fixed: 209586, fuel: 2.942, maint: 1.566 }
];

export const MAX_RA_DEDUCTION_PERCENT = 0.275;
export const MAX_RA_DEDUCTION_CAP = 350000;
