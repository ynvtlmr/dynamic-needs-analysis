import { Component, OnInit } from '@angular/core';
import { Asset } from '../../inputs/asset/asset.component';
import { Beneficiary } from '../../inputs/beneficiary/beneficiary.component';
import { LocalStorageService } from '../../services/local-storage.service';
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
    this.prepareChartData();
  }

  prepareChartData(): void {
    this.assets.forEach((asset: Asset) => {
      const valueSeries: any[] = [];
      const percentageSeries: any[] = [];

      asset.beneficiaries.forEach((beneficiary: Beneficiary) => {
        valueSeries.push({
          name: beneficiary.name,
          value: (beneficiary.allocation / 100) * asset.currentValue,
        });
        percentageSeries.push({
          name: beneficiary.name,
          value: beneficiary.allocation,
        });
      });

      this.valueChartData.push({
        name: asset.name,
        series: valueSeries,
      });

      this.percentageChartData.push({
        name: asset.name,
        series: percentageSeries,
      });
    });
  }
}
