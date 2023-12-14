import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientComponent } from './client/client.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { BusinessComponent } from './business/business.component';
import { GoalComponent } from './goal/goal.component';
import { AssetComponent } from './asset/asset.component';
import { DebtComponent } from './debt/debt.component';
import { BusinessManagerComponent } from './business-manager/business-manager.component';
import { DebtManagerComponent } from './debt-manager/debt-manager.component';

export const routes: Routes = [
  { path: 'client', component: ClientComponent },
  { path: 'beneficiaries', component: BeneficiaryComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'goal', component: GoalComponent },
  { path: 'asset', component: AssetComponent },
  { path: 'debt', component: DebtComponent },
  { path: 'business-manager', component: BusinessManagerComponent },
  { path: 'debt-manager', component: DebtManagerComponent },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
