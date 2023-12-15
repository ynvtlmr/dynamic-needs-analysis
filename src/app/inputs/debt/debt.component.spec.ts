import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DebtComponent } from './debt.component';

describe('DebtComponent', () => {
  let component: DebtComponent;
  let fixture: ComponentFixture<DebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, DecimalPipe, DebtComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtComponent);
    component = fixture.componentInstance;

    // Mock Initialization
    component.name = 'Sample Debt';
    component.initialValue = 5000;
    component.yearAcquired = 2015;
    component.rate = 3;
    component.term = 20;
    component.annualPayment = 300;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate amount paid off correctly', () => {
    const currentYear = new Date().getFullYear();
    const yearsHeld = currentYear - 2015;
    expect(component.amountPaidOffDollars).toBe(300 * yearsHeld);
  });

  it('should calculate current value of debt correctly', () => {
    const yearsHeld = new Date().getFullYear() - 2015;
    const expectedValue = 5000 * Math.pow(1 + 0.03, yearsHeld);
    expect(component.currentValueOfDebtDollars).toBeCloseTo(expectedValue, 2);
  });

  it('should calculate debt remaining correctly', () => {
    const yearsHeld = new Date().getFullYear() - 2015;
    const paidOff = 300 * yearsHeld;
    const currentValue = 5000 * Math.pow(1 + 0.03, yearsHeld);
    expect(component.debtRemainingDollars).toBeCloseTo(
      currentValue - paidOff,
      2,
    );
  });

  it('should calculate years to be paid off correctly', () => {
    // This test may require specific logic based on the implementation of nper function
    // expect(component.yearsToBePaidOff).toBe(XXX);
  });

  it('should calculate insurable future value correctly', () => {
    const yearsHeld = new Date().getFullYear() - 2015;
    const paidOff = 300 * yearsHeld;
    const futureValue = 5000 * Math.pow(1 + 0.03, 20);
    expect(component.insurableFutureValueDollars).toBeCloseTo(
      futureValue - paidOff,
      2,
    );
  });
});
