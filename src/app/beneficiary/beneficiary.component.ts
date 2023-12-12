import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Beneficiary {
  name: string;
  allocation: number;
}

@Component({
  selector: 'app-beneficiary',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './beneficiary.component.html',
})
export class BeneficiaryComponent {
  beneficiaries: Beneficiary[] = [];

  constructor() {
    this.loadBeneficiariesFromStorage();
  }

  get totalAllocation(): number {
    return this.beneficiaries.reduce(
      (total, beneficiary) => total + beneficiary.allocation,
      0,
    );
  }

  addBeneficiary(): void {
    this.beneficiaries.push({ name: '', allocation: 0 });
  }

  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
    this.updateStorage();
  }

  onBeneficiaryChange(): void {
    this.updateStorage(); // Update localStorage whenever there's a change
  }

  private updateStorage(): void {
    localStorage.setItem('beneficiaries', JSON.stringify(this.beneficiaries));
  }

  private loadBeneficiariesFromStorage(): void {
    const data = localStorage.getItem('beneficiaries');
    this.beneficiaries = data ? JSON.parse(data) : [];
  }
}
