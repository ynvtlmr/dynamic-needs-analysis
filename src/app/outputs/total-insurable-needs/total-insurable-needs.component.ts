import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-total-insurable-needs',
  templateUrl: './total-insurable-needs.component.html',
  imports: [CurrencyPipe, FormsModule],
  standalone: true,
})
export class TotalInsurableNeedsComponent implements OnInit, OnDestroy {
  estateTaxLiability: number = 0;
  percentageAllocation: number = 0;
  desiredInsuranceCoverage: number = 0;
  private storageSub!: Subscription;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadDataFromStorage();
    this.subscribeToLocalStorageChanges();
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadDataFromStorage(): void {
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

  private subscribeToLocalStorageChanges(): void {
    this.storageSub = this.localStorageService.watchStorage().subscribe(() => {
      this.loadDataFromStorage();
    });
  }

  private calculateEstateTaxLiability(assets: Asset[]): number {
    return assets
      .filter((asset) => asset.isTaxable)
      .map((asset) => this.calculateFutureTaxLiability(asset))
      .reduce((acc, liability) => acc + liability, 0);
  }

  private calculateFutureTaxLiability(asset: Asset): number {
    const futureValue = this.calculateFutureValue(asset);
    return (
      (futureValue - asset.initialValue) * (asset.capitalGainsTaxRate / 100.0)
    );
  }

  private calculateFutureValue(asset: Asset): number {
    return asset.currentValue * Math.pow(1 + asset.rate / 100, asset.term);
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
