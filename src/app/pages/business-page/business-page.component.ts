import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessManagerComponent } from '../../inputs/business-manager/business-manager.component';
import { ShareholderEbitdaContributionComponent } from '../../outputs/shareholder-ebitda-contribution/shareholder-ebitda-contribution.component';
import { ShareholderShareValueComponent } from '../../outputs/shareholder-share-value/shareholder-share-value.component';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    BusinessManagerComponent,
    ShareholderEbitdaContributionComponent,
    ShareholderShareValueComponent,
  ],
})
export class BusinessPageComponent {}
