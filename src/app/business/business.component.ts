import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shareholder } from './shareholder.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './business.component.html',
})
export class BusinessComponent {
  businessName: string = '';
  valuation: number = 0;
  rate: number = 0;
  term: number = 0;
  shareholders: Shareholder[] = [];

  addShareholder(name: string, share: number, coverage: number): void {
    if (name && share > 0 && coverage > 0) {
      this.shareholders.push(new Shareholder(name, share, coverage));
    }
  }

  // Delete a shareholder by index
  deleteShareholder(index: number): void {
    this.shareholders.splice(index, 1);
  }

  // Calculate total value of major shareholders' shares
  get totalMajorShareholderValue(): number {
    return this.shareholders.reduce(
      (acc, shareholder) => acc + shareholder.shareValue(this.valuation),
      0,
    );
  }

  // Calculate total insurance coverage of major shareholders
  get totalMajorShareholderInsurance(): number {
    return this.shareholders.reduce(
      (acc, shareholder) => acc + shareholder.insuranceCoverage,
      0,
    );
  }

  // Calculate total disparity between share value and insurance coverage
  get totalMajorShareholderDisparity(): number {
    return (
      this.totalMajorShareholderValue - this.totalMajorShareholderInsurance
    );
  }
}
