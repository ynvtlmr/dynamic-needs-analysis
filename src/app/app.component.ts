import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BirthdateComponent } from "./birthdate/birthdate.component";
import { ClientComponent } from "./client/client.component";
import {FinancialInstrumentComponent} from "./financial-instrument/financial-instrument.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BirthdateComponent, ClientComponent, FinancialInstrumentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dynamic-needs-analysis';
}
