import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuState = new BehaviorSubject(true);
  currentState = this.menuState.asObservable();

  constructor() {}

  toggleMenu() {
    this.menuState.next(!this.menuState.value);
  }
}

// The MenuService should be used to communicate between 
// the HeaderComponent and MenuComponent. The MenuService 
// should have a BehaviorSubject that emits a value whenever
// the menu should be toggled.