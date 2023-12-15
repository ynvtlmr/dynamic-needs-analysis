import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientComponent } from './inputs/client/client.component';
import { BeneficiaryComponent } from './inputs/beneficiary/beneficiary.component';
import { BusinessComponent } from './inputs/business/business.component';
import { GoalComponent } from './inputs/goal/goal.component';
import { AssetComponent } from './inputs/asset/asset.component';
import { DebtComponent } from './inputs/debt/debt.component';
import { BusinessManagerComponent } from './inputs/business-manager/business-manager.component';
import { DebtManagerComponent } from './inputs/debt-manager/debt-manager.component';
import { AssetManagerComponent } from './inputs/asset-manager/asset-manager.component';

export const routes: Routes = [
  { path: 'client', component: ClientComponent },
  { path: 'beneficiaries', component: BeneficiaryComponent },
  { path: 'business-manager', component: BusinessManagerComponent },
  { path: 'asset-manager', component: AssetManagerComponent },
  { path: 'debt-manager', component: DebtManagerComponent },
  { path: 'goal', component: GoalComponent },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
