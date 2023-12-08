import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientComponent } from './client/client.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { BusinessComponent } from './business/business.component';
import { GoalComponent } from './goal/goal.component';
import { AssetComponent } from './finance/asset.component';
import { DebtComponent } from './finance/debt.component';

export const routes: Routes = [
  { path: 'client', component: ClientComponent },
  { path: 'beneficiaries', component: BeneficiaryComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'goal', component: GoalComponent },
  { path: 'asset', component: AssetComponent },
  { path: 'debt', component: DebtComponent },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
