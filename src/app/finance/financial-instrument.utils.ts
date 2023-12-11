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

}
