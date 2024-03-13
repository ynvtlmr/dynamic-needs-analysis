// Angular core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

// services
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MenuComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    this.checkForUpdates();
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
        if (event.type === 'VERSION_READY') {
          if (
            confirm('New version of the app is available. Load new version?')
          ) {
            window.location.reload();
          }
        }
      });
    }
  }
}
