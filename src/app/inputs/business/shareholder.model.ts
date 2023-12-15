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
