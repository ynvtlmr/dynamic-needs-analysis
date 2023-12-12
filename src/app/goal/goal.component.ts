import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../services/local-storage.service';

export interface Goal {
  goalName: string;
  dollarAmount: number;
  isPhilanthropic: boolean;
}

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './goal.component.html',
})
export class GoalComponent {
  goals: Goal[] = [];

  constructor(private localStorageService: LocalStorageService) {
    this.loadGoalsFromStorage();
  }

  addGoal(name: string, amount: number, isPhilanthropic: boolean): void {
    if (name) {
      this.goals.push({
        goalName: name,
        dollarAmount: amount,
        isPhilanthropic: isPhilanthropic,
      });
      this.updateStorage();
    }
  }

  deleteGoal(index: number): void {
    this.goals.splice(index, 1);
    this.updateStorage();
  }

  private updateStorage(): void {
    this.localStorageService.setItem('goals', this.goals);
  }

  private loadGoalsFromStorage(): void {
    const data = this.localStorageService.getItem('goals');
    this.goals = data ? data : [];
  }
}
