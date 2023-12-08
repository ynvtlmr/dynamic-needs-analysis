export class FinancialInstrumentBase {
  name: string;
  initialValue: number;
  yearAcquired: number;
  currentValue: number;
  rate: number;
  term: number;

  constructor(
    name: string,
    initialValue: number,
    yearAcquired: number,
    currentValue: number,
    rate: number,
    term: number,
  ) {
    this.name = name;
    this.initialValue = initialValue;
    this.yearAcquired = yearAcquired;
    this.currentValue = currentValue;
    this.rate = rate;
    this.term = term;
  }

  get currentYearsHeld(): number {
    const currentYear: number = new Date().getFullYear();
    return currentYear - this.yearAcquired;
  }

  get currentGrowthDollars(): number {
    return this.currentValue - this.initialValue;
  }

  get currentGrowthPercentage(): number {
    if (this.initialValue === 0) {
      return 0;
    }
    return (this.currentValue / this.initialValue - 1) * 100;
  }

  get futureValueDollars(): number {
    return this.currentValue * Math.pow(1 + this.rate / 100, this.term);
  }

  get futureValueGrowthPercentage(): number {
    let futureValue = this.futureValueDollars;
    if (this.initialValue === 0) {
      return 0;
    }
    return (futureValue / this.initialValue - 1) * 100;
  }
}
