import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BeneficiaryService } from './beneficiary.service';
import { Beneficiary } from './beneficiary.model';

@Component({
  selector: 'app-beneficiary',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './beneficiary.component.html',
})
export class BeneficiaryComponent {
  constructor(private beneficiaryService: BeneficiaryService) {}

  get beneficiaries(): Beneficiary[] {
    return this.beneficiaryService.beneficiariesList;
  }

  get totalAllocation(): number {
    return this.beneficiaryService.totalAllocation;
  }

  addBeneficiary(name: string, idealAllocation: number): void {
    this.beneficiaryService.addBeneficiary(name, idealAllocation);
  }

  deleteBeneficiary(index: number): void {
    this.beneficiaryService.deleteBeneficiary(index);
  }
}
