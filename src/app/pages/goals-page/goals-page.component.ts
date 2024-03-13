import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalComponent } from '../../inputs/goal/goal.component';
import { GoalsVisualizationComponent } from '../../outputs/goals-visualization/goals-visualization.component';

@Component({
  selector: 'app-goals-page',
  templateUrl: './goals-page.component.html',
  standalone: true,
  imports: [CommonModule, GoalComponent, GoalsVisualizationComponent],
})
export class GoalsPageComponent {}
