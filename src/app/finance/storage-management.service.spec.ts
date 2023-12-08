import { TestBed } from '@angular/core/testing';
import { StorageManagementService } from './storage-management.service';

describe('StorageManagementService', () => {
  let service: StorageManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageManagementService);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'testKey' ? JSON.stringify({ data: 'testData' }) : null;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store data in local storage', () => {
    service.storeData('testKey', { data: 'testData' });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'testKey',
      '{"data":"testData"}',
    );
  });

  it('should load data from local storage', () => {
    const data = service.loadData('testKey');
    expect(data).toEqual({ data: 'testData' });
  });

  it('should return null if data is not found', () => {
    const data = service.loadData('nonExistentKey');
    expect(data).toBeNull();
  });
});
