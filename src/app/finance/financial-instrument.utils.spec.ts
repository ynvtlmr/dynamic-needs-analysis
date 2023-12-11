import { FinancialInstrumentBase } from './financial-instrument.utils';

describe('FinancialInstrumentBase', () => {
  let component: FinancialInstrumentBase;

  beforeEach(() => {
    // Create a new instance of FinancialInstrumentBase before each test
    component = new FinancialInstrumentBase(
      'Test Instrument',
      100,
      2010,
      150,
      5,
      10,
    );
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate current years held correctly', () => {
    expect(component.currentYearsHeld).toBe(
      new Date().getFullYear() - 2010,
    );
  });
});
