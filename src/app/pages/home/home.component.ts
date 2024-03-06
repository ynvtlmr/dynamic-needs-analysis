// Angular core
import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

// services
import { LocalStorageService } from '../../services/local-storage.service';

// inputs
import { AssetManagerComponent } from '../../inputs/asset-manager/asset-manager.component';
import { BeneficiaryComponent } from '../../inputs/beneficiary/beneficiary.component';
import { BusinessManagerComponent } from '../../inputs/business-manager/business-manager.component';
import { ClientComponent } from '../../inputs/client/client.component';
import { DebtManagerComponent } from '../../inputs/debt-manager/debt-manager.component';
import { GoalComponent } from '../../inputs/goal/goal.component';

// outputs
import { AssetBeneficiaryComponent } from '../../outputs/asset-beneficiary/asset-beneficiary.component';
import { DebtVisualizationComponent } from '../../outputs/debt-visualization/debt-visualization.component';
import { DiversificationComponent } from '../../outputs/diversification/diversification.component';
import { GoalsVisualizationComponent } from '../../outputs/goals-visualization/goals-visualization.component';
import { NetWorthComponent } from '../../outputs/net-worth/net-worth.component';
import { ShareholderEbitdaContributionComponent } from '../../outputs/shareholder-ebitda-contribution/shareholder-ebitda-contribution.component';
import { ShareholderShareValueComponent } from '../../outputs/shareholder-share-value/shareholder-share-value.component';
import { TotalInsurableNeedsComponent } from '../../outputs/total-insurable-needs/total-insurable-needs.component';

type ComponentType = Type<
  | ClientComponent
  | BeneficiaryComponent
  | GoalComponent
  | BusinessManagerComponent
  | DebtManagerComponent
  | AssetManagerComponent
  | DiversificationComponent
  | AssetBeneficiaryComponent
  | NetWorthComponent
  | DebtVisualizationComponent
  | ShareholderEbitdaContributionComponent
  | ShareholderShareValueComponent
  | GoalsVisualizationComponent
  | TotalInsurableNeedsComponent
>;

interface NavLink {
  path: string;
  label: string;
  component: ComponentType;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  selectedInputComponent: ComponentType | null = null;
  selectedOutputComponent: ComponentType | null = null;
  constructor(
    private localStorageService: LocalStorageService,
    private swUpdate: SwUpdate,
  ) {}

  ngOnInit() {
    this.checkForUpdates();
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
        if (event.type === 'VERSION_READY') {
          if (
            confirm('New version of the app is available. Load new version?')
          ) {
            window.location.reload();
          }
        }
      });
    }
  }

  inputLinks: NavLink[] = [
    { path: 'inputs/client', label: 'Client', component: ClientComponent },
    {
      path: 'inputs/beneficiaries',
      label: 'Beneficiaries',
      component: BeneficiaryComponent,
    },
    {
      path: 'inputs/business-manager',
      label: 'Businesses',
      component: BusinessManagerComponent,
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
    {
      path: 'outputs/debt-visualization',
      label: 'Debts',
      component: DebtVisualizationComponent,
    },
    {
      path: 'outputs/shareholder-ebitda-contribution',
      label: 'Biz Ebitda',
      component: ShareholderEbitdaContributionComponent,
    },
    {
      path: 'outputs/shareholder-share-value',
      label: 'Biz Shares',
      component: ShareholderShareValueComponent,
    },
    {
      path: 'outputs/goals-visualization',
      label: 'Goals',
      component: GoalsVisualizationComponent,
    },
    {
      path: 'outputs/total-insurable-needs',
      label: 'Insurable Needs',
      component: TotalInsurableNeedsComponent,
    },
  ];

  onSelectInputComponent(component: ComponentType | null): void {
    if (this.selectedInputComponent === component) {
      this.selectedInputComponent = null;
    } else {
      this.selectedInputComponent = component;
    }
  }

  onSelectOutputComponent(component: ComponentType | null): void {
    if (this.selectedOutputComponent === component) {
      this.selectedOutputComponent = null;
    } else {
      this.selectedOutputComponent = component;
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
