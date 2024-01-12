import { Injectable } from '@angular/core';
import { Beneficiary } from '../../models/beneficiary.model';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryManagementService {
  constructor() {}

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
