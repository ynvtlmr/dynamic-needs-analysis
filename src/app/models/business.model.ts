export interface Shareholder {
  shareholderName: string;
  sharePercentage: number;
  insuranceCoverage: number;
  ebitdaContributionPercentage: number;
}

export interface Business {
  businessName: string;
  valuation: number;
  ebitda: number;
  rate: number;
  term: number;
  shareholders: Shareholder[];
}
