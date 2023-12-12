import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetComponent } from './asset/asset.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { BusinessComponent } from './business/business.component';
import { ClientComponent } from './client/client.component';
import { DebtComponent } from './debt/debt.component';
import { GoalComponent } from './goal/goal.component';

export const routes: Routes = [
  { component: ClientComponent, path: 'client' },
  { component: BeneficiaryComponent, path: 'beneficiaries' },
  { component: BusinessComponent, path: 'business' },
  { component: GoalComponent, path: 'goal' },
  { component: AssetComponent, path: 'asset' },
  { component: DebtComponent, path: 'debt' },
  { path: '', pathMatch: 'full', redirectTo: '/client' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
