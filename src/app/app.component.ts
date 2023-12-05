import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BirthdateComponent } from './birthdate/birthdate.component';
import { ClientComponent } from './client/client.component';
import { FinancialInstrumentComponent } from './financial-instrument/financial-instrument.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';

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

  clearAllLocalStorage() {
    localStorage.clear();
    window.location.reload();
  }

  downloadLocalStorageAsFile() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const fileName = 'dna-local-storage.json';
    const downloadURL = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = fileName;
    link.click();

    // Revoke the object URL to free up memory
    window.URL.revokeObjectURL(downloadURL);
  }

  loadLocalStorageFromFile(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result as string);
      for (let key in data) {
        localStorage.setItem(key, data[key]);
      }
      // Reload app
      window.location.reload();
    };
    reader.readAsText(file);
  }
}
