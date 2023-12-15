import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Business, BusinessComponent } from '../business/business.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-business-manager',
  standalone: true,
  imports: [CommonModule, BusinessComponent, CurrencyPipe],
  templateUrl: './business-manager.component.html',
})
export class BusinessManagerComponent {
  businesses: Business[] = [];
  editingBusiness: Business | null = null;
  editingBusinessIndex: number | null = null;

  constructor(private localStorageService: LocalStorageService) {
    this.loadBusinessesFromStorage();
  }

  loadBusinessesFromStorage(): void {
    const storedBusinesses = this.localStorageService.getItem('businesses');
    if (storedBusinesses) {
      this.businesses = storedBusinesses;
    }
  }

  addNewBusiness(): void {
    this.editingBusiness = new Business('', 0, 0, 0, []);
  }

  saveBusiness(updatedBusiness: Business): void {
    if (this.editingBusinessIndex !== null) {
      this.businesses[this.editingBusinessIndex] = updatedBusiness;
    } else {
      this.businesses.push(updatedBusiness);
    }
    this.editingBusiness = null;
    this.editingBusinessIndex = null;
    this.updateStorage();
  }

  editBusiness(index: number): void {
    this.editingBusiness = { ...this.businesses[index] };
    this.editingBusinessIndex = index; // Add this line
  }

  deleteBusiness(index: number): void {
    this.businesses.splice(index, 1);
    this.updateStorage();
  }

  updateStorage(): void {
    this.localStorageService.setItem('businesses', this.businesses);
  }

  onCancelEditing(): void {
    this.editingBusiness = null;
    this.editingBusinessIndex = null;
  }
}
