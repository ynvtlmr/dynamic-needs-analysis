import { Beneficiary } from './beneficiary.model';
import { TaxBracket } from '../inputs/constants/tax.constant';

export interface Asset {
  name: string;
  initialValue: number;
  currentValue: number;
  yearAcquired: number;
  rate: number;
  term: number;
  type: string;
  isTaxable: boolean;
  isLiquid: boolean;
  isToBeSold: boolean;
  beneficiaries: Beneficiary[];
  selectedTaxBracket: TaxBracket | undefined;
  capitalGainsTaxRate: number;
  futureTaxLiabilityDollars?: number;
}
