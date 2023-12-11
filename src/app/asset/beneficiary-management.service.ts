import { Injectable } from '@angular/core';
import { Beneficiary } from '../beneficiary/beneficiary.component';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryManagementService {
  constructor() {}

  loadBeneficiaries(): Beneficiary[] {
    const beneficiariesData = localStorage.getItem('beneficiaries');
    return beneficiariesData ? JSON.parse(beneficiariesData) : [];
  }

  updateAllocation(
    beneficiaries: Beneficiary[],
    index: number,
    newAllocation: number,
  ): void {
    if (beneficiaries[index]) {
      beneficiaries[index].allocation = newAllocation;
    }
  }

  getTotalAllocations(beneficiaries: Beneficiary[]): number {
    return beneficiaries.reduce(
      (total, beneficiary) => total + beneficiary.allocation,
      0,
    );
  }
}
