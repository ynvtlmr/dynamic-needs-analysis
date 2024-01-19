import { Component, OnInit } from '@angular/core';
import { Asset } from '../../models/asset.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goals-visualization',
  templateUrl: './goals-visualization.component.html',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
})
export class GoalsVisualizationComponent implements OnInit {
  totalCurrentValueFixed: number = 0;
  totalFutureValueFixed: number = 0;
  totalCurrentValueLiquid: number = 0;
  totalFutureValueLiquid: number = 0;
  totalCurrentValueToBeSold: number = 0;
  totalFutureValueToBeSold: number = 0;

  percentLiquidityToGoals: number = 0;
  liquidityPreserved: number = 0;
  liquidityAllocatedToGoals: number = 0;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadPercentLiquidityFromStorage();
    this.calculateTotals();
  }

  private calculateTotals(): void {
    const assets: Asset[] =
      this.localStorageService.getItem<Asset[]>('assets') || [];

    assets.forEach((asset) => {
      const futureValue =
        asset.currentValue * Math.pow(1 + asset.rate / 100, asset.term);

      if (asset.isLiquid) {
        this.totalCurrentValueLiquid += asset.currentValue;
        this.totalFutureValueLiquid += futureValue;
      }

      if (!asset.isLiquid && !asset.isToBeSold) {
        this.totalCurrentValueFixed += asset.currentValue;
        this.totalFutureValueFixed += futureValue;
      }

      if (asset.isToBeSold) {
        this.totalCurrentValueToBeSold += asset.currentValue;
        this.totalFutureValueToBeSold += futureValue;
      }
    });
    this.calculateLiquidityValues();
  }

  private calculateLiquidityValues(): void {
    const allocationFactor = this.percentLiquidityToGoals / 100;
    this.liquidityPreserved =
      this.totalFutureValueLiquid * (1 - allocationFactor);
    this.liquidityAllocatedToGoals =
      this.totalFutureValueLiquid * allocationFactor;
  }

  private loadPercentLiquidityFromStorage(): void {
    const storedPercent = this.localStorageService.getItem<number>(
      'percentLiquidityToGoals',
    );
    if (storedPercent != null) {
      this.percentLiquidityToGoals = storedPercent;
    }
  }

  onPercentLiquidityChange(): void {
    this.localStorageService.setItem(
      'percentLiquidityToGoals',
      this.percentLiquidityToGoals,
    );
    this.calculateLiquidityValues();
  }
}
