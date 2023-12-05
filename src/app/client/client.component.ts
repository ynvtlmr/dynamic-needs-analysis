import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BirthdateComponent } from '../birthdate/birthdate.component';
import { CANADA_PROVINCES } from '../constants/canada-provinces.constant';
import { NgForOf } from '@angular/common';
import { TAX_BRACKETS, Bracket } from '../constants/tax.constant';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [FormsModule, BirthdateComponent, NgForOf],
})
export class ClientComponent implements OnInit {
  taxBrackets: Bracket[] = [];
  selectedBracket: Bracket | undefined;

  ngOnInit(): void {
    // if they exist, load the variables `name, province, annualIncome, incomeReplacementMultiplier` from local storage.
    const storedClient = localStorage.getItem('client');
    if (storedClient) {
      const { name, province, annualIncome, incomeReplacementMultiplier } =
        JSON.parse(storedClient);
      this.name = name;
      this.province = province;
      this.annualIncome = annualIncome;
      this.incomeReplacementMultiplier = incomeReplacementMultiplier;
    }
    this.updateTaxBrackets();
  }
  name: string = '';
  province: string = '';
  annualIncome: number = 0;
  incomeReplacementMultiplier: number = 1;
  provinces: string[] = CANADA_PROVINCES;

  updateClientData(): void {
    this.updateTaxBrackets();
    const client = {
      name: this.name,
      province: this.province,
      annualIncome: this.annualIncome,
      incomeReplacementMultiplier: this.incomeReplacementMultiplier,
    };
    localStorage.setItem('client', JSON.stringify(client));
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
}
