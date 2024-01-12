export interface Shareholder {
  shareholderName: string;
  sharePercentage: number;
  insuranceCoverage: number;
}

export interface Business {
  businessName: string;
  valuation: number;
  ebita: number;
  rate: number;
  term: number;
  shareholders: Shareholder[];
}
