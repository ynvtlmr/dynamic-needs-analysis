import { Component, OnInit } from '@angular/core';
import { Asset } from '../../inputs/asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { colorSets, Color, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-diversification',
  templateUrl: './diversification.component.html',
  imports: [NgxChartsModule],
  standalone: true,
})
export class DiversificationComponent implements OnInit {
  data: any[] = [];
  colorScheme: Color = colorSets.find((s) => s.name === 'cool') || colorSets[0];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.processData();
  }

  processData(): void {
    const assets: Asset[] = this.localStorageService.getItem('assets') || [];
    const totalByType: Record<string, number> = assets.reduce(
      (acc: Record<string, number>, asset: Asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + asset.currentValue;
        return acc;
      },
      {},
    );

    this.data = Object.keys(totalByType).map((type) => ({
      name: type,
      value: totalByType[type],
    }));
  }
}
