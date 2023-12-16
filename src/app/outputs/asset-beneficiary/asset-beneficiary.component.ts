import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../inputs/asset/asset.component';
import { Beneficiary } from '../../inputs/beneficiary/beneficiary.component';
import { colorSets, Color, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-asset-beneficiary',
  templateUrl: './asset-beneficiary.component.html',
  imports: [NgxChartsModule],
  standalone: true,
})
export class AssetBeneficiaryComponent implements OnInit {
  valueChartData: any[] = [];
  percentageChartData: any[] = [];
  colorScheme: Color = colorSets.find((s) => s.name === 'cool') || colorSets[0];
  assets: Asset[] = this.localStorageService.getItem('assets') || [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.prepareValueData();
    this.preparePercentageData();
  }

  prepareValueData(): void {
    this.valueChartData = this.assets.map((asset) => {
      const series = asset.beneficiaries.map((beneficiary: Beneficiary) => {
        return {
          name: beneficiary.name,
          value: (beneficiary.allocation / 100) * asset.currentValue,
        };
      });

      return {
        name: asset.name,
        series: series,
      };
    });
  }

  preparePercentageData(): void {
    this.percentageChartData = this.assets.map((asset: Asset) => {
      const series = asset.beneficiaries.map((beneficiary: Beneficiary) => {
        return {
          name: beneficiary.name,
          value: beneficiary.allocation,
        };
      });

      return {
        name: asset.name,
        series: series,
      };
    });
  }
}
