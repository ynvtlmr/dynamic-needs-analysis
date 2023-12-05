import { TestBed } from '@angular/core/testing';
import { BeneficiaryService } from './beneficiary.service';

describe('BeneficiaryService', () => {
    let service: BeneficiaryService;
    let storageSpy: jasmine.SpyObj<Storage>;

    beforeEach(() => {
        storageSpy = jasmine.createSpyObj('Storage', ['getItem', 'setItem']);
        TestBed.configureTestingModule({
            providers: [
                BeneficiaryService,
                { provide: Storage, useValue: storageSpy }
            ]
        });
        localStorage.clear(); // Clear localStorage before each test
        storageSpy.getItem.calls.reset(); // Reset the getItem spy
        storageSpy.setItem.calls.reset(); // Reset the setItem spy
    });

    it('should be created', () => {
        service = TestBed.inject(BeneficiaryService);
        expect(service).toBeTruthy();
    });

    it('should add a beneficiary and update storage', () => {
        service = TestBed.inject(BeneficiaryService);
        service.addBeneficiary('John Doe', 25);
        expect(service.beneficiariesList.length).toBe(1);
        expect(service.beneficiariesList[0]).toEqual({ name: 'John Doe', idealAllocation: 25 });
    });

    it('should delete a beneficiary and update storage', () => {
        service = TestBed.inject(BeneficiaryService);
        service.addBeneficiary('John Doe', 25);
        service.deleteBeneficiary(0);
        expect(service.beneficiariesList.length).toBe(0);
    });

    it('should calculate total allocation correctly', () => {
        service = TestBed.inject(BeneficiaryService);
        service.addBeneficiary('John Doe', 25);
        service.addBeneficiary('Jane Doe', 30);
        expect(service.totalAllocation).toBe(55);
    });
});
