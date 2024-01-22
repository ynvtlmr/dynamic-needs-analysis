import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AssetComponent } from '../asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

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
  distributions: Record<string, number> | null = null;

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
    this.updateBeneficiaryDistributions();
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
    this.updateBeneficiaryDistributions(); // Call after saving an asset
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
    this.updateBeneficiaryDistributions();
  }

  updateStorage(): void {
    this.localStorageService.setItem('assets', this.assets);

    let totals: { [key: string]: number } =
      this.localStorageService.getItem<{ [key: string]: number }>('totals') ??
      {};
    totals['estateTaxLiability'] = this.totalFutureTaxLiability;
    this.localStorageService.setItem('totals', totals);
  }

  onCancelEditing(): void {
    this.editingState = { asset: null, index: null };
  }

  isEditing(index: number): boolean {
    return this.editingState.index === index;
  }

  get totalCurrentValue(): number {
    return this.assets.reduce(
      (acc: number, asset: Asset) => acc + (asset.currentValue || 0),
      0,
    );
  }

  get totalFutureTaxLiability(): number {
    return this.assets.reduce(
      (acc: number, asset: Asset) =>
        acc + (asset.futureTaxLiabilityDollars || 0),
      0,
    );
  }

  private calculateFutureValue(asset: Asset): number {
    return asset.currentValue * Math.pow(1 + asset.rate / 100, asset.term);
  }

  private calculateBeneficiaryDistributions(): Record<string, number> {
    const distributions: Record<string, number> = {};

    this.assets.forEach((asset) => {
      const futureValue = this.calculateFutureValue(asset);
      asset.beneficiaries.forEach((beneficiary) => {
        const distribution = (beneficiary.allocation / 100) * futureValue;
        distributions[beneficiary.name] =
          (distributions[beneficiary.name] || 0) + distribution;
      });
    });

    return distributions;
  }

  private updateBeneficiaryDistributions(): void {
    this.distributions = this.calculateBeneficiaryDistributions();
  }

  protected readonly Object: ObjectConstructor = Object;
}
