import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AssetComponent } from './asset.component';

describe('AssetComponent', () => {
  let component: AssetComponent;
  let fixture: ComponentFixture<AssetComponent>;

  beforeEach(async () => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'selectedTaxBracket') {
        return JSON.stringify({ taxRate: 20 }); // Mocked tax rate value
      }
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, AssetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetComponent);
    component = fixture.componentInstance;

    // Mock Initialization
    component.name = 'Sample Asset';
    component.initialValue = 1000;
    component.yearAcquired = 2010;
    component.currentValue = 2000;
    component.rate = 5;
    component.term = 10;
    component.type = 'Stocks';
    component.isTaxable = true;
    component.isLiquid = true;
    component.isToBeSold = false;
    component.beneficiaries = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly calculate current years held', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYearsHeld).toBe(currentYear - 2010);
  });

  it('should correctly calculate current growth dollars', () => {
    expect(component.currentGrowthDollars).toBe(1000); // 2000 - 1000
  });

  it('should load capital gains tax rate correctly', () => {
    expect(component.capitalGainsTaxRate).toBe(10); // 20% tax rate * 0.5
  });

  it('should calculate current tax liability correctly', () => {
    expect(component.currentTaxLiabilityDollars).toBe(100); // (2000 - 1000) * 10%
  });

  it('should calculate future tax liability correctly', () => {
    const futureValue = 2000 * Math.pow(1 + 0.05, 10); // Future value calculation
    expect(component.futureTaxLiabilityDollars).toBeCloseTo(
      (futureValue - 1000) * 0.1,
      2,
    );
  });

  it('should calculate current growth dollars correctly', () => {
    expect(component.currentGrowthDollars).toBe(50); // 150 - 100
  });

  it('should calculate current growth percentage correctly', () => {
    expect(component.currentGrowthPercentage).toBe(50); // 50% growth
  });

  it('should calculate future value dollars correctly', () => {
    // The future value is calculated using the formula: currentValue * (1 + rate/100)^term
    const futureValue = 150 * Math.pow(1 + 5 / 100, 10);
    expect(component.futureValueDollars).toBeCloseTo(futureValue, 2);
  });

  it('should calculate future value growth percentage correctly', () => {
    const futureValue = component.futureValueDollars;
    const growthPercentage = (futureValue / 100 - 1) * 100;
    expect(component.futureValueGrowthPercentage).toBeCloseTo(
      growthPercentage,
      2,
    );
  });
});
