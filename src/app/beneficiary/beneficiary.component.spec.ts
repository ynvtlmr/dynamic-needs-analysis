import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BeneficiaryComponent } from './beneficiary.component';

describe('BeneficiaryComponent', () => {
  let component: BeneficiaryComponent;
  let fixture: ComponentFixture<BeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, BeneficiaryComponent]
    }).compileComponents();
    localStorage.clear();
    fixture = TestBed.createComponent(BeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a beneficiary', () => {
    component.addBeneficiary('John Doe', 25);
    expect(component.beneficiaries.length).toBe(1);
    expect(component.beneficiaries[0].name).toBe('John Doe');
    expect(component.beneficiaries[0].idealAllocation).toBe(25);
  });

  it('should delete a beneficiary', () => {
    component.addBeneficiary('John Doe', 25);
    component.deleteBeneficiary(0);
    expect(component.beneficiaries.length).toBe(0);
  });

  it('should calculate total allocation correctly', () => {
    component.addBeneficiary('John Doe', 25);
    component.addBeneficiary('Jane Doe', 30);
    expect(component.totalAllocation).toBe(55);
  });
});
