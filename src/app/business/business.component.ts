import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../services/local-storage.service';
import { Shareholder } from './shareholder.model';

export interface Business {
  businessName: string;
  valuation: number;
  rate: number;
  term: number;
  shareholders: Shareholder[];
}

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-business',
  standalone: true,
  templateUrl: './business.component.html',
})
export class BusinessComponent implements OnInit {
  businessName: string = '';
  valuation: number = 0;
  rate: number = 0;
  term: number = 0;
  shareholders: Shareholder[] = [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadBusinessFromStorage();
  }

  addShareholder(name: string, share: number, coverage: number): void {
    if (name && share > 0 && coverage > 0) {
      this.shareholders.push(new Shareholder(name, share, coverage));
      this.updateStorage();
    }
  }

  addEmptyShareholder(): void {
    this.shareholders.push(new Shareholder('', 0, 0));
  }

  // Delete a shareholder by index
  deleteShareholder(index: number): void {
    this.shareholders.splice(index, 1);
    this.updateStorage();
  }

  onShareholderChange(): void {
    this.updateStorage();
  }

  private updateStorage(): void {
    const business: Business = {
      businessName: this.businessName,
      rate: this.rate,
      shareholders: this.shareholders,
      term: this.term,
      valuation: this.valuation,
    };
    this.localStorageService.setItem('business', business);
  }

  private loadBusinessFromStorage(): void {
    const business: Business = this.localStorageService.getItem('business');
    if (business) {
      this.businessName = business.businessName;
      this.valuation = business.valuation;
      this.rate = business.rate;
      this.term = business.term;
      this.shareholders = business.shareholders.map(
        (sh: Shareholder) =>
          new Shareholder(
            sh.shareholderName,
            sh.sharePercentage,
            sh.insuranceCoverage,
          ),
      );
    }
  }
  // Calculate total percentage owned by all shareholders
  get totalMajorShareholderPercentage(): number {
    return this.shareholders.reduce(
      (acc, shareholder) => acc + shareholder.sharePercentage,
      0,
    );
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
