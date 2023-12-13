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
  selectedBracket: TaxBracket | undefined;
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
    this.updateTaxBracketsUsingIncome();
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
      this.selectedBracket = client.selectedBracket;
    }
  }

  forceIncomeUpdate(newIncome: number): void {
    this.annualIncome = newIncome;
    this.updateClientData();
    this.updateTaxBracketsUsingIncome();
    this.saveSelectedBracket();
  }
  updateNameManually(newName: string): void {
    this.name = newName;
    this.updateClientData();
  }
  updateMultiplierManually(newMultiplier: number): void {
    this.incomeReplacementMultiplier = newMultiplier;
    this.updateClientData();
  }
  updateClientData(): void {
    const client: Client = {
      annualIncome: this.annualIncome,
      birthdate: this.birthdateModel.birthdate,
      incomeReplacementMultiplier: this.incomeReplacementMultiplier,
      name: this.name,
      province: this.province,
      selectedBracket: this.selectedBracket,
    };
    this.localStorageService.setItem('client', client);
  }

  private loadSelectedBracket(): void {
    const selectedTaxBracket =
      this.localStorageService.getItem('client')?.selectedBracket;
    if (selectedTaxBracket) {
      this.selectedBracket = this.taxBrackets.find(
        (bracket) => bracket.minIncome === selectedTaxBracket.minIncome,
      );
    }
  }

  private updateTaxBracketsUsingIncome(): void {
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

  saveManualBracket(bracket: TaxBracket): void {
    this.selectedBracket = bracket;
    this.saveSelectedBracket();
  }
  saveSelectedBracket(): void {
    // Retrieve the entire client object from localStorage
    const client: Client = this.localStorageService.getItem('client');
    client.selectedBracket = this.selectedBracket;
    this.localStorageService.setItem('client', client);
    console.log(this.selectedBracket)
    console.log(client.selectedBracket)
  }

  updateBirthdateAndMultiplier(newBirthdate: null | string): void {
    this.birthdateModel.birthdate = newBirthdate;
    // Update incomeReplacementMultiplier based on the new years to retirement
    this.incomeReplacementMultiplier = this.birthdateModel.yearsToRetirement;
    // Update the client data in localStorage
    this.updateClientData();
  }
}
