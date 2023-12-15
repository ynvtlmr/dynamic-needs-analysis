import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Asset, AssetComponent } from '../asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { CurrencyPipe } from '@angular/common';
import { FIN_INSTR_TYPES } from '../constants/asset-types.constant';

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
      financialInstrumentTypes: Array.from(FIN_INSTR_TYPES.keys()),
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
  }

  editAsset(index: number): void {
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
}
