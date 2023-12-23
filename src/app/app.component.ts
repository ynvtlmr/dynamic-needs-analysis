import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';

import { ClientComponent } from './inputs/client/client.component';
import { BeneficiaryComponent } from './inputs/beneficiary/beneficiary.component';
import { GoalComponent } from './inputs/goal/goal.component';
import { BusinessManagerComponent } from './inputs/business-manager/business-manager.component';
import { DebtManagerComponent } from './inputs/debt-manager/debt-manager.component';
import { AssetManagerComponent } from './inputs/asset-manager/asset-manager.component';
import { DiversificationComponent } from './outputs/diversification/diversification.component';
import { AssetBeneficiaryComponent } from './outputs/asset-beneficiary/asset-beneficiary.component';
import { NetWorthComponent } from './outputs/net-worth/net-worth.component';

interface NavLink {
  path: string;
  label: string;
  component: any;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // existing properties
  selectedInputComponent: any = null;
  selectedOutputComponent: any = null;
  constructor(private localStorageService: LocalStorageService) {}

  // Update with the actual component classes
  inputLinks: NavLink[] = [
    { path: 'inputs/client', label: 'Client', component: ClientComponent },
    {
      path: 'inputs/beneficiaries',
      label: 'Beneficiaries',
      component: BeneficiaryComponent,
    },
    {
      path: 'inputs/asset-manager',
      label: 'Assets',
      component: AssetManagerComponent,
    },
    {
      path: 'inputs/debt-manager',
      label: 'Debts',
      component: DebtManagerComponent,
    },
    {
      path: 'inputs/business-manager',
      label: 'Businesses',
      component: BusinessManagerComponent,
    },
    { path: 'inputs/goal', label: 'Goals', component: GoalComponent },
  ];

  outputLinks: NavLink[] = [
    {
      path: 'outputs/net-worth',
      label: 'Net Worth',
      component: NetWorthComponent,
    },
    {
      path: 'outputs/diversification',
      label: 'Diversification',
      component: DiversificationComponent,
    },
    {
      path: 'outputs/asset-beneficiary',
      label: 'Asset-Beneficiary',
      component: AssetBeneficiaryComponent,
    },
  ];

  onSelectInputComponent(component: any) {
    if (this.selectedInputComponent === component) {
      this.selectedInputComponent = null; // Hide if it's the same component
    } else {
      this.selectedInputComponent = component;
      // this.selectedOutputComponent = null; // Optionally hide the other section
    }
  }

  onSelectOutputComponent(component: any) {
    if (this.selectedOutputComponent === component) {
      this.selectedOutputComponent = null;
    } else {
      this.selectedOutputComponent = component;
      // this.selectedInputComponent = null; // Optionally hide the other section
    }
  }

  clearAllLocalStorage() {
    this.localStorageService.clearAll();
  }

  downloadLocalStorageAsFile() {
    this.localStorageService.downloadAsFile();
  }

  loadLocalStorageFromFile(event: Event) {
    this.localStorageService.loadFromFile(event);
  }
}
