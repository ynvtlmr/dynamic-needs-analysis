import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BirthdateComponent } from './birthdate/birthdate.component';
import { ClientComponent } from './client/client.component';
import { FinancialInstrumentComponent } from './financial-instrument/financial-instrument.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BirthdateComponent,
    ClientComponent,
    FinancialInstrumentComponent,
    BeneficiaryComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'dynamic-needs-analysis';

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
