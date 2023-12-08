import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageManagementService {
  constructor() {}

  storeData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  loadData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  }
}
