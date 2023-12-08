import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { BusinessComponent } from './business/business.component';
import { GoalComponent } from './goal/goal.component';
import { LocalStorageService } from './services/local-storage.service';
import { AssetComponent } from './finance/asset.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ClientComponent,
    BeneficiaryComponent,
    BusinessComponent,
    GoalComponent,
    AssetComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'dynamic-needs-analysis';
  selectedTab: string = 'client';

  constructor(private localStorageService: LocalStorageService) {}

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
