import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule,
  ],
})
export class MenuComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleSidenav(sidenav: any): void {
    sidenav.toggle();
  }

  clearLocalStorage(): void {
    this.localStorageService.clearAll();
  }

  saveLocalStorage(): void {
    this.localStorageService.downloadAsFile();
  }

  loadLocalStorage(event: Event): void {
    this.localStorageService.loadFromFile(event);
  }

  logOut(): void {
    this.authService
      .logOut()
      .then(() => {
        // Handle navigation or UI feedback post logout
        console.log('Logged out successfully');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
