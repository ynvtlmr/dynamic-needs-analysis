// import { Asset } from './asset.component';
// import { Beneficiary } from '../beneficiary/beneficiary.component';
//
// describe('Asset', () => {
//   let asset: Asset;
//   const mockBeneficiaries: Beneficiary[] = [
//     { name: 'Beneficiary 1', allocation: 50 },
//     { name: 'Beneficiary 2', allocation: 50 },
//   ];
//
//   beforeEach(() => {
//     asset = new Asset(
//       'Test Asset',
//       1000, // initialValue
//       new Date().getFullYear() - 5, // yearAcquired
//       1500, // currentValue
//       5, // rate
//       10, // term
//       'Stocks', // type
//       true, // isTaxable
//       true, // isLiquid
//       false, // isToBeSettled
//       mockBeneficiaries,
//
//     );
//
//     // Mocking localStorage for capital gains tax rate
//     spyOn(localStorage, 'getItem').and.callFake((key: string) => {
//       if (key === 'selectedTaxBracket') {
//         return JSON.stringify({ taxRate: 20 });
//       }
//       return null;
//     });
//
//     asset.ngOnInit(); // Simulating component initialization
//   });
//   it('should create an instance of Asset', () => {
//     expect(asset).toBeTruthy();
//   });
//   it('should load capital gains tax rate correctly', () => {
//     expect(asset['capitalGainsTaxRate']).toBe(10); // 20% tax rate * 0.5
//   });
//   it('should calculate current tax liability correctly', () => {
//     expect(asset.currentTaxLiabilityDollars).toBe(50); // (1500 - 1000) * 10%
//   });
//   it('should calculate future tax liability correctly', () => {
//     const futureValue = 1500 * Math.pow(1 + 0.05, 10); // Future value calculation
//     expect(asset.futureTaxLiabilityDollars).toBeCloseTo(
//       (futureValue - 1000) * 0.1,
//       2,
//     );
//   });
// });
