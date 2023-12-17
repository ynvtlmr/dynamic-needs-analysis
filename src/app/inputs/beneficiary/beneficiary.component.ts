import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';

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

  constructor(private localStorageService: LocalStorageService) {
    this.loadBeneficiariesFromStorage();
  }

  get totalAllocation(): number {
    return this.beneficiaries.reduce(
      (total, beneficiary) => total + beneficiary.allocation,
      0,
    );
  }

  addEmptyBeneficiary(): void {
    this.beneficiaries.push({ name: '', allocation: 0 });
  }

  addBeneficiary(name: string, allocation: number): void {
    this.beneficiaries.push({ name: name, allocation: allocation });
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
