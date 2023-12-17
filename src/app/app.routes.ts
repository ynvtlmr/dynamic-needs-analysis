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
  { path: 'client', component: ClientComponent },
  { path: 'beneficiaries', component: BeneficiaryComponent },
  { path: 'business-manager', component: BusinessManagerComponent },
  { path: 'asset-manager', component: AssetManagerComponent },
  { path: 'debt-manager', component: DebtManagerComponent },
  { path: 'goal', component: GoalComponent },
  { path: 'diversification', component: DiversificationComponent },
  { path: 'asset-beneficiary', component: AssetBeneficiaryComponent },
  { path: 'net-worth', component: NetWorthComponent },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
