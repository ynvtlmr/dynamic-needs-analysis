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
  idealDistributions: Record<string, number> = {};
  additionalMoneyRequired: Record<string, number> = {};

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
    this.loadBeneficiariesFromStorage();
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
    this.updateBeneficiaryDistributions();
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

    let totals: { [key: string]: any } =
      this.localStorageService.getItem<{ [key: string]: number }>('totals') ??
      {};
    if (!totals['Estate Tax Liability']) {
      totals['Estate Tax Liability'] = { value: 0, priority: 100 };
    }
    if (!totals['Equalization']) {
      totals['Equalization'] = { value: 0, priority: 100 };
    }
    totals['Estate Tax Liability']['value'] = this.totalFutureTaxLiability;
    totals['Equalization']['value'] = this.totalAdditionalMoneyRequired;
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

  get totalFutureValue(): number {
    return this.assets.reduce(
      (acc, asset) => acc + this.calculateFutureValue(asset),
      0,
    );
  }

  private calculateFutureValue(asset: Asset): number {
    return asset.currentValue * Math.pow(1 + asset.rate / 100, asset.term);
  }

  private calculateBeneficiaryDistributions(): Record<string, number> {
    const distributions: Record<string, number> = {};

    this.assets.forEach((asset) => {
      const futureValue: number = this.calculateFutureValue(asset);
      asset.beneficiaries.forEach((beneficiary: Beneficiary): void => {
        const distribution: number =
          (beneficiary.allocation / 100) * futureValue;
        distributions[beneficiary.name] =
          (distributions[beneficiary.name] || 0) + distribution;
      });
    });

    return distributions;
  }

  private updateBeneficiaryDistributions(): void {
    this.distributions = this.calculateBeneficiaryDistributions();
    this.calculateAdditionalMoneyRequired();
  }

  private loadBeneficiariesFromStorage(): void {
    const beneficiaries: Beneficiary[] =
      this.localStorageService.getItem<Beneficiary[]>('beneficiaries') || [];
    this.calculateIdealDistributions(beneficiaries);
    this.calculateAdditionalMoneyRequired();
  }

  private calculateIdealDistributions(beneficiaries: Beneficiary[]): void {
    beneficiaries.forEach((beneficiary: Beneficiary): void => {
      this.idealDistributions[beneficiary.name] = beneficiary.allocation;
    });
  }

  private calculateAdditionalMoneyRequired(): void {
    const totalFutureValue: number = this.totalFutureValue;
    Object.keys(this.idealDistributions).forEach(
      (beneficiaryName: string): void => {
        const idealAmount: number =
          (this.idealDistributions[beneficiaryName] / 100) * totalFutureValue;
        const actualAmount: number = this.distributions?.[beneficiaryName] || 0;
        this.additionalMoneyRequired[beneficiaryName] = Math.max(
          0,
          idealAmount - actualAmount,
        );
      },
    );
  }

  get totalAdditionalMoneyRequired(): number {
    return Object.values(this.additionalMoneyRequired).reduce(
      (total: number, amount: number) => total + amount,
      0,
    );
  }

  protected readonly Object: ObjectConstructor = Object;
}
