import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessManagerComponent } from '../../components/inputs/business-manager/business-manager.component';
import { ShareholderEbitdaContributionComponent } from '../../components/outputs/shareholder-ebitda-contribution/shareholder-ebitda-contribution.component';
import { ShareholderShareValueComponent } from '../../components/outputs/shareholder-share-value/shareholder-share-value.component';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  standalone: true,
  imports: [CommonModule, BusinessManagerComponent,
            ShareholderEbitdaContributionComponent,
            ShareholderShareValueComponent]
})
export class BusinessPageComponent {}
