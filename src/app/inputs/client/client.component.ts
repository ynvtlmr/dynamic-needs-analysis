import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Birthdate } from './birthdate.model';
import { CANADA_PROVINCES } from '../constants/canada-provinces.constant';
import { TAX_BRACKETS, TaxBracket } from '../constants/tax.constant';
import { LocalStorageService } from '../../services/local-storage.service';
import { Client } from '../../models/client.model';

const DEFAULT_RETIREMENT_AGE: number = 65;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [FormsModule, NgForOf, CurrencyPipe, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
})
export class ClientComponent implements OnInit {
  taxBrackets: TaxBracket[] = [];
  birthdateModel: Birthdate = new Birthdate(
    this.localStorageService.getItem('birthdate'),
  );
  expectedRetirementAge: number = DEFAULT_RETIREMENT_AGE;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadClientFromStorage();
    this.updateTaxBrackets();
    this.loadSelectedBracket();
  }
  name: string = '';
  birthdate: string = '';
  province: string = '';
  annualIncome: number = 0;
  incomeReplacementMultiplier: number = 1;
  provinces: string[] = CANADA_PROVINCES;
  selectedBracket: TaxBracket | undefined;
  insuredIncomeAmount: number = 0;

  private loadClientFromStorage(): void {
    const clientData: Client | null =
      this.localStorageService.getItem<Client>('client');
    if (clientData) {
      const client: Client = clientData;
      this.name = client.name;
      this.birthdateModel.birthdate = client.birthdate;
      this.province = client.province;
      this.annualIncome = client.annualIncome;
      this.incomeReplacementMultiplier = client.incomeReplacementMultiplier;
      this.selectedBracket = client.selectedBracket;
      this.expectedRetirementAge =
        client.expectedRetirementAge ?? DEFAULT_RETIREMENT_AGE;
    }
  }

  updateClientData(): void {
    this.updateTaxBrackets();
    this.saveSelectedBracket();
    this.insuredIncomeAmount =
      this.annualIncome * this.incomeReplacementMultiplier;

    const client: Client = {
      name: this.name,
      birthdate: this.birthdateModel.birthdate,
      province: this.province,
      annualIncome: this.annualIncome,
      incomeReplacementMultiplier: this.incomeReplacementMultiplier,
      selectedBracket: this.selectedBracket,
      expectedRetirementAge: this.expectedRetirementAge,
    };
    this.localStorageService.setItem('client', client);

    // Save insuredIncomeAmount to totals
    let totals: { [key: string]: any } =
      this.localStorageService.getItem<{ [key: string]: number }>('totals') ??
      {};
    if (!totals['Income Replacement']) {
      totals['Income Replacement'] = { value: 0, priority: 100 };
    }
    totals['Income Replacement']['value'] = this.insuredIncomeAmount;
    this.localStorageService.setItem('totals', totals);
  }

  private loadSelectedBracket(): void {
    const clientData: Client | null =
      this.localStorageService.getItem<Client>('client');
    if (clientData && clientData.selectedBracket) {
      const storedBracket: TaxBracket = clientData.selectedBracket;
      this.selectedBracket = this.taxBrackets.find(
        (bracket: TaxBracket): boolean =>
          bracket.minIncome === storedBracket.minIncome,
      );
    }
  }

  private updateTaxBrackets(): void {
    const year: number = new Date().getFullYear();
    this.taxBrackets = TAX_BRACKETS[year]?.[this.province.toUpperCase()] || [];
    this.selectedBracket = this.taxBrackets.find(
      (bracket: TaxBracket, index: number, array: TaxBracket[]) => {
        const nextBracket: TaxBracket = array[index + 1];
        return (
          this.annualIncome >= bracket.minIncome &&
          (!nextBracket || this.annualIncome < nextBracket.minIncome)
        );
      },
    );
  }

  saveSelectedBracket(): void {
    this.localStorageService.setItem('client', {
      ...this.localStorageService.getItem<Client>('client'),
      selectedBracket: this.selectedBracket,
    });
  }

  updateBirthdateAndMultiplier(newBirthdate: string | null): void {
    this.birthdateModel.birthdate = newBirthdate;

    this.incomeReplacementMultiplier = Math.max(
      this.expectedRetirementAge - this.birthdateModel.age,
      0,
    );

    this.updateClientData();
  }

  protected readonly Math: Math = Math;
}
