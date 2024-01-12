import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Goal } from '../../models/goal.model';
@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskPipe, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './goal.component.html',
})
export class GoalComponent {
  goals: Goal[] = [];

  constructor(private localStorageService: LocalStorageService) {
    this.loadGoalsFromStorage();
  }

  addEmptyGoal(): void {
    this.goals.push({ goalName: '', dollarAmount: 0, isPhilanthropic: false });
  }

  deleteGoal(index: number): void {
    this.goals.splice(index, 1);
    this.updateStorage();
  }

  onGoalChange(): void {
    this.updateStorage(); // Update localStorage whenever there's a change
  }

  private updateStorage(): void {
    this.localStorageService.setItem('goals', this.goals);
  }

  private loadGoalsFromStorage(): void {
    const data = this.localStorageService.getItem<Goal[]>('goals');
    this.goals = data ? data : [];
  }
}
