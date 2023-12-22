import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorageSubject = new BehaviorSubject<string>('');

  watchStorage(): Observable<string> {
    return this.localStorageSubject.asObservable();
  }

  // Serialize data before storing
  private serialize(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  // Deserialize data when retrieving
  private deserialize(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, this.serialize(value));
    this.localStorageSubject.next(key); // Emit the key of the changed item
  }

  getItem(key: string): any {
    const value = localStorage.getItem(key);
    return value ? this.deserialize(value) : null;
  }

  clearAll() {
    localStorage.clear();
    this.localStorageSubject.next('clear'); // Emit a special value for clearing all
    window.location.reload();
  }

  downloadAsFile() {
    const data = this.serialize(this.getAllItems());
    const blob = new Blob([data], { type: 'application/json' });
    const fileName = 'dna-local-storage.json';
    const downloadURL = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(downloadURL);
  }

  getAllItems(): Record<string, any> {
    const items: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        items[key] = this.getItem(key);
      }
    }
    return items;
  }

  loadFromFile(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = this.deserialize(reader.result as string);
      Object.entries(data).forEach(([key, value]) => {
        this.setItem(key, value);
      });
      window.location.reload();
    };
    reader.readAsText(file);
  }
}
