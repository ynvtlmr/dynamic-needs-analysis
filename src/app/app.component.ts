import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'dynamic-needs-analysis';
  selectedTab: string = 'client';

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {
    this.selectedTab = localStorageService.getItem('selectedTab') || 'client';
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Extract the path and set the selectedTab
        const currentPath = event.urlAfterRedirects.split('/')[1];
        this.selectedTab = currentPath;
        // Optionally save the selectedTab to localStorage
        this.localStorageService.setItem('selectedTab', currentPath);
      }
    });
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

  navLinks: NavLink[] = [
    { path: 'client', label: 'Client' },
    { path: 'beneficiaries', label: 'Beneficiaries' },
    { path: 'asset-manager', label: 'Assets' },
    { path: 'debt-manager', label: 'Debts' },
    { path: 'business-manager', label: 'Businesses' },
    { path: 'goal', label: 'Goals' },
  ];
}
