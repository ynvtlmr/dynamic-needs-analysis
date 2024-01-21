import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-total-insurable-needs',
  templateUrl: './total-insurable-needs.component.html',
  imports: [CurrencyPipe],
  standalone: true,
})
export class TotalInsurableNeedsComponent implements OnInit {
  estateTaxLiability: number = 0;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    // Fetch assets from LocalStorageService
    const assets: Asset[] =
      this.localStorageService.getItem<Asset[]>('assets') ?? [];
    this.estateTaxLiability = this.calculateEstateTaxLiability(assets);
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
}
