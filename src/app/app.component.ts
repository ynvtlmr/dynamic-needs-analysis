import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.css',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'dynamic-needs-analysis';
  selectedTab: string = 'client';

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

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
    { label: 'Client', path: 'client' },
    { label: 'Beneficiaries', path: 'beneficiaries' },
    { label: 'Business', path: 'business' },
    { label: 'Goal', path: 'goal' },
    { label: 'Asset', path: 'asset' },
    { label: 'Debt', path: 'debt' },
  ];
}
