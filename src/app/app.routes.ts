import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientComponent } from './client/client.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { FinancialInstrumentComponent } from './financial-instrument/financial-instrument.component';
import { BusinessComponent } from './business/business.component';
import { GoalComponent } from './goal/goal.component';

export const routes: Routes = [
  { path: 'client', component: ClientComponent },
  { path: 'beneficiaries', component: BeneficiaryComponent },
  { path: 'financial-instrument', component: FinancialInstrumentComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'goal', component: GoalComponent },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
