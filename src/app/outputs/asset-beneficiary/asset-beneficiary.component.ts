// asset-beneficiary.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asset } from '../../inputs/asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { BeneficiaryValuePieChartComponent } from './beneficiary-value-pie-chart.component';
import { BeneficiaryPercentagePieChartComponent } from './beneficiary-percentage-pie-chart.component';
import { AssetValueBarChartComponent } from './asset-value-bar-chart.component';
import { AssetPercentageBarChartComponent } from './asset-percentage-bar-chart.component';
import { Beneficiary } from '../../inputs/beneficiary/beneficiary.component';

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
  public beneficiaries: Beneficiary[] = []; // You might want to define a proper type for beneficiaries

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadAssetsAndBeneficiaries(); // Load initial assets and beneficiaries

    // Subscribe to the localStorage changes
    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key) => {
        // If the change is related to assets or beneficiaries or something that affects the charts
        if (key === 'assets' || key === 'beneficiaries' || key === 'all') {
          this.loadAssetsAndBeneficiaries(); // Reload the data
        }
      });
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadAssetsAndBeneficiaries(): void {
    // Retrieve assets and beneficiaries from local storage or set to empty if none
    this.assets = this.localStorageService.getItem('assets') || [];
    this.beneficiaries =
      this.localStorageService.getItem('beneficiaries') || [];
  }
}
