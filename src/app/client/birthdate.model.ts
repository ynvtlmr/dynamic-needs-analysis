export class Birthdate {
  private _birthdate: Date | null = null;

  constructor(initialBirthdate: string | null) {
    this.birthdate = initialBirthdate;
  }

  get birthdate(): string | null {
    return this._birthdate
      ? this._birthdate.toISOString().substring(0, 10)
      : null;
  }

  set birthdate(value: string | null) {
    if (value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        this._birthdate = newDate;
      } else {
        this._birthdate = null;
      }
    } else {
      this._birthdate = null;
    }
  }

  get age(): number {
    if (!this._birthdate) return 0;
    const today: Date = new Date();
    let age = today.getFullYear() - this._birthdate.getFullYear();

    if (
      today.getMonth() < this._birthdate.getMonth() ||
      (today.getMonth() === this._birthdate.getMonth() &&
        today.getDate() < this._birthdate.getDate())
    ) {
      age--;
    }
    return age;
  }

  get yearsToRetirement(): number {
    return Math.max(65 - this.age, 0);
  }
}
