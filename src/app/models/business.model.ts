export class Shareholder {
  constructor(
    public shareholderName: string,
    public sharePercentage: number,
    public insuranceCoverage: number,
  ) {}

  shareValue(businessValuation: number): number {
    return (this.sharePercentage / 100) * businessValuation;
  }

  liquidationDisparity(businessValuation: number): number {
    return this.shareValue(businessValuation) - this.insuranceCoverage;
  }
}

export class Business {
  constructor(
    public businessName: string,
    public valuation: number,
    public ebita: number,
    public rate: number,
    public term: number,
    public shareholders: Shareholder[],
  ) {}
}
