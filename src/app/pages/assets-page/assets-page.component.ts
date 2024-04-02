import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetManagerComponent } from '../../components/inputs/asset-manager/asset-manager.component';
import { NetWorthComponent } from '../../components/outputs/net-worth/net-worth.component';
import { DiversificationComponent } from '../../components/outputs/diversification/diversification.component';

@Component({
  selector: 'app-assets-page',
  templateUrl: './assets-page.component.html',
  standalone: true,
  imports: [CommonModule, AssetManagerComponent, 
            NetWorthComponent, DiversificationComponent],
})
export class AssetsPageComponent {}
