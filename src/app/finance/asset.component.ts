import { OnInit } from '@angular/core';
import { FinancialInstrumentBase } from './financial-instrument.utils';
import { Beneficiary } from '../beneficiary/beneficiary.component';

export class Asset extends FinancialInstrumentBase implements OnInit {
  type: string;
  isTaxable: boolean;
  isLiquid: boolean;
  isToBeSettled: boolean;
  beneficiaries: Beneficiary[];
  private capitalGainsTaxRate: number = 0;

  constructor(
    name: string,
    initialValue: number,
    yearAcquired: number,
    currentValue: number,
    rate: number,
    term: number,
    type: string,
    isTaxable: boolean,
    isLiquid: boolean,
    isToBeSettled: boolean,
    beneficiaries: Beneficiary[],
  ) {
    super(name, initialValue, yearAcquired, currentValue, rate, term);
    this.type = type;
    this.isTaxable = isTaxable;
    this.isLiquid = isLiquid;
    this.isToBeSettled = isToBeSettled;
    this.beneficiaries = beneficiaries;
  }

  ngOnInit(): void {
    this.loadCapitalGainsTaxRate();
  }
  private loadCapitalGainsTaxRate(): void {
    const selectedBracketString = localStorage.getItem('selectedTaxBracket');
    if (selectedBracketString) {
      const selectedBracket = JSON.parse(selectedBracketString);
      this.capitalGainsTaxRate = selectedBracket.taxRate * 0.5;
    }
  }
  get currentTaxLiabilityDollars(): number {
    if (!this.isTaxable) {
      return 0;
    }
    return this.currentGrowthDollars * (this.capitalGainsTaxRate / 100.0);
  }

  get futureTaxLiabilityDollars(): number {
    if (!this.isTaxable) {
      return 0;
    }
    return (
      (this.futureValueDollars - this.initialValue) *
      (this.capitalGainsTaxRate / 100.0)
    );
  }
}
