import { Shareholder } from './shareholder.model';

export interface Business {
  businessName: string;
  valuation: number;
  ebitda: number;
  rate: number;
  term: number;
  shareholders: Shareholder[];
}
