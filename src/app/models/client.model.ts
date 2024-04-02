import { TaxBracket } from '../constants/tax.constant';

export interface Client {
  name: string;
  province: string;
  annualIncome: number;
  expectedRetirementAge: number;
  incomeReplacementMultiplier: number;
  birthdate?: string | null;
  selectedBracket?: TaxBracket | undefined;
}
