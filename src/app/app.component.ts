import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/common/header/header.component';
import { MenuComponent } from './components/common/menu/menu.component';

import { Subscription } from 'rxjs';
import { MenuService } from './services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, MenuComponent, RouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'DynamicNeedsAnalysis';
  // showMenu = false; // Define showMenu property

  // Added -->
  showMenu = false; // Define showMenu property
  private subscription: Subscription = new Subscription;
  // <-- Added

  // constructor(private outlet: RouterOutlet) {}
  constructor(private menuService: MenuService) {} // Inject MenuService

  ngOnInit() {
    console.log('AppComponent ngOnInit');
    // this.subscription = this.menuService.currentState.subscribe((state) => (this.showMenu = state));
  }

  ngOnDestroy() {
    console.log('AppComponent ngOnDestroy');
    // this.subscription.unsubscribe();
  }
}
