import { Injectable } from '@angular/core';
import { Beneficiary } from './beneficiary.model';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryService {
  private beneficiaries: Beneficiary[] = [];

  constructor() {
    this.loadBeneficiariesFromStorage();
  }
  get beneficiariesList(): Beneficiary[] {
    return this.beneficiaries;
  }
  addBeneficiary(name: string, idealAllocation: number): void {
    this.beneficiaries.push({ name, idealAllocation });
    this.updateStorage();
  }
  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
    this.updateStorage();
  }
  get totalAllocation(): number {
    return this.beneficiaries.reduce(
      (total, beneficiary) => total + beneficiary.idealAllocation,
      0,
    );
  }
  private updateStorage(): void {
    localStorage.setItem('beneficiaries', JSON.stringify(this.beneficiaries));
  }
  private loadBeneficiariesFromStorage(): void {
    const data = localStorage.getItem('beneficiaries');
    this.beneficiaries = data ? JSON.parse(data) : [];
  }
}
