export class FinancialInstrumentUtils {
  static currentYearsHeld(yearAcquired: number): number {
    const currentYear: number = new Date().getFullYear();
    return currentYear - yearAcquired;
  }

  static currentGrowthDollars(
    initialValue: number,
    currentValue: number,
  ): number {
    return currentValue - initialValue;
  }

  static currentGrowthPercentage(
    initialValue: number,
    currentValue: number,
  ): number {
    if (initialValue === 0) {
      return 0;
    }
    return (currentValue / initialValue - 1) * 100;
  }

  static futureValueDollars(
    currentValue: number,
    rate: number,
    term: number,
  ): number {
    return currentValue * Math.pow(1 + rate / 100, term);
  }

  static futureValueGrowthPercentage(
    initialValue: number,
    futureValueDollars: number,
  ): number {
    if (initialValue === 0) {
      return 0;
    }
    return (futureValueDollars / initialValue - 1) * 100;
  }
}
