import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FinancialInstrumentComponent } from './financial-instrument.component';

describe('FinancialInstrumentComponent', () => {
  let component: FinancialInstrumentComponent;
  let fixture: ComponentFixture<FinancialInstrumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, FinancialInstrumentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialInstrumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate current years held correctly', () => {
    const yearAcquired = new Date().getFullYear() - 10;
    component.yearAcquired = yearAcquired;
    expect(component.currentYearsHeld).toBe(10);
  });

  it('should calculate current growth dollars correctly', () => {
    component.initialValue = 100;
    component.currentValue = 150;
    expect(component.currentGrowthDollars).toBe(50);
  });

  it('should calculate current growth percentage correctly', () => {
    component.initialValue = 100;
    component.currentValue = 150;
    expect(component.currentGrowthPercentage).toBe(50); // 50% growth

    // Test for division by zero scenario
    component.initialValue = 0;
    expect(component.currentGrowthPercentage).toBe(0);
  });

  it('should calculate future value dollars correctly', () => {
    component.currentValue = 100;
    component.rate = 5; // 5% rate
    component.term = 10; // 10 years
    expect(component.futureValueDollars).toBeCloseTo(162.89, 2); // Approximate value
  });

  it('should calculate future value growth percentage correctly', () => {
    component.initialValue = 100;
    component.currentValue = 100;
    component.rate = 5; // 5% rate
    component.term = 10; // 10 years
    expect(component.futureValueGrowthPercentage).toBeCloseTo(62.89, 2); // Approximate value

    // Test for division by zero scenario
    component.initialValue = 0;
    expect(component.futureValueGrowthPercentage).toBe(0);
  });
});
