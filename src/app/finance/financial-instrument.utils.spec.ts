import { FinancialInstrumentBase } from './financial-instrument.utils';

describe('FinancialInstrumentBase', () => {
  let financialInstrument: FinancialInstrumentBase;

  beforeEach(() => {
    // Create a new instance of FinancialInstrumentBase before each test
    financialInstrument = new FinancialInstrumentBase(
      'Test Instrument',
      100,
      2010,
      150,
      5,
      10,
    );
  });

  it('should create an instance', () => {
    expect(financialInstrument).toBeTruthy();
  });

  it('should calculate current years held correctly', () => {
    expect(financialInstrument.currentYearsHeld).toBe(
      new Date().getFullYear() - 2010,
    );
  });

  it('should calculate current growth dollars correctly', () => {
    expect(financialInstrument.currentGrowthDollars).toBe(50); // 150 - 100
  });

  it('should calculate current growth percentage correctly', () => {
    expect(financialInstrument.currentGrowthPercentage).toBe(50); // 50% growth
  });

  it('should calculate future value dollars correctly', () => {
    // The future value is calculated using the formula: currentValue * (1 + rate/100)^term
    const futureValue = 150 * Math.pow(1 + 5 / 100, 10);
    expect(financialInstrument.futureValueDollars).toBeCloseTo(futureValue, 2);
  });

  it('should calculate future value growth percentage correctly', () => {
    const futureValue = financialInstrument.futureValueDollars;
    const growthPercentage = (futureValue / 100 - 1) * 100;
    expect(financialInstrument.futureValueGrowthPercentage).toBeCloseTo(
      growthPercentage,
      2,
    );
  });
});
