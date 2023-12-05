import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BirthdateComponent } from '../birthdate/birthdate.component';
import { CANADA_PROVINCES } from '../constants/canada-provinces.constant';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [FormsModule, BirthdateComponent, NgForOf],
})
export class ClientComponent implements OnInit {
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
  }
  name: string = '';
  province: string = '';
  annualIncome: number = 0;
  incomeReplacementMultiplier: number = 1;
  provinces: string[] = CANADA_PROVINCES;

  updateClientData(): void {
    const client = {
      name: this.name,
      province: this.province,
      annualIncome: this.annualIncome,
      incomeReplacementMultiplier: this.incomeReplacementMultiplier,
    };
    localStorage.setItem('client', JSON.stringify(client));
  }
}
