import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebtManagerComponent } from '../../components/inputs/debt-manager/debt-manager.component';
import {
  DebtVisualizationComponent
} from '../../components/outputs/debt-visualization/debt-visualization.component';

@Component({
  selector: 'app-debts-page',
  templateUrl: './debts-page.component.html',
  standalone: true,
  imports: [CommonModule, DebtManagerComponent, DebtVisualizationComponent],
})
export class DebtsPageComponent {}
