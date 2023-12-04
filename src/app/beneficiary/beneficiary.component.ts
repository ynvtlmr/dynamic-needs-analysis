import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Beneficiary } from './beneficiary.model';

@Component({
  selector: 'app-beneficiary',
  standalone: true,
  imports: [
    FormsModule, CommonModule
  ],
  templateUrl: './beneficiary.component.html',
})
export class BeneficiaryComponent {
  beneficiaries: Beneficiary[] = [];

  addBeneficiary(name:string, idealAllocation: number): void {
    this.beneficiaries.push({ name, idealAllocation });
  }

  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
  }

  get totalAllocation(): number {
    return this.beneficiaries.reduce((total, beneficiary) => total + beneficiary.idealAllocation, 0);
  }
}
