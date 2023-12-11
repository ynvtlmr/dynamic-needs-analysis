import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'dynamic-needs-analysis';
  selectedTab: string = 'client';

  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  clearAllLocalStorage() {
    this.localStorageService.clearAll();
  }

  downloadLocalStorageAsFile() {
    this.localStorageService.downloadAsFile();
  }

  loadLocalStorageFromFile(event: Event) {
    this.localStorageService.loadFromFile(event);
  }

  navLinks: NavLink[] = [
    { path: 'client', label: 'Client' },
    { path: 'beneficiaries', label: 'Beneficiaries' },
    { path: 'business', label: 'Business' },
    { path: 'goal', label: 'Goal' },
    { path: 'asset', label: 'Asset' },
    { path: 'debt', label: 'Debt' },
  ];
}
