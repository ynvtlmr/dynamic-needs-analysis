import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  clearAll() {
    localStorage.clear();
    window.location.reload();
  }

  downloadAsFile() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const fileName = 'dna-local-storage.json';
    const downloadURL = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(downloadURL);
  }

  loadFromFile(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result as string);
      for (let key in data) {
        localStorage.setItem(key, data[key]);
      }
      window.location.reload();
    };
    reader.readAsText(file);
  }
}
