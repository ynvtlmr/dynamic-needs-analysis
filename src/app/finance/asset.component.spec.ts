import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AssetComponent } from './asset.component';
import { CommonModule } from '@angular/common';

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
});
