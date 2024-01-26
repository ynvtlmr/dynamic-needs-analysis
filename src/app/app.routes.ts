import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientComponent } from './inputs/client/client.component';
import { BeneficiaryComponent } from './inputs/beneficiary/beneficiary.component';
import { GoalComponent } from './inputs/goal/goal.component';
import { BusinessManagerComponent } from './inputs/business-manager/business-manager.component';
import { DebtManagerComponent } from './inputs/debt-manager/debt-manager.component';
import { AssetManagerComponent } from './inputs/asset-manager/asset-manager.component';
import { DiversificationComponent } from './outputs/diversification/diversification.component';
import { AssetBeneficiaryComponent } from './outputs/asset-beneficiary/asset-beneficiary.component';
import { NetWorthComponent } from './outputs/net-worth/net-worth.component';
import { DebtVisualizationComponent } from './outputs/debt-visualization/debt-visualization.component';
import { ShareholderEbitaContributionComponent } from './outputs/shareholder-ebita-contribution/shareholder-ebita-contribution.component';
import { ShareholderShareValueComponent } from './outputs/shareholder-share-value/shareholder-share-value.component';
import { GoalsVisualizationComponent } from './outputs/goals-visualization/goals-visualization.component';
import { TotalInsurableNeedsComponent } from './outputs/total-insurable-needs/total-insurable-needs.component';

export const routes: Routes = [
  { path: 'inputs/client', component: ClientComponent },
  { path: 'inputs/beneficiaries', component: BeneficiaryComponent },
  { path: 'inputs/business-manager', component: BusinessManagerComponent },
  { path: 'inputs/asset-manager', component: AssetManagerComponent },
  { path: 'inputs/debt-manager', component: DebtManagerComponent },
  { path: 'inputs/goal', component: GoalComponent },

  { path: 'outputs/diversification', component: DiversificationComponent },
  { path: 'outputs/asset-beneficiary', component: AssetBeneficiaryComponent },
  { path: 'outputs/net-worth', component: NetWorthComponent },
  { path: 'outputs/debt-visualization', component: DebtVisualizationComponent },
  {
    path: 'outputs/shareholder-ebita-contribution',
    component: ShareholderEbitaContributionComponent,
  },
  {
    path: 'outputs/shareholder-share-value',
    component: ShareholderShareValueComponent,
  },
  {
    path: 'outputs/goals-visualization',
    component: GoalsVisualizationComponent,
  },
  // {
  //   path: 'outputs/total-insurable-needs',
  //   component: TotalInsurableNeedsComponent,
  // },
  { path: '', redirectTo: '/inputs/client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
