import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BirthdateComponent } from "../birthdate/birthdate.component";
import { CANADA_PROVINCES } from "../constants/canada-provinces.constant";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [
    FormsModule,
    BirthdateComponent,
    NgForOf
  ]
})
export class ClientComponent {
  name: string = '';
  province: string = '';
  annualIncome: number = 0;
  incomeReplacementMultiplier: number = 1;
  provinces: string[] = CANADA_PROVINCES;
}
