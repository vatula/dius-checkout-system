import {IPricingRule} from '../pricingRule';

export class ThreeForTwoATV implements IPricingRule {
  apply(items: Array<string>): Array<[string, number]> {
    let atvCount = 0;
    return items.map((sku) => [sku, (sku === 'atv' && ((++atvCount) % 3) === 0) ? 0 : Number.MAX_SAFE_INTEGER] as [string, number]);
  }
}
