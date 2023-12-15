import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../inputs/asset/asset.component';
import { colorSets, Color, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-asset-beneficiary',
  templateUrl: './asset-beneficiary.component.html',
  imports: [NgxChartsModule],
  standalone: true,
})
export class AssetBeneficiaryComponent implements OnInit {
  beneficiaryChartData: any[] = [];
  colorScheme: Color = colorSets.find((s) => s.name === 'cool') || colorSets[0];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.prepareChartData();
  }

  prepareChartData(): void {
    const assets: Asset[] = this.localStorageService.getItem('assets') || [];

    this.beneficiaryChartData = assets.map((asset) => {
      const series = asset.beneficiaries.map((beneficiary) => {
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
}
