import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
// import { LocalStorageService } from '../../../services/local-storage.service';
// import { AuthService } from '../../../services/auth.service';
// import { MenuComponent } from '../menu/menu.component';
// Add -->
import { MenuService } from '../../../services/menu.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, RouterModule],
})
export class HeaderComponent {
  
  currentUserEmail: string | null = null;

  constructor(
    // private localStorageService: LocalStorageService,
    // private authService: AuthService,
    private router: Router,
    // private menu: MenuComponent,
    private menuService: MenuService,
    private authService: AuthService,
  ) {
    this.currentUserEmail = this.authService.getCurrentUserEmail();
  }

  // toggleSidenav(): void {
  //   this.menu.toggleSidenav();
  // }

  toggleMenu() {
    this.menuService.toggleMenu();
  }

  // toggleSidenav(sidenav: any): void {
  //   sidenav.toggle();
  // }
}
 