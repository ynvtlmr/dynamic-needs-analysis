import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BeneficiaryValuePieChartComponent } from './beneficiary-value-pie-chart.component';
import { BeneficiaryPercentagePieChartComponent } from './beneficiary-percentage-pie-chart.component';
import { AssetValueBarChartComponent } from './asset-value-bar-chart.component';
import { AssetPercentageBarChartComponent } from './asset-percentage-bar-chart.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-asset-beneficiary',
  templateUrl: './asset-beneficiary.component.html',
  imports: [
    BeneficiaryValuePieChartComponent,
    BeneficiaryPercentagePieChartComponent,
    AssetValueBarChartComponent,
    AssetPercentageBarChartComponent,
  ],
  standalone: true,
})
export class AssetBeneficiaryComponent implements OnInit, OnDestroy {
  private storageSub!: Subscription;
  public assets: Asset[] = [];
  public beneficiaries: Beneficiary[] = [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadAssetsAndBeneficiaries();

    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string): void => {
        if (key === 'assets' || key === 'beneficiaries' || key === 'all') {
          this.loadAssetsAndBeneficiaries();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadAssetsAndBeneficiaries(): void {
    this.assets = this.localStorageService.getItem('assets') || [];
    this.beneficiaries =
      this.localStorageService.getItem('beneficiaries') || [];
  }
}
