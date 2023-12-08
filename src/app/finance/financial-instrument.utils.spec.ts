import { FinancialInstrumentUtils } from './financial-instrument.utils';

describe('FinancialInstrumentUtils', () => {
  it('should calculate current years held correctly', () => {
    const yearAcquired = new Date().getFullYear() - 10;
    expect(FinancialInstrumentUtils.currentYearsHeld(yearAcquired)).toBe(10);
  });

  it('should calculate current growth dollars correctly', () => {
    expect(FinancialInstrumentUtils.currentGrowthDollars(100, 150)).toBe(50);
  });

  it('should calculate current growth percentage correctly', () => {
    expect(FinancialInstrumentUtils.currentGrowthPercentage(100, 150)).toBe(50); // 50% growth

    // Test for division by zero scenario
    expect(FinancialInstrumentUtils.currentGrowthPercentage(0, 150)).toBe(0);
  });

  it('should calculate future value dollars correctly', () => {
    expect(FinancialInstrumentUtils.futureValueDollars(100, 5, 10)).toBeCloseTo(
      162.89,
      2,
    ); // Approximate value
  });

  it('should calculate future value growth percentage correctly', () => {
    const futureValueDollars = FinancialInstrumentUtils.futureValueDollars(
      100,
      5,
      10,
    );
    expect(
      FinancialInstrumentUtils.futureValueGrowthPercentage(
        100,
        futureValueDollars,
      ),
    ).toBeCloseTo(62.89, 2); // Approximate value

    // Test for division by zero scenario
    expect(
      FinancialInstrumentUtils.futureValueGrowthPercentage(
        0,
        futureValueDollars,
      ),
    ).toBe(0);
  });
});
