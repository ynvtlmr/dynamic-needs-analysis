import { Component, OnDestroy, OnInit } from '@angular/core';
import { Asset } from '../../models/asset.model';
import { Goal } from '../../models/goal.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getChartOptions, ChartOptions } from './goals-visualization-chart';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-goals-visualization',
  templateUrl: './goals-visualization.component.html',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgApexchartsModule, DecimalPipe],
})
export class GoalsVisualizationComponent implements OnInit, OnDestroy {
  totalCurrentValueFixed: number = 0;
  totalFutureValueFixed: number = 0;
  totalCurrentValueLiquid: number = 0;
  totalFutureValueLiquid: number = 0;
  totalCurrentValueToBeSold: number = 0;
  totalFutureValueToBeSold: number = 0;

  percentLiquidityToGoals: number = 0;
  liquidityPreserved: number = 0;
  liquidityAllocatedToGoals: number = 0;

  totalSumOfGoals: number = 0;
  shortfall: number = 0;

  chartOptions!: ChartOptions;
  private storageSub!: Subscription;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string) => {
        if (
          key === 'assets' ||
          key === 'goals' ||
          key === 'percentLiquidityToGoals'
        ) {
          this.calculateTotals();
          this.calculateGoals();
          this.updateChart();
          this.loadPercentLiquidityFromStorage();
        }
      });
    this.loadPercentLiquidityFromStorage();
    this.calculateTotals();
    this.calculateGoals();
    this.updateChart();
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private calculateTotals(): void {
    this.totalCurrentValueLiquid = 0;
    this.totalFutureValueLiquid = 0;
    this.totalCurrentValueFixed = 0;
    this.totalFutureValueFixed = 0;
    this.totalCurrentValueToBeSold = 0;
    this.totalFutureValueToBeSold = 0;

    const assets: Asset[] =
      this.localStorageService.getItem<Asset[]>('assets') ?? [];

    assets.forEach((asset: Asset): void => {
      const futureValue: number =
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

  private calculateGoals(): void {
    const goals: Goal[] =
      this.localStorageService.getItem<Goal[]>('goals') || [];
    this.totalSumOfGoals = goals.reduce(
      (sum, goal) => sum + goal.dollarAmount,
      0,
    );

    // Recalculate shortfall in case goals change
    this.calculateShortfall();
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

  private calculateShortfall(): void {
    // Assuming this.totalFutureValueLiquid already reflects liquidity allocated towards goals
    this.shortfall = this.liquidityAllocatedToGoals - this.totalSumOfGoals;

    const totals: { [key: string]: any } =
      this.localStorageService.getItem<{ [key: string]: number }>('totals') ??
      {};
    if (!totals['Goal Shortfall']) {
      totals['Goal Shortfall'] = { value: 0, priority: 100 };
    }
    if (this.shortfall < 0) {
      totals['Goal Shortfall']['value'] = this.shortfall * -1.0;
    } else {
      totals['Goal Shortfall']['value'] = 0;
    }
    this.localStorageService.setItem('totals', totals);
  }

  private updateChart(): void {
    const chartValues = [
      this.totalFutureValueLiquid,
      this.liquidityPreserved,
      this.liquidityAllocatedToGoals,
      -this.totalSumOfGoals, // Display as negative
      this.shortfall,
    ];
    this.chartOptions = getChartOptions(chartValues);
  }
}
