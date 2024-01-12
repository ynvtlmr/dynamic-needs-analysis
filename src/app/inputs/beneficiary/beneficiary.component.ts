import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { Beneficiary } from '../../models/beneficiary.model';

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
      (total: number, beneficiary: Beneficiary) =>
        total + beneficiary.allocation,
      0,
    );
  }

  addEmptyBeneficiary(): void {
    this.beneficiaries.push({ name: '', allocation: 0 });
  }

  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
    this.updateStorage();
  }

  onBeneficiaryChange(): void {
    this.updateStorage();
  }

  private updateStorage(): void {
    this.localStorageService.setItem('beneficiaries', this.beneficiaries);
  }

  private loadBeneficiariesFromStorage(): void {
    const data: Beneficiary[] | null =
      this.localStorageService.getItem<Beneficiary[]>('beneficiaries');
    this.beneficiaries = data ? data : [];
  }
}
