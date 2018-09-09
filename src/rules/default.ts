import {IPricingRule} from '../pricingRule';

export class DefaultPricingRule implements IPricingRule {
  constructor(private readonly pricelist: Map<string, number>) {}

  apply(items: Array<string>): Array<[string, number]> {
    return items.map((sku: string) => {
      if (!this.pricelist.has(sku)) {
        throw new Error(`unknown sku: ${sku}`);
      }
      return [sku, this.pricelist.get(sku)] as [string, number];
    });
  }
}
