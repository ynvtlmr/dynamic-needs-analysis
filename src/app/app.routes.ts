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

  { path: '', redirectTo: '/inputs/client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
