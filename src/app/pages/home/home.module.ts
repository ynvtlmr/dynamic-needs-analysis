// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './home.component';

// Pages
import { ClientPageComponent } from '../client-page/client-page.component';
import { BeneficiaryPageComponent } from '../beneficiary-page/beneficiary-page.component';
import { BusinessPageComponent } from '../business-page/business-page.component';
import { AssetsPageComponent } from '../assets-page/assets-page.component';
import { DebtsPageComponent } from '../debts-page/debts-page.component';
import { GoalsPageComponent } from '../goals-page/goals-page.component';
import { TotalInsurableNeedsComponent } from '../../outputs/total-insurable-needs/total-insurable-needs.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'client', component: ClientPageComponent, title: 'Client' },
      {
        path: 'beneficiaries',
        component: BeneficiaryPageComponent,
        title: 'Beneficiaries',
      },
      {
        path: 'businesses',
        component: BusinessPageComponent,
        title: 'Businesses',
      },
      { path: 'assets', component: AssetsPageComponent, title: 'Assets' },
      { path: 'debts', component: DebtsPageComponent, title: 'Debts' },
      { path: 'goals', component: GoalsPageComponent, title: 'Goals' },
      {
        path: 'total-needs',
        component: TotalInsurableNeedsComponent,
        title: 'Total Needs',
      },
    ],
  },
];

@NgModule({
  imports: [HomeComponent, CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeModule {}
