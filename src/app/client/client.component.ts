import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BirthdateComponent } from "../birthdate/birthdate.component";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [
    FormsModule,
    BirthdateComponent
  ]
})
export class ClientComponent {
  name: string = '';
  province: string = '';
  annualIncome: number = 0;
  incomeReplacementMultiplier: number = 1;
}
