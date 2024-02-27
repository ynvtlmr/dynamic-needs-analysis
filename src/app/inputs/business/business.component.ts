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
  ebitda: number = 0;
  rate: number = 0;
  term: number = 0;
  shareholders: Shareholder[] = [];

  @Input() business: Business | null = null;
  @Output() save: EventEmitter<Business> = new EventEmitter<Business>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    if (this.shareholders.length === 0) {
      this.addEmptyShareholder();
    }
  }

  ngOnChanges(): void {
    if (this.business) {
      this.populateBusinessData(this.business);
    }
  }

  populateBusinessData(business: Business): void {
    this.businessName = business.businessName;
    this.valuation = business.valuation;
    this.ebitda = business.ebitda;
    this.rate = business.rate;
    this.term = business.term;
    this.shareholders = business.shareholders;
  }

  onSave(): void {
    const business: Business = {
      businessName: this.businessName,
      valuation: this.valuation,
      ebitda: this.ebitda,
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
      ebitdaContributionPercentage: this.shareholders.length === 0 ? 100 : 0,
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

  calculateEbitdaContribDollars(shareholder: Shareholder): number {
    return this.ebitda * (shareholder.ebitdaContributionPercentage / 100);
  }

  get totalMajorShareholderPercentage(): number {
    return this.shareholders.reduce(
      (acc: number, shareholder: Shareholder) =>
        acc + shareholder.sharePercentage,
      0,
    );
  }

  get totalEbitdaContribPercentage(): number {
    return this.shareholders.reduce(
      (acc: number, shareholder: Shareholder) =>
        acc + shareholder.ebitdaContributionPercentage,
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

  private calculateFinalEbitdaContribution(
    business: Business,
    shareholder: Shareholder,
  ): number {
    return (
      (shareholder.ebitdaContributionPercentage / 100) *
      business.ebitda *
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
    const totals: { [p: string]: any } =
      this.localStorageService.getItem<{ [key: string]: any }>('totals') ?? {};

    totals['Key Man'] = totals['Key Man'] || { subcategories: {} };
    totals['Shareholder Agreement'] = totals['Shareholder Agreement'] || {
      subcategories: {},
    };

    totals['Key Man'].subcategories[business.businessName] = totals['Key Man']
      .subcategories[business.businessName] || { subcategories: {} };
    totals['Shareholder Agreement'].subcategories[business.businessName] =
      totals['Shareholder Agreement'].subcategories[business.businessName] || {
        subcategories: {},
      };

    business.shareholders.forEach((shareholder: Shareholder): void => {
      const finalEbitdaContribution: number =
        this.calculateFinalEbitdaContribution(business, shareholder);
      const finalShareValue: number = this.calculateFinalShareValue(
        business,
        shareholder,
      );

      totals['Key Man'].subcategories[business.businessName].subcategories[
        shareholder.shareholderName
      ] = {
        value: finalEbitdaContribution,
        priority: 100,
      };
      totals['Shareholder Agreement'].subcategories[
        business.businessName
      ].subcategories[shareholder.shareholderName] = {
        value: finalShareValue,
        priority: 100,
      };
    });

    this.localStorageService.setItem('totals', totals);
  }
}
