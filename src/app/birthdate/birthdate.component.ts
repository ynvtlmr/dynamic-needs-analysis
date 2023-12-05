import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-birthdate',
  templateUrl: './birthdate.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class BirthdateComponent implements OnInit {
  private _birthdate: Date | null = null;
  age: number = 0;
  yearsToRetirement: number = 0;

  ngOnInit(): void {
    // Load the birthdate from localStorage when the component initializes
    const storedBirthdate = localStorage.getItem('birthdate');
    if (storedBirthdate) {
      this.birthdate = storedBirthdate;
    }
  }

  @Input()
  set birthdate(value: string | null) {
    if (value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        this._birthdate = newDate;
        this.calculateAgeAndRetirement();
        // Save the valid birthdate to localStorage
        localStorage.setItem('birthdate', value);
      }
    } else {
      this._birthdate = null;
      this.age = 0;
      this.yearsToRetirement = 0;
      // Clear the birthdate from localStorage
      localStorage.removeItem('birthdate');
    }
  }

  get birthdate(): string | null {
    return this._birthdate
      ? this._birthdate.toISOString().substring(0, 10)
      : null;
  }

  private calculateAgeAndRetirement(): void {
    if (!this._birthdate) {
      return;
    }

    const today: Date = new Date();
    this.age = today.getFullYear() - this._birthdate.getFullYear();

    if (
      today.getMonth() < this._birthdate.getMonth() ||
      (today.getMonth() === this._birthdate.getMonth() &&
        today.getDate() < this._birthdate.getDate())
    ) {
      this.age--;
    }

    this.yearsToRetirement = 65 - this.age;
  }
}
