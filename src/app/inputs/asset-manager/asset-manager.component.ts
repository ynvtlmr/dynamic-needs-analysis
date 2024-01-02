import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Asset, AssetComponent } from '../asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-asset-manager',
  standalone: true,
  imports: [CommonModule, AssetComponent, CurrencyPipe],
  templateUrl: './asset-manager.component.html',
})
export class AssetManagerComponent {
  assets: Asset[] = [];
  editingAsset: Asset | null = null;
  editingAssetIndex: number | null = null;

  constructor(private localStorageService: LocalStorageService) {
    this.loadAssetsFromStorage();
  }

  loadAssetsFromStorage(): void {
    const storedAssets = this.localStorageService.getItem('assets');
    if (storedAssets) {
      this.assets = storedAssets;
    }
  }

  addNewAsset(): void {
    // Initialize a new asset with default values
    this.editingAsset = {
      name: '',
      initialValue: 0,
      currentValue: 0,
      yearAcquired: new Date().getFullYear(),
      rate: 0,
      term: 0,
      type: '',
      isTaxable: false,
      isLiquid: false,
      isToBeSold: false,
      beneficiaries: [],
      selectedTaxBracket: undefined,
      capitalGainsTaxRate: 0,
    };
  }

  saveAsset(updatedAsset: Asset): void {
    if (this.editingAssetIndex !== null) {
      this.assets[this.editingAssetIndex] = updatedAsset;
    } else {
      this.assets.push(updatedAsset);
    }
    this.editingAsset = null;
    this.editingAssetIndex = null;
    this.updateStorage();
    this.editingAssetIndex = null;  // Reset the editing index after saving
  }

  editAsset(index: number): void {
    if (this.editingAssetIndex !== null && this.editingAssetIndex !== index) {
      // Cancel the current editing if another asset's edit button is clicked
      this.onCancelEditing();
    }

    this.editingAsset = { ...this.assets[index] };
    this.editingAssetIndex = index;
  }

  deleteAsset(index: number): void {
    this.assets.splice(index, 1);
    this.updateStorage();
  }

  updateStorage(): void {
    this.localStorageService.setItem('assets', this.assets);
  }

  onCancelEditing(): void {
    this.editingAsset = null;
    this.editingAssetIndex = null;
  }

  isEditing(index: number): boolean {
    return this.editingAssetIndex === index;
  }
}
