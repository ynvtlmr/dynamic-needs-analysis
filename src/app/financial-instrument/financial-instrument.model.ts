import { Beneficiary } from '../beneficiary/beneficiary.component';
export interface FinancialInstrument {
  name: string;
  initialValue: number;
  yearAcquired: number;
  currentValue: number;
  annualContribution: number;
  rate: number;
  term: number;
  type: string;
  isTaxable: boolean;
  isLiquid: boolean;
  isToBeSettled: boolean;
  beneficiaries: Beneficiary[];
}
