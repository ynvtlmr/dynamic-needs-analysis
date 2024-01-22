import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';
import { Subscription } from 'rxjs';
import { BeneficiaryValuePieChartComponent } from './beneficiary-value-pie-chart.component';
import { BeneficiaryPercentagePieChartComponent } from './beneficiary-percentage-pie-chart.component';
import { AssetValueBarChartComponent } from './asset-value-bar-chart.component';
import { AssetPercentageBarChartComponent } from './asset-percentage-bar-chart.component';
import { BeneficiaryFutureValuePieChartComponent } from './beneficiary-future-value-pie-chart.component';
import { BeneficiaryFutureValueBarChartComponent } from './beneficiary-future-value-bar-chart.component';

@Component({
  selector: 'app-asset-beneficiary',
  templateUrl: './asset-beneficiary.component.html',
  imports: [
    BeneficiaryValuePieChartComponent,
    BeneficiaryPercentagePieChartComponent,
    AssetValueBarChartComponent,
    AssetPercentageBarChartComponent,
    BeneficiaryFutureValuePieChartComponent,
    BeneficiaryFutureValueBarChartComponent,
  ],
  standalone: true,
})
export class AssetBeneficiaryComponent implements OnInit, OnDestroy {
  private storageSub!: Subscription;
  public assets: Asset[] = [];
  public beneficiaries: Beneficiary[] = [];

  @ViewChild(BeneficiaryValuePieChartComponent)
  private beneficiaryValuePieChartComponent!: BeneficiaryValuePieChartComponent;
  @ViewChild(BeneficiaryPercentagePieChartComponent)
  private beneficiaryPercentagePieChartComponent!: BeneficiaryPercentagePieChartComponent;
  @ViewChild(AssetValueBarChartComponent)
  private assetValueBarChartComponent!: AssetValueBarChartComponent;
  @ViewChild(AssetPercentageBarChartComponent)
  private assetPercentageBarChartComponent!: AssetPercentageBarChartComponent;
  @ViewChild(BeneficiaryFutureValuePieChartComponent)
  private beneficiaryFutureValuePieChartComponent!: BeneficiaryFutureValuePieChartComponent;
  @ViewChild(BeneficiaryFutureValueBarChartComponent)
  private beneficiaryFutureValueBarChartComponent!: BeneficiaryFutureValueBarChartComponent;

  constructor(
    private localStorageService: LocalStorageService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAssetsAndBeneficiaries();

    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string) => {
        if (key === 'assets' || key === 'beneficiaries' || key === 'all') {
          this.loadAssetsAndBeneficiaries();
          this.refreshCharts();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadAssetsAndBeneficiaries(): void {
    this.assets = this.localStorageService.getItem('assets') ?? [];
    this.beneficiaries =
      this.localStorageService.getItem('beneficiaries') ?? [];
  }

  private refreshCharts(): void {
    this.changeDetectorRef.detectChanges();

    if (this.beneficiaryValuePieChartComponent) {
      this.beneficiaryValuePieChartComponent.refreshChart();
    }
    if (this.beneficiaryPercentagePieChartComponent) {
      this.beneficiaryPercentagePieChartComponent.refreshChart();
    }
    if (this.assetValueBarChartComponent) {
      this.assetValueBarChartComponent.refreshChart();
    }
    if (this.assetPercentageBarChartComponent) {
      this.assetPercentageBarChartComponent.refreshChart();
    }
    if (this.beneficiaryFutureValuePieChartComponent) {
      this.beneficiaryFutureValuePieChartComponent.refreshChart();
    }
    if (this.beneficiaryFutureValueBarChartComponent) {
      this.beneficiaryFutureValueBarChartComponent.refreshChart();
    }
  }
}
