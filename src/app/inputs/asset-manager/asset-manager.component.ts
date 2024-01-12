import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AssetComponent } from '../asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';

interface EditingState {
  asset: Asset | null;
  index: number | null;
}

@Component({
  selector: 'app-asset-manager',
  standalone: true,
  imports: [CommonModule, AssetComponent, CurrencyPipe],
  templateUrl: './asset-manager.component.html',
})
export class AssetManagerComponent {
  assets: Asset[] = [];
  editingState: EditingState = { asset: null, index: null };

  constructor(private localStorageService: LocalStorageService) {
    this.loadAssetsFromStorage();
  }

  private createEmptyAsset(): Asset {
    return {
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

  loadAssetsFromStorage(): void {
    const storedAssets: Asset[] | null =
      this.localStorageService.getItem<Asset[]>('assets');
    this.assets = storedAssets || [];
  }

  addNewAsset(): void {
    this.editingState = { asset: this.createEmptyAsset(), index: null };
  }

  saveAsset(updatedAsset: Asset): void {
    if (this.editingState.index != null) {
      this.assets[this.editingState.index] = updatedAsset;
    } else {
      this.assets.push(updatedAsset);
    }
    this.editingState = { asset: null, index: null };
    this.updateStorage();
  }

  editAsset(index: number): void {
    if (this.editingState.index === index) {
      this.onCancelEditing();
    } else {
      this.editingState = {
        asset: { ...this.assets[index] },
        index: index,
      };
    }
  }

  deleteAsset(index: number): void {
    this.assets.splice(index, 1);
    this.updateStorage();
  }

  updateStorage(): void {
    this.localStorageService.setItem('assets', this.assets);
  }

  onCancelEditing(): void {
    this.editingState = { asset: null, index: null };
  }

  isEditing(index: number): boolean {
    return this.editingState.index === index;
  }
}
