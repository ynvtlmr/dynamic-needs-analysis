import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
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
export class BusinessComponent implements OnChanges {
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

  ngOnChanges() {
    if (this.business) {
      this.populateBusinessData(this.business);
    }
  }

  populateBusinessData(business: Business): void {
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
      ebita: this.ebita,
      rate: this.rate,
      term: this.term,
      shareholders: this.shareholders,
    };
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
      sharePercentage: 0,
      insuranceCoverage: 0,
      ebitaContributionPercentage: 0,
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
    return (
      this.business!.ebita * (shareholder.ebitaContributionPercentage / 100)
    );
  }

  get totalMajorShareholderPercentage(): number {
    return this.shareholders.reduce(
      (acc: number, shareholder: Shareholder) =>
        acc + shareholder.sharePercentage,
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
}
