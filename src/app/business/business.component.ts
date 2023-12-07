import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shareholder } from './shareholder.model';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './business.component.html',
})
export class BusinessComponent {
  businessName: string = '';
  valuation: number = 0;
  rate: number = 0;
  term: number = 0;
  shareholders: Shareholder[] = [];

  addShareholder(name: string, share: number, coverage: number): void {
    this.shareholders.push(new Shareholder(name, share, coverage));
  }
}
