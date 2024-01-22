import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-total-insurable-needs',
  templateUrl: './total-insurable-needs.component.html',
  imports: [CurrencyPipe, FormsModule],
  standalone: true,
})
export class TotalInsurableNeedsComponent implements OnInit {
  estateTaxLiability: number = 0;
  percentageAllocation: number = 0;
  desiredInsuranceCoverage: number = 0;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const assets: Asset[] =
      this.localStorageService.getItem<Asset[]>('assets') ?? [];
    this.estateTaxLiability = this.calculateEstateTaxLiability(assets);

    const liabilityAllocations =
      this.localStorageService.getItem<{ [key: string]: number }>(
        'liabilityAllocations',
      ) ?? {};
    this.percentageAllocation = liabilityAllocations['estateTaxLiability'] ?? 0;
    this.calculateDesiredInsuranceCoverage();
  }

  private calculateEstateTaxLiability(assets: Asset[]): number {
    return assets
      .filter((asset) => asset.isTaxable)
      .map((asset) => this.calculateFutureTaxLiability(asset))
      .reduce((acc, liability) => acc + liability, 0);
  }

  private calculateFutureTaxLiability(asset: Asset): number {
    // Reuse future value calculation logic from asset component
    const futureValue =
      asset.currentValue * Math.pow(1 + asset.rate / 100, asset.term);
    return (
      (futureValue - asset.initialValue) * (asset.capitalGainsTaxRate / 100.0)
    );
  }

  onPercentageChange(): void {
    this.calculateDesiredInsuranceCoverage();
    this.storePercentageAllocation();
  }

  private calculateDesiredInsuranceCoverage(): void {
    this.desiredInsuranceCoverage =
      this.estateTaxLiability * (this.percentageAllocation / 100);
  }

  private storePercentageAllocation(): void {
    const liabilityAllocations =
      this.localStorageService.getItem<{ [key: string]: number }>(
        'liabilityAllocations',
      ) ?? {};
    liabilityAllocations['estateTaxLiability'] = this.percentageAllocation;
    this.localStorageService.setItem(
      'liabilityAllocations',
      liabilityAllocations,
    );
  }
}
