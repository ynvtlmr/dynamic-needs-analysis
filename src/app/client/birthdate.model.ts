export class Birthdate {
  private _birthdate: null | Date = null;

  constructor(initialBirthdate: undefined | null | string) {
    this.birthdate = initialBirthdate;
  }

  get birthdate(): null | string {
    return this._birthdate
      ? this._birthdate.toISOString().substring(0, 10)
      : null;
  }

  set birthdate(value: undefined | null | string) {
    if (value) {
      const newDate: Date = new Date(value);
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
