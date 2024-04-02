import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Goal } from '../../../models/goal.model';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskPipe, NgxMaskDirective],
  providers: [provideNgxMask()]
})
export class GoalComponent {
  goals: Goal[] = [];
  percentLiquidityToGoals: number = 0;

  constructor(private localStorageService: LocalStorageService) {
    this.loadGoalsFromStorage();
    this.loadPercentLiquidityFromStorage();
  }

  addEmptyGoal(): void {
    this.goals.push({ goalName: '', dollarAmount: 0, isPhilanthropic: false });
  }

  deleteGoal(index: number): void {
    this.goals.splice(index, 1);
    this.updateStorage();
  }

  onGoalChange(): void {
    this.updateStorage();
  }

  private updateStorage(): void {
    this.localStorageService.setItem('goals', this.goals);
    this.localStorageService.setItem(
      'percentLiquidityToGoals',
      this.percentLiquidityToGoals,
    );
  }

  private loadGoalsFromStorage(): void {
    const data: Goal[] | null =
      this.localStorageService.getItem<Goal[]>('goals');
    this.goals = data ? data : [];
  }

  private loadPercentLiquidityFromStorage(): void {
    const percent: number | null = this.localStorageService.getItem<number>(
      'percentLiquidityToGoals',
    );
    this.percentLiquidityToGoals = percent ?? 0;
  }

  onPercentLiquidityChange(): void {
    this.localStorageService.setItem(
      'percentLiquidityToGoals',
      this.percentLiquidityToGoals,
    );
    this.updateStorage();
  }
}
