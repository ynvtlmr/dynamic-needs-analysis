import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AssetComponent } from '../asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';
import { Business } from '../../models/business.model';

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
  businesses: Business[] = [];
  assets: Asset[] = [];
  editingState: EditingState = { asset: null, index: null };
  distributions: Record<string, number> | null = null;
  idealDistributions: Record<string, number> = {};
  additionalMoneyRequired: Record<string, number> = {};

  constructor(private localStorageService: LocalStorageService) {
    this.loadBusinessesFromStorage();
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

  loadBusinessesFromStorage(): void {
    this.businesses =
      this.localStorageService.getItem<Business[]>('businesses') ?? [];
  }

  loadAssetsFromStorage(): void {
    const storedAssets: Asset[] | null =
      this.localStorageService.getItem<Asset[]>('assets');
    this.assets = storedAssets ?? [];
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

    const totals: { [key: string]: any } =
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
    const totalAssetValue: number = this.assets.reduce(
      (acc: number, asset: Asset) => acc + (asset.currentValue || 0),
      0,
    );
    const totalBusinessValue: number = this.businesses.reduce(
      (acc: number, business: Business) => acc + (business.valuation || 0),
      0,
    );
    return totalAssetValue + totalBusinessValue;
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
      (acc: number, asset: Asset) => acc + this.calculateFutureValue(asset),
      0,
    );
  }

  private calculateFutureValue(asset: Asset): number {
    return asset.currentValue * Math.pow(1 + asset.rate / 100, asset.term);
  }

  private calculateBeneficiaryDistributions(): Record<string, number> {
    const distributions: Record<string, number> = {};

    this.assets.forEach((asset: Asset): void => {
      const futureValue: number = this.calculateFutureValue(asset);
      const totalAllocation: number = asset.beneficiaries.reduce(
        (sum: any, beneficiary: { allocation: any }) =>
          sum + beneficiary.allocation,
        0,
      );
      asset.beneficiaries.forEach((beneficiary: Beneficiary): void => {
        const distribution: number =
          (beneficiary.allocation / totalAllocation) * futureValue;
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
    const totalIdealDistribution = Object.values(
      this.idealDistributions,
    ).reduce((sum, value) => sum + value, 0);

    const totalDesiredValue: number = Object.keys(
      this.idealDistributions,
    ).reduce((total: number, beneficiaryName: string) => {
      const currentAmount: number = this.distributions?.[beneficiaryName] ?? 0;
      const idealPercentage: number =
        this.idealDistributions[beneficiaryName] / totalIdealDistribution;
      const idealAmount: number = currentAmount / idealPercentage;
      return Math.max(total, idealAmount);
    }, 0);

    Object.keys(this.idealDistributions).forEach(
      (beneficiaryName: string): void => {
        const currentAmount: number =
          this.distributions?.[beneficiaryName] ?? 0;
        const desiredPercentage: number =
          this.idealDistributions[beneficiaryName] / totalIdealDistribution;
        const idealAmount: number = totalDesiredValue * desiredPercentage;
        this.additionalMoneyRequired[beneficiaryName] = Math.max(
          0,
          idealAmount - currentAmount,
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

  get calculateTotalPercentage(): number {
    const totalDistributions: number = Object.values(
      this.distributions ?? {},
    ).reduce((total: number, amount: number) => total + amount, 0);
    return totalDistributions > 0
      ? (totalDistributions / this.totalFutureValue) * 100
      : 0;
  }

  get calculateTotalIdealPercentage(): number {
    return Object.values(this.idealDistributions).reduce(
      (total: number, percentage: number) => total + percentage,
      0,
    );
  }
}
