import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
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
  constructor(private localStorageService: LocalStorageService) {}

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
  }

  clearLocalStorage() {
    this.localStorageService.clearAll();
  }

  saveLocalStorage() {
    this.localStorageService.downloadAsFile();
  }

  loadLocalStorage(event: Event) {
    this.localStorageService.loadFromFile(event);
  }
}
