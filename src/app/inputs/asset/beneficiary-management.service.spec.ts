import { TestBed } from '@angular/core/testing';
import { BeneficiaryManagementService } from './beneficiary-management.service';

describe('BeneficiaryManagementService', () => {
  let service: BeneficiaryManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaryManagementService);
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'beneficiaries') {
        return JSON.stringify([{ name: 'John Doe', allocation: 50 }]);
      }
      return null;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update allocation of a beneficiary', () => {
    const beneficiaries = [{ name: 'John Doe', allocation: 50 }];
    service.updateAllocation(beneficiaries, 0, 60);
    expect(beneficiaries[0].allocation).toBe(60);
  });

  it('should calculate total allocations correctly', () => {
    const beneficiaries = [
      { name: 'John Doe', allocation: 50 },
      { name: 'Jane Doe', allocation: 30 },
    ];
    const total = service.getTotalAllocations(beneficiaries);
    expect(total).toBe(80);
  });
});
