import { Component, OnDestroy, OnInit } from '@angular/core';
// Added -->
import { CommonModule } from '@angular/common';
import { MenuService } from './services/menu.service';
import { Subscription } from 'rxjs';
// <-- Added
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/common/header/header.component";
import { MenuComponent } from './components/common/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, HeaderComponent, MenuComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'DynamicNeedsAnalysis';

  // Added -->
  showMenu = true; // Define showMenu property
  private subscription!: Subscription;
  // <-- Added

  // constructor(private outlet: RouterOutlet) {}
  constructor(private menuService: MenuService) {} // Inject MenuService

  ngOnInit() {
    this.subscription = this.menuService.currentState.subscribe((state) => (this.showMenu = state));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
