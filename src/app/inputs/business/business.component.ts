import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { Client } from '../../models/client.model';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
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
    };
    this.shareholders.push(newShareholder);
  }

  // Delete a shareholder by index
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
      (acc, shareholder) => acc + this.calculateShareValue(shareholder),
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
