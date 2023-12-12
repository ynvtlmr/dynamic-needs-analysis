import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CANADA_PROVINCES } from '../constants/canada-provinces.constant';
import { TAX_BRACKETS, TaxBracket } from '../constants/tax.constant';
import { LocalStorageService } from '../services/local-storage.service';
import { Birthdate } from './birthdate.model';

export interface Client {
  name: string;
  province: string;
  annualIncome: number;
  incomeReplacementMultiplier: number;
  birthdate?: string | null;
}

@Component({
  imports: [FormsModule, NgForOf],
  selector: 'app-client',
  standalone: true,
  templateUrl: './client.component.html',
})
export class ClientComponent implements OnInit {
  taxBrackets: TaxBracket[] = [];
  selectedBracket: undefined | TaxBracket;
  birthdateModel: Birthdate = new Birthdate(
    this.localStorageService.getItem('birthdate'),
  );

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

  private loadClientFromStorage(): void {
    const clientData = this.localStorageService.getItem('client');
    if (clientData) {
      const client: Client = clientData;
      this.name = client.name;
      this.birthdateModel.birthdate = client.birthdate;
      this.province = client.province;
      this.annualIncome = client.annualIncome;
      this.incomeReplacementMultiplier = client.incomeReplacementMultiplier;
    }
  }

  forceIncomeUpdate(newIncome: number): void {
    this.annualIncome = newIncome;
    this.updateClientData();
  }
  updateClientData(): void {
    this.updateTaxBrackets();
    this.saveSelectedBracket();
    const client: Client = {
      annualIncome: this.annualIncome,
      birthdate: this.birthdateModel.birthdate,
      incomeReplacementMultiplier: this.incomeReplacementMultiplier,
      name: this.name,
      province: this.province,
    };
    this.localStorageService.setItem('client', client);
  }

  private loadSelectedBracket(): void {
    const selectedTaxBracket =
      this.localStorageService.getItem('selectedTaxBracket');
    if (selectedTaxBracket) {
      const storedBracket = selectedTaxBracket;
      this.selectedBracket = this.taxBrackets.find(
        (bracket) => bracket.minIncome === storedBracket.minIncome,
      );
    }
  }

  private updateTaxBrackets(): void {
    const year = new Date().getFullYear(); // or a specific year if required
    this.taxBrackets = TAX_BRACKETS[year]?.[this.province.toUpperCase()] || [];
    this.selectedBracket = this.taxBrackets.find((bracket, index, array) => {
      const nextBracket = array[index + 1];
      return (
        this.annualIncome >= bracket.minIncome &&
        (!nextBracket || this.annualIncome < nextBracket.minIncome)
      );
    });
  }

  saveSelectedBracket() {
    this.localStorageService.setItem(
      'selectedTaxBracket',
      this.selectedBracket,
    );
  }

  updateBirthdateAndMultiplier(newBirthdate: null | string): void {
    this.birthdateModel.birthdate = newBirthdate;
    // Update incomeReplacementMultiplier based on the new years to retirement
    this.incomeReplacementMultiplier = this.birthdateModel.yearsToRetirement;
    // Update the client data in localStorage
    this.updateClientData();
  }
}
