import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shareholder } from './shareholder.model';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../services/local-storage.service';

export class Business {
  constructor(
    public businessName: string,
    public valuation: number,
    public rate: number,
    public term: number,
    public shareholders: Shareholder[], // Assuming Shareholder is already defined
  ) {}
}

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './business.component.html',
})
export class BusinessComponent implements OnInit {
  businessName: string = '';
  valuation: number = 0;
  rate: number = 0;
  term: number = 0;
  shareholders: Shareholder[] = [];

  @Input() business: Business | null = null;
  @Output() save: EventEmitter<Business> = new EventEmitter<Business>();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    if (this.business) {
      this.loadBusiness(this.business);
    } else {
      this.loadBusinessFromStorage();
    }
  }

  loadBusiness(business: Business): void {
    this.businessName = business.businessName;
    this.valuation = business.valuation;
    this.rate = business.rate;
    this.term = business.term;
    this.shareholders = business.shareholders;
  }

  onSave(): void {
    const business: Business = {
      businessName: this.businessName,
      valuation: this.valuation,
      rate: this.rate,
      term: this.term,
      shareholders: this.shareholders,
    };
    this.save.emit(business);
  }

  addShareholder(name: string, share: number, coverage: number): void {
    if (name && share > 0 && coverage > 0) {
      this.shareholders.push(new Shareholder(name, share, coverage));
      this.updateStorage();
    }
  }

  addEmptyShareholder(): void {
    if (this.shareholders.length === 0) {
      const clientName = this.localStorageService.getItem('client').name;
      this.shareholders.push(new Shareholder(clientName, 0, 0));
    } else {
      this.shareholders.push(new Shareholder('', 0, 0));
    }
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
      valuation: this.valuation,
      rate: this.rate,
      term: this.term,
      shareholders: this.shareholders,
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
