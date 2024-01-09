import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Define a type for local storage items
type LocalStorageItem = Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorageSubject = new BehaviorSubject<string>('');

  // Serialize data before storing
  private serialize<T>(data: T): string {
    return JSON.stringify(data);
  }

  // Deserialize data when retrieving
  private deserialize<T>(data: string): T | null {
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error parsing data from localStorage: ${error}`);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, this.serialize(value));
      this.localStorageSubject.next(key); // Notify of change
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? this.deserialize<T>(value) : null;
    } catch (error) {
      console.error(`Error retrieving item from localStorage: ${error}`);
      return null;
    }
  }

  clearAll(): void {
    try {
      localStorage.clear();
      this.localStorageSubject.next('clear');
      window.location.reload();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  }

  downloadAsFile(): void {
    try {
      const data = this.serialize(this.getAllItems());
      const blob = new Blob([data], { type: 'application/json' });
      const fileName = 'dna-local-storage.json';
      const downloadURL = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(downloadURL);
    } catch (error) {
      console.error(`Error downloading data as file: ${error}`);
    }
  }

  getAllItems(): Record<string, LocalStorageItem> {
    try {
      const items: Record<string, LocalStorageItem> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = this.getItem(key) || {};
        }
      }
      return items;
    } catch (error) {
      console.error(`Error getting all items from localStorage: ${error}`);
      return {};
    }
  }

  loadFromFile(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = this.deserialize(reader.result as string);
        if (data) {
          Object.entries(data).forEach(([key, value]) => {
            this.setItem(key, value as LocalStorageItem);
          });
        }
        window.location.reload();
      } catch (error) {
        console.error(`Error loading data from file: ${error}`);
      }
    };
    reader.readAsText(file);
  }
  watchStorage(): Observable<string> {
    return this.localStorageSubject.asObservable();
  }
}
