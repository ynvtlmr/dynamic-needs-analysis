import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiaryComponent } from '../../inputs/beneficiary/beneficiary.component';
import { AssetBeneficiaryComponent } from '../../outputs/asset-beneficiary/asset-beneficiary.component';

@Component({
  selector: 'app-beneficiary-page',
  templateUrl: './beneficiary-page.component.html',
  standalone: true,
  imports: [CommonModule, BeneficiaryComponent, AssetBeneficiaryComponent],
})
export class BeneficiaryPageComponent {}
