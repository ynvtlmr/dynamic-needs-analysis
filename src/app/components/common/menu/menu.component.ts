import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
// import { ViewChild } from '@angular/core';
// New -->
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [NgIf, MatSidenavModule, MatListModule, MatIconModule,
            MatToolbarModule, RouterModule, HeaderComponent],
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  // New -->
  showMenu = true;
  // private subscription: Subscription;
  private subscription!: Subscription;
  // <-- New

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.menuService.currentState.subscribe(
      (state) => (this.showMenu = state));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
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
