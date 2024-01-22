import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type LocalStorageItem = Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorageSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  private serialize<T>(data: T): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error(`Error serializing data for localStorage: ${error}`);
      return '';
    }
  }

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
      this.localStorageSubject.next(key);
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const value: string | null = localStorage.getItem(key);
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

  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  downloadAsFile(): void {
    try {
      const allData: Record<string, LocalStorageItem> = this.getAllItems();
      const clientName: string =
        typeof allData['client']?.['name'] === 'string'
          ? allData['client']['name'].split(' ').join('')
          : 'DNA';

      const currentDate = new Date()
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '.');

      const fileName: string = `${clientName}_${currentDate}.json`;

      const data: string = this.serialize(allData);
      const blob: Blob = new Blob([data], { type: 'application/json' });
      const downloadURL: string = window.URL.createObjectURL(blob);

      const link: HTMLAnchorElement = document.createElement('a');
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
      for (let i: number = 0; i < localStorage.length; i++) {
        const key: string | null = localStorage.key(i);
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
    const file: File | undefined = (event.target as HTMLInputElement)
      ?.files?.[0];
    if (!file) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (): void => {
      try {
        const data = this.deserialize(reader.result as string);
        if (data) {
          Object.entries(data).forEach(([key, value]): void => {
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
