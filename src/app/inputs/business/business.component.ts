import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LocalStorageService } from '../../services/local-storage.service';
import { Client } from '../../models/client.model';
import { Business, Shareholder } from '../../models/business.model';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskPipe, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './business.component.html',
})
export class BusinessComponent implements OnChanges, OnInit {
  businessName: string = '';
  valuation: number = 0;
  ebita: number = 0;
  rate: number = 0;
  term: number = 0;
  shareholders: Shareholder[] = [];

  @Input() business: Business | null = null;
  @Output() save: EventEmitter<Business> = new EventEmitter<Business>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.addEmptyShareholder();
  }

  ngOnChanges() {
    if (this.business) {
      this.populateBusinessData(this.business);
    }
  }

  populateBusinessData(business: Business): void {
    this.businessName = business.businessName;
    this.valuation = business.valuation;
    this.ebita = business.ebita; // Add this line to set the EBITA value
    this.rate = business.rate;
    this.term = business.term;
    this.shareholders = business.shareholders;
  }

  onSave(): void {
    const business: Business = {
      businessName: this.businessName,
      valuation: this.valuation,
      ebita: this.ebita,
      rate: this.rate,
      term: this.term,
      shareholders: this.shareholders,
    };
    this.updateTotalsForShareholders(business);
    this.save.emit(business);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  addEmptyShareholder(): void {
    const newShareholder: Shareholder = {
      shareholderName:
        this.shareholders.length === 0
          ? this.localStorageService.getItem<Client>('client')!.name
          : '',
      sharePercentage: this.shareholders.length === 0 ? 100 : 0,
      insuranceCoverage: 0,
      ebitaContributionPercentage: this.shareholders.length === 0 ? 100 : 0,
    };
    this.shareholders.push(newShareholder);
  }

  deleteShareholder(index: number): void {
    this.shareholders.splice(index, 1);
  }

  calculateShareValue(shareholder: Shareholder): number {
    return (shareholder.sharePercentage / 100) * this.valuation;
  }

  calculateLiquidationDisparity(shareholder: Shareholder): number {
    return (
      this.calculateShareValue(shareholder) - shareholder.insuranceCoverage
    );
  }

  calculateEbitaContribDollars(shareholder: Shareholder): number {
    return this.ebita * (shareholder.ebitaContributionPercentage / 100);
  }

  get totalMajorShareholderPercentage(): number {
    return this.shareholders.reduce(
      (acc: number, shareholder: Shareholder) =>
        acc + shareholder.sharePercentage,
      0,
    );
  }

  get totalEbitaContribPercentage(): number {
    return this.shareholders.reduce(
      (acc: number, shareholder: Shareholder) =>
        acc + shareholder.ebitaContributionPercentage,
      0,
    );
  }

  get totalMajorShareholderValue(): number {
    return this.shareholders.reduce(
      (acc: number, shareholder: Shareholder) =>
        acc + this.calculateShareValue(shareholder),
      0,
    );
  }

  get totalMajorShareholderInsurance(): number {
    return this.shareholders.reduce(
      (acc: number, shareholder: Shareholder) =>
        acc + shareholder.insuranceCoverage,
      0,
    );
  }

  get totalMajorShareholderDisparity(): number {
    return (
      this.totalMajorShareholderValue - this.totalMajorShareholderInsurance
    );
  }

  private calculateFinalEbitaContribution(
    business: Business,
    shareholder: Shareholder,
  ): number {
    return (
      shareholder.ebitaContributionPercentage *
      business.ebita *
      Math.pow(1 + business.rate / 100, business.term)
    );
  }

  private calculateFinalShareValue(
    business: Business,
    shareholder: Shareholder,
  ): number {
    return (
      (shareholder.sharePercentage / 100) *
      business.valuation *
      Math.pow(1 + business.rate / 100, business.term)
    );
  }

  private updateTotalsForShareholders(business: Business): void {
    // Retrieve the existing totals or initialize if not present
    const totals =
      this.localStorageService.getItem<{ [key: string]: any }>('totals') || {};

    // Initialize KeyMan and ShareholderAgreement objects if not already present
    totals['Key Man'] = totals['Key Man'] || {};
    totals['Shareholder Agreement'] = totals['Shareholder Agreement'] || {};

    business.shareholders.forEach((shareholder) => {
      const finalEbitaContribution = this.calculateFinalEbitaContribution(
        business,
        shareholder,
      );
      const finalShareValue = this.calculateFinalShareValue(
        business,
        shareholder,
      );

      // Ensure the business object exists within KeyMan and ShareholderAgreement
      totals['Key Man'][business.businessName] =
        totals['Key Man'][business.businessName] || {};
      totals['Shareholder Agreement'][business.businessName] =
        totals['Shareholder Agreement'][business.businessName] || {};

      // Assign values to respective shareholders
      totals['Key Man'][business.businessName][shareholder.shareholderName] =
        finalEbitaContribution;
      totals['Shareholder Agreement'][business.businessName][
        shareholder.shareholderName
      ] = finalShareValue;
    });

    this.localStorageService.setItem('totals', totals);
  }
}
