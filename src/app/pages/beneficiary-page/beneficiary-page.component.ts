import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiaryComponent } from '../../components/inputs/beneficiary/beneficiary.component';
import { AssetBeneficiaryComponent } from '../../components/outputs/asset-beneficiary/asset-beneficiary.component';

@Component({
  selector: 'app-beneficiary-page',
  templateUrl: './beneficiary-page.component.html',
  standalone: true,
  imports: [CommonModule, BeneficiaryComponent, AssetBeneficiaryComponent]
})
export class BeneficiaryPageComponent {}
