import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../services/local-storage.service';

export interface Beneficiary {
  name: string;
  allocation: number;
}

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-beneficiary',
  standalone: true,
  templateUrl: './beneficiary.component.html',
})
export class BeneficiaryComponent {
  beneficiaries: Beneficiary[] = [];

  constructor(private localStorageService: LocalStorageService) {
    this.loadBeneficiariesFromStorage();
  }

  get totalAllocation(): number {
    return this.beneficiaries.reduce(
      (total, beneficiary) => total + beneficiary.allocation,
      0,
    );
  }

  addBeneficiary(): void {
    this.beneficiaries.push({ allocation: 0, name: '' });
  }

  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
    this.updateStorage();
  }

  onBeneficiaryChange(): void {
    this.updateStorage(); // Update localStorage whenever there's a change
  }

  private updateStorage(): void {
    this.localStorageService.setItem('beneficiaries', this.beneficiaries);
  }

  private loadBeneficiariesFromStorage(): void {
    const data = this.localStorageService.getItem('beneficiaries');
    this.beneficiaries = data ? data : [];
  }
}
