import {IPricingRule} from '../pricingRule';

export class BulkDiscountIPD5 implements IPricingRule {
  apply(items: Array<string>): Array<[string, number]> {
    const result = items.map((sku) => [sku, Number.MAX_SAFE_INTEGER] as [string, number]);
    const ipdCount = items.reduce((count, sku) => count + ((sku === 'ipd') ? 1 : 0), 0);
    if (ipdCount > 4) {
      return result.map(([sku, price]) => ([sku, sku === 'ipd' ? 499.99 : price] as [string, number]));
    }
    return result;
  }
}
