import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BusinessComponent } from '../business/business.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Business } from '../../models/business.model';

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
    const storedBusinesses: Business[] | null =
      this.localStorageService.getItem<Business[]>('businesses');
    if (storedBusinesses) {
      this.businesses = storedBusinesses;
    }
  }

  addNewBusiness(): void {
    this.editingBusiness = {
      businessName: '',
      valuation: 0,
      ebita: 0,
      rate: 0,
      term: 0,
      shareholders: [],
    };
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
    if (
      this.editingBusinessIndex !== null &&
      this.editingBusinessIndex === index
    ) {
      this.onCancelEditing();
    } else {
      this.editingBusiness = { ...this.businesses[index] };
      this.editingBusinessIndex = index;
    }
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

  isEditing(index: number): boolean {
    return this.editingBusinessIndex === index;
  }
}
