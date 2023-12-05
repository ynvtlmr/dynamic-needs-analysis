import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthdateComponent } from './birthdate.component';

const AGE: number = 40;
const TODAY: Date = new Date();
const BIRTHDATE: string = new Date(
  TODAY.getFullYear() - AGE,
  TODAY.getMonth(),
  TODAY.getDate(),
)
  .toISOString()
  .substring(0, 10);

describe('BirthdateComponent', () => {
  let component: BirthdateComponent;
  let fixture: ComponentFixture<BirthdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthdateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should calculate the client's age correctly", () => {
    component.birthdate = BIRTHDATE;
    expect(component.age).toBe(AGE);
  });

  it("should calculate the client's years to retirement correctly", () => {
    component.birthdate = BIRTHDATE;
    expect(component.yearsToRetirement).toBe(65 - AGE);
  });
});
